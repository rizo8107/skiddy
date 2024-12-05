import React, { useState } from 'react';
import { pb } from '../lib/pocketbase';
import { Send, Loader2, HelpCircle, Mail } from 'lucide-react';

const SupportPage: React.FC = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('idle');

    try {
      await pb.collection('support_tickets').create({
        subject,
        message,
        email,
        status: 'new',
        user: pb.authStore.model?.id
      });
      
      setStatus('success');
      setSubject('');
      setMessage('');
      setEmail('');
    } catch (error) {
      console.error('Support submission error:', error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2e] via-[#14171f] to-[#1a1f2e]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <HelpCircle className="w-16 h-16 text-indigo-500/80 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white/95">Support & Feedback</h1>
          <p className="mt-3 text-lg text-white/70">
            We're here to help! Send us your questions or feedback.
          </p>
        </div>

        {/* Support Info */}
        <div className="mb-12">
          <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-indigo-500/30 transition-colors">
            <Mail className="w-8 h-8 text-indigo-400/80 mb-4" />
            <h3 className="text-lg font-semibold text-white/90 mb-2">Email Support</h3>
            <p className="text-white/70">Get help via email with detailed responses to your inquiries. Our support team typically responds within 24 hours.</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {status === 'success' && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                <p className="text-sm text-emerald-400 text-center">
                  Thank you for your message! We'll get back to you soon.
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <p className="text-sm text-red-400 text-center">
                  Something went wrong. Please try again later.
                </p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/40 text-white/90 rounded-lg border border-white/10
                         focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 
                         placeholder-white/30 transition-colors"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-white/80 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/40 text-white/90 rounded-lg border border-white/10
                         focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 
                         placeholder-white/30 transition-colors"
                placeholder="How can we help?"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-white/80 mb-2">
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/40 text-white/90 rounded-lg border border-white/10
                         focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 
                         placeholder-white/30 transition-colors"
                placeholder="Please describe your issue or feedback..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center px-6 py-3 bg-indigo-500/80 hover:bg-indigo-500/90
                       text-white font-medium rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;
