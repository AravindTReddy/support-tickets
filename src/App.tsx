import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getTickets } from './services/api';
import type { Ticket } from './backend/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('date_desc');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // search handled by backend via Tanstack Query
  const { data: tickets, isLoading, isError } = useQuery({
    queryKey: ['tickets', searchTerm],
    queryFn: () => getTickets(searchTerm),
  });

  // NOTE: Client-side Filtering and Sorting (for demonstration purposes)
  const processedTickets = useMemo(() => {
    if (!tickets) return [];

    let result = [...tickets];

    // Filter by Status
    if (statusFilter !== 'All') {
      result = result.filter(ticket => ticket.status === statusFilter);
    }

    // Sort by Date or Priority
    result.sort((a, b) => {
      if (sortBy === 'date_desc') {
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      }
      if (sortBy === 'priority_desc') {
        const priorityWeight = { 'Urgent': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return 0;
    });

    return result;
  }, [tickets, statusFilter, sortBy]);

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Support Tickets</h2>
      </div>

      {/* Search, Filter, Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input 
          placeholder="Search by subject or requester..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val ?? 'All')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Statuses</SelectItem>
            <SelectItem value="Open">Open</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Resolved">Resolved</SelectItem>
            <SelectItem value="Closed">Closed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(val) => setSortBy(val ?? 'date_desc')}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date_desc">Newest First</SelectItem>
            <SelectItem value="priority_desc">Highest Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tickets Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Loading tickets...
                </TableCell>
              </TableRow>
            )}
            
            {isError && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-red-500 py-10">
                  Failed to load tickets. Please try again.
                </TableCell>
              </TableRow>
            )}

            {!isLoading && !isError && processedTickets.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                  No tickets found matching your criteria.
                </TableCell>
              </TableRow>
            )}

            {processedTickets.map((ticket) => (
              <TableRow 
                key={ticket.id} 
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => setSelectedTicket(ticket)}
              >
                <TableCell className="font-medium">{ticket.id}</TableCell>
                <TableCell>{ticket.subject}</TableCell>
                <TableCell>{ticket.requester}</TableCell>
                <TableCell>
                  <Badge variant={ticket.status === 'Resolved' ? 'secondary' : 'default'}>
                    {ticket.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{ticket.priority}</Badge>
                </TableCell>
                <TableCell>{new Date(ticket.createdDate).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Ticket Details Dialog */}
      <Dialog open={!!selectedTicket} onOpenChange={(open) => !open && setSelectedTicket(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedTicket?.subject}</DialogTitle>
            <DialogDescription>
              Ticket {selectedTicket?.id} • Submitted by {selectedTicket?.requester}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex gap-4 mb-4">
              <div>
                <span className="text-sm text-muted-foreground block">Status</span>
                <Badge>{selectedTicket?.status}</Badge>
              </div>
              <div>
                <span className="text-sm text-muted-foreground block">Priority</span>
                <Badge variant="outline">{selectedTicket?.priority}</Badge>
              </div>
            </div>
            <div>
              <span className="text-sm text-muted-foreground block mb-1">Description</span>
              <p className="text-sm whitespace-pre-wrap">{selectedTicket?.description}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}