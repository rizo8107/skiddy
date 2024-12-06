import { useState, useRef } from 'react';
import { pb, getCurrentUser, getFileUrl } from '../lib/pocketbase';
import { MessageSquare, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../lib/pocketbase';
import { Button } from '../components/ui/button';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const getAvatarUrl = (user: User | null) => {
    if (!user?.avatar) return null;
    return getFileUrl(user, user.avatar);
  };

  const handleLogout = async () => {
    pb.authStore.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1f2e] rounded-lg overflow-hidden">
          {/* Profile Header with Avatar */}
          <div className="bg-[#2563eb] h-32 relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
              <div className="relative">
                <img
                  src={getAvatarUrl(user) || '/default-avatar.png'}
                  alt={user?.name}
                  className="w-32 h-32 rounded-full border-4 border-[#1a1f2e] bg-[#1a1f2e] object-cover"
                />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-6 pb-6">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-white mb-1">{user?.name || 'User'}</h1>
              <p className="text-gray-400">{user?.email}</p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-5 bg-[#1e2435] hover:bg-[#252b3d] border-[#2a3041] text-white"
                onClick={() => navigate('/contact-us')}
              >
                <MessageSquare className="w-5 h-5" />
                <span>Contact Support</span>
              </Button>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 py-5 bg-[#1e2435] hover:bg-[#252b3d] border-[#2a3041] text-white"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
