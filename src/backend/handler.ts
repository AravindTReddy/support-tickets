// handler.ts
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { mockTickets } from './fixture';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    // Extracting the search query parameter from the event
    const searchTerm = event.queryStringParameters?.search?.toLowerCase();
    
    let results = mockTickets;

    // Filtering results if a search term exists
    // supports partial matches in both subject and requester fields
    if (searchTerm) {
      results = mockTickets.filter(ticket => 
        ticket.subject.toLowerCase().includes(searchTerm) ||
        ticket.requester.toLowerCase().includes(searchTerm)
      );
    }

    // In a production env, pagination would be applied here to limit the number of results returned.
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', 
      },
      body: JSON.stringify({
        data: results,
        count: results.length
      })
    };
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' })
    };
  }
};