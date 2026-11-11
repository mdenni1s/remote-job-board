// components/Header.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            setRole(userDoc.data().role);
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
        }
      } else {
        setRole(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign-out error:", error);
    }
  };

  return (
    <header className="w-full border-b border-zinc-800 bg-zinc-950 px-6 py-4 text-white sticky top-0 z-50 backdrop-blur-md bg-opacity-90">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Section: Logo & Direct Navigation Links */}
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-black tracking-tight">
            Regional<span className="text-blue-500">Jobs</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link 
              href="/#jobs" 
              className="text-zinc-300 hover:text-white transition flex items-center gap-1.5"
            >
              <span>🔍</span> Find Jobs
            </Link>
            <Link 
              href="/about" 
              className="text-zinc-300 hover:text-white transition flex items-center gap-1.5"
            >
              <span>💡</span> About Us
            </Link>
          </nav>
        </div>

        {/* Right Section: Action Buttons & Auth */}
        <div className="flex items-center space-x-3">
          {loading ? (
            <div className="h-9 w-20 bg-zinc-800 animate-pulse rounded-md"></div>
          ) : user ? (
            <div className="flex items-center space-x-3">
              <span className="text-xs sm:text-sm text-zinc-300 hidden sm:inline bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
                <strong className="text-white capitalize">{role === "employer" ? "🏢 Employer" : "🔍 Job Seeker"}</strong> ({user.email})
              </span>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-zinc-400 hover:text-white px-3 py-2 rounded-lg transition"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              className="text-sm font-medium text-zinc-300 hover:text-white px-4 py-2 rounded-xl border border-zinc-700 hover:border-zinc-500 bg-zinc-900 transition shadow-sm"
            >
              Sign In
            </Link>
          )}

          {/* Primary Action Button */}
          <Link
            href="/post-a-job"
            className="text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl transition shadow-md shadow-blue-600/20 whitespace-nowrap"
          >
            Post a Job ($29)
          </Link>
        </div>
      </div>
    </header>
  );
}