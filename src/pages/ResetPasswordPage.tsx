import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { pb } from '../lib/pocketbase';
import { Loader2 } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      toast({
        title: "Error",
        description: "Invalid or missing reset token. Please request a new password reset.",
        variant: "destructive",
      });
      return;
    }

    if (password !== passwordConfirm) {
      toast({
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await pb.collection('users').confirmPasswordReset(
        token,
        password,
        passwordConfirm
      );

      toast({
        title: "Success",
        description: "Your password has been reset. You can now login with your new password.",
        variant: "default",
      });

      // Redirect to login page
      navigate('/login');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-white/10">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h2>
            <p className="text-white/70 mb-6">This password reset link is invalid or has expired.</p>
            <button
              onClick={() => navigate('/forgot-password')}
              className="w-full px-4 py-3 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700"
            >
              Request New Reset Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e] flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-black/40 backdrop-blur-sm p-8 rounded-xl border border-white/10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-white/70">
            Enter your new password below.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-lg border border-white/10 
                         bg-black/20 px-4 py-3 text-white placeholder-white/50 
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                         focus:outline-none sm:text-sm"
                placeholder="New password"
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="passwordConfirm" className="sr-only">
                Confirm Password
              </label>
              <input
                id="passwordConfirm"
                name="passwordConfirm"
                type="password"
                required
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="relative block w-full rounded-lg border border-white/10 
                         bg-black/20 px-4 py-3 text-white placeholder-white/50 
                         focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
                         focus:outline-none sm:text-sm"
                placeholder="Confirm new password"
                minLength={8}
              />
            </div>
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
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
