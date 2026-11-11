// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import Link from "next/link";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setRole(userDoc.data().role);
        }
      }
      setLoading(false);
    });

    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jobs"));
        const jobList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJobs(jobList);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };

    fetchJobs();
    return () => unsubscribe();
  }, []);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.techStack?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || job.jobType === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 text-slate-500">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
          <p className="text-sm">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white pb-20">
      
      {/* HERO SECTION / ROLE BANNER */}
      <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-white via-slate-50 to-slate-50 py-16 px-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-40"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          
          {/* Role Indicator Badge */}
          {user && role && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-700 shadow-sm mb-2">
              <span className={`h-2 w-2 rounded-full ${role === "employer" ? "bg-blue-600" : "bg-emerald-600"}`}></span>
              Logged in as <strong className="text-slate-900 capitalize">{role === "employer" ? "🏢 Employer Dashboard" : "🔍 Job Seeker Workspace"}</strong> ({user.email})
            </div>
          )}

          {!user && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-xs font-semibold text-blue-600 uppercase tracking-wider shadow-sm">
              🚀 The #1 Regional Remote Tech Board
            </div>
          )}

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 max-w-3xl mx-auto leading-[1.1]">
            {user && role === "employer" ? (
              <span>Manage Your Listings & Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Top Tech Talent</span></span>
            ) : user && role === "seeker" ? (
              <span>Explore & Apply to Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Remote Tech Roles</span></span>
            ) : (
              <span>Discover Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Remote Tech Jobs</span> in Your Region</span>
            )}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
            {user && role === "employer" 
              ? "Post your openings today and connect instantly with pre-vetted regional engineers."
              : user && role === "seeker"
              ? "Hand-picked remote opportunities matching your skill set. Apply directly with one click."
              : "Connect top regional talent with exciting remote opportunities. Sign in to apply or post openings."}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            {user && role === "employer" ? (
              <Link
                href="/post-a-job"
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition shadow-lg shadow-blue-600/20 flex items-center gap-2"
              >
                + Post a New Job ($29)
              </Link>
            ) : !user ? (
              <>
                <Link
                  href="/signin"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition shadow-lg shadow-blue-600/20"
                >
                  Sign In / Register
                </Link>
                <Link
                  href="/post-a-job"
                  className="bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-semibold px-7 py-3.5 rounded-xl text-sm transition shadow-sm"
                >
                  Post a Job ($29)
                </Link>
              </>
            ) : null}
          </div>

        </div>
      </div>

      {/* MAIN WORKSPACE CONTENT & ANCHOR TARGET */}
      <div className="max-w-6xl mx-auto px-4 mt-12 space-y-8">
        
        {/* Search & Category Filter Bar */}
        <div id="jobs" className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 scroll-mt-24">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search title, tech stack, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition shadow-sm"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {["All", "Full-time", "Contract", "Part-time", "Remote"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                      : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* Section Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {user && role === "employer" ? "Your Posted Listings" : "Active Remote Opportunities"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {user && role === "employer" 
                ? "Manage your active job postings" 
                : `Showing ${filteredJobs.length} active positions`}
            </p>
          </div>
        </div>

        {/* Job Cards Feed */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center space-y-3 shadow-sm">
            <div className="text-4xl">📂</div>
            <h3 className="text-lg font-bold text-slate-900">No jobs found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              {user && role === "employer" 
                ? "You haven't posted any jobs yet. Click '+ Post a New Job' above to publish your first listing."
                : "No remote jobs found matching your search criteria. Try modifying your keywords or check back soon!"}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <div
                key={job.id}
                className="group bg-white hover:border-blue-300 border border-slate-200 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {job.title}
                    </h3>
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {job.jobType || "Remote"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span className="font-semibold text-slate-800">{job.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">📍 {job.location || "Remote"}</span>
                    {job.salary && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-600 font-semibold">💰 {job.salary}</span>
                      </>
                    )}
                  </div>

                  {job.techStack && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.techStack.split(",").map((tech: string, i: number) => (
                        <span key={i} className="text-[11px] bg-slate-100 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-md font-mono">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {user && role === "employer" ? (
                  <button
                    onClick={() => alert(`Managing listing: ${job.title}`)}
                    className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold px-6 py-3 rounded-xl transition border border-slate-200 whitespace-nowrap"
                  >
                    Manage Listing
                  </button>
                ) : user && role === "seeker" ? (
                  <button
                    onClick={() => alert(`Application submitted for ${job.title}!`)}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition shadow-sm whitespace-nowrap"
                  >
                    Apply Now →
                  </button>
                ) : (
                  <Link
                    href="/signin"
                    className="w-full sm:w-auto bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 text-sm font-semibold px-6 py-3 rounded-xl transition border border-slate-200 whitespace-nowrap text-center shadow-sm"
                  >
                    Sign In to Apply
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}