import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { pb } from '../../lib/pocketbase';
import { createSupportTicket } from '../../lib/supportTicketService';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../ui/use-toast';

export function SupportAndFeedback() {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pb.authStore.model?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to submit a support ticket",
        variant: "destructive"
      });
      return;
    }

    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const ticketData = {
        message: message.trim(),
        priority: 'low',
        subject: subject.trim(),
        user: pb.authStore.model.id
      };

      await createSupportTicket(ticketData);
      
      toast({
        title: "Success",
        description: "Your support ticket has been submitted successfully",
      });
      
      // Reset form
      setSubject('');
      setMessage('');
    } catch (error) {
      console.error('Error submitting support ticket:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit support ticket. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white">Support & Feedback</h3>
        <p className="text-sm text-gray-400">
          Need help or want to share feedback? We're here to help.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-gray-200">Subject</Label>
          <Input
            id="subject"
            placeholder="Brief description of your issue"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message" className="text-gray-200">Message</Label>
          <Textarea
            id="message"
            placeholder="Describe your issue or feedback in detail"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[150px] bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-blue-500"
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
