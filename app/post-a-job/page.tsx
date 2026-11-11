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
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/50 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-4xl">🎉</span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Listing Received Successfully!</h1>
            <p className="text-sm text-slate-600">
              Your position is securely logged and currently <strong className="text-amber-600">Pending Verification</strong>.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Your Secure Reference Code</span>
            <div className="text-lg font-mono font-bold text-blue-600 select-all">{referenceCode}</div>
          </div>

          <div className="space-y-3 text-sm text-slate-700">
            <h3 className="font-semibold text-slate-900">Final Step: $29 Verification Fee</h3>
            <ul className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <li>📱 <strong>M-Pesa (Buy Goods / Till No):</strong> Send equivalent to Till <code className="text-slate-900 font-bold">123456</code> using your reference code.</li>
              <li>🌍 <strong>PayPal:</strong> Send $29 to <code className="text-slate-900 font-bold">payments@regionaljobs.com</code></li>
              <li>🏦 <strong>Bank Transfer:</strong> RegionalJobs Account - <code className="text-slate-900 font-bold">0123456789</code> (Bank XYZ)</li>
            </ul>
            <p className="text-xs text-slate-500 leading-relaxed pt-1">
              Once completed, email your confirmation receipt along with your reference code to <strong className="text-slate-800">support@regionaljobs.com</strong>. Our team manually verifies every transaction to maintain the highest standard of quality and safety for your talent pipeline.
            </p>
          </div>

          <div className="pt-2">
            <Link 
              href="/" 
              className="w-full block text-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition text-sm shadow-md shadow-blue-600/20"
            >
              Return to Home Feed
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 flex flex-col items-center justify-center">
      
      {/* Reassuring Value Proposition Banner */}
      <div className="max-w-2xl w-full mb-6 bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center space-y-2 shadow-sm">
        <h2 className="text-base font-bold text-blue-900">🎯 Why Hire Through RegionalJobs?</h2>
        <p className="text-xs text-blue-700 leading-relaxed max-w-lg mx-auto">
          Connect directly with pre-vetted, elite regional engineers and technical talent. Every listing is manually reviewed to protect your brand and connect you with dedicated professionals ready to deliver exceptional results.
        </p>
      </div>

      <div className="max-w-2xl w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/50 space-y-6">
        
        <div className="space-y-2">
          <Link href="/" className="text-xs text-blue-600 font-semibold uppercase tracking-wider hover:underline">
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Post a Verified Tech Opening ($29)</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Fill in your job details below to place your vacancy in front of top regional developers and tech specialists.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Full-Stack React & Node Engineer"
              className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company Name</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Innovations"
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location / Region</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Remote (East Africa / Global)"
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Type</label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-sm text-slate-900 outline-none transition shadow-sm"
              >
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Salary Range (Optional)</label>
              <input
                type="text"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                placeholder="e.g. $3,500 - $6,000 / mo"
                className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Tech Stack (Comma separated)</label>
            <input
              type="text"
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              placeholder="e.g. React, Next.js, TypeScript, Firebase, Node.js"
              className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition shadow-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-xl transition text-sm shadow-md shadow-blue-600/20 disabled:opacity-50 mt-4 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{loading ? "Submitting Listing..." : "Publish Job & Proceed to Verification ($29)"}</span>
          </button>
        </form>

        {/* Trust Footer Badges */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-around gap-2 text-[11px] text-slate-500 text-center font-medium">
          <span>🛡️ Verified Employers</span>
          <span>⚡ 24-Hour Review Turnaround</span>
          <span>👥 Targeted Regional Tech Pool</span>
        </div>

      </div>
    </div>
  );
}