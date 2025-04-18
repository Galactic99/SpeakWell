"use server";

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getUserFeedbacks, FeedbackData } from './feedback.action';
import { AssessmentResult } from '../gemini-assessment';

// Minimum sessions required for full analytics (non-exported)
const MIN_SESSIONS_FOR_ANALYTICS = 5;

// Getter function for the minimum sessions constant
export async function getMinSessionsForAnalytics(): Promise<number> {
  return MIN_SESSIONS_FOR_ANALYTICS;
}

// Interfaces for progress data
export interface DailyActivity {
  date: string;
  count: number;
  averageScore: number;
}

// Extended metrics for more detailed analysis
export interface SkillProgressData {
  currentScore: number;
  initialScore: number;
  improvementPercentage: number;
  trend: 'improving' | 'steady' | 'declining';
  commonErrors: string[];
  recommendedExercises: string[];
  detailedFeedback: string;
}

export interface LearningInsight {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}

export interface ProgressMetrics {
  totalSessions: number;
  averageScore: number;
  progressTrend: 'improving' | 'steady' | 'declining' | 'insufficient-data';
  mostImprovedArea: string;
  areaNeededFocus: string;
  recentStrengths: string[];
  recentWeaknesses: string[];
  proficiencyLevel: string;
  progressPercentage: number;
  activityByDay: DailyActivity[];
  insightSummary: string;
  // Enhanced metrics
  skillProgress: {
    pronunciation: SkillProgressData;
    fluency: SkillProgressData;
    grammar: SkillProgressData;
    vocabulary: SkillProgressData;
  };
  consistencyScore: number;
  studyHabits: {
    averageSessionsPerWeek: number;
    mostActiveDay: string;
    averageSessionDuration?: number;
  };
  learningInsights: LearningInsight[];
  predictedTimeToNextLevel: string;
  recommendedFocus: {
    shortTerm: string[];
    longTerm: string[];
  };
  detailedAnalysis: string;
}

// Get calendar activity for the progress page
export async function getActivityCalendar(): Promise<{ success: boolean; data?: DailyActivity[]; message: string }> {
  try {
    const { success, data: feedbacks, message } = await getUserFeedbacks();
    
    if (!success || !feedbacks || feedbacks.length === 0) {
      return {
        success: true,
        data: [],
        message: "No activity data available",
      };
    }
    
    // Create a map to store activities by date
    const activityMap = new Map<string, { count: number; totalScore: number }>();
    
    // Process each feedback to extract date and score
    feedbacks.forEach(feedback => {
      const date = new Date(feedback.createdAt).toISOString().split('T')[0]; // YYYY-MM-DD
      const score = feedback.assessment.score;
      
      if (activityMap.has(date)) {
        const existing = activityMap.get(date)!;
        activityMap.set(date, {
          count: existing.count + 1,
          totalScore: existing.totalScore + score,
        });
      } else {
        activityMap.set(date, {
          count: 1,
          totalScore: score,
        });
      }
    });
    
    // Convert map to array of DailyActivity
    const activityByDay: DailyActivity[] = Array.from(activityMap.entries()).map(([date, data]) => ({
      date,
      count: data.count,
      averageScore: Math.round(data.totalScore / data.count),
    }));
    
    // Sort by date
    activityByDay.sort((a, b) => a.date.localeCompare(b.date));
    
    return {
      success: true,
      data: activityByDay,
      message: "Activity data retrieved successfully",
    };
  } catch (error: any) {
    console.error("Error getting activity calendar:", error);
    
    return {
      success: false,
      message: `Failed to get activity data: ${error.message}`,
    };
  }
}

// Analyze progress using Gemini AI
export async function analyzeProgress(): Promise<{ success: boolean; data?: ProgressMetrics; message: string }> {
  try {
    const { success, data: feedbacks, message } = await getUserFeedbacks();
    
    if (!success || !feedbacks || feedbacks.length === 0) {
      return {
        success: true,
        data: getDefaultProgressMetrics(),
        message: "No feedback data available for analysis",
      };
    }
    
    // If there's only one feedback, we don't have enough data for trend analysis
    if (feedbacks.length === 1) {
      const metrics = getSingleSessionMetrics(feedbacks[0]);
      return {
        success: true,
        data: metrics,
        message: "Progress analysis based on a single session",
      };
    }
    
    // For 2+ feedbacks, use Gemini for more sophisticated analysis
    const metrics = await getGeminiProgressAnalysis(feedbacks);
    
    return {
      success: true,
      data: metrics,
      message: "Progress analysis completed successfully",
    };
  } catch (error: any) {
    console.error("Error analyzing progress:", error);
    
    return {
      success: false,
      message: `Failed to analyze progress: ${error.message}`,
      data: getDefaultProgressMetrics(),
    };
  }
}

// Helper function to get metrics from a single session
function getSingleSessionMetrics(feedback: FeedbackData): ProgressMetrics {
  const { assessment } = feedback;
  
  // Get the activity data for the calendar
  const date = new Date(feedback.createdAt).toISOString().split('T')[0];
  
  return {
    totalSessions: 1,
    averageScore: assessment.score,
    progressTrend: 'insufficient-data',
    mostImprovedArea: 'Need more sessions to determine',
    areaNeededFocus: assessment.weaknesses[0] || 'General practice',
    recentStrengths: assessment.strengths,
    recentWeaknesses: assessment.weaknesses,
    proficiencyLevel: assessment.proficiencyLevel,
    progressPercentage: 0, // Can't calculate progress with only one session
    activityByDay: [
      {
        date,
        count: 1,
        averageScore: assessment.score,
      }
    ],
    insightSummary: `Based on your first session, your current proficiency level is ${assessment.proficiencyLevel} with an overall score of ${assessment.score}/100. Continue practicing to track your progress over time.`,
    skillProgress: {
      pronunciation: {
        currentScore: assessment.pronunciation.score,
        initialScore: assessment.pronunciation.score,
        improvementPercentage: 0,
        trend: 'steady',
        commonErrors: [],
        recommendedExercises: [],
        detailedFeedback: '',
      },
      fluency: {
        currentScore: assessment.fluency.score,
        initialScore: assessment.fluency.score,
        improvementPercentage: 0,
        trend: 'steady',
        commonErrors: [],
        recommendedExercises: [],
        detailedFeedback: '',
      },
      grammar: {
        currentScore: assessment.grammar.score,
        initialScore: assessment.grammar.score,
        improvementPercentage: 0,
        trend: 'steady',
        commonErrors: [],
        recommendedExercises: [],
        detailedFeedback: '',
      },
      vocabulary: {
        currentScore: assessment.vocabulary.score,
        initialScore: assessment.vocabulary.score,
        improvementPercentage: 0,
        trend: 'steady',
        commonErrors: [],
        recommendedExercises: [],
        detailedFeedback: '',
      },
    },
    consistencyScore: 0,
    studyHabits: {
      averageSessionsPerWeek: 0,
      mostActiveDay: '',
    },
    learningInsights: [],
    predictedTimeToNextLevel: '',
    recommendedFocus: {
      shortTerm: [],
      longTerm: [],
    },
    detailedAnalysis: '',
  };
}

// Default metrics when no data is available
function getDefaultProgressMetrics(): ProgressMetrics {
  return {
    totalSessions: 0,
    averageScore: 0,
    progressTrend: 'insufficient-data',
    mostImprovedArea: 'No data available',
    areaNeededFocus: 'Start with regular speaking practice',
    recentStrengths: [],
    recentWeaknesses: [],
    proficiencyLevel: 'Not determined',
    progressPercentage: 0,
    activityByDay: [],
    insightSummary: "You haven't completed any practice sessions yet. Start practicing to track your progress!",
    skillProgress: {
      pronunciation: {
        currentScore: 0,
        initialScore: 0,
        improvementPercentage: 0,
        trend: 'steady',
        commonErrors: [],
        recommendedExercises: [],
        detailedFeedback: '',
      },
      fluency: {
        currentScore: 0,
        initialScore: 0,
        improvementPercentage: 0,
        trend: 'steady',
        commonErrors: [],
        recommendedExercises: [],
        detailedFeedback: '',
      },
      grammar: {
        currentScore: 0,
        initialScore: 0,
        improvementPercentage: 0,
        trend: 'steady',
        commonErrors: [],
        recommendedExercises: [],
        detailedFeedback: '',
      },
      vocabulary: {
        currentScore: 0,
        initialScore: 0,
        improvementPercentage: 0,
        trend: 'steady',
        commonErrors: [],
        recommendedExercises: [],
        detailedFeedback: '',
      },
    },
    consistencyScore: 0,
    studyHabits: {
      averageSessionsPerWeek: 0,
      mostActiveDay: '',
    },
    learningInsights: [],
    predictedTimeToNextLevel: '',
    recommendedFocus: {
      shortTerm: [],
      longTerm: [],
    },
    detailedAnalysis: '',
  };
}

// Use Gemini to analyze progress across multiple sessions
async function getGeminiProgressAnalysis(feedbacks: FeedbackData[]): Promise<ProgressMetrics> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error('Gemini API key is missing.');
      return calculateProgressMetricsManually(feedbacks);
    }
    
    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });
    
    // Sort feedbacks by date (oldest to newest)
    const sortedFeedbacks = [...feedbacks].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    // Prepare the feedback data for analysis
    const feedbackSummaries = sortedFeedbacks.map((feedback, index) => {
      const { assessment, createdAt, sessionName } = feedback;
      const date = new Date(createdAt).toISOString().split('T')[0];
      
      // Create a more detailed session summary
      return `
Session ${index + 1} (${date}): "${sessionName}"
Proficiency: ${assessment.proficiencyLevel}
Overall Score: ${assessment.score}/100
Pronunciation Score: ${assessment.pronunciation.score}/100
Pronunciation Feedback: ${assessment.pronunciation.feedback}
Pronunciation Examples: ${assessment.pronunciation.examples.join(', ')}
Pronunciation Tips: ${assessment.pronunciation.tips.join(', ')}
Fluency Score: ${assessment.fluency.score}/100
Fluency Feedback: ${assessment.fluency.feedback}
Fluency Examples: ${assessment.fluency.examples.join(', ')}
Fluency Tips: ${assessment.fluency.tips.join(', ')}
Grammar Score: ${assessment.grammar.score}/100
Grammar Feedback: ${assessment.grammar.feedback}
Grammar Examples: ${assessment.grammar.examples.join(', ')}
Grammar Tips: ${assessment.grammar.tips.join(', ')}
Vocabulary Score: ${assessment.vocabulary.score}/100
Vocabulary Feedback: ${assessment.vocabulary.feedback}
Vocabulary Examples: ${assessment.vocabulary.examples.join(', ')}
Vocabulary Tips: ${assessment.vocabulary.tips.join(', ')}
Strengths: ${assessment.strengths.join(', ')}
Weaknesses: ${assessment.weaknesses.join(', ')}
      `;
    }).join('\n\n');
    
    const prompt = `
You are a world-class language learning analytics expert specializing in English language acquisition data analysis. You have advanced degrees in applied linguistics, second language acquisition, and data science, with a focus on tracking meaningful language learning progress.

PRIMARY TASK:
Analyze this chronological sequence of English speaking practice assessment data to provide precise, data-driven insights on the learner's progress trajectory, patterns, strengths, and optimal focus areas.

SESSION DATA (chronological order):
${feedbackSummaries}

ANALYSIS APPROACH:
1. Identify clear progression patterns and learning trajectories
2. Recognize both obvious and subtle improvements across all skill areas
3. Identify persistent error patterns that require focused attention
4. Consider the relationship between practice frequency and skill development
5. Prioritize high-impact improvement opportunities based on the data evidence
6. Provide personalized, actionable guidance tailored to this specific learner

OUTPUT REQUIREMENTS:
Return ONLY a JSON object with the following structure (no additional text or formatting):

{
  "totalSessions": [Integer: Number of sessions analyzed],
  "averageScore": [Integer: Average of all overall scores],
  "progressTrend": [String: One of: "improving", "steady", "declining", "insufficient-data"],
  "mostImprovedArea": [String: Based on statistical comparison between first and last sessions],
  "areaNeededFocus": [String: Area with lowest recent scores or least improvement],
  "recentStrengths": [Array of strings: Top 3 strengths from the most recent session],
  "recentWeaknesses": [Array of strings: Top 3 weaknesses from the most recent session],
  "proficiencyLevel": [String: Current CEFR proficiency level based on latest assessment],
  "progressPercentage": [Integer: Percentage improvement in overall score from first to most recent session],
  "insightSummary": [String: 2-3 sentence summary of key findings and highest-priority next steps],
  
  "skillProgress": {
    "pronunciation": {
      "currentScore": [Integer: Current pronunciation score],
      "initialScore": [Integer: Initial pronunciation score],
      "improvementPercentage": [Integer: Percentage improvement],
      "trend": [String: "improving", "steady", or "declining" based on statistical trend analysis],
      "commonErrors": [Array of strings: Recurring pronunciation errors identified across sessions],
      "recommendedExercises": [Array: 3-5 specific, targeted exercises to address identified issues],
      "detailedFeedback": [String: Specific analysis of pronunciation progress patterns]
    },
    "fluency": {
      "currentScore": [Integer: Current fluency score],
      "initialScore": [Integer: Initial fluency score],
      "improvementPercentage": [Integer: Percentage improvement],
      "trend": [String: "improving", "steady", or "declining" based on statistical trend analysis],
      "commonErrors": [Array of strings: Recurring fluency issues identified across sessions],
      "recommendedExercises": [Array: 3-5 specific, targeted exercises to address identified issues],
      "detailedFeedback": [String: Specific analysis of fluency progress patterns]
    },
    "grammar": {
      "currentScore": [Integer: Current grammar score],
      "initialScore": [Integer: Initial grammar score],
      "improvementPercentage": [Integer: Percentage improvement],
      "trend": [String: "improving", "steady", or "declining" based on statistical trend analysis],
      "commonErrors": [Array of strings: Recurring grammatical errors identified across sessions],
      "recommendedExercises": [Array: 3-5 specific, targeted exercises to address identified issues],
      "detailedFeedback": [String: Specific analysis of grammar progress patterns]
    },
    "vocabulary": {
      "currentScore": [Integer: Current vocabulary score],
      "initialScore": [Integer: Initial vocabulary score],
      "improvementPercentage": [Integer: Percentage improvement],
      "trend": [String: "improving", "steady", or "declining" based on statistical trend analysis],
      "commonErrors": [Array of strings: Recurring vocabulary limitations identified across sessions],
      "recommendedExercises": [Array: 3-5 specific, targeted exercises to address identified issues],
      "detailedFeedback": [String: Specific analysis of vocabulary development patterns]
    }
  },
  "consistencyScore": [Integer: 0-100 score calculated from practice frequency and regularity metrics],
  "studyHabits": {
    "averageSessionsPerWeek": [Float: Calculated average sessions per week based on timestamps],
    "mostActiveDay": [String: Statistically determined most frequent practice day]
  },
  "learningInsights": [
    {
      "title": [String: Clear, specific insight title],
      "description": [String: Detailed explanation with evidence from the data],
      "impact": [String: "high", "medium", or "low" impact assessment with justification]
    },
    // Additional insights...
  ],
  "predictedTimeToNextLevel": [String: Data-driven estimate based on current improvement rate],
  "recommendedFocus": {
    "shortTerm": [Array: Prioritized immediate focus areas with specific rationale],
    "longTerm": [Array: Strategic longer-term development goals with specific rationale]
  },
  "detailedAnalysis": [String: Evidence-based analysis of learning patterns, strengths, challenges, and recommendations]
}

CRITICAL RESPONSE REQUIREMENTS:
1. Return ONLY the raw JSON object with NO additional text
2. The response MUST start with { and end with }
3. All fields must contain meaningful, personalized, data-driven insights
4. Base ALL analyses on clear evidence from the session data
5. For insufficient data cases (fewer than 3 sessions), indicate this clearly while still providing meaningful estimates
6. Calculate metrics precisely (e.g., progressPercentage = ((latestScore - firstScore) / firstScore) * 100)
7. Provide specific, actionable recommendations based directly on the performance data
8. For each skill area, identify clear patterns rather than isolated instances
9. Prioritize recommendations based on impact potential and learner's demonstrated needs
10. If inconsistencies exist in the data, acknowledge them and provide the most likely interpretation
`;
    
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    try {
      // Clean up the response text
      responseText = responseText.replace(/```json\s*/g, '');
      responseText = responseText.replace(/```\s*/g, '');
      responseText = responseText.trim();
      
      // Extract JSON using regex if needed
      const jsonMatch = responseText.match(/(\{[\s\S]*\})/);
      if (jsonMatch && jsonMatch[0]) {
        responseText = jsonMatch[0];
      }
      
      // Parse the JSON response
      const analysisResult = JSON.parse(responseText);
      
      // Get activity calendar data for the complete metrics
      const { success, data: activityData } = await getActivityCalendar();
      
      return {
        ...analysisResult,
        activityByDay: success && activityData ? activityData : [],
      };
    } catch (parseError) {
      console.error('Error parsing Gemini progress response:', parseError);
      // Fallback to manual calculation if parsing fails
      return calculateProgressMetricsManually(feedbacks);
    }
  } catch (error) {
    console.error('Error getting Gemini progress analysis:', error);
    return calculateProgressMetricsManually(feedbacks);
  }
}

// Fallback function to calculate metrics manually if Gemini fails
function calculateProgressMetricsManually(feedbacks: FeedbackData[]): ProgressMetrics {
  // Sort feedbacks by date (oldest to newest)
  const sortedFeedbacks = [...feedbacks].sort((a, b) => 
    new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  
  const firstSession = sortedFeedbacks[0];
  const lastSession = sortedFeedbacks[sortedFeedbacks.length - 1];
  
  // Calculate average score
  const totalScore = sortedFeedbacks.reduce((sum, feedback) => sum + feedback.assessment.score, 0);
  const averageScore = Math.round(totalScore / sortedFeedbacks.length);
  
  // Calculate progress percentage
  const firstScore = firstSession.assessment.score;
  const lastScore = lastSession.assessment.score;
  const progressPercentage = firstScore > 0 
    ? Math.round(((lastScore - firstScore) / firstScore) * 100) 
    : 0;
  
  // Determine trend
  let progressTrend: 'improving' | 'steady' | 'declining' | 'insufficient-data' = 'insufficient-data';
  
  if (sortedFeedbacks.length >= 3) {
    if (progressPercentage >= 5) {
      progressTrend = 'improving';
    } else if (progressPercentage <= -5) {
      progressTrend = 'declining';
    } else {
      progressTrend = 'steady';
    }
  }
  
  // Find most improved area
  const areas = ['pronunciation', 'fluency', 'grammar', 'vocabulary'] as const;
  let mostImprovedArea = 'Overall speaking';
  let highestImprovement = -100;
  
  for (const area of areas) {
    const firstAreaScore = firstSession.assessment[area].score;
    const lastAreaScore = lastSession.assessment[area].score;
    const improvement = lastAreaScore - firstAreaScore;
    
    if (improvement > highestImprovement) {
      highestImprovement = improvement;
      mostImprovedArea = area.charAt(0).toUpperCase() + area.slice(1);
    }
  }
  
  // Find area needing focus
  let areaNeededFocus = 'Overall practice';
  let lowestScore = 100;
  
  for (const area of areas) {
    const score = lastSession.assessment[area].score;
    if (score < lowestScore) {
      lowestScore = score;
      areaNeededFocus = area.charAt(0).toUpperCase() + area.slice(1);
    }
  }
  
  // Get activity calendar data
  const activityMap = new Map<string, { count: number; totalScore: number }>();
  
  sortedFeedbacks.forEach(feedback => {
    const date = new Date(feedback.createdAt).toISOString().split('T')[0];
    const score = feedback.assessment.score;
    
    if (activityMap.has(date)) {
      const existing = activityMap.get(date)!;
      activityMap.set(date, {
        count: existing.count + 1,
        totalScore: existing.totalScore + score,
      });
    } else {
      activityMap.set(date, {
        count: 1,
        totalScore: score,
      });
    }
  });
  
  const activityByDay: DailyActivity[] = Array.from(activityMap.entries()).map(([date, data]) => ({
    date,
    count: data.count,
    averageScore: Math.round(data.totalScore / data.count),
  }));
  
  activityByDay.sort((a, b) => a.date.localeCompare(b.date));
  
  // Generate insight summary
  const insightSummary = `Based on your ${sortedFeedbacks.length} sessions, your ${progressTrend === 'improving' ? 'progress shows improvement' : progressTrend === 'declining' ? 'progress needs attention' : 'progress remains steady'}. Your current proficiency level is ${lastSession.assessment.proficiencyLevel} with ${mostImprovedArea} as your most improved area. Focus on improving your ${areaNeededFocus} skills for better results.`;
  
  // Calculate a skill trend that fits the SkillProgressData type
  const getSkillTrend = (trend: 'improving' | 'steady' | 'declining' | 'insufficient-data'): 'improving' | 'steady' | 'declining' => {
    if (trend === 'insufficient-data' || trend === 'steady') return 'steady';
    return trend;
  };
  
  // Extract skill progress data for each area with defaults for missing properties
  const createSkillProgressData = (area: 'pronunciation' | 'fluency' | 'grammar' | 'vocabulary'): SkillProgressData => {
    const first = firstSession.assessment[area];
    const last = lastSession.assessment[area];
    
    const initialScore = first.score;
    const currentScore = last.score;
    const improvementPercentage = initialScore > 0 
      ? Math.round(((currentScore - initialScore) / initialScore) * 100)
      : 0;
    
    // Extract any examples or tips to use as common errors/recommended exercises
    const commonErrors = last.examples || [];
    const recommendedExercises = last.tips || [];
    
    return {
      currentScore,
      initialScore,
      improvementPercentage,
      trend: getSkillTrend(progressTrend),
      commonErrors,
      recommendedExercises,
      detailedFeedback: last.feedback || ''
    };
  };
  
  return {
    totalSessions: sortedFeedbacks.length,
    averageScore,
    progressTrend,
    mostImprovedArea,
    areaNeededFocus,
    recentStrengths: lastSession.assessment.strengths,
    recentWeaknesses: lastSession.assessment.weaknesses,
    proficiencyLevel: lastSession.assessment.proficiencyLevel,
    progressPercentage,
    activityByDay,
    insightSummary,
    skillProgress: {
      pronunciation: createSkillProgressData('pronunciation'),
      fluency: createSkillProgressData('fluency'),
      grammar: createSkillProgressData('grammar'),
      vocabulary: createSkillProgressData('vocabulary')
    },
    consistencyScore: 0,
    studyHabits: {
      averageSessionsPerWeek: 0,
      mostActiveDay: '',
    },
    learningInsights: [],
    predictedTimeToNextLevel: '',
    recommendedFocus: {
      shortTerm: [],
      longTerm: [],
    },
    detailedAnalysis: '',
  };
} 