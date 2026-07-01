// types.ts
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export interface Ticket {
  id: string;
  subject: string;
  requester: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdDate: string;
  description: string;
}