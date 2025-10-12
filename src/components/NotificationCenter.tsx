import React, { useState, useEffect } from "react";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Phone, 
  Settings, 
  Check, 
  X, 
  Clock, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Send,
  Smartphone,
  Globe,
  Zap,
  Filter,
  Calendar,
  Users
} from "lucide-react";
import { AppHeader } from "./AppHeader";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Progress } from "./ui/progress";
import { useAppContext } from "../App";

interface NotificationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  conditions: {
    ticketPriority?: string[];
    ticketCategory?: string[];
    userRole?: string[];
    department?: string[];
    keywords?: string[];
  };
  channels: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
    webhook?: string;
  };
  schedule: {
    immediate: boolean;
    digest: boolean;
    digestFrequency?: "hourly" | "daily" | "weekly";
    quietHours?: { start: string; end: string };
  };
  recipients: string[]; // user IDs or email addresses
}

interface NotificationHistory {
  id: string;
  type: "email" | "sms" | "push" | "webhook";
  recipient: string;
  subject: string;
  content: string;
  sentAt: string;
  status: "sent" | "delivered" | "failed" | "pending";
  ticketId?: string;
  ruleId: string;
  deliveryTime?: number; // milliseconds
}

interface ExternalIntegration {
  id: string;
  name: string;
  type: "sendgrid" | "twilio" | "slack" | "teams" | "webhook";
  status: "connected" | "disconnected" | "error";
  apiKey?: string;
  endpoint?: string;
  lastSync?: string;
  totalSent: number;
  successRate: number;
}

const mockRules: NotificationRule[] = [
  {
    id: "rule001",
    name: "Critical Ticket Alert",
    description: "Immediate notification for critical priority tickets",
    enabled: true,
    conditions: {
      ticketPriority: ["Critical", "High"]
    },
    channels: {
      email: true,
      sms: true,
      inApp: true
    },
    schedule: {
      immediate: true,
      digest: false
    },
    recipients: ["harish@resolv.ai", "karthikeyan@resolv.ai"]
  },
  {
    id: "rule002",
    name: "Database Access Requests",
    description: "Notifications for database access requests requiring approval",
    enabled: true,
    conditions: {
      ticketCategory: ["Database Management"],
      keywords: ["access", "permission", "database"]
    },
    channels: {
      email: true,
      sms: false,
      inApp: true
    },
    schedule: {
      immediate: true,
      digest: true,
      digestFrequency: "daily"
    },
    recipients: ["naveen@resolv.ai", "ranjithkumar@resolv.ai"]
  },
  {
    id: "rule003",
    name: "Junior Developer Digest",
    description: "Daily digest of tickets and announcements for junior developers",
    enabled: true,
    conditions: {
      userRole: ["junior_developer"]
    },
    channels: {
      email: true,
      sms: false,
      inApp: true
    },
    schedule: {
      immediate: false,
      digest: true,
      digestFrequency: "daily",
      quietHours: { start: "18:00", end: "09:00" }
    },
    recipients: ["subhaharini@resolv.ai", "hairni@resolv.ai", "dhina@resolv.ai"]
  }
];

const mockHistory: NotificationHistory[] = [
  {
    id: "hist001",
    type: "email",
    recipient: "harish@resolv.ai",
    subject: "Critical Ticket Alert: Database Connection Failed",
    content: "A critical ticket has been created: TIK-123 - Database Connection Failed",
    sentAt: "2024-12-15T10:30:00Z",
    status: "delivered",
    ticketId: "TIK-123",
    ruleId: "rule001",
    deliveryTime: 1250
  },
  {
    id: "hist002",
    type: "sms",
    recipient: "+1234567890",
    subject: "Critical Alert",
    content: "Critical ticket TIK-123 requires immediate attention",
    sentAt: "2024-12-15T10:31:00Z",
    status: "delivered",
    ticketId: "TIK-123",
    ruleId: "rule001",
    deliveryTime: 850
  },
  {
    id: "hist003",
    type: "email",
    recipient: "naveen@resolv.ai",
    subject: "Database Access Request Pending",
    content: "New database access request TIK-124 requires your approval",
    sentAt: "2024-12-15T09:15:00Z",
    status: "sent",
    ticketId: "TIK-124",
    ruleId: "rule002",
    deliveryTime: 2100
  }
];

const mockIntegrations: ExternalIntegration[] = [
  {
    id: "int001",
    name: "SendGrid Email Service",
    type: "sendgrid",
    status: "connected",
    apiKey: "SG.****************************",
    lastSync: "2024-12-15T10:35:00Z",
    totalSent: 15420,
    successRate: 99.2
  },
  {
    id: "int002",
    name: "Twilio SMS Service",
    type: "twilio",
    status: "connected",
    apiKey: "AC****************************",
    lastSync: "2024-12-15T10:32:00Z",
    totalSent: 3450,
    successRate: 97.8
  },
  {
    id: "int003",
    name: "Slack Workspace",
    type: "slack",
    status: "disconnected",
    endpoint: "https://hooks.slack.com/services/...",
    lastSync: "2024-12-14T16:20:00Z",
    totalSent: 890,
    successRate: 95.4
  }
];

interface NotificationCenterProps {
  onLogout: () => void;
}

export function NotificationCenter({ onLogout }: NotificationCenterProps) {
  const { user } = useAppContext();
  const [rules, setRules] = useState(mockRules);
  const [history] = useState(mockHistory);
  const [integrations] = useState(mockIntegrations);
  const [selectedRule, setSelectedRule] = useState<NotificationRule | null>(null);
  const [isTestingNotification, setIsTestingNotification] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule =>
      rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
      case "sent":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "failed":
        return <X className="h-4 w-4 text-destructive" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      case "push":
        return <Smartphone className="h-4 w-4" />;
      case "webhook":
        return <Globe className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case "sendgrid":
        return <Mail className="h-5 w-5" />;
      case "twilio":
        return <Phone className="h-5 w-5" />;
      case "slack":
        return <MessageSquare className="h-5 w-5" />;
      case "teams":
        return <Users className="h-5 w-5" />;
      case "webhook":
        return <Globe className="h-5 w-5" />;
      default:
        return <Settings className="h-5 w-5" />;
    }
  };

  const testNotification = async (type: "email" | "sms" | "push") => {
    setIsTestingNotification(true);
    setTestResult(null);

    // Simulate API call to notification service
    await new Promise(resolve => setTimeout(resolve, 2000));

    const success = Math.random() > 0.1; // 90% success rate
    if (success) {
      setTestResult(`Test ${type} notification sent successfully!`);
    } else {
      setTestResult(`Failed to send test ${type} notification. Please check your configuration.`);
    }

    setIsTestingNotification(false);
    setTimeout(() => setTestResult(null), 5000);
  };

  const getDeliveryStats = () => {
    const total = history.length;
    const delivered = history.filter(h => h.status === "delivered" || h.status === "sent").length;
    const failed = history.filter(h => h.status === "failed").length;
    const avgDeliveryTime = history
      .filter(h => h.deliveryTime)
      .reduce((sum, h) => sum + (h.deliveryTime || 0), 0) / history.length;

    return { total, delivered, failed, avgDeliveryTime };
  };

  const stats = getDeliveryStats();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        user={user}
        onLogout={onLogout}
        title="Notification Center"
        subtitle="Manage alerts, notifications, and external integrations"
      />

      <div className="container mx-auto p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Rules</p>
                  <p className="text-2xl font-bold">{rules.filter(r => r.enabled).length}</p>
                </div>
                <Bell className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Sent Today</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <Send className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Rate</p>
                  <p className="text-2xl font-bold">{Math.round((stats.delivered / stats.total) * 100)}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Delivery</p>
                  <p className="text-2xl font-bold">{Math.round(stats.avgDeliveryTime)}ms</p>
                </div>
                <Zap className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="rules" className="space-y-4">
          <TabsList>
            <TabsTrigger value="rules" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Notification Rules
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Delivery History
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Integrations
            </TabsTrigger>
            <TabsTrigger value="test" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Test Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rules" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Notification Rules</h3>
              <Button className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Create Rule
              </Button>
            </div>

            <div className="grid gap-4">
              {rules.map((rule) => (
                <Card key={rule.id} className={`transition-all ${rule.enabled ? 'border-primary/50' : 'border-muted'}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          {rule.name}
                          {rule.enabled ? (
                            <Badge variant="default">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Disabled</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{rule.description}</CardDescription>
                      </div>
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => toggleRule(rule.id)}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Conditions</Label>
                        <div className="mt-1 space-y-1">
                          {rule.conditions.ticketPriority && (
                            <div className="flex flex-wrap gap-1">
                              <span className="text-xs text-muted-foreground">Priority:</span>
                              {rule.conditions.ticketPriority.map(p => (
                                <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
                              ))}
                            </div>
                          )}
                          {rule.conditions.ticketCategory && (
                            <div className="flex flex-wrap gap-1">
                              <span className="text-xs text-muted-foreground">Category:</span>
                              {rule.conditions.ticketCategory.map(c => (
                                <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                              ))}
                            </div>
                          )}
                          {rule.conditions.userRole && (
                            <div className="flex flex-wrap gap-1">
                              <span className="text-xs text-muted-foreground">Role:</span>
                              {rule.conditions.userRole.map(r => (
                                <Badge key={r} variant="outline" className="text-xs">{r}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Channels</Label>
                        <div className="mt-1 flex gap-2">
                          {rule.channels.email && <Badge variant="secondary" className="text-xs">Email</Badge>}
                          {rule.channels.sms && <Badge variant="secondary" className="text-xs">SMS</Badge>}
                          {rule.channels.inApp && <Badge variant="secondary" className="text-xs">In-App</Badge>}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Recipients</Label>
                        <div className="mt-1 text-sm">{rule.recipients.length} recipient(s)</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Delivery History</h3>
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="push">Push</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {history.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(item.type)}
                        <div>
                          <h4 className="font-medium">{item.subject}</h4>
                          <p className="text-sm text-muted-foreground">To: {item.recipient}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.content}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(item.status)}
                          <Badge variant="outline" className="text-xs">
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.sentAt).toLocaleString()}
                        </p>
                        {item.deliveryTime && (
                          <p className="text-xs text-muted-foreground">
                            {item.deliveryTime}ms
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">External Integrations</h3>
              <Button className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Add Integration
              </Button>
            </div>

            <div className="grid gap-4">
              {integrations.map((integration) => (
                <Card key={integration.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getIntegrationIcon(integration.type)}
                        <div>
                          <CardTitle>{integration.name}</CardTitle>
                          <CardDescription>{integration.type.toUpperCase()}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={integration.status === "connected" ? "default" : "secondary"}>
                        {integration.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">API Key</Label>
                        <div className="mt-1 font-mono text-xs">
                          {integration.apiKey || integration.endpoint || "Not configured"}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Last Sync</Label>
                        <div className="mt-1 text-sm">
                          {integration.lastSync ? new Date(integration.lastSync).toLocaleString() : "Never"}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Total Sent</Label>
                        <div className="mt-1 text-sm font-medium">{integration.totalSent.toLocaleString()}</div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Success Rate</Label>
                        <div className="mt-1 flex items-center gap-2">
                          <Progress value={integration.successRate} className="flex-1 h-2" />
                          <span className="text-sm">{integration.successRate}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        Test Connection
                      </Button>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                      {integration.status === "disconnected" && (
                        <Button size="sm">
                          Reconnect
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Test Notifications</h3>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Test
                  </CardTitle>
                  <CardDescription>Send a test email notification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="test-email">Email Address</Label>
                      <Input
                        id="test-email"
                        type="email"
                        placeholder="test@example.com"
                        defaultValue={user?.email}
                      />
                    </div>
                    <Button 
                      onClick={() => testNotification("email")}
                      disabled={isTestingNotification}
                      className="w-full"
                    >
                      {isTestingNotification ? "Sending..." : "Send Test Email"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    SMS Test
                  </CardTitle>
                  <CardDescription>Send a test SMS notification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="test-phone">Phone Number</Label>
                      <Input
                        id="test-phone"
                        type="tel"
                        placeholder="+1234567890"
                      />
                    </div>
                    <Button 
                      onClick={() => testNotification("sms")}
                      disabled={isTestingNotification}
                      className="w-full"
                    >
                      {isTestingNotification ? "Sending..." : "Send Test SMS"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    Push Test
                  </CardTitle>
                  <CardDescription>Send a test push notification</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="test-device">Device Token</Label>
                      <Input
                        id="test-device"
                        placeholder="Device token or user ID"
                        defaultValue={user?.id}
                      />
                    </div>
                    <Button 
                      onClick={() => testNotification("push")}
                      disabled={isTestingNotification}
                      className="w-full"
                    >
                      {isTestingNotification ? "Sending..." : "Send Test Push"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {testResult && (
              <Card className={testResult.includes("successfully") ? "border-success" : "border-destructive"}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    {testResult.includes("successfully") ? (
                      <CheckCircle className="h-4 w-4 text-success" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                    <span>{testResult}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}