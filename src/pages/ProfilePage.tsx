import { useState, useRef } from 'react';
import { pb, getCurrentUser, getFileUrl } from '../lib/pocketbase';
import { Camera, Shield, LogOut, Pencil, X, Check, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { User } from '../lib/pocketbase';
import { Navigation } from '../components/Navigation';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const getAvatarUrl = (user: User | null) => {
    if (!user?.avatar) return null;
    return getFileUrl(user, user.avatar);
  };
  
  const [avatarUrl, setAvatarUrl] = useState<string | null>(getAvatarUrl(user));

  const handleLogout = () => {
    pb.authStore.clear();
    navigate('/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    
    setError('');
    setSuccess('');

    try {
      const record = await pb.collection('users').update(user.id, {
        name: name,
      });
      setSuccess('Profile updated successfully');
      setIsEditing(false);
      
      // Update the auth store to reflect the changes
      pb.authStore.save(pb.authStore.token, record);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user?.id) return;

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const record = await pb.collection('users').update(user.id, formData);
      setAvatarUrl(getAvatarUrl(record));
      
      // Update the auth store to reflect the changes
      pb.authStore.save(pb.authStore.token, record);
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload avatar');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e]">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <div 
                className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-black/40 cursor-pointer group"
                onClick={handleAvatarClick}
              >
                {isUploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                ) : (
                  <>
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt={user?.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/60 text-2xl font-medium">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>

            {/* User Info Section */}
            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-white/90 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-white/20 
                             transition-colors w-full sm:w-auto"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="submit"
                      className="p-2 bg-indigo-500/80 hover:bg-indigo-500/90 text-white rounded-lg 
                               transition-colors"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg 
                               transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white/95">
                      {user?.name}
                    </h2>
                    <p className="text-white/60 mt-1">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 
                             text-white/90 rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                </div>
              )}

              {/* Status Messages */}
              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}
              {success && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg">
                  <p className="text-sm text-green-400">{success}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-8 pt-8 border-t border-white/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                to="/support"
                className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 
                         rounded-lg transition-colors group"
              >
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg 
                            group-hover:bg-indigo-500/20 transition-colors">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-medium text-white/90">Support</h3>
                  <p className="text-sm text-white/60">Get help with your account</p>
                </div>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 
                         rounded-lg transition-colors group"
              >
                <div className="p-3 bg-red-500/10 text-red-400 rounded-lg 
                            group-hover:bg-red-500/20 transition-colors">
                  <LogOut className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-white/90">Sign Out</h3>
                  <p className="text-sm text-white/60">Log out of your account</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
