"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaGoogle, FaGithub, FaEye, FaEyeSlash } from "react-icons/fa";
import Aurora from "./Backgrounds/Aurora/Aurora";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase/client";
import { signIn, signUp } from "@/lib/actions/auth.action";
import { toast } from "sonner";

// Define FormType type
type FormType = "sign-in" | "sign-up";

// Create a FormField component for consistent form fields
const FormField = ({ 
  control, 
  name, 
  label, 
  placeholder, 
  type = "text",
  showPassword,
  togglePassword,
}: { 
  control: any;
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  showPassword?: boolean;
  togglePassword?: () => void;
}) => {
  const isPassword = type === "password";
  
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="block text-white mb-1">
        {label}
      </label>
      
      <div className="relative">
        <input
          type={isPassword && showPassword ? "text" : type}
          id={name}
          placeholder={placeholder}
          className="w-full bg-zinc-900 border border-gray-900 rounded-lg p-3 text-white"
          {...control.register(name)}
        />
        
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            onClick={togglePassword}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
      
      {control.formState.errors[name] && (
        <p className="text-sm text-red-400 mt-1">
          {control.formState.errors[name].message}
        </p>
      )}
    </div>
  );
};

// Define form schema for validation
const authFormSchema = (type: FormType) => {
  return z.object({
    firstName: type === "sign-up" ? z.string().min(1, "First name is required") : z.string().optional(),
    lastName: type === "sign-up" ? z.string().min(1, "Last name is required") : z.string().optional(),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
  });
};

const AuthForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  
  const type: FormType = pathname === "/sign-in" ? "sign-in" : "sign-up";
  const pageTitle = type === "sign-in" ? "Sign In" : "Sign Up";
  const buttonText = type === "sign-in" ? "Sign In" : "Sign Up";
  const formDescription = type === "sign-in" 
    ? "Enter your credentials to access your account" 
    : "Enter your personal data to create your account";
  
  // Define form with zod resolver
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: ""
    }
  });
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError("");
    
    try {
      console.log(`Processing ${type === "sign-in" ? 'Sign In' : 'Sign Up'} Data:`, values);
      
      if (type === "sign-in") {
        // Sign in logic
        const { email, password } = values;
        const result = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await result.user.getIdToken();
        
        // Call server action to set cookie
        await signIn({ email, idToken });
        console.log("User signed in successfully:", result.user);
        toast.success("Signed in successfully");
        router.push("/home");
      } else {
        // Sign up logic
        const { firstName, lastName, email, password } = values;
        const name = `${firstName} ${lastName}`.trim();
        
        try {
          console.log("Creating user in Firebase Auth with email:", email);
          // Create user in Firebase Auth
          const result = await createUserWithEmailAndPassword(auth, email, password);
          const uid = result.user.uid;
          console.log("User created in Firebase Auth with UID:", uid);
          
          // Call server action to store user in Firestore
          console.log("Calling server action with:", { uid, name, email });
          const signUpResult = await signUp({
            uid, 
            name, 
            email,
            password
          });
          
          console.log("Server action response:", signUpResult);
          
          if (signUpResult.success) {
            toast.success("Account created successfully! Please sign in.");
            router.push("/sign-in");
          } else {
            console.error("Server action failed:", signUpResult.message);
            
            // Even if Firestore save fails, the account was created in Firebase Auth
            const isDbError = signUpResult.message.includes("Database error");
            if (isDbError) {
              toast.error(signUpResult.message + " We've noted the issue and will fix it. You can still try to sign in.");
              setError(signUpResult.message + " Your account was created but your profile information couldn't be saved. You can still try to sign in.");
              // Wait 3 seconds then redirect to sign-in
              setTimeout(() => {
                router.push("/sign-in");
              }, 3000);
            } else {
              toast.error(signUpResult.message);
              setError(signUpResult.message);
            }
          }
        } catch (firebaseError: any) {
          console.error("Firebase Auth error:", firebaseError);
          throw firebaseError; // Rethrow for the outer catch block to handle
        }
      }
    } catch (error: any) {
      console.error("Authentication error:", error);
      // Handle Firebase auth errors
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError("This email is already in use.");
          toast.error("This email is already in use.");
          break;
        case 'auth/invalid-email':
          setError("Invalid email address.");
          toast.error("Invalid email address.");
          break;
        case 'auth/weak-password':
          setError("Password should be at least 6 characters.");
          toast.error("Password should be at least 6 characters.");
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError("Invalid email or password.");
          toast.error("Invalid email or password.");
          break;
        default:
          setError(`An error occurred: ${error.message}`);
          toast.error(`An error occurred: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // Call server action to set cookie
      await signIn({ 
        email: result.user.email || "", 
        idToken 
      });
      
      console.log("Google sign in successful:", result.user);
      toast.success("Signed in with Google successfully");
      router.push("/home");
    } catch (error: any) {
      console.error("Google sign in error:", error);
      setError("Failed to sign in with Google. Please try again.");
      toast.error("Failed to sign in with Google. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      // Call server action to set cookie
      await signIn({ 
        email: result.user.email || "", 
        idToken 
      });
      
      console.log("GitHub sign in successful:", result.user);
      toast.success("Signed in with GitHub successfully");
      router.push("/home");
    } catch (error: any) {
      console.error("GitHub sign in error:", error);
      setError("Failed to sign in with GitHub. Please try again.");
      toast.error("Failed to sign in with GitHub. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto bg-black rounded-xl overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 h-full">
          {/* Left side - hidden on mobile */}
          <div className="col-span-1 hidden md:flex relative flex-col items-center justify-center text-white p-6 md:p-10" style={{ minHeight: "650px" }}>
            <div className="absolute inset-0">
              <Aurora
                colorStops={["#8A3FFC", "#C77DFF", "#622EB5"]}
                blend={0.6}
                amplitude={1.0}
                speed={0.5}
              />
            </div>
            <div className="z-10 text-center">
              <div className="flex items-center justify-center mb-6">
                <span className="text-2xl font-bold">SpeakWell</span>
              </div>
              <h2 className="text-4xl font-bold mb-4">
                {type === "sign-in" ? "Welcome Back" : "Get Started with Us"}
              </h2>
              <p className="mb-10">
                {type === "sign-in" 
                  ? "Log in to your account to continue your journey" 
                  : "Fill in the details and register your account."}
              </p>
            </div>
          </div>

          {/* Right side - full width on mobile */}
          <div className="col-span-1 md:col-span-1 bg-black p-6 md:p-10 flex flex-col justify-center" style={{ minHeight: "650px" }}>
            {/* Mobile-only logo and header */}
            <div className="flex flex-col items-center mb-8 md:hidden">
              <span className="text-2xl font-bold text-white mb-2">SpeakWell</span>
              <h2 className="text-3xl text-white font-bold px-20">{pageTitle}</h2>
            </div>
            
            {/* Desktop-only header */}
            <div className="hidden md:block md:flex md:flex-col md:items-center">
              <h2 className="text-3xl text-white font-bold mb-2">
                {pageTitle}
              </h2>
              <p className="text-gray-400 mb-8">
                {formDescription}
              </p>
            </div>

            {/* Error message */}
            {error && (
              <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <button 
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-transparent border border-gray-700 text-white rounded-lg p-3 transition hover:bg-gray-900 disabled:opacity-50"
              >
                <FaGoogle className="text-lg" />
                <span>Google</span>
              </button>
              <button 
                type="button"
                onClick={handleGithubSignIn}
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-transparent border border-gray-700 text-white rounded-lg p-3 transition hover:bg-gray-900 disabled:opacity-50"
              >
                <FaGithub className="text-lg" />
                <span>Github</span>
              </button>
            </div>

            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-gray-800"></div>
              <span className="flex-shrink mx-4 text-gray-500">Or</span>
              <div className="flex-grow border-t border-gray-800"></div>
            </div>

            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              {type === "sign-up" && (
                <div className="grid grid-cols-2 gap-4">
                  <FormField 
                    control={form}
                    name="firstName"
                    label="First Name"
                    placeholder="eg. John"
                  />
                  <FormField 
                    control={form}
                    name="lastName"
                    label="Last Name"
                    placeholder="eg. Francisco"
                  />
                </div>
              )}

              <FormField 
                control={form}
                name="email"
                label="Email"
                placeholder="eg. johnfrans@gmail.com"
                type="email"
              />

              <FormField 
                control={form}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
                showPassword={showPassword}
                togglePassword={() => setShowPassword(!showPassword)}
              />

              {!type && (
                <p className="text-sm text-gray-500 mt-1">
                  Must be at least 6 characters.
                </p>
              )}
              
              {type === "sign-in" && (
                <p className="text-sm text-right mt-1">
                  <Link href="/forgot-password" className="text-gray-400 hover:text-white transition-colors">
                    Forgot password?
                  </Link>
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black font-medium rounded-lg p-3 transition hover:bg-gray-200 disabled:opacity-50"
              >
                {loading ? "Processing..." : buttonText}
              </Button>
            </form>

            <p className="text-gray-400 text-center mt-6">
              {type === "sign-in" 
                ? "Don't have an account? " 
                : "Already have an account? "}
              <Link 
                href={type === "sign-in" ? "/sign-up" : "/sign-in"} 
                className="text-white underline"
              >
                {type === "sign-in" ? "Sign up" : "Log in"}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
