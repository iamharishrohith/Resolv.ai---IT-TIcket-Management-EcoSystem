import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../App';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  CheckCircle, 
  AlertCircle,
  MessageSquare,
  Shield,
  Laptop
} from 'lucide-react';

interface TicketDetailsProps {
  onLogout: () => void;
}

export function TicketDetails({ onLogout }: TicketDetailsProps) {
  const { id } = useParams();
  const { user } = useAppContext();
  const navigate = useNavigate();

  // Mock ticket data
  const tickets = {
    'alert-1': {
      id: 'alert-1',
      title: 'Battery Health Degrading - Proactive Alert',
      description: 'AI Guardian has detected that your laptop battery capacity has dropped to 78%. Based on usage patterns, we recommend scheduling a replacement to prevent unexpected shutdowns.',
      status: 'auto_resolving',
      priority: 'medium',
      category: 'hardware',
      created: '2024-01-15 14:30:00',
      assignee: 'AI Guardian',
      timeline: [
        {
          time: '2024-01-15 14:30:00',
          action: 'Issue Detected',
          description: 'AI Guardian detected battery capacity degradation',
          type: 'system',
          icon: AlertCircle
        },
        {
          time: '2024-01-15 14:32:00',
          action: 'Analysis Complete',
          description: 'Battery health analysis completed. Replacement recommended.',
          type: 'system',
          icon: CheckCircle
        },
        {
          time: '2024-01-15 14:35:00',
          action: 'Replacement Ordered',
          description: 'New battery ordered from approved vendor. ETA: 2 business days.',
          type: 'system',
          icon: CheckCircle
        },
        {
          time: '2024-01-15 14:40:00',
          action: 'Appointment Scheduled',
          description: 'IT technician appointment scheduled for Thursday 2PM.',
          type: 'system',
          icon: Clock
        }
      ]
    },
    'ticket-1': {
      id: 'ticket-1',
      title: 'Database Access Request',
      description: 'Requesting read access to the production analytics database for the Q1 reporting project.',
      status: 'pending_approval',
      priority: 'high',
      category: 'access_request',
      created: '2024-01-15 12:15:00',
      assignee: user?.manager || 'David Chen',
      timeline: [
        {
          time: '2024-01-15 12:15:00',
          action: 'Ticket Created',
          description: 'Database access request submitted',
          type: 'user',
          icon: User
        },
        {
          time: '2024-01-15 12:16:00',
          action: 'Auto-Classification',
          description: 'AI classified as access request requiring manager approval',
          type: 'system',
          icon: CheckCircle
        },
        {
          time: '2024-01-15 12:17:00',
          action: 'Approval Required',
          description: 'Awaiting approval from manager (David Chen)',
          type: 'pending',
          icon: Clock
        }
      ]
    }
  };

  const ticket = tickets[id as keyof typeof tickets];

  if (!ticket) {
    return <div>Ticket not found</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'auto_resolving': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-semibold">Ticket Details</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Ticket Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-blue-600" />
                  <CardTitle>{ticket.title}</CardTitle>
                </div>
                <CardDescription>Ticket ID: {ticket.id.toUpperCase()}</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge className={getPriorityColor(ticket.priority)}>
                  {ticket.priority} priority
                </Badge>
                <Badge className={getStatusColor(ticket.status)}>
                  {ticket.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Created</p>
                <p className="font-medium">{new Date(ticket.created).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Assigned to</p>
                <p className="font-medium">{ticket.assignee}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Category</p>
                <p className="font-medium">{ticket.category.replace('_', ' ')}</p>
              </div>
            </div>
            <Separator className="my-4" />
            <div>
              <p className="text-sm text-gray-600 mb-2">Description</p>
              <p>{ticket.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Special Notice for Proactive Tickets */}
        {ticket.status === 'auto_resolving' && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                AI Guardian is Proactively Resolving This Issue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-700">
                Our AI has detected this issue and is automatically taking steps to resolve it. 
                No action is required from you. We'll notify you once the replacement is complete.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Approval Notice for Junior Developer */}
        {ticket.status === 'pending_approval' && user?.role === 'junior_developer' && (
          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-800 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Awaiting Manager Approval
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-amber-700">
                This request requires approval from your manager ({ticket.assignee}). 
                They have been notified and will review your request soon.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ticket.timeline.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      event.type === 'system' ? 'bg-blue-100' :
                      event.type === 'user' ? 'bg-green-100' :
                      'bg-amber-100'
                    }`}>
                      <event.icon className={`w-5 h-5 ${
                        event.type === 'system' ? 'text-blue-600' :
                        event.type === 'user' ? 'text-green-600' :
                        'text-amber-600'
                      }`} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{event.action}</h4>
                      <span className="text-xs text-gray-500">
                        {new Date(event.time).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button 
                variant="outline"
                onClick={() => navigate('/chat')}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat with AI
              </Button>
              {ticket.status === 'pending_approval' && user?.role !== 'junior_developer' && (
                <>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Approve Request
                  </Button>
                  <Button variant="outline">
                    Request More Info
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}