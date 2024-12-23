import React, { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { useToast } from "../components/ui/use-toast";
import { Mail, Clock, Send, MessageSquare, Phone } from "lucide-react";
import { contactService } from "../lib/pocketbase";
import { ScrollArea } from "../components/ui/scroll-area";

function ContactUsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [contactHistory, setContactHistory] = useState<Array<{
    subject: string;
    message: string;
    status: string;
    created: string;
  }>>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadContactHistory();
  }, []);

  const loadContactHistory = async () => {
    try {
      const history = await contactService.getContactHistory();
      setContactHistory(history);
    } catch (error) {
      console.error('Failed to load contact history:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      await contactService.submitContact(data);
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you soon!",
      });
      (e.target as HTMLFormElement).reset();
      await loadContactHistory(); // Refresh contact history
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-lg text-gray-400">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Contact Form */}
          <Card className="md:col-span-2 bg-gray-900/50 backdrop-blur-lg border border-gray-800">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-300">
                      Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      required
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      required
                      className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-300">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What is this regarding?"
                    required
                    className="bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-gray-300">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message..."
                    className="min-h-[150px] bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg 
                           transition-colors duration-200 flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white/20 border-t-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </Button>
              </form>

              {/* Contact History Section */}
              {contactHistory.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <Button
                    variant="ghost"
                    className="mb-4 text-gray-400 hover:text-white"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    {showHistory ? 'Hide Message History' : 'Show Message History'}
                  </Button>
                  
                  {showHistory && (
                    <ScrollArea className="h-[300px] rounded-md border border-gray-800 p-4">
                      <div className="space-y-4">
                        {contactHistory.map((message, index) => (
                          <div key={index} className="p-4 bg-gray-800/30 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium text-white">{message.subject}</h3>
                              <span className="text-xs text-gray-400">{formatDate(message.created)}</span>
                            </div>
                            <p className="text-gray-300 text-sm mb-2">{message.message}</p>
                            <div className="flex justify-between items-center">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                message.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                                message.status === 'responded' ? 'bg-green-500/20 text-green-300' :
                                'bg-gray-500/20 text-gray-300'
                              }`}>
                                {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Info */}
          <Card className="bg-gray-900/50 backdrop-blur-lg border border-gray-800 h-fit">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-6 h-6 text-indigo-400 mt-1" />
                  <div>
                    <h3 className="font-medium text-white mb-1">Email</h3>
                    <a href="mailto:contact@skiddy.in" className="text-gray-400 hover:text-indigo-400 transition-colors">
                      contact@skiddy.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-6 h-6 text-indigo-400 mt-1" />
                  <div>
                    <h3 className="font-medium text-white mb-1">Phone</h3>
                    <a href="tel:+919566067565" className="text-gray-400 hover:text-indigo-400 transition-colors">
                      +91 95660 67565
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-6 h-6 text-indigo-400 mt-1" />
                  <div>
                    <h3 className="font-medium text-white mb-1">Business Hours</h3>
                    <p className="text-gray-400">
                      Monday - Friday<br />
                      9:00 AM - 6:00 PM IST
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-800">
                  <p className="text-gray-400 text-sm">
                    We aim to respond to all inquiries within 24 business hours.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ContactUsPage;
