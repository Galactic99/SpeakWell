import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API with explicit error handling
let genAI: GoogleGenerativeAI;
let model: any;

try {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('Gemini API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.');
  } else {
    genAI = new GoogleGenerativeAI(apiKey);
    model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });
    console.log('Gemini API initialized successfully');
  }
} catch (error) {
  console.error('Error initializing Gemini API:', error);
}

export interface AssessmentResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  pronunciation: {
    score: number;
    feedback: string;
    examples: string[];
    tips: string[];
  };
  fluency: {
    score: number;
    feedback: string;
    examples: string[];
    tips: string[];
  };
  grammar: {
    score: number;
    feedback: string;
    examples: string[];
    tips: string[];
  };
  vocabulary: {
    score: number;
    feedback: string;
    examples: string[];
    tips: string[];
  };
  overall: string;
  nextSteps: string[];
  proficiencyLevel: string;
}

export async function assessEnglishSkills(transcript: string): Promise<AssessmentResult> {
  try {
    // First check if the API is properly initialized
    if (!genAI || !model) {
      throw new Error('Gemini API not properly initialized. Check your API key.');
    }

    const prompt = `
      You are an expert English language teacher and assessor with extensive experience in ESL teaching and CEFR assessments.
      
      TASK:
      Analyze the following conversation transcript from an English practice session between a student and an AI language coach.
      Provide a comprehensive, professional assessment of the student's English language skills.
      
      TRANSCRIPT:
      ${transcript}
      
      ASSESSMENT REQUIREMENTS:
      - Be detailed, specific, and constructive in your feedback
      - Reference actual examples from the transcript whenever possible
      - Maintain an encouraging, supportive tone while being honest about areas for improvement
      - Focus on communicative effectiveness rather than just technical accuracy
      - Consider aspects of pronunciation, fluency, grammar, vocabulary usage, and overall communication
      
      OUTPUT FORMAT:
      Return ONLY a JSON object with the following structure - no additional text, no markdown formatting:
      
      {
        "score": [0-100 integer representing overall English proficiency],
        "proficiencyLevel": [One of: "Beginner (A1)", "Elementary (A2)", "Intermediate (B1)", "Upper Intermediate (B2)", "Advanced (C1)", "Near-Native (C2)"],
        "strengths": [Array of 3-5 specific strengths demonstrated, with clear examples from the transcript],
        "weaknesses": [Array of 3-5 specific areas for improvement, with clear examples from the transcript],
        "pronunciation": {
          "score": [0-100 integer],
          "feedback": [1-2 sentence assessment of pronunciation quality],
          "examples": [Array of 2-3 specific pronunciation examples from the transcript],
          "tips": [Array of 2-3 actionable improvement suggestions]
        },
        "fluency": {
          "score": [0-100 integer],
          "feedback": [1-2 sentence assessment of speaking fluency],
          "examples": [Array of 2-3 specific fluency examples from the transcript],
          "tips": [Array of 2-3 actionable improvement suggestions]
        },
        "grammar": {
          "score": [0-100 integer],
          "feedback": [1-2 sentence assessment of grammatical accuracy],
          "examples": [Array of 2-3 specific grammar examples from the transcript],
          "tips": [Array of 2-3 actionable improvement suggestions]
        },
        "vocabulary": {
          "score": [0-100 integer],
          "feedback": [1-2 sentence assessment of vocabulary range and usage],
          "examples": [Array of 2-3 specific vocabulary examples from the transcript],
          "tips": [Array of 2-3 actionable improvement suggestions]
        },
        "overall": [A paragraph (3-5 sentences) summarizing the assessment, highlighting key strengths and areas for improvement],
        "nextSteps": [Array of 3-5 specific, actionable recommendations for continued improvement]
      }
      
      CRITICAL INSTRUCTIONS:
      1. Return ONLY the raw JSON object
      2. DO NOT use markdown formatting or code blocks
      3. DO NOT add explanations before or after the JSON
      4. Ensure all fields are properly populated with meaningful content
      5. The response must start with { and end with }
      6. Be specific and reference the transcript, avoid generic feedback
    `;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    try {
      // Clean up the response text in case Gemini wraps it in markdown code blocks
      // Remove markdown code block indicators
      responseText = responseText.replace(/```json\s*/g, '');
      responseText = responseText.replace(/```\s*/g, '');
      
      // Trim whitespace
      responseText = responseText.trim();
      
      // Additional safeguard: try to extract JSON using regex
      const jsonMatch = responseText.match(/(\{[\s\S]*\})/);
      if (jsonMatch && jsonMatch[0]) {
        responseText = jsonMatch[0];
      }
      
      // Try to parse the JSON response
      const assessment = JSON.parse(responseText);
      return assessment as AssessmentResult;
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      console.error('Raw response:', responseText);
      
      // Fallback to a default response if parsing fails
      return getDefaultAssessment();
    }
  } catch (error) {
    console.error('Error getting Gemini assessment:', error);
    return getDefaultAssessment();
  }
}

// Helper function to provide a default assessment when the API call fails
function getDefaultAssessment(): AssessmentResult {
  return {
    score: 75,
    proficiencyLevel: "Intermediate (B1)",
    strengths: [
      'Participated actively in the conversation',
      'Showed willingness to communicate in English',
      'Attempted to express ideas clearly'
    ],
    weaknesses: [
      'Assessment could not be completed due to technical issues',
      'Consider working with a human tutor for detailed feedback',
      'Try again later when our assessment system is available'
    ],
    pronunciation: {
      score: 70,
      feedback: 'Based on your conversation, you demonstrated an ability to communicate. For more detailed pronunciation assessment, please try again later.',
      examples: ['N/A - Technical limitations prevented detailed analysis'],
      tips: ['Practice reading aloud', 'Listen to native speakers', 'Record yourself speaking']
    },
    fluency: {
      score: 75,
      feedback: 'You engaged in conversation which shows a basic level of fluency. Continue practicing to build more natural speech flow.',
      examples: ['N/A - Technical limitations prevented detailed analysis'],
      tips: ['Practice speaking daily', 'Try to think in English', 'Join conversation groups']
    },
    grammar: {
      score: 75,
      feedback: 'Grammar assessment is not available at this time due to technical limitations. Consider reviewing common grammar patterns.',
      examples: ['N/A - Technical limitations prevented detailed analysis'],
      tips: ['Review verb tenses', 'Practice sentence construction', 'Use grammar checking tools']
    },
    vocabulary: {
      score: 80,
      feedback: 'You used vocabulary appropriate for conversation. Continue expanding your vocabulary through reading and listening practice.',
      examples: ['N/A - Technical limitations prevented detailed analysis'],
      tips: ['Read English materials daily', 'Learn 5 new words per day', 'Use new vocabulary in conversation']
    },
    overall: 'Thank you for practicing your English! You participated in the conversation, which is the most important step in improving. Due to technical limitations, we couldn\'t provide a detailed assessment this time. Keep practicing regularly and try again later for more specific feedback. Remember, consistent practice is key to improvement!',
    nextSteps: [
      'Continue regular English practice sessions',
      'Read English materials at your current level',
      'Watch English videos with subtitles',
      'Join an English conversation group',
      'Consider working with a language exchange partner'
    ]
  };
} 