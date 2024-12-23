import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useToast } from '../components/ui/use-toast';
import { adminService } from '../lib/adminService';
import { Loader2 } from 'lucide-react';

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const currentSettings = await adminService.getSettings();
      setSettings(currentSettings);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      await adminService.updateSettings(settings);
      
      toast({
        title: 'Success',
        description: 'Settings updated successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not super admin
  if (!adminService.isSuperAdmin()) {
    return <Navigate to="/courses" replace />;
  }

  if (loading && !settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white/70" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Admin Settings</h1>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="meta.appName" className="text-white">
                    App Name
                  </Label>
                  <Input
                    id="meta.appName"
                    value={settings?.meta?.appName || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        meta: { ...settings.meta, appName: e.target.value },
                      })
                    }
                    className="bg-black/20 border-white/10 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="meta.appUrl" className="text-white">
                    App URL
                  </Label>
                  <Input
                    id="meta.appUrl"
                    value={settings?.meta?.appUrl || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        meta: { ...settings.meta, appUrl: e.target.value },
                      })
                    }
                    className="bg-black/20 border-white/10 text-white"
                  />
                </div>

                <div>
                  <Label htmlFor="smtp.enabled" className="text-white">
                    SMTP Settings
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      id="smtp.host"
                      placeholder="SMTP Host"
                      value={settings?.smtp?.host || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          smtp: { ...settings.smtp, host: e.target.value },
                        })
                      }
                      className="bg-black/20 border-white/10 text-white"
                    />
                    <Input
                      id="smtp.port"
                      placeholder="SMTP Port"
                      value={settings?.smtp?.port || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          smtp: { ...settings.smtp, port: e.target.value },
                        })
                      }
                      className="bg-black/20 border-white/10 text-white"
                    />
                    <Input
                      id="smtp.username"
                      placeholder="SMTP Username"
                      value={settings?.smtp?.username || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          smtp: { ...settings.smtp, username: e.target.value },
                        })
                      }
                      className="bg-black/20 border-white/10 text-white"
                    />
                    <Input
                      id="smtp.password"
                      type="password"
                      placeholder="SMTP Password"
                      value={settings?.smtp?.password || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          smtp: { ...settings.smtp, password: e.target.value },
                        })
                      }
                      className="bg-black/20 border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
