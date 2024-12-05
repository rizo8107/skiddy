import { useState, useRef } from 'react';
import { pb, getCurrentUser, getFileUrl } from '../lib/pocketbase';
import { Camera, LogOut, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../lib/pocketbase';
import { Button } from '../components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { SupportAndFeedback } from '../components/profile/SupportAndFeedback';

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
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-gray-800/50 rounded-lg shadow-xl overflow-hidden backdrop-blur-sm">
          {/* Profile Header */}
          <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 h-32">
            <div className="absolute -bottom-12 left-8">
              <div className="relative">
                <img
                  src={getAvatarUrl(user) || '/default-avatar.png'}
                  alt={user?.name}
                  className="w-24 h-24 rounded-full border-4 border-gray-800 bg-gray-800"
                />
                <label className="absolute bottom-0 right-0 bg-gray-800 rounded-full p-2 cursor-pointer hover:bg-gray-700 transition-colors">
                  <Camera className="w-4 h-4 text-blue-400" />
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 px-8 pb-8">
            <div className="flex flex-col space-y-2">
              <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
              <p className="text-gray-400">{user?.email}</p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center space-x-2 py-6 bg-gray-800 border-gray-700 hover:bg-gray-700 text-white"
                  >
                    <MessageSquare className="w-5 h-5 text-blue-400" />
                    <span>Support & Feedback</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Support & Feedback</DialogTitle>
                  </DialogHeader>
                  <SupportAndFeedback />
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                className="w-full flex items-center justify-center space-x-2 py-6 bg-gray-800 border-gray-700 hover:bg-gray-700/80 text-white"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 text-red-400" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
