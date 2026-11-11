// app/about/page.tsx
"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-16 px-4 selection:bg-blue-600 selection:text-white">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <Link 
            href="/" 
            className="inline-block text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-50 border border-blue-200 px-3 py-1 rounded-full mb-2 hover:bg-blue-100 transition shadow-sm"
          >
            ← Back to Home
          </Link>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
            Empowering <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Regional Tech Talent</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
            RegionalJobs connects ambitious tech professionals with verified remote companies looking for world-class regional expertise.
          </p>
        </div>

        {/* Why Choose Us Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="text-2xl">🎯</div>
            <h3 className="text-lg font-bold text-slate-900">Targeted Opportunities</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              No endless scrolling through mismatched global job boards. Every listing is curated specifically for regional remote tech professionals.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="text-2xl">🔒</div>
            <h3 className="text-lg font-bold text-slate-900">Verified Companies</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We vet employers to ensure competitive remote compensation, transparent growth paths, and safe working environments.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-sm hover:shadow-md transition">
            <div className="text-2xl">⚡</div>
            <h3 className="text-lg font-bold text-slate-900">Direct Applications</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Apply directly to open positions with one click as a job seeker, or post your openings instantly as an employer.
            </p>
          </div>
        </div>

        {/* Frequently Asked Questions (FAQs) */}
        <div className="space-y-6 pt-6">
          <h2 className="text-2xl font-bold tracking-tight text-center text-slate-900">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">How do I apply for remote jobs?</h3>
              <p className="text-sm text-slate-600">
                Simply sign in with your <strong className="text-slate-900">Job Seeker</strong> account, select a job on the homepage feed, and click the "Apply Now" button.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">How do I post a job opening as an employer?</h3>
              <p className="text-sm text-slate-600">
                Sign in using an <strong className="text-slate-900">Employer</strong> account, click the "+ Post a New Job ($29)" button, and fill out your company and position requirements.
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-2 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">Is it free to create a Job Seeker account?</h3>
              <p className="text-sm text-slate-600">
                Yes! Creating an account, browsing listings, and submitting job applications is completely free for job seekers.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action Footer */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Ready to get started?</h3>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Join our regional network today as a job seeker or employer.
          </p>
          <div className="flex justify-center gap-4 pt-2">
            <Link href="/signin" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition shadow-md shadow-blue-600/20">
              Sign In / Register
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}