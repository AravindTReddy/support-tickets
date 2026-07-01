import type { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../backend/handler';
import type { Ticket } from '../backend/types';

export const getTickets = async (search?: string): Promise<Ticket[]> => {
  // Simulating network latency to show a loading state
  await new Promise(resolve => setTimeout(resolve, 800));

  const mockEvent = {
    queryStringParameters: search ? { search } : null,
  } as unknown as APIGatewayProxyEvent;

  const response = await handler(mockEvent);

  if (response.statusCode !== 200) {
    throw new Error('Failed to fetch tickets');
  }

  const parsedBody = JSON.parse(response.body);
  return parsedBody.data;
};