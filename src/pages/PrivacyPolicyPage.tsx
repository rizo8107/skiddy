import { useQuery } from '@tanstack/react-query';
import { settingsService } from '../lib/settingsService';
import { Loader2 } from 'lucide-react';

export default function PrivacyPolicyPage() {
  const { data: settings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.get,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          <p className="mt-2 text-lg text-gray-400">
            Last updated: {settings?.privacy_policy_last_updated 
              ? new Date(settings.privacy_policy_last_updated).toLocaleDateString() 
              : new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-8">
          <div className="prose prose-invert max-w-none">
            {settings?.privacy_policy ? (
              <div className="text-gray-300" dangerouslySetInnerHTML={{ __html: settings.privacy_policy }} />
            ) : (
              <p className="text-gray-300">Privacy policy content not available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
