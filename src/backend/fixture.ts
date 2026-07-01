// fixture.ts (mock data for testing purposes)
import type { Ticket } from './types';

export const mockTickets: Ticket[] = [
  {
    id: 'TCK-1001',
    subject: 'Cannot access email',
    requester: 'alice.smith@example.com',
    status: 'Open',
    priority: 'High',
    createdDate: '2026-06-28T09:00:00Z',
    description: 'I am getting a 403 error when trying to log into the outlook web portal.'
  },
  {
    id: 'TCK-1002',
    subject: 'Request for new monitor',
    requester: 'bob.jones@example.com',
    status: 'In Progress',
    priority: 'Low',
    createdDate: '2026-06-29T14:30:00Z',
    description: 'My secondary monitor is flickering, requesting a replacement.'
  },
  {
    id: 'TCK-1003',
    subject: 'VPN disconnects randomly',
    requester: 'carol.williams@example.com',
    status: 'Resolved',
    priority: 'Medium',
    createdDate: '2026-06-30T10:15:00Z',
    description: 'VPN drops connection every 30 minutes while working remotely.'
  },
  {
    id: 'TCK-1004',
    subject: 'Software installation request',
    requester: 'david.brown@example.com',
    status: 'Closed',
    priority: 'Low',
    createdDate: '2026-07-01T09:00:00Z',
    description: 'Requesting installation of the latest version of Adobe Photoshop on my workstation.'
  },
  {
    id: 'TCK-1005',
    subject: 'Password reset not working',
    requester: 'eve.davis@example.com',
    status: 'Open',
    priority: 'Urgent',
    createdDate: '2026-07-02T11:00:00Z',
    description: 'The password reset link is not working and I cannot access my account.'
  }
];