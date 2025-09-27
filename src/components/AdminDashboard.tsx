import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  Shield, 
  Users, 
  Settings, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Database,
  GitBranch,
  UserCog,
  Lock
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const ticketData = [
    { name: 'Mon', proactive: 12, reactive: 8 },
    { name: 'Tue', proactive: 15, reactive: 6 },
    { name: 'Wed', proactive: 18, reactive: 4 },
    { name: 'Thu', proactive: 14, reactive: 7 },
    { name: 'Fri', proactive: 16, reactive: 5 },
    { name: 'Sat', proactive: 8, reactive: 3 },
    { name: 'Sun', proactive: 6, reactive: 2 }
  ];

  const resolutionTimeData = [
    { name: 'Week 1', time: 4.2 },
    { name: 'Week 2', time: 3.8 },
    { name: 'Week 3', time: 3.1 },
    { name: 'Week 4', time: 2.9 }
  ];

  const systemStats = {
    totalTickets: 847,
    openTickets: 23,
    avgResolutionTime: 2.9,
    proactiveRatio: 73,
    userSatisfaction: 94
  };

  const recentActivity = [
    {
      id: 1,
      action: 'Karthikeyan\'s manager changed to Naveen',
      user: 'Harish Rohith S',
      time: '2 hours ago',
      type: 'hierarchy'
    },
    {
      id: 2,
      action: 'New user role created: Senior Developer',
      user: 'Harish Rohith S',
      time: '4 hours ago',
      type: 'role'
    },
    {
      id: 3,
      action: 'Proactive alert: Server CPU high usage',
      user: 'AI Guardian',
      time: '6 hours ago',
      type: 'system'
    },
    {
      id: 4,
      action: '15 tickets auto-resolved by AI',
      user: 'AI Guardian',
      time: '1 day ago',
      type: 'automation'
    }
  ];

  const departmentStats = [
    { name: 'Engineering', users: 45, tickets: 156, avgTime: 2.3 },
    { name: 'Design', users: 12, tickets: 23, avgTime: 1.8 },
    { name: 'Product', users: 18, tickets: 34, avgTime: 2.1 },
    { name: 'Marketing', users: 23, tickets: 45, avgTime: 3.2 }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader onLogout={onLogout} />

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Key Metrics */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-info" />
            </div>
            <h2 className="text-xl">System Overview</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Total Tickets</p>
                    <p className="text-3xl text-foreground">{systemStats.totalTickets}</p>
                  </div>
                  <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-info" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Open Tickets</p>
                    <p className="text-3xl text-warning">{systemStats.openTickets}</p>
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
                    <p className="text-sm text-muted-foreground">Avg Resolution</p>
                    <p className="text-3xl text-success">{systemStats.avgResolutionTime}h</p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Proactive Ratio</p>
                    <p className="text-3xl text-primary">{systemStats.proactiveRatio}%</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Satisfaction</p>
                    <p className="text-3xl text-success">{systemStats.userSatisfaction}%</p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Settings className="w-4 h-4 text-primary" />
            </div>
            <h2 className="text-xl">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-sm border-border/50 hover:bg-accent/20 transition-colors cursor-pointer" onClick={() => navigate('/admin/users')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="mb-1">Manage Users</h3>
                <p className="text-sm text-muted-foreground">Add, edit, or remove users</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border/50 hover:bg-accent/20 transition-colors cursor-pointer" onClick={() => navigate('/admin/roles')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-info/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <UserCog className="w-6 h-6 text-info" />
                </div>
                <h3 className="mb-1">Role Permissions</h3>
                <p className="text-sm text-muted-foreground">Configure access levels</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border/50 hover:bg-accent/20 transition-colors cursor-pointer" onClick={() => navigate('/admin/hierarchy')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <GitBranch className="w-6 h-6 text-success" />
                </div>
                <h3 className="mb-1">Org Hierarchy</h3>
                <p className="text-sm text-muted-foreground">Manage reporting structure</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-border/50 hover:bg-accent/20 transition-colors cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Database className="w-6 h-6 text-warning" />
                </div>
                <h3 className="mb-1">System Settings</h3>
                <p className="text-sm text-muted-foreground">Configure system parameters</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* AI Guardian Status Grid */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-success" />
            </div>
            <h2 className="text-xl">AI Guardian Status</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-success/20 bg-success/5 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-success" />
                </div>
                <p className="text-3xl text-success mb-1">24/7</p>
                <p className="text-sm text-success/80">Active Monitoring</p>
              </CardContent>
            </Card>
            <Card className="border-success/20 bg-success/5 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <p className="text-3xl text-success mb-1">847</p>
                <p className="text-sm text-success/80">Issues Prevented</p>
              </CardContent>
            </Card>
            <Card className="border-success/20 bg-success/5 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <p className="text-3xl text-success mb-1">156</p>
                <p className="text-sm text-success/80">Auto-Resolved</p>
              </CardContent>
            </Card>
            <Card className="border-success/20 bg-success/5 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BarChart3 className="w-6 h-6 text-success" />
                </div>
                <p className="text-3xl text-success mb-1">98.2%</p>
                <p className="text-sm text-success/80">Prediction Accuracy</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ticket Trends */}
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-4 h-4 text-primary" />
                </div>
                Proactive vs Reactive Tickets
              </CardTitle>
              <CardDescription>Last 7 days comparison showing AI prevention effectiveness</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ticketData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="proactive" fill="hsl(var(--success))" name="Proactive" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="reactive" fill="hsl(var(--destructive))" name="Reactive" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resolution Time Trend */}
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-success" />
                </div>
                Average Resolution Time
              </CardTitle>
              <CardDescription>Continuous improvement in response times (hours)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={resolutionTimeData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    domain={['auto', 'auto']}
                    label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    formatter={(value: any) => [`${value}h`, 'Resolution Time']}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="time" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={3} 
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: 'hsl(var(--success))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Department Performance */}
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-info" />
                </div>
                Department Overview
              </CardTitle>
              <CardDescription>Performance metrics across teams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentStats.map((dept, index) => (
                  <div key={index} className="border border-border/50 rounded-lg p-4 hover:bg-accent/20 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-foreground">{dept.name}</h4>
                      <Badge variant="outline" className="border-border/50">{dept.users} users</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-3">
                      <div>
                        <span>Tickets: </span>
                        <span className="text-foreground">{dept.tickets}</span>
                      </div>
                      <div>
                        <span>Avg Time: </span>
                        <span className="text-foreground">{dept.avgTime}h</span>
                      </div>
                    </div>
                    <Progress value={(5 - dept.avgTime) * 20} className="h-2.5" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-warning" />
                </div>
                Recent Activity
              </CardTitle>
              <CardDescription>Latest system and administrative actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activity.type === 'hierarchy' ? 'bg-info/10' :
                      activity.type === 'role' ? 'bg-primary/10' :
                      activity.type === 'system' ? 'bg-success/10' :
                      'bg-warning/10'
                    }`}>
                      {activity.type === 'hierarchy' ? <GitBranch className="w-4 h-4 text-info" /> :
                       activity.type === 'role' ? <Lock className="w-4 h-4 text-primary" /> :
                       activity.type === 'system' ? <Database className="w-4 h-4 text-success" /> :
                       <Settings className="w-4 h-4 text-warning" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.action}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>by {activity.user}</span>
                        <span>•</span>
                        <span>{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>


      </div>
    </div>
  );
}