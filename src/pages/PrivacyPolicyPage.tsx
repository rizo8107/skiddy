import { useQuery } from '@tanstack/react-query';
import { settingsService } from '../lib/pocketbase';
import { Loader2, Shield } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { ScrollArea } from '../components/ui/scroll-area';

export default function PrivacyPolicyPage() {
  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['settings'],
    queryFn: settingsService.get,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading privacy policy...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center text-red-400">
          <p>Failed to load privacy policy. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-400">
            Last updated: {settings?.privacy_policy_last_updated 
              ? new Date(settings.privacy_policy_last_updated).toLocaleDateString() 
              : new Date().toLocaleDateString()}
          </p>
        </div>

        <Card className="bg-gray-900/50 backdrop-blur-lg border border-gray-800">
          <CardContent className="p-8">
            <ScrollArea className="h-[70vh] pr-4">
              {settings?.privacy_policy ? (
                <div 
                  className="prose prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-a:text-indigo-400 hover:prose-a:text-indigo-300 prose-li:text-gray-300 max-w-none"
                  dangerouslySetInnerHTML={{ __html: settings.privacy_policy }} 
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-2">Privacy policy content not available.</p>
                  <p className="text-sm text-gray-500">Please check back later or contact support if this persists.</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
