import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pb, isAdmin, settingsService } from '../lib/pocketbase';
import { Upload, Loader2, Shield } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface Settings {
  id: string;
  site_logo: string;
  site_name: string;
  privacy_policy: string;
  privacy_policy_last_updated: string;
}

const SettingsPage: React.FC = () => {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [siteName, setSiteName] = useState('');
  const [privacyPolicy, setPrivacyPolicy] = useState('');
  const queryClient = useQueryClient();

  // Fetch current settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.get,
    onSuccess: (data) => {
      if (data?.site_name) {
        setSiteName(data.site_name);
      }
      if (data?.privacy_policy) {
        setPrivacyPolicy(data.privacy_policy);
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
    
    if (logoFile) {
      formData.append('site_logo', logoFile);
    }
    formData.append('site_name', siteName);
    formData.append('privacy_policy', privacyPolicy);
    formData.append('privacy_policy_last_updated', new Date().toISOString());

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
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Site Settings</h1>
          <p className="mt-2 text-lg text-gray-400">
            Manage your site's general settings and configurations
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white/10 backdrop-blur-md rounded-lg p-6">
          {/* Site Logo Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Site Logo</h2>
            <div className="flex items-center space-x-4">
              {settings?.site_logo && (
                <img
                  src={pb.getFileUrl(settings, settings.site_logo)}
                  alt="Site Logo"
                  className="h-16 w-16 object-contain rounded-lg bg-white/20"
                />
              )}
              <label className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md cursor-pointer">
                <Upload className="w-5 h-5 text-white mr-2" />
                <span className="text-white">Upload Logo</span>
                <input
                  type="file"
                  onChange={handleLogoChange}
                  accept="image/*"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Site Name Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Site Name</h2>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter site name"
            />
          </div>

          {/* Privacy Policy Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Privacy Policy
            </h2>
            <textarea
              value={privacyPolicy}
              onChange={(e) => setPrivacyPolicy(e.target.value)}
              rows={20}
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your privacy policy text here..."
            />
            <p className="mt-2 text-sm text-gray-400">
              Last updated: {settings?.privacy_policy_last_updated 
                ? new Date(settings.privacy_policy_last_updated).toLocaleDateString() 
                : 'Never'}
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </form>

        {/* View Privacy Policy Link */}
        <div className="mt-8 p-6 bg-white/10 backdrop-blur-md rounded-lg">
          <h2 className="text-xl font-semibold text-white mb-4">View Privacy Policy</h2>
          <p className="text-gray-300 mb-4">
            Review the current privacy policy as it appears to users.
          </p>
          <a
            href="/privacy-policy"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            <Shield className="w-5 h-5 mr-2" />
            View Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
