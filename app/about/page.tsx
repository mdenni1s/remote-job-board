// app/about/page.tsx
"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white py-16 px-4 selection:bg-blue-600 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <Link 
            href="/" 
            className="inline-block text-xs font-semibold tracking-wider text-blue-400 uppercase bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-2 hover:bg-blue-500/20 transition"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Regional Tech Talent</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg">
            RegionalJobs connects ambitious tech professionals with verified remote companies looking for world-class regional expertise.
          </p>
        </div>

        {/* Why Choose Us Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-3">
            <div className="text-2xl">🎯</div>
            <h3 className="text-lg font-bold text-white">Targeted Opportunities</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              No endless scrolling through mismatched global job boards. Every listing is curated specifically for regional remote tech professionals.
            </p>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-3">
            <div className="text-2xl">🔒</div>
            <h3 className="text-lg font-bold text-white">Verified Companies</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              We vet employers to ensure competitive remote compensation, transparent growth paths, and safe working environments.
            </p>
          </div>

          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-3">
            <div className="text-2xl">⚡</div>
            <h3 className="text-lg font-bold text-white">Direct Applications</h3>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              Apply directly to open positions with one click as a job seeker, or post your openings instantly as an employer.
            </p>
          </div>
        </div>

        {/* Frequently Asked Questions (FAQs) */}
        <div className="space-y-6 pt-6">
          <h2 className="text-2xl font-bold tracking-tight text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 space-y-2">
              <h3 className="text-base font-semibold text-white">How do I apply for remote jobs?</h3>
              <p className="text-sm text-zinc-400">
                Simply sign in with your <strong className="text-zinc-200">Job Seeker</strong> account, select a job on the homepage feed, and click the "Apply Now" button.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 space-y-2">
              <h3 className="text-base font-semibold text-white">How do I post a job opening as an employer?</h3>
              <p className="text-sm text-zinc-400">
                Sign in using an <strong className="text-zinc-200">Employer</strong> account, click the "+ Post a New Job ($29)" button, and fill out your company and position requirements.
              </p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 space-y-2">
              <h3 className="text-base font-semibold text-white">Is it free to create a Job Seeker account?</h3>
              <p className="text-sm text-zinc-400">
                Yes! Creating an account, browsing listings, and submitting job applications is completely free for job seekers.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Footer */}
        <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-500/20 rounded-2xl p-8 text-center space-y-4">
          <h3 className="text-xl font-bold text-white">Ready to get started?</h3>
          <p className="text-sm text-zinc-300 max-w-md mx-auto">
            Join our regional network today as a job seeker or employer.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link href="/signin" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-lg shadow-blue-600/20">
              Sign In / Register
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}