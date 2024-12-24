import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useToast } from '../components/ui/use-toast';
import { Loader2, Mail, Phone, InfoIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { pb } from '../lib/pocketbase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter your email address',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      await pb.collection('users').requestPasswordReset(email);
      setEmailSent(true);
      toast({
        title: 'Success',
        description: 'Password reset instructions have been sent to your email',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send reset instructions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardContent className="p-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white">Reset your password</h2>
              <p className="mt-2 text-gray-400">
                Enter your email address and we'll send you instructions to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Sending Instructions...
                  </>
                ) : (
                  'Send Reset Instructions'
                )}
              </Button>
            </form>

            {emailSent && (
              <div className="mt-6 p-4 rounded-lg bg-indigo-600/10 border border-indigo-500/20">
                <div className="flex items-start gap-3">
                  <InfoIcon className="w-5 h-5 text-indigo-400 mt-0.5" />
                  <div>
                    <h5 className="font-medium text-indigo-300">Check your email</h5>
                    <p className="mt-1 text-sm text-indigo-300/80">
                      Please check your email (including spam/junk folder) for password reset instructions.
                      The email should arrive within a few minutes.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-4">
              <div className="text-sm text-center">
                <Link to="/login" className="text-indigo-400 hover:text-indigo-300">
                  Return to login
                </Link>
              </div>

              <div className="border-t border-white/10 pt-6">
                <p className="text-sm text-gray-400 text-center mb-4">
                  Haven't received the email? Check your spam folder or contact us:
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <a href="mailto:contact@skiddy.in" className="text-indigo-400 hover:text-indigo-300">
                      contact@skiddy.in
                    </a>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Phone className="w-4 h-4" />
                    <a href="tel:+919876543210" className="text-indigo-400 hover:text-indigo-300">
                      +91 98765 43210
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
