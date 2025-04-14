"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FirestoreData = any;

const ONE_WEEK = 60 * 60 * 24 * 7; // 7

interface SignInParams {
  email: string;
  idToken: string;
}

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

interface User {
  name: string;
  email: string;
  id: string;
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  console.log("SignUp action called with:", { uid, name, email });

  try {
    console.log("Checking if user already exists in Firestore...");
    const userRecord = await db.collection("users").doc(uid).get();
    
    if (userRecord.exists) {
      console.log("User already exists in Firestore, returning error");
      return {
        success: false,
        message: "User already exists. Please log in.",
      };
    }

    console.log("User doesn't exist in Firestore, creating new document...");
    try {
      // Use set with merge option to be safer
      await db.collection("users").doc(uid).set({
        name,
        email,
        createdAt: new Date(),
      }, { merge: true });
      
      console.log("User document created successfully in Firestore");
      
      return {
        success: true,
        message: "Account created successfully. Please sign in.",
      };
    } catch (firestoreError: any) {
      console.error("Firestore write error:", firestoreError);
      
      // Return a more specific error message
      return {
        success: false,
        message: `Database error: ${firestoreError.message || "Failed to save user data."}`,
      };
    }
  } catch (error: any) {
    console.error("Error in signUp server action:", error);
    console.error("Error details:", error.code, error.message);

    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "Email already exists. Please use a different email.",
      };
    }

    return {
      success: false,
      message: `Server error: ${error.message || "Something went wrong. Failed to create an account."}`,
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "User not found. Please sign up.",
      };
    }

    await setSessionCookie(idToken);
  } catch (error) {
    console.log("Error signing in:", error);

    return {
      success: false,
      message: "Something went wrong. Failed to sign in.",
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000, // 7 days
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) {
      return null;
    }

    // Serialize Firestore data to plain objects
    const userData = userRecord.data();
    
    // Convert Firestore Timestamp to ISO string or timestamp
    const serializedData: any = {
      ...userData,
      id: userRecord.id
    };
    
    // Check if createdAt exists and is a Timestamp
    if (userData?.createdAt && typeof userData.createdAt.toDate === 'function') {
      // Convert to ISO string
      serializedData.createdAt = userData.createdAt.toDate().toISOString();
    } else if (userData?.createdAt) {
      // If it's already an object with _seconds, convert to ISO string
      serializedData.createdAt = new Date(
        (userData.createdAt._seconds || 0) * 1000
      ).toISOString();
    }
    
    return serializedData as User;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();

  return !!user;
}

export async function logout() {
  const cookieStore = await cookies();

  // Remove session cookie
  cookieStore.delete("session");

  return {
    success: true,
    message: "Logged out successfully",
  };
}
