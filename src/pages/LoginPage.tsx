import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb, login } from '../lib/pocketbase';
import { Loader2, Mail } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    if (pb.authStore.isValid) {
      navigate('/courses', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      
      // Double check auth state after login
      if (pb.authStore.isValid) {
        navigate('/courses', { replace: true });
      } else {
        throw new Error('Login failed. Please check your credentials.');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(
        error.message || 
        'Failed to login. Please check your credentials and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e]">
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Login Form */}
        <div className="flex-1 flex items-center justify-center order-1 lg:order-2 p-4 sm:p-6 md:p-8">
          <div className="w-full max-w-sm space-y-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="grid grid-cols-3 gap-0.5">
                  <div className="w-2 h-2 bg-indigo-500 rounded-sm"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-sm"></div>
                  <div className="w-2 h-2 bg-indigo-300 rounded-sm"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-sm"></div>
                  <div className="w-2 h-2 bg-indigo-300 rounded-sm"></div>
                  <div className="w-2 h-2 bg-indigo-200 rounded-sm"></div>
                  <div className="w-2 h-2 bg-indigo-300 rounded-sm"></div>
                  <div className="w-2 h-2 bg-indigo-200 rounded-sm"></div>
                  <div className="w-2 h-2 bg-indigo-100 rounded-sm"></div>
                </div>
              </div>
              <h2 className="text-lg font-medium text-white/90 mb-2">
                Skiddy
              </h2>
              <p className="text-sm text-white/70">
                Sign in to access your courses
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded px-3 py-2">
                  <p className="text-xs text-red-400 text-center">{error}</p>
                </div>
              )}

              <div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/20 border border-white/10 text-white/90 text-sm rounded
                           placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30
                           transition-colors"
                  placeholder="Email"
                />
              </div>

              <div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 bg-black/20 border border-white/10 text-white/90 text-sm rounded
                           placeholder:text-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30
                           transition-colors"
                  placeholder="Password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-indigo-600 text-white text-sm font-medium rounded
                         hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                         disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                         shadow-lg shadow-indigo-500/30"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  'Login'
                )}
              </button>

              <div className="text-center space-y-4">
                <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                  Forgot password?
                </a>
                <div className="pt-4 border-t border-white/10">
                  <div className="flex items-center justify-center space-x-2 text-white/50 text-xs">
                    <Mail className="w-3 h-3" />
                    <a href="mailto:support@skiddytamil.in" className="hover:text-white/70 transition-colors">
                      support@skiddytamil.in
                    </a>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Welcome Content - Only visible on desktop */}
        <div className="hidden lg:flex flex-1 items-center justify-center order-2 lg:order-1 p-8 sm:p-6 md:p-12">
          <div className="max-w-lg mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6">
              Welcome to Skiddy
            </h1>
            <p className="text-base sm:text-lg text-white/70 mb-8 px-4">
              Your gateway to mastering cybersecurity and ethical hacking. Join our community of security enthusiasts and start your learning journey today.
            </p>
            <div className="space-y-4 text-sm sm:text-base text-white/60 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                <span>Comprehensive cybersecurity courses</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                <span>Hands-on practical exercises</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                <span>Expert-led training materials</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
