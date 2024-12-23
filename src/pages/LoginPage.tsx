import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pb, login } from '../lib/pocketbase';
import { Loader2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

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
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e] flex items-center justify-center">
      <div className="w-full max-w-sm space-y-8 p-4">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="https://skiddy-pocketbase.9dto0s.easypanel.host/api/files/pbc_2769025244/61fh77e81b7wrx5/skiddy_text_box_01s7ysvh4c.png"
              alt="Skiddy Logo"
              className="h-16 w-auto"
            />
          </div>
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-white/70">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link
                to="/forgot-password"
                className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
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
        </form>
      </div>
    </div>
  );
}
