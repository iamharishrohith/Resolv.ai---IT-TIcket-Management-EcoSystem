import React, { useState } from "react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from "recharts";
import { Calendar, TrendingUp, Clock, Users, AlertTriangle, CheckCircle, Activity, Filter, Download, RefreshCw } from "lucide-react";
import { AppHeader } from "./AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { DatePickerWithRange } from "./ui/date-picker";
import { useAppContext } from "../App";

// Mock analytics data that would come from the centralized database
const mockTicketTrends = [
  { month: "Jan", created: 45, resolved: 42, pending: 3 },
  { month: "Feb", created: 52, resolved: 48, pending: 7 },
  { month: "Mar", created: 61, resolved: 55, pending: 13 },
  { month: "Apr", created: 58, resolved: 60, pending: 11 },
  { month: "May", created: 67, resolved: 63, pending: 15 },
  { month: "Jun", created: 71, resolved: 68, pending: 18 },
];

const mockCategoryData = [
  { name: "Database Management", value: 285, color: "#1e3a5f" },
  { name: "Network Security", value: 210, color: "#3b82f6" },
  { name: "Hardware", value: 167, color: "#10b981" },
  { name: "Software Management", value: 142, color: "#f59e0b" },
  { name: "Access Management", value: 98, color: "#8b5cf6" },
  { name: "Other", value: 78, color: "#6b7280" },
];

const mockPriorityData = [
  { name: "Low", value: 450, color: "#6b7280" },
  { name: "Medium", value: 380, color: "#3b82f6" },
  { name: "High", value: 120, color: "#f59e0b" },
  { name: "Critical", value: 30, color: "#dc2626" },
];

const mockResolutionTimes = [
  { category: "Hardware", avgHours: 24, sla: 48 },
  { category: "Software", avgHours: 8, sla: 24 },
  { category: "Database", avgHours: 4, sla: 12 },
  { category: "Network", avgHours: 2, sla: 6 },
  { category: "Access", avgHours: 1, sla: 4 },
];

const mockUserActivity = [
  { user: "Karthikeyan", role: "Solutions Architect", ticketsResolved: 45, avgResolutionTime: 3.2, satisfaction: 4.8 },
  { user: "Naveen", role: "Solutions Architect", ticketsResolved: 38, avgResolutionTime: 4.1, satisfaction: 4.6 },
  { user: "Ranjithkumar", role: "Solutions Architect", ticketsResolved: 42, avgResolutionTime: 3.8, satisfaction: 4.7 },
  { user: "IT Support Team", role: "Support", ticketsResolved: 156, avgResolutionTime: 6.5, satisfaction: 4.2 },
];

const mockDepartmentStats = [
  { department: "Engineering", totalTickets: 420, openTickets: 35, avgResolutionDays: 2.1 },
  { department: "DevOps", totalTickets: 180, openTickets: 12, avgResolutionDays: 1.8 },
  { department: "QA", totalTickets: 95, openTickets: 8, avgResolutionDays: 2.5 },
  { department: "Frontend", totalTickets: 145, openTickets: 15, avgResolutionDays: 2.3 },
  { department: "Backend", totalTickets: 190, openTickets: 18, avgResolutionDays: 2.0 },
];

const mockSLACompliance = [
  { month: "Jan", compliance: 92, target: 95 },
  { month: "Feb", compliance: 94, target: 95 },
  { month: "Mar", compliance: 89, target: 95 },
  { month: "Apr", compliance: 96, target: 95 },
  { month: "May", compliance: 93, target: 95 },
  { month: "Jun", compliance: 97, target: 95 },
];

interface TicketAnalyticsProps {
  onLogout: () => void;
}

export function TicketAnalytics({ onLogout }: TicketAnalyticsProps) {
  const { user } = useAppContext();
  const [selectedPeriod, setSelectedPeriod] = useState("6months");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const exportData = (format: "csv" | "excel" | "pdf") => {
    // Mock export functionality
    console.log(`Exporting data as ${format}`);
  };

  const getTotalTickets = () => {
    return mockTicketTrends.reduce((sum, month) => sum + month.created, 0);
  };

  const getResolutionRate = () => {
    const total = mockTicketTrends.reduce((sum, month) => sum + month.created, 0);
    const resolved = mockTicketTrends.reduce((sum, month) => sum + month.resolved, 0);
    return Math.round((resolved / total) * 100);
  };

  const getAvgResolutionTime = () => {
    const totalTime = mockResolutionTimes.reduce((sum, item) => sum + item.avgHours, 0);
    return Math.round((totalTime / mockResolutionTimes.length) * 10) / 10;
  };

  const getCurrentSLA = () => {
    const latest = mockSLACompliance[mockSLACompliance.length - 1];
    return latest.compliance;
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        user={user}
        onLogout={onLogout}
        title="Ticket Analytics"
        subtitle="Advanced analytics and insights from centralized ticket database"
      />

      <div className="container mx-auto p-6 space-y-6">
        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="qa">QA</SelectItem>
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Select onValueChange={(format) => exportData(format as any)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Tickets</p>
                  <p className="text-2xl font-bold">{getTotalTickets()}</p>
                  <p className="text-xs text-success">+12% from last period</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolution Rate</p>
                  <p className="text-2xl font-bold">{getResolutionRate()}%</p>
                  <p className="text-xs text-success">+3% from last period</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Resolution</p>
                  <p className="text-2xl font-bold">{getAvgResolutionTime()}h</p>
                  <p className="text-xs text-success">-15min from last period</p>
                </div>
                <Clock className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">SLA Compliance</p>
                  <p className="text-2xl font-bold">{getCurrentSLA()}%</p>
                  <p className="text-xs text-success">+2% from last period</p>
                </div>
                <TrendingUp className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="space-y-4">
          <TabsList>
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Categories
            </TabsTrigger>
            <TabsTrigger value="performance" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="teams" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Teams
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ticket Volume Trends</CardTitle>
                  <CardDescription>Monthly ticket creation and resolution rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mockTicketTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="created" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="resolved" stackId="2" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SLA Compliance Trend</CardTitle>
                  <CardDescription>Monthly SLA compliance vs target</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={mockSLACompliance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="compliance" stroke="#3b82f6" strokeWidth={3} />
                      <Line type="monotone" dataKey="target" stroke="#dc2626" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tickets by Category</CardTitle>
                  <CardDescription>Distribution of tickets across different categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {mockCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Priority Distribution</CardTitle>
                  <CardDescription>Tickets grouped by priority level</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockPriorityData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6">
                        {mockPriorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resolution Time by Category</CardTitle>
                  <CardDescription>Average resolution time vs SLA targets</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={mockResolutionTimes}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="avgHours" fill="#3b82f6" name="Avg Resolution (hours)" />
                      <Bar dataKey="sla" fill="#10b981" name="SLA Target (hours)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                  <CardDescription>Ticket metrics by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockDepartmentStats.map((dept) => (
                      <div key={dept.department} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <h4 className="font-medium">{dept.department}</h4>
                          <p className="text-sm text-muted-foreground">
                            {dept.totalTickets} total tickets, {dept.openTickets} open
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{dept.avgResolutionDays} days</p>
                          <p className="text-xs text-muted-foreground">avg resolution</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Team Member Performance</CardTitle>
                <CardDescription>Individual performance metrics and satisfaction scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserActivity.map((user) => (
                    <div key={user.user} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <h4 className="font-medium">{user.user}</h4>
                        <Badge variant="outline" className="text-xs">{user.role}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                          <p className="text-lg font-bold">{user.ticketsResolved}</p>
                          <p className="text-xs text-muted-foreground">Resolved</p>
                        </div>
                        <div>
                          <p className="text-lg font-bold">{user.avgResolutionTime}h</p>
                          <p className="text-xs text-muted-foreground">Avg Time</p>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <p className="text-lg font-bold">{user.satisfaction}</p>
                            <span className="text-warning">★</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Satisfaction</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}