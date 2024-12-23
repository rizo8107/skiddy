import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { pb } from '../lib/pocketbase';
import { Loader2 } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await pb.collection('users').requestPasswordReset(email);
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for instructions to reset your password.",
        variant: "default",
      });
      setEmail('');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-white/10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-white/70">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="relative block w-full rounded-lg border border-white/10 
                       bg-black/20 px-4 py-3 text-white placeholder-white/50 
                       focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                       focus:outline-none sm:text-sm"
              placeholder="Email address"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-lg 
                       bg-indigo-600 px-4 py-3 text-sm font-medium text-white 
                       hover:bg-indigo-700 focus:outline-none focus:ring-2 
                       focus:ring-indigo-500 focus:ring-offset-2 
                       disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isLoading ? "Sending..." : "Send Reset Instructions"}
            </button>
          </div>

          <div className="text-center">
            <Link
              to="/login"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Return to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
