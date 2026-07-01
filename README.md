# Support Tickets Dashboard

This is a full-stack support tickets dashboard built to demonstrate modern React development, API abstraction, and AWS backend design.

## Tech Stack

- **Frontend:** React, Vite, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **State & Data Fetching:** TanStack Query (React Query)
- **Backend (Mocked):** TypeScript AWS Lambda Handler
- **Testing:** Vitest

## Getting Started

To run this project locally, follow these steps:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser.

## Running Tests

To verify the backend filtering logic (simulating the AWS Lambda search requirements), I have included a Vitest test suite that validates the API abstraction layer.

Run the tests using:
```bash
npm run test
```
*Note: I have added tests strictly on the core business logiv within API layer and did not include tests for the React UI components*

## Architecture & Design Decisions

- **API Abstraction:** To simulate a real backend environment without requiring local Docker/AWS infrastructure, I created a frontend API abstraction layer (`src/services/api.ts`). This layer constructs a mock AWS `APIGatewayProxyEvent`, invokes the Lambda handler directly, and simulates network latency to showcase TanStack Query's loading and error states.
- **Hybrid Data Processing:** The text search feature (by Subject or Requester) is handled by the backend Lambda handler as requested. However, exact-match status filtering and sorting (by Created Date or Priority) are handled efficiently on the client side using React's `useMemo` to minimize unnecessary network requests.
- **Strict Typing:** The project is strictly typed using TypeScript, including the exact AWS Lambda event types (`APIGatewayProxyEvent`) to ensure the handler is production-ready.

---

## Bonus: Production Implementation

If this `GET /tickets?search=\<term\>` endpoint were moving to a production environment using **AWS Lambda** and **Amazon DocumentDB**, here is the high-level flow and architecture I would use:

### 1. Production Request Flow
Instead of handling the data in-memory, the production architecture would work like this:
1. **Client Request:** The React frontend sends a GET request with the search term to an AWS API Gateway endpoint.
2. **Lambda Invocation:** API Gateway triggers the AWS Lambda function, passing the search term via the event payload.
3. **Database Query:** The Lambda function connects to Amazon DocumentDB (using the MongoDB Node.js Driver).
4. **Response:** DocumentDB executes the search and returns only the matching, paginated results to Lambda, which formats the JSON response and sends it back to the frontend.

### 2. DocumentDB Data Model & Indexing
*NOTE: I want to be transparent that I haven't worked directly with Amazon DocumentDB before. However, based on my research/understanding of document databases, here is conceptually how I would approach it.*

- **Data Model:** Tickets would be stored as JSON documents in a `tickets` collection, mapping directly to the frontend TypeScript interfaces along with standard database timestamps (`createdAt`, `updatedAt`).
- **Efficient Searching:** I would push the search logic completely down to the database layer. I would use DocumentDB's native querying capabilities to perform the text or substring search directly against the `subject` and `requester` fields, rather than loading records into Lambda and filtering there.
- **Appropriate Indexes:** To ensure the search and UI filters run fast without scanning the entire database, I would create indexes on the searched fields (`subject`, `requester`), as well as the fields used for sorting and filtering (`status`, `priority`, `createdAt`).

### 3. A Note on DynamoDB vs. DocumentDB for Search
This specific requirement (searching by text) highlights why DocumentDB is a better fit here than Amazon DynamoDB. Because DynamoDB is a strictly key-value store, it does not natively support full-text search or complex substring queries. If we were using DynamoDB, we would be forced to stream our data into an external service like Amazon OpenSearch (Elasticsearch) just to have the search bar functionality. DocumentDB allows us to handle this requirement efficiently within the database itself.
