import { describe, it, expect } from 'vitest';
import { getTickets } from '@/services/api';

describe('getTickets API Abstraction (Lambda Mock)', () => {
  it('should return all tickets when no search term is provided', async () => {
    const tickets = await getTickets();
    expect(tickets.length).toBeGreaterThan(0);
    // Based on our mockData, there should be 5 tickets
    expect(tickets.length).toBe(5); 
  });

  it('should filter tickets by requester', async () => {
    const tickets = await getTickets('alice');
    expect(tickets.length).toBe(1);
    expect(tickets[0].requester).toContain('alice');
  });

  it('should filter tickets by subject', async () => {
    const tickets = await getTickets('monitor');
    expect(tickets.length).toBe(1);
    expect(tickets[0].subject.toLowerCase()).toContain('monitor');
  });

  it('should return an empty array when no matches are found', async () => {
    const tickets = await getTickets('nonexistent_search_term');
    expect(tickets.length).toBe(0);
  });
});