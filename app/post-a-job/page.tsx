// app/post-a-job/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import Link from "next/link";

export default function PostAJobPage() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("Full-time");
  const [salary, setSalary] = useState("");
  const [techStack, setTechStack] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // State for success & manual payment instructions screen
  const [submitted, setSubmitted] = useState(false);
  const [referenceCode, setReferenceCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Save the job to Firestore with status "pending" awaiting $29 manual verification
      const docRef = await addDoc(collection(db, "jobs"), {
        title,
        company,
        location,
        jobType,
        salary,
        techStack,
        status: "pending", // Awaiting payment verification
        employerId: auth.currentUser ? auth.currentUser.uid : "anonymous",
        employerEmail: auth.currentUser ? auth.currentUser.email : "unknown",
        createdAt: new Date().toISOString(),
      });

      setReferenceCode(docRef.id);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit job posting.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="text-4xl">🎉</span>
            <h1 className="text-2xl font-bold tracking-tight">Job Submitted Successfully!</h1>
            <p className="text-sm text-zinc-400">
              Your listing is currently <strong className="text-amber-400">Pending</strong> payment verification.
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-2 text-center">
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Your Reference Code</span>
            <div className="text-lg font-mono font-bold text-blue-400 select-all">{referenceCode}</div>
          </div>

          <div className="space-y-3 text-sm text-zinc-300">
            <h3 className="font-semibold text-white">Payment Instructions ($29 USD Fee):</h3>
            <ul className="space-y-2 text-xs text-zinc-400 bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/80">
              <li>📱 <strong>M-Pesa (Buy Goods / Till No):</strong> Send equivalent to Till <code className="text-white">123456</code> and note your reference code.</li>
              <li>🌍 <strong>PayPal:</strong> Send $29 to <code className="text-white">payments@regionaljobs.com</code></li>
              <li>🏦 <strong>Bank Transfer:</strong> RegionalJobs Account - <code className="text-white">0123456789</code> (Bank XYZ)</li>
            </ul>
            <p className="text-xs text-zinc-400 leading-relaxed pt-1">
              Once paid, send your transaction confirmation receipt and reference code to <strong className="text-zinc-200">support@regionaljobs.com</strong>. Your job will go live on the homepage within 24 hours of verification!
            </p>
          </div>

          <div className="pt-2">
            <Link 
              href="/" 
              className="w-full block text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition text-sm shadow-lg shadow-blue-600/25"
            >
              Return to Home Feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl space-y-6">
        
        <div className="space-y-2">
          <Link href="/" className="text-xs text-blue-400 font-semibold uppercase tracking-wider hover:underline">
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight">Post a Remote Job ($29)</h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Fill out your vacancy details below. Listings are activated upon payment verification.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-200 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Job Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior React Developer"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Corp"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Location / Region</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote (East Africa)"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none transition"
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">Salary Range (Optional)</label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. $3,000 - $5,000 / mo"
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Tech Stack (Comma separated)</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="e.g. React, Node.js, TypeScript, Firebase"
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition text-sm shadow-lg shadow-blue-600/25 disabled:opacity-50 mt-4"
          >
            {loading ? "Submitting Listing..." : "Submit Listing & View Payment Details ($29)"}
          </button>
        </form>

      </div>
    </div>
  );
}