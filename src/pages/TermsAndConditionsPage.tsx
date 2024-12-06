import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { useToast } from "../components/ui/use-toast";
import { pb, termsService } from "../lib/pocketbase";
import { Loader2, CheckCircle2 } from "lucide-react";

function TermsAndConditionsPage() {
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alreadyAccepted, setAlreadyAccepted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAcceptance = async () => {
      const userId = pb.authStore.model?.id;
      if (userId) {
        const status = await termsService.getAcceptanceStatus(userId);
        if (status) {
          setAlreadyAccepted(true);
        }
      }
    };
    checkAcceptance();
  }, []);

  const handleAcceptTerms = async () => {
    if (!accepted) {
      toast({
        title: "Please accept the terms",
        description: "You must check the box to accept the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const userId = pb.authStore.model?.id;
      if (!userId) {
        toast({
          title: "Authentication required",
          description: "Please log in to accept the terms",
          variant: "destructive",
        });
        return;
      }

      await termsService.acceptTerms(userId, "1.0");
      setAlreadyAccepted(true);
      
      toast({
        title: "Terms accepted",
        description: "Thank you for accepting our terms and conditions",
      });
      
      setAccepted(false);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to record terms acceptance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="w-full bg-card shadow-lg">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Terms and Conditions</h1>
          
          {alreadyAccepted ? (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <p className="text-sm text-green-700 dark:text-green-300">
                You have already accepted the terms and conditions.
              </p>
            </div>
          ) : (
            <div className="bg-secondary/10 rounded-lg p-4 mb-6">
              <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          )}
          
          <ScrollArea className="h-[60vh] rounded-md border p-4">
            <div className="space-y-6 pr-4">
              <section>
                <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using Skiddy, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">2. User Responsibilities</h2>
                <p>
                  Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">3. Service Usage</h2>
                <p>
                  Our services are provided "as is" and "as available." We reserve the right to modify, suspend, or discontinue any part of our services at any time.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">4. Content Policy</h2>
                <p>
                  Users are prohibited from posting or sharing content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">5. Intellectual Property</h2>
                <p>
                  All content and materials available through Skiddy are protected by intellectual property rights. Users may not copy, reproduce, or distribute this content without permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
                <p>
                  Skiddy shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">7. Changes to Terms</h2>
                <p>
                  We reserve the right to update these Terms and Conditions at any time. Continued use of our services after such changes constitutes acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">8. Governing Law</h2>
                <p>
                  These Terms and Conditions shall be governed by and construed in accordance with applicable laws, without regard to conflicts of law principles.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold mb-2">9. Contact Information</h2>
                <p>
                  For questions about these Terms and Conditions, please contact us through our support system.
                </p>
              </section>
            </div>
          </ScrollArea>
          
          {!alreadyAccepted && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(checked as boolean)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I have read and agree to the terms and conditions
                </label>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleAcceptTerms}
                disabled={!accepted || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Accept Terms'
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default TermsAndConditionsPage;
