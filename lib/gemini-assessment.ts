import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });

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
      return {
        score: 70,
        strengths: ['Participated actively in the conversation'],
        weaknesses: ['Assessment data could not be fully processed'],
        pronunciation: 'Unable to assess based on transcript format',
        fluency: 'Unable to assess based on transcript format',
        grammar: 'Unable to assess based on transcript format',
        vocabulary: 'Unable to assess based on transcript format',
        overall: 'You participated in the English practice session. Unfortunately, we encountered an issue processing the detailed assessment. Keep practicing regularly to improve your skills.'
      };
    }
  } catch (error) {
    console.error('Error getting Gemini assessment:', error);
    throw new Error('Failed to assess English skills');
  }
} 