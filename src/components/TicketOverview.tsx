import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Shield, 
  Search, 
  BarChart3, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Database,
  Network,
  Lock,
  Settings,
  Plus,
  Laptop,
  FileText,
  TrendingUp
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TicketOverviewProps {
  onLogout: () => void;
}

// Enhanced ticket categories with AI recognition metadata
export const TICKET_CATEGORIES = {
  access_request: {
    id: 'access_request',
    name: 'Access Request',
    description: 'Database, system, or application access requests',
    icon: Lock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    keywords: ['database', 'access', 'permission', 'login', 'credentials', 'auth'],
    aiPriority: 'high',
    requiresApproval: true,
    avgResolutionTime: 2.5
  },
  hardware: {
    id: 'hardware',
    name: 'Hardware',
    description: 'Laptop, desktop, peripherals, and equipment issues',
    icon: Laptop,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    keywords: ['laptop', 'desktop', 'monitor', 'keyboard', 'mouse', 'hardware', 'battery'],
    aiPriority: 'medium',
    requiresApproval: false,
    avgResolutionTime: 4.2
  },
  software: {
    id: 'software',
    name: 'Software',
    description: 'Application installation, updates, and licensing',
    icon: Settings,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    keywords: ['software', 'install', 'application', 'license', 'update', 'program'],
    aiPriority: 'medium',
    requiresApproval: false,
    avgResolutionTime: 1.8
  },
  network: {
    id: 'network',
    name: 'Network',
    description: 'VPN, connectivity, and network-related issues',
    icon: Network,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    keywords: ['vpn', 'network', 'connection', 'wifi', 'internet', 'connectivity'],
    aiPriority: 'high',
    requiresApproval: false,
    avgResolutionTime: 1.2
  },
  security: {
    id: 'security',
    name: 'Security',
    description: 'Security incidents, malware, and compliance issues',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    keywords: ['security', 'malware', 'virus', 'phishing', 'breach', 'password'],
    aiPriority: 'critical',
    requiresApproval: false,
    avgResolutionTime: 0.8
  },
  infrastructure: {
    id: 'infrastructure',
    name: 'Infrastructure',
    description: 'Server, database, and infrastructure issues',
    icon: Database,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-100',
    keywords: ['server', 'database', 'infrastructure', 'cloud', 'deployment'],
    aiPriority: 'critical',
    requiresApproval: true,
    avgResolutionTime: 6.5
  },
  other: {
    id: 'other',
    name: 'Other',
    description: 'General inquiries and miscellaneous requests',
    icon: FileText,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
    keywords: ['other', 'general', 'help', 'question'],
    aiPriority: 'low',
    requiresApproval: false,
    avgResolutionTime: 3.0
  }
};

export function TicketOverview({ onLogout }: TicketOverviewProps) {
  const { user } = useAppContext();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock ticket data with enhanced categorization
  const ticketStats = {
    total: 847,
    open: 23,
    inProgress: 12,
    resolved: 812,
    byCategory: [
      { category: 'access_request', count: 245, resolved: 223, avgTime: 2.5 },
      { category: 'hardware', count: 189, resolved: 178, avgTime: 4.2 },
      { category: 'software', count: 156, resolved: 148, avgTime: 1.8 },
      { category: 'network', count: 134, resolved: 129, avgTime: 1.2 },
      { category: 'security', count: 78, resolved: 76, avgTime: 0.8 },
      { category: 'infrastructure', count: 32, resolved: 28, avgTime: 6.5 },
      { category: 'other', count: 13, resolved: 12, avgTime: 3.0 }
    ]
  };

  const recentTickets = [
    {
      id: 'TK-2024-001',
      title: 'Database access for Q1 analytics',
      category: 'access_request',
      status: 'pending_approval',
      priority: 'high',
      created: '2 hours ago',
      assignee: 'Karthikeyan'
    },
    {
      id: 'TK-2024-002',
      title: 'Laptop battery replacement needed',
      category: 'hardware',
      status: 'auto_resolving',
      priority: 'medium',
      created: '4 hours ago',
      assignee: 'AI Guardian'
    },
    {
      id: 'TK-2024-003',
      title: 'VPN connection intermittent failures',
      category: 'network',
      status: 'in_progress',
      priority: 'high',
      created: '6 hours ago',
      assignee: 'IT Support'
    },
    {
      id: 'TK-2024-004',
      title: 'Docker Desktop update required',
      category: 'software',
      status: 'resolved',
      priority: 'medium',
      created: '1 day ago',
      assignee: 'AI Guardian'
    }
  ];

  const categoryData = Object.values(TICKET_CATEGORIES).map(category => {
    const stats = ticketStats.byCategory.find(s => s.category === category.id);
    return {
      name: category.name,
      count: stats?.count || 0,
      resolved: stats?.resolved || 0,
      avgTime: stats?.avgTime || 0,
      color: category.color,
      bgColor: category.bgColor,
      icon: category.icon
    };
  });

  const pieData = categoryData.map((category, index) => ({
    name: category.name,
    value: category.count,
    fill: `hsl(${index * 51}, 70%, 50%)`
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'auto_resolving': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in_progress': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const headerActions = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => navigate('/create-ticket')}
      className="hover:bg-accent/50 border-border/50"
    >
      <Plus className="w-4 h-4 mr-2" />
      New Ticket
    </Button>
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        onLogout={onLogout}
        title="Ticket Overview"
        subtitle="Comprehensive ticket analytics and categorization"
        showBackButton={true}
        actions={headerActions}
      />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Tickets</p>
                  <p className="text-3xl text-foreground">{ticketStats.total}</p>
                </div>
                <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Open Tickets</p>
                  <p className="text-3xl text-warning">{ticketStats.open}</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-3xl text-info">{ticketStats.inProgress}</p>
                </div>
                <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Resolved</p>
                  <p className="text-3xl text-success">{ticketStats.resolved}</p>
                </div>
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI-Powered Category Analytics */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-xl">AI-Powered Category Analytics</h2>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              AI Enhanced
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Category Breakdown Chart */}
            <Card className="lg:col-span-2 shadow-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-info" />
                  </div>
                  Tickets by Category
                </CardTitle>
                <CardDescription>AI-categorized tickets with resolution metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" name="Total" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="resolved" fill="hsl(var(--success))" name="Resolved" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Category Distribution */}
            <Card className="shadow-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-success" />
                  </div>
                  Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                      fontSize={12}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Category Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-warning" />
            </div>
            <h2 className="text-xl">Category Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(TICKET_CATEGORIES).map((category) => {
              const stats = ticketStats.byCategory.find(s => s.category === category.id);
              const Icon = category.icon;
              
              return (
                <Card key={category.id} className="shadow-sm border-border/50 hover:bg-accent/20 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 ${category.bgColor} rounded-xl flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${category.color}`} />
                      </div>
                      {category.requiresApproval && (
                        <Badge variant="outline" className="text-xs">
                          Approval Required
                        </Badge>
                      )}
                    </div>
                    <h3 className="mb-2">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Total: </span>
                        <span className="text-foreground">{stats?.count || 0}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Resolved: </span>
                        <span className="text-foreground">{stats?.resolved || 0}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Avg Resolution: </span>
                        <span className="text-foreground">{category.avgResolutionTime}h</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            category.aiPriority === 'critical' ? 'border-red-200 text-red-700' :
                            category.aiPriority === 'high' ? 'border-orange-200 text-orange-700' :
                            category.aiPriority === 'medium' ? 'border-amber-200 text-amber-700' :
                            'border-green-200 text-green-700'
                          }`}
                        >
                          AI: {category.aiPriority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Keywords: {category.keywords.slice(0, 3).join(', ')}
                        {category.keywords.length > 3 && '...'}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Recent Tickets */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-info" />
              </div>
              <h2 className="text-xl">Recent Tickets</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="shadow-sm border-border/50">
            <CardContent className="p-0">
              <div className="space-y-1">
                {recentTickets.map((ticket) => {
                  const category = TICKET_CATEGORIES[ticket.category as keyof typeof TICKET_CATEGORIES];
                  const Icon = category?.icon || FileText;
                  
                  return (
                    <div 
                      key={ticket.id} 
                      className="p-4 hover:bg-accent/20 cursor-pointer transition-colors border-b border-border/50 last:border-b-0"
                      onClick={() => navigate(`/ticket/${ticket.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 ${category?.bgColor || 'bg-gray-100'} rounded-lg flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${category?.color || 'text-gray-600'}`} />
                          </div>
                          <div>
                            <h4 className="text-sm">{ticket.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <span>{ticket.id}</span>
                              <span>•</span>
                              <span>{ticket.created}</span>
                              <span>•</span>
                              <span>Assigned to {ticket.assignee}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(ticket.status)} variant="outline">
                            {ticket.status.replace('_', ' ')}
                          </Badge>
                          <Badge className={getPriorityColor(ticket.priority)} variant="outline">
                            {ticket.priority}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}