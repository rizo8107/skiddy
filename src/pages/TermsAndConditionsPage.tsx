import React from "react";
import { Card, CardContent } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";

function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold text-white mb-6">Terms and Conditions</h1>
            
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6 text-white/80">
                <section>
                  <h2 className="text-lg font-semibold text-white mb-3">1. Introduction</h2>
                  <p>
                    Welcome to Skiddy. These terms and conditions outline the rules and regulations
                    for the use of our platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-white mb-3">2. Intellectual Property Rights</h2>
                  <p>
                    Other than the content you own, under these terms, Skiddy and/or its licensors
                    own all the intellectual property rights and materials contained in this platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-white mb-3">3. Restrictions</h2>
                  <p>You are specifically restricted from all of the following:</p>
                  <ul className="list-disc list-inside mt-2 space-y-2">
                    <li>Publishing any material from Skiddy in any other media</li>
                    <li>Selling, sublicensing and/or otherwise commercializing any platform material</li>
                    <li>Publicly performing and/or showing any platform material without permission</li>
                    <li>Using this platform in any way that is or may be damaging to this platform</li>
                    <li>Using this platform contrary to applicable laws and regulations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-white mb-3">4. Your Content</h2>
                  <p>
                    In these terms and conditions, "Your Content" shall mean any audio, video text,
                    images or other material you choose to display on this platform. By displaying Your
                    Content, you grant Skiddy a non-exclusive, worldwide irrevocable, sub licensable
                    license to use, reproduce, adapt, publish, translate and distribute it in any and
                    all media.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-white mb-3">5. No Warranties</h2>
                  <p>
                    This platform is provided "as is," with all faults, and Skiddy express no
                    representations or warranties, of any kind related to this platform or the
                    materials contained on this platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-white mb-3">6. Limitation of Liability</h2>
                  <p>
                    In no event shall Skiddy, nor any of its officers, directors and employees, be
                    held liable for anything arising out of or in any way connected with your use of
                    this platform.
                  </p>
                </section>

                <section>
                  <h2 className="text-lg font-semibold text-white mb-3">7. Governing Law</h2>
                  <p>
                    These terms and conditions are governed by and construed in accordance with the
                    laws of your country and you irrevocably submit to the exclusive jurisdiction of
                    the courts in that location.
                  </p>
                </section>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default TermsAndConditionsPage;
