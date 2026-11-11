'use client';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 flex items-center justify-center p-4 text-zinc-100">
      <div className="w-full max-w-md bg-zinc-800/80 border border-zinc-700 p-8 rounded-2xl shadow-xl">
        <h2 className="text-2xl font-bold mb-2 text-white text-center">Create an Account</h2>
        <p className="text-zinc-400 text-xs text-center mb-6">Sign up to post jobs and manage listings</p>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border border-red-700 text-red-200 text-xs rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-xl outline-none focus:border-zinc-500 text-sm"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-zinc-900 border border-zinc-700 rounded-xl outline-none focus:border-zinc-500 text-sm"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-100 hover:bg-white text-zinc-900 font-bold py-3 rounded-xl transition text-sm disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-xs text-center text-zinc-400 mt-6">
          Already have an account?{' '}
          <Link className="text-white hover:underline font-semibold" href="/signin">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}