import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pb, isAdmin, settingsService } from '../lib/pocketbase';
import { Upload, Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface Settings {
  id: string;
  site_logo: string;
  site_name: string;
}

const SettingsPage: React.FC = () => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [siteName, setSiteName] = useState('');
  const queryClient = useQueryClient();

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.get,
    onSuccess: (data) => {
      if (data?.site_name) {
        setSiteName(data.site_name);
      }
    },
  });

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: async (data: FormData) => {
      if (!settings?.id) throw new Error('No settings found');
      return await settingsService.update(settings.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      alert('Settings updated successfully!');
    },
    onError: (error) => {
      alert(error instanceof Error ? error.message : 'Failed to update settings');
    },
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('site_name', siteName);
    
    if (logoFile) {
      formData.append('site_logo', logoFile);
    }

    updateMutation.mutate(formData);
  };

  if (!isAdmin()) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e] px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white/95">Settings</h1>
          <p className="text-base text-white/70 mt-1">Manage your site preferences</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6 bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <div>
              <label className="block text-base font-medium text-white/90 mb-2">
                Site Name
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-2.5 bg-black/40 text-white/90 rounded-lg border border-white/10
                         focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 
                         placeholder-white/30 transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-base font-medium text-white/90 mb-2">
                Site Logo
              </label>
              {settings?.site_logo && !logoFile && (
                <div className="mb-4 p-4 bg-black/20 rounded-lg border border-white/10">
                  <img
                    src={pb.files.getUrl(settings, settings.site_logo)}
                    alt="Current Logo"
                    className="h-16 object-contain"
                  />
                </div>
              )}
              <div className="flex items-center justify-center w-full">
                <label className="w-full flex flex-col items-center px-6 py-8 bg-black/20 text-white/90 rounded-lg 
                               border border-white/10 cursor-pointer hover:bg-black/30 hover:border-indigo-500/30
                               transition-all duration-200">
                  <Upload className="w-8 h-8 text-indigo-400/80 mb-2" />
                  <span className="text-base text-white/70">
                    {logoFile ? logoFile.name : 'Select Logo'}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full px-6 py-3 bg-indigo-500/90 hover:bg-indigo-500/80 text-white/90 rounded-lg
                     transition-colors duration-200 disabled:opacity-50 focus:outline-none 
                     focus:ring-2 focus:ring-indigo-500/30"
          >
            {updateMutation.isPending ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Updating...</span>
              </div>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
