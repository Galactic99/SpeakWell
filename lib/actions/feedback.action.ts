"use server";

import { db } from "@/firebase/admin";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AssessmentResult } from '../gemini-assessment';
import { getCurrentUser } from './auth.action';

// Interface for feedback data
export interface FeedbackData {
  id: string;
  userId: string;
  sessionId: string;
  sessionName: string;
  assessment: AssessmentResult;
  createdAt: string;
}

// Save feedback to Firestore
export async function saveFeedback(
  sessionId: string, 
  assessment: AssessmentResult,
  transcript: string
): Promise<{ success: boolean; feedbackId?: string; message: string }> {
  try {
    // Get current user
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Generate session name using Gemini
    const sessionName = await generateSessionName(transcript);
    
    // Create feedback document
    const feedbackRef = db.collection("feedback").doc();
    
    await feedbackRef.set({
      userId: user.id,
      sessionId,
      sessionName,
      assessment,
      createdAt: new Date(),
    });
    
    return {
      success: true,
      feedbackId: feedbackRef.id,
      message: "Feedback saved successfully",
    };
  } catch (error: any) {
    console.error("Error saving feedback:", error);
    
    return {
      success: false,
      message: `Failed to save feedback: ${error.message}`,
    };
  }
}

// Get user feedbacks
export async function getUserFeedbacks(): Promise<{ success: boolean; data?: FeedbackData[]; message: string }> {
  try {
    // Get current user
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Query feedbacks for this user, sorted by created date
    const feedbacksSnapshot = await db
      .collection("feedback")
      .where("userId", "==", user.id)
      .orderBy("createdAt", "desc")
      .get();
    
    if (feedbacksSnapshot.empty) {
      return {
        success: true,
        data: [],
        message: "No feedbacks found",
      };
    }
    
    // Convert feedbacks to expected format
    const feedbacks: FeedbackData[] = feedbacksSnapshot.docs.map(doc => {
      const data = doc.data();
      
      // Convert Firestore Timestamp to ISO string
      const createdAt = data.createdAt && typeof data.createdAt.toDate === 'function'
        ? data.createdAt.toDate().toISOString()
        : new Date().toISOString();
      
      return {
        id: doc.id,
        userId: data.userId,
        sessionId: data.sessionId,
        sessionName: data.sessionName || "English Conversation Session",
        assessment: data.assessment,
        createdAt
      };
    });
    
    return {
      success: true,
      data: feedbacks,
      message: "Feedbacks retrieved successfully",
    };
  } catch (error: any) {
    console.error("Error getting feedbacks:", error);
    
    return {
      success: false,
      message: `Failed to get feedbacks: ${error.message}`,
    };
  }
}

// Get a specific feedback by ID
export async function getFeedbackById(feedbackId: string): Promise<{ success: boolean; data?: FeedbackData; message: string }> {
  try {
    // Get current user
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        success: false,
        message: "User not authenticated",
      };
    }

    // Get the feedback document
    const feedbackDoc = await db.collection("feedback").doc(feedbackId).get();
    
    if (!feedbackDoc.exists) {
      return {
        success: false,
        message: "Feedback not found",
      };
    }
    
    const data = feedbackDoc.data();
    
    // Verify ownership
    if (data?.userId !== user.id) {
      return {
        success: false,
        message: "Unauthorized access to feedback",
      };
    }
    
    // Convert Firestore Timestamp to ISO string
    const createdAt = data?.createdAt && typeof data.createdAt.toDate === 'function'
      ? data.createdAt.toDate().toISOString()
      : new Date().toISOString();
    
    const feedback: FeedbackData = {
      id: feedbackDoc.id,
      userId: data?.userId,
      sessionId: data?.sessionId,
      sessionName: data?.sessionName || "English Conversation Session",
      assessment: data?.assessment,
      createdAt
    };
    
    return {
      success: true,
      data: feedback,
      message: "Feedback retrieved successfully",
    };
  } catch (error: any) {
    console.error("Error getting feedback:", error);
    
    return {
      success: false,
      message: `Failed to get feedback: ${error.message}`,
    };
  }
}

// Generate a session name using Gemini
async function generateSessionName(transcript: string): Promise<string> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('Gemini API key is missing.');
      return "English Practice Session";
    }
    
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });
    
    // Truncate transcript if it's too long
    const truncatedTranscript = transcript.length > 2000 
      ? transcript.substring(0, 2000) + "..." 
      : transcript;
    
    const prompt = `
      Task: Create a descriptive title for an English learning conversation between a student and an AI coach.
      
      REQUIREMENTS:
      - The title must be concise (3-5 words maximum)
      - The title should reflect the MAIN TOPIC discussed, not generic descriptions
      - Focus on specific themes, vocabulary domains, or skills practiced
      - Use engaging, descriptive language that would help the user recognize this session later
      - Avoid generic titles like "English Practice" or "Conversation Practice"
      
      TRANSCRIPT EXCERPT:
      ${truncatedTranscript}
      
      TITLE (3-5 words only):
    `;
    
    const result = await model.generateContent(prompt);
    const title = result.response.text().trim();
    
    // Limit title length and sanitize it
    return title.length > 40 ? title.substring(0, 40) + "..." : title;
  } catch (error) {
    console.error('Error generating session name:', error);
    return "English Practice Session";
  }
} 