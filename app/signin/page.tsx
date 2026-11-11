// app/signin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth, db, googleProvider } from "@/lib/firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup 
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Link from "next/link";

export default function SignInPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<"seeker" | "employer" | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordInputType, setPasswordInputType] = useState<"text" | "password">("text");
  const router = useRouter();

  // Load saved credentials ONLY for sign-in; keep empty for new registration
  useEffect(() => {
    if (!role) {
      setEmail("");
      setPassword("");
      return;
    }

    if (!isSignUp) {
      setPasswordInputType("password");
      const savedCreds = localStorage.getItem(`jobboard_creds_${role}`);
      if (savedCreds) {
        try {
          const parsed = JSON.parse(savedCreds);
          setEmail(parsed.email || "");
          setPassword(parsed.password || "");
        } catch (e) {
          setEmail("");
          setPassword("");
        }
      } else {
        setEmail("");
        setPassword("");
      }
    } else {
      setPasswordInputType("text");
      setEmail("");
      setPassword("");
    }
  }, [role, isSignUp]);

  const handleRoleSelect = (selectedRole: "seeker" | "employer") => {
    setRole(selectedRole);
    setError("");
  };

  const handleToggleMode = (signUpState: boolean) => {
    setIsSignUp(signUpState);
    setError("");
    setEmail("");
    setPassword("");
    setPasswordInputType(signUpState ? "text" : "password");
  };

  const saveRoleCredentials = (userEmail: string, userPass: string) => {
    if (role) {
      localStorage.setItem(
        `jobboard_creds_${role}`,
        JSON.stringify({ email: userEmail, password: userPass })
      );
    }
  };

  const saveUserProfile = async (uid: string, userEmail: string, userDisplayName?: string) => {
    try {
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      const assignedRole = role || "seeker";

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid,
          email: userEmail,
          displayName: userDisplayName || "",
          role: assignedRole,
          createdAt: new Date().toISOString(),
        });
      } else if (role) {
        await setDoc(userRef, { role: role }, { merge: true });
      }
    } catch (err) {
      console.error("Error saving user profile:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      setError("Please select whether you are a Job Seeker or Employer first.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await saveUserProfile(userCredential.user.uid, email);
        saveRoleCredentials(email, password);
      } else {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await saveUserProfile(userCredential.user.uid, email);
        saveRoleCredentials(email, password);
      }
      router.push("/");
    } catch (err: any) {
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!role) {
      setError("Please select whether you are a Job Seeker or Employer first.");
      return;
    }
    setError("");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await saveUserProfile(result.user.uid, result.user.email || "", result.user.displayName || "");
      router.push("/");
    } catch (err: any) {
      if (err.code !== "auth/cancelled-popup-request") {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-[128px] pointer-events-none"></div>

      <div className="max-w-md w-full relative z-10 my-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-2xl font-black tracking-tight mb-3">
            Regional<span className="text-blue-500">Jobs</span>
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            {isSignUp ? "Create an Account" : "Welcome Back"}
          </h1>
          <p className="text-sm text-zinc-400 mt-2">
            {isSignUp 
              ? "Select your role and enter your fresh credentials" 
              : "Select your role to load your saved credentials"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900/85 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-8 shadow-2xl shadow-blue-500/5">
          
          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              1. Choose your role: <span className="text-blue-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2 bg-zinc-950/80 p-1.5 rounded-xl border border-zinc-800">
              <button
                type="button"
                onClick={() => handleRoleSelect("seeker")}
                className={`py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  role === "seeker"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>🔍</span> Job Seeker
              </button>
              <button
                type="button"
                onClick={() => handleRoleSelect("employer")}
                className={`py-2.5 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  role === "employer"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <span>🏢</span> Employer
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-3.5 bg-red-950/40 border border-red-800/60 text-red-200 text-xs font-medium rounded-xl flex items-start gap-2.5">
              <span className="text-base">⚠️</span>
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleAuth}
            type="button"
            disabled={!role}
            className="w-full mb-5 flex items-center justify-center gap-3 bg-zinc-950 hover:bg-zinc-800/80 border border-zinc-700/80 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-md group disabled:opacity-40"
          >
            <svg className="w-5 h-5 transition-transform group-hover:scale-105" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.19v3.15C3.17 21.31 7.27 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.19C.43 8.12 0 9.87 0 11.7s.43 3.58 1.19 5.12l4.09-2.55z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.27 0 3.17 2.69 1.19 6.58l4.09 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span className="text-sm">Continue with Google {role ? `as ${role}` : ""}</span>
          </button>

          <div className="flex items-center my-5">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="px-3 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Or with email</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="off">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                disabled={!role}
                id={isSignUp ? "new_user_reg_email" : "existing_user_email"}
                name={isSignUp ? "new_user_reg_email" : "username"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete={isSignUp ? "off" : "username email"}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none transition shadow-inner disabled:opacity-40 disabled:cursor-not-allowed"
                placeholder={role ? "name@company.com" : "Please select a role above first..."}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">Password</label>
              <input
                type={passwordInputType}
                required
                disabled={!role}
                id={isSignUp ? "new_user_reg_password" : "existing_user_password"}
                name={isSignUp ? "new_user_reg_password" : "current-password"}
                value={password}
                onFocus={() => {
                  if (isSignUp) setPasswordInputType("password");
                }}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (isSignUp) setPasswordInputType("password");
                }}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-white text-sm placeholder-zinc-500 focus:outline-none transition shadow-inner disabled:opacity-40 disabled:cursor-not-allowed"
                placeholder={role ? "••••••••" : "Please select a role above first..."}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !role}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all text-sm shadow-lg shadow-blue-600/25 disabled:opacity-40 disabled:cursor-not-allowed mt-2"
            >
              {loading 
                ? "Processing..." 
                : !role 
                  ? "Select a Role Above" 
                  : isSignUp 
                    ? `Register as ${role === "seeker" ? "Job Seeker" : "Employer"}` 
                    : `Sign In as ${role === "seeker" ? "Job Seeker" : "Employer"}`}
            </button>
          </form>

          {/* Toggle Button */}
          <div className="text-center mt-6 pt-5 border-t border-zinc-800/80">
            <button
              onClick={() => handleToggleMode(!isSignUp)}
              type="button"
              className="text-xs text-zinc-400 hover:text-white transition font-medium"
            >
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <span className="text-blue-400 hover:underline font-semibold">
                {isSignUp ? "Sign In" : "Create one free"}
              </span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-zinc-500 mt-6 px-2">
          <span>🔒 256-bit Secure Encryption</span>
          <Link href="/" className="hover:text-zinc-300 transition font-medium">
            ← Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}