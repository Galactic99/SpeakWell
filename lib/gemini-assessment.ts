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
  pronunciation: string;
  fluency: string;
  grammar: string;
  vocabulary: string;
  overall: string;
}

export async function assessEnglishSkills(transcript: string): Promise<AssessmentResult> {
  try {
    // First check if the API is properly initialized
    if (!genAI || !model) {
      throw new Error('Gemini API not properly initialized. Check your API key.');
    }

    const prompt = `
      You are an expert English language teacher and assessor. Please analyze the following conversation 
      transcript from an English practice session. The student was practicing with an AI language coach.
      
      TRANSCRIPT:
      ${transcript}
      
      Please provide a detailed assessment of the student's English speaking skills based on this conversation.
      Format your response as a JSON object with the following structure:
      
      {
        "score": [A score from 0-100 reflecting overall English proficiency],
        "strengths": [Array of 2-4 specific strengths demonstrated],
        "weaknesses": [Array of 2-4 specific areas for improvement],
        "pronunciation": [Brief assessment of pronunciation, with specific examples if possible],
        "fluency": [Brief assessment of speaking fluency and natural flow],
        "grammar": [Brief assessment of grammatical accuracy],
        "vocabulary": [Brief assessment of vocabulary range and usage],
        "overall": [A paragraph summarizing the assessment and providing encouragement]
      }
      
      Your assessment should be constructive, encouraging, and specific. Please provide examples from the transcript when possible.
      
      CRITICAL INSTRUCTIONS:
      1. Return ONLY the raw JSON object
      2. DO NOT use markdown formatting
      3. DO NOT add code blocks (no \`\`\`)
      4. DO NOT add any explanations before or after the JSON
      5. The response should start with { and end with }
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
    strengths: [
      'Participated actively in the conversation',
      'Showed willingness to communicate in English',
      'Attempted to express ideas clearly'
    ],
    weaknesses: [
      'Assessment could not be completed due to technical issues',
      'Consider working with a human tutor for detailed feedback'
    ],
    pronunciation: 'Based on your conversation, you demonstrated an ability to communicate. For more detailed pronunciation assessment, please try again later when our assessment system is available.',
    fluency: 'You engaged in conversation which shows a basic level of fluency. Continue practicing to build more natural speech flow.',
    grammar: 'Grammar assessment is not available at this time due to technical limitations. Consider reviewing common grammar patterns in English conversation.',
    vocabulary: 'You used vocabulary appropriate for conversation. Continue expanding your vocabulary through reading and listening practice.',
    overall: 'Thank you for practicing your English! You participated in the conversation, which is the most important step in improving. Due to technical limitations, we couldn\'t provide a detailed assessment this time. Keep practicing regularly and try again later for more specific feedback. Remember, consistent practice is key to improvement!'
  };
} 