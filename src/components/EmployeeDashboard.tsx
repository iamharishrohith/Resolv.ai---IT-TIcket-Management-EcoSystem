import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MessageSquare, 
  Plus, 
  Shield, 
  Laptop,
  Database,
  Wifi,
  Activity,
  BarChart3
} from 'lucide-react';

interface EmployeeDashboardProps {
  onLogout: () => void;
}

export function EmployeeDashboard({ onLogout }: EmployeeDashboardProps) {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const isJuniorDev = user?.role === 'junior_developer';
  const isSolutionsArchitect = user?.role === 'solutions_architect';

  const proactiveAlerts = [
    {
      id: 'alert-1',
      title: 'Battery Health Degrading',
      description: 'Your laptop battery capacity has dropped to 78%. Replacement recommended.',
      severity: 'warning',
      icon: Laptop,
      action: 'Schedule Replacement'
    },
    {
      id: 'alert-2',
      title: 'Software Update Available',
      description: 'Security update for Docker Desktop is ready to install.',
      severity: 'info',
      icon: Shield,
      action: 'Install Now'
    }
  ];

  const recentTickets = [
    {
      id: 'ticket-1',
      title: 'Database Access Request',
      status: 'pending_approval',
      created: '2 hours ago',
      type: 'access_request'
    },
    {
      id: 'ticket-2',
      title: 'VPN Connection Issues',
      status: 'resolved',
      created: '1 day ago',
      type: 'network'
    },
    {
      id: 'ticket-3',
      title: 'Software Installation: IntelliJ',
      status: 'in_progress',
      created: '2 days ago',
      type: 'software'
    }
  ];

  const systemHealth = {
    overall: 85,
    components: [
      { name: 'Laptop Performance', status: 'good', value: 92 },
      { name: 'Network Connectivity', status: 'excellent', value: 98 },
      { name: 'Security Status', status: 'good', value: 88 },
      { name: 'Software Updates', status: 'warning', value: 75 }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'bg-warning/10 text-warning border-warning/20';
      case 'resolved': return 'bg-success/10 text-success border-success/20';
      case 'in_progress': return 'bg-info/10 text-info border-info/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'warning': return 'border-l-warning bg-warning/5 border-warning/20';
      case 'error': return 'border-l-destructive bg-destructive/5 border-destructive/20';
      case 'info': return 'border-l-info bg-info/5 border-info/20';
      default: return 'border-l-border bg-muted/30 border-border';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onLogout={onLogout} />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Proactive Alerts */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-warning" />
            </div>
            <h2 className="text-xl">Proactive Alerts</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {proactiveAlerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${getSeverityColor(alert.severity)} shadow-sm hover:shadow-md transition-shadow duration-200`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <alert.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-base leading-tight">{alert.title}</CardTitle>
                        <CardDescription className="text-sm leading-relaxed">{alert.description}</CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button 
                    size="sm" 
                    onClick={() => navigate('/ticket/alert-1')}
                    className="bg-primary hover:bg-primary/90 shadow-sm"
                  >
                    {alert.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* System Health */}
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-success" />
                </div>
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-4xl text-success mb-2">{systemHealth.overall}%</div>
                <p className="text-sm text-muted-foreground">Overall Health Score</p>
              </div>
              <div className="space-y-4">
                {systemHealth.components.map((component, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground">{component.name}</span>
                      <span className={`${
                        component.status === 'excellent' ? 'text-success' :
                        component.status === 'good' ? 'text-info' :
                        'text-warning'
                      }`}>
                        {component.value}%
                      </span>
                    </div>
                    <Progress value={component.value} className="h-2.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Plus className="w-4 h-4 text-primary" />
                </div>
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full justify-start h-12 hover:bg-accent/50 border-border/50" 
                variant="outline"
                onClick={() => navigate('/chat')}
              >
                <MessageSquare className="w-4 h-4 mr-3" />
                Chat with AI Guardian
              </Button>
              <Button 
                className="w-full justify-start h-12 hover:bg-accent/50 border-border/50" 
                variant="outline"
                onClick={() => navigate('/create-ticket')}
              >
                <Plus className="w-4 h-4 mr-3" />
                Create New Ticket
              </Button>
              <Button 
                className="w-full justify-start h-12 hover:bg-accent/50 border-border/50" 
                variant="outline"
                onClick={() => navigate('/tickets')}
              >
                <BarChart3 className="w-4 h-4 mr-3" />
                View All Tickets
              </Button>
              {isSolutionsArchitect && (
                <>
                  <Button 
                    className="w-full justify-start h-12 hover:bg-accent/50 border-border/50" 
                    variant="outline"
                    onClick={() => navigate('/infrastructure')}
                  >
                    <Database className="w-4 h-4 mr-3" />
                    Infrastructure Status
                  </Button>
                  <Button 
                    className="w-full justify-start h-12 hover:bg-accent/50 border-border/50" 
                    variant="outline"
                    onClick={() => navigate('/network')}
                  >
                    <Wifi className="w-4 h-4 mr-3" />
                    Network Monitoring
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Recent Tickets */}
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-info" />
                </div>
                Recent Tickets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentTickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  className="border border-border/50 rounded-lg p-4 hover:bg-accent/30 cursor-pointer transition-all duration-200 hover:shadow-sm"
                  onClick={() => navigate(`/ticket/${ticket.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm leading-tight">{ticket.title}</h4>
                    <Badge className={`text-xs border ${getStatusColor(ticket.status)}`}>
                      {ticket.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{ticket.created}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Solutions Architect Advanced View */}
        {isSolutionsArchitect && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-xl">Infrastructure Overview</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Active Services</p>
                      <p className="text-3xl text-success">47</p>
                    </div>
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">CPU Usage</p>
                      <p className="text-3xl text-info">23%</p>
                    </div>
                    <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                      <Activity className="w-6 h-6 text-info" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Memory Usage</p>
                      <p className="text-3xl text-warning">67%</p>
                    </div>
                    <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                      <Database className="w-6 h-6 text-warning" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Response Time</p>
                      <p className="text-3xl text-success">142ms</p>
                    </div>
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}