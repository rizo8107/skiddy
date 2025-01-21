import React, { useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { useToast } from '../components/ui/use-toast';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { pb } from '../lib/pocketbase';

export default function ContactUsPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !message) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      
      // Send contact form data to your backend
      await pb.collection('contact_messages').create({
        name,
        email,
        message,
        status: 'new'
      });

      toast({
        title: 'Success',
        description: 'Your message has been sent. We will get back to you soon.',
      });

      // Clear form
      setName('');
      setEmail('');
      setMessage('');
      
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-black/40 backdrop-blur-sm border-white/10">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="bg-black/20 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-black/20 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Your Message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="bg-black/20 border-white/10 text-white min-h-[150px]"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white mb-6">Contact Information</h2>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-indigo-400 mt-1" />
                    <div>
                      <h3 className="font-medium text-white mb-1">Email</h3>
                      <a href="mailto:contact@skiddy.in" className="text-gray-400 hover:text-indigo-400 transition-colors">
                        contact@skiddy.in
                      </a>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-indigo-400 mt-1" />
                    <div>
                      <h3 className="font-medium text-white mb-1">Phone</h3>
                      <a href="tel:+919566067565" className="text-gray-400 hover:text-indigo-400 transition-colors">
                        +91 98765 43210
                      </a>
                      <p className="text-sm text-gray-500 mt-1">
                        Monday to Friday, 9:00 AM to 6:00 PM IST
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-indigo-400 mt-1" />
                    <div>
                      <h3 className="font-medium text-white mb-1">Office Address</h3>
                      <p className="text-gray-400">
                        TSMC Creations India Pvt. Ltd.<br />
                       12th Floor, Prince Infocity 1 <br />
                        Kandanchavadi<br />
                        OMR, Chennai -600096
                      </p>
                    </div>
                  </div>

                  {/* Support Hours */}
                  <div className="bg-indigo-600/10 rounded-lg p-4 mt-6">
                    <h3 className="font-medium text-white mb-2">Support Hours</h3>
                    <p className="text-gray-400">
                      Our support team is available Monday through Friday from 9:00 AM to 6:00 PM IST.
                      For urgent inquiries outside business hours, please email us at{' '}
                      <a href="mailto:support@skiddy.in" className="text-indigo-400 hover:text-indigo-300">
                        support@skiddy.in
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
