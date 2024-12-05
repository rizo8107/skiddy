import { pb } from './pocketbase';

// Valid status values that match PocketBase schema
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface SupportTicket {
  message: string;
  priority: TicketPriority;
  status: TicketStatus;
  subject: string;
  updated: string;
  user: string;
}

export const createSupportTicket = async (data: Omit<SupportTicket, 'status' | 'updated'>) => {
  try {
    const ticketData = {
      message: data.message,
      priority: data.priority,
      status: 'open' as TicketStatus,
      subject: data.subject,
      updated: new Date().toISOString(),
      user: data.user
    };

    const record = await pb.collection('support_tickets').create(ticketData);
    return record;
  } catch (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }
};

export const getUserTickets = async (userId: string) => {
  try {
    const records = await pb.collection('support_tickets').getList(1, 50, {
      filter: `user = "${userId}"`,
      sort: '-created',
      expand: 'user'
    });
    return records;
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    throw error;
  }
};

export const updateTicketStatus = async (ticketId: string, status: TicketStatus) => {
  try {
    const record = await pb.collection('support_tickets').update(ticketId, {
      status: status,
      updated: new Date().toISOString()
    });
    return record;
  } catch (error) {
    console.error('Error updating ticket status:', error);
    throw error;
  }
};
