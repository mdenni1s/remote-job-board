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
      <div className="min-h-[70vh] flex items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
          <p className="text-sm">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-blue-600 selection:text-white pb-20">
      
      {/* HERO SECTION / ROLE BANNER */}
      <div className="relative overflow-hidden border-b border-zinc-800/80 bg-gradient-to-b from-zinc-900/60 via-zinc-950 to-zinc-950 py-16 px-4">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          
          {/* Role Indicator Badge */}
          {user && role && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 shadow-sm mb-2">
              <span className={`h-2 w-2 rounded-full ${role === "employer" ? "bg-blue-500" : "bg-emerald-500"}`}></span>
              Logged in as <strong className="text-white capitalize">{role === "employer" ? "🏢 Employer Dashboard" : "🔍 Job Seeker Workspace"}</strong> ({user.email})
            </div>
          )}

          {!user && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 uppercase tracking-wider">
              🚀 The #1 Regional Remote Tech Board
            </div>
          )}

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-[1.1]">
            {user && role === "employer" ? (
              <span>Manage Your Listings & Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Top Tech Talent</span></span>
            ) : user && role === "seeker" ? (
              <span>Explore & Apply to Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Remote Tech Roles</span></span>
            ) : (
              <span>Discover Elite <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Remote Tech Jobs</span> in Your Region</span>
            )}
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto">
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
                className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition shadow-lg shadow-blue-600/25 flex items-center gap-2"
              >
                + Post a New Job ($29)
              </Link>
            ) : !user ? (
              <>
                <Link
                  href="/signin"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition shadow-lg shadow-blue-600/25"
                >
                  Sign In / Register
                </Link>
                <Link
                  href="/post-a-job"
                  className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 text-white font-semibold px-7 py-3.5 rounded-xl text-sm transition"
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
        <div id="jobs" className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4 scroll-mt-24">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search title, tech stack, company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition shadow-inner"
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
                      : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
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
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {user && role === "employer" ? "Your Posted Listings" : "Active Remote Opportunities"}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400">
              {user && role === "employer" 
                ? "Manage your active job postings" 
                : `Showing ${filteredJobs.length} active positions`}
            </p>
          </div>
        </div>

        {/* Job Cards Feed */}
        {filteredJobs.length === 0 ? (
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-16 text-center space-y-3">
            <div className="text-4xl">📂</div>
            <h3 className="text-lg font-bold text-white">No jobs found</h3>
            <p className="text-sm text-zinc-400 max-w-md mx-auto">
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
                className="group bg-zinc-900/70 hover:bg-zinc-900 border border-zinc-800/80 hover:border-blue-500/50 rounded-2xl p-6 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-blue-500/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-blue-400 transition">
                      {job.title}
                    </h3>
                    <span className="text-xs px-3 py-1 rounded-full font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {job.jobType || "Remote"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-400">
                    <span className="font-medium text-zinc-200">{job.company}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">📍 {job.location || "Remote"}</span>
                    {job.salary && (
                      <>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">💰 {job.salary}</span>
                      </>
                    )}
                  </div>

                  {job.techStack && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {job.techStack.split(",").map((tech: string, i: number) => (
                        <span key={i} className="text-[11px] bg-zinc-950 text-zinc-300 border border-zinc-800 px-2.5 py-0.5 rounded-md">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {user && role === "employer" ? (
                  <button
                    onClick={() => alert(`Managing listing: ${job.title}`)}
                    className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold px-6 py-3 rounded-xl transition border border-zinc-700 whitespace-nowrap"
                  >
                    Manage Listing
                  </button>
                ) : user && role === "seeker" ? (
                  <button
                    onClick={() => alert(`Application submitted for ${job.title}!`)}
                    className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-6 py-3 rounded-xl transition shadow-md shadow-blue-600/25 whitespace-nowrap"
                  >
                    Apply Now →
                  </button>
                ) : (
                  <Link
                    href="/signin"
                    className="w-full sm:w-auto bg-zinc-800 hover:bg-blue-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition border border-zinc-700 whitespace-nowrap text-center"
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