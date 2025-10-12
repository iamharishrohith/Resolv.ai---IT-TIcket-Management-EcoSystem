import React, { useState, useEffect } from "react";
import { 
  Server, 
  Activity, 
  Code, 
  GitBranch, 
  Settings, 
  Shield, 
  Calendar, 
  Database, 
  Monitor, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw,
  TrendingUp,
  FileText,
  Users,
  Zap,
  Target,
  Layers,
  TestTube,
  ChevronRight,
  RefreshCw,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  Plus
} from "lucide-react";
import { AppHeader } from "./AppHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Switch } from "./ui/switch";
import { useAppContext } from "../App";

interface SAPSystem {
  id: string;
  name: string;
  systemId: string;
  environment: "DEV" | "QAS" | "PRD";
  status: "online" | "offline" | "maintenance" | "error";
  version: string;
  lastSync: string;
  components: string[];
  landscape: string;
}

interface BusinessProcess {
  id: string;
  name: string;
  system: string;
  status: "running" | "stopped" | "error" | "warning";
  lastExecution: string;
  avgExecutionTime: number;
  successRate: number;
  issues: number;
  owner: string;
  criticality: "High" | "Medium" | "Low";
}

interface ChangeRequest {
  id: string;
  title: string;
  type: "emergency" | "normal" | "urgent";
  status: "submitted" | "approved" | "in_progress" | "testing" | "deployed" | "rejected";
  submitter: string;
  approver?: string;
  targetSystem: string;
  scheduledDate: string;
  impact: "High" | "Medium" | "Low";
  category: "transport" | "config" | "code" | "master_data";
}

interface CustomCodeObject {
  id: string;
  name: string;
  type: "report" | "class" | "function" | "enhancement" | "badi";
  system: string;
  developer: string;
  lastModified: string;
  codeQuality: number;
  testCoverage: number;
  complexity: "Low" | "Medium" | "High";
  status: "active" | "obsolete" | "deprecated";
  issues: string[];
}

interface JobDefinition {
  id: string;
  name: string;
  type: "batch" | "background" | "scheduled";
  system: string;
  frequency: string;
  nextRun: string;
  lastRun: string;
  status: "active" | "inactive" | "error";
  duration: number;
  successRate: number;
  dependencies: string[];
}

interface TestCase {
  id: string;
  name: string;
  module: string;
  type: "unit" | "integration" | "e2e" | "performance";
  status: "passed" | "failed" | "pending" | "skipped";
  lastRun: string;
  duration: number;
  environment: string;
  coverage: number;
  defects: number;
}

// Mock data
const mockSAPSystems: SAPSystem[] = [
  {
    id: "sap001",
    name: "SAP ERP Development",
    systemId: "ERD",
    environment: "DEV",
    status: "online",
    version: "SAP ECC 6.0 EHP8",
    lastSync: "2024-12-15T10:30:00Z",
    components: ["FI", "CO", "MM", "SD", "HR"],
    landscape: "Development"
  },
  {
    id: "sap002", 
    name: "SAP ERP Quality",
    systemId: "ERQ",
    environment: "QAS",
    status: "online",
    version: "SAP ECC 6.0 EHP8",
    lastSync: "2024-12-15T10:25:00Z",
    components: ["FI", "CO", "MM", "SD", "HR"],
    landscape: "Quality Assurance"
  },
  {
    id: "sap003",
    name: "SAP ERP Production",
    systemId: "ERP",
    environment: "PRD",
    status: "online",
    version: "SAP ECC 6.0 EHP8", 
    lastSync: "2024-12-15T10:35:00Z",
    components: ["FI", "CO", "MM", "SD", "HR"],
    landscape: "Production"
  }
];

const mockBusinessProcesses: BusinessProcess[] = [
  {
    id: "bp001",
    name: "Order-to-Cash Process",
    system: "ERP",
    status: "running",
    lastExecution: "2024-12-15T09:00:00Z",
    avgExecutionTime: 45,
    successRate: 98.5,
    issues: 2,
    owner: "Sales Team",
    criticality: "High"
  },
  {
    id: "bp002",
    name: "Procure-to-Pay Process", 
    system: "ERP",
    status: "running",
    lastExecution: "2024-12-15T08:30:00Z",
    avgExecutionTime: 32,
    successRate: 96.8,
    issues: 5,
    owner: "Procurement Team",
    criticality: "High"
  },
  {
    id: "bp003",
    name: "Financial Closing Process",
    system: "ERP",
    status: "warning",
    lastExecution: "2024-12-14T18:00:00Z",
    avgExecutionTime: 120,
    successRate: 89.2,
    issues: 12,
    owner: "Finance Team",
    criticality: "High"
  }
];

const mockChangeRequests: ChangeRequest[] = [
  {
    id: "CHG001",
    title: "Update Sales Tax Calculation Logic",
    type: "normal",
    status: "approved",
    submitter: "Karthikeyan",
    approver: "Naveen",
    targetSystem: "ERP",
    scheduledDate: "2024-12-20T14:00:00Z",
    impact: "Medium",
    category: "code"
  },
  {
    id: "CHG002",
    title: "New Customer Master Data Fields",
    type: "urgent",
    status: "in_progress",
    submitter: "Ranjithkumar",
    targetSystem: "ERD",
    scheduledDate: "2024-12-16T10:00:00Z",
    impact: "High",
    category: "config"
  }
];

const mockCustomCode: CustomCodeObject[] = [
  {
    id: "cc001",
    name: "Z_CUSTOM_REPORT_001",
    type: "report",
    system: "ERP",
    developer: "Kevin S",
    lastModified: "2024-12-10T14:30:00Z",
    codeQuality: 85,
    testCoverage: 78,
    complexity: "Medium",
    status: "active",
    issues: ["Performance optimization needed"]
  },
  {
    id: "cc002",
    name: "ZCL_CUSTOM_BUSINESS_LOGIC",
    type: "class",
    system: "ERP",
    developer: "Dhina",
    lastModified: "2024-12-08T16:15:00Z",
    codeQuality: 92,
    testCoverage: 85,
    complexity: "High",
    status: "active",
    issues: []
  }
];

const mockJobs: JobDefinition[] = [
  {
    id: "job001",
    name: "Daily Sales Report Generation",
    type: "scheduled",
    system: "ERP",
    frequency: "Daily at 6:00 AM",
    nextRun: "2024-12-16T06:00:00Z",
    lastRun: "2024-12-15T06:00:00Z",
    status: "active",
    duration: 15,
    successRate: 99.2,
    dependencies: ["Daily Data Extraction"]
  },
  {
    id: "job002",
    name: "Monthly Financial Closing",
    type: "batch",
    system: "ERP", 
    frequency: "Monthly on last day",
    nextRun: "2024-12-31T20:00:00Z",
    lastRun: "2024-11-30T20:00:00Z",
    status: "active",
    duration: 180,
    successRate: 95.8,
    dependencies: ["All Daily Processes"]
  }
];

const mockTestCases: TestCase[] = [
  {
    id: "test001",
    name: "Order Creation Test",
    module: "SD",
    type: "integration",
    status: "passed",
    lastRun: "2024-12-15T08:00:00Z",
    duration: 5,
    environment: "QAS",
    coverage: 87,
    defects: 0
  },
  {
    id: "test002",
    name: "Invoice Processing Test",
    module: "FI",
    type: "e2e",
    status: "failed",
    lastRun: "2024-12-15T09:15:00Z",
    duration: 12,
    environment: "QAS",
    coverage: 92,
    defects: 3
  }
];

interface SAPSolutionManagerProps {
  onLogout: () => void;
}

export function SAPSolutionManager({ onLogout }: SAPSolutionManagerProps) {
  const { user } = useAppContext();
  const [selectedSystem, setSelectedSystem] = useState<string>("all");
  const [systems] = useState(mockSAPSystems);
  const [businessProcesses] = useState(mockBusinessProcesses);
  const [changeRequests] = useState(mockChangeRequests);
  const [customCode] = useState(mockCustomCode);
  const [jobs] = useState(mockJobs);
  const [testCases] = useState(mockTestCases);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
      case "running":
      case "active":
      case "passed":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "error":
      case "failed":
      case "offline":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "maintenance":
      case "pending":
      case "inactive":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
      case "running": 
      case "active":
      case "passed":
        return "default";
      case "warning":
        return "warning";
      case "error":
      case "failed":
      case "offline":
        return "destructive";
      case "maintenance":
      case "pending":
      case "inactive":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const getOverallSystemHealth = () => {
    const onlineSystems = systems.filter(s => s.status === "online").length;
    return Math.round((onlineSystems / systems.length) * 100);
  };

  const getProcessHealth = () => {
    const runningProcesses = businessProcesses.filter(p => p.status === "running").length;
    return Math.round((runningProcesses / businessProcesses.length) * 100);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        user={user}
        onLogout={onLogout}
        title="SAP Solution Manager"
        subtitle="Agile Application Lifecycle Management for SAP Systems"
      />

      <div className="container mx-auto p-6 space-y-6">
        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">System Health</p>
                  <p className="text-2xl font-bold">{getOverallSystemHealth()}%</p>
                  <p className="text-xs text-success">{systems.filter(s => s.status === "online").length}/{systems.length} online</p>
                </div>
                <Server className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Process Health</p>
                  <p className="text-2xl font-bold">{getProcessHealth()}%</p>
                  <p className="text-xs text-success">{businessProcesses.filter(p => p.status === "running").length} running</p>
                </div>
                <Activity className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Changes</p>
                  <p className="text-2xl font-bold">{changeRequests.filter(c => c.status !== "deployed" && c.status !== "rejected").length}</p>
                  <p className="text-xs text-warning">{changeRequests.filter(c => c.type === "urgent").length} urgent</p>
                </div>
                <GitBranch className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Test Success</p>
                  <p className="text-2xl font-bold">{Math.round((testCases.filter(t => t.status === "passed").length / testCases.length) * 100)}%</p>
                  <p className="text-xs text-info">{testCases.length} test cases</p>
                </div>
                <TestTube className="h-8 w-8 text-info" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center">
          <Select value={selectedSystem} onValueChange={setSelectedSystem}>
            <SelectTrigger className="w-64">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Systems</SelectItem>
              {systems.map(system => (
                <SelectItem key={system.id} value={system.id}>
                  {system.name} ({system.systemId})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* ALM Areas Navigation */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              SAP Solution Manager - Application Lifecycle Management Areas
            </CardTitle>
            <CardDescription>
              Comprehensive ALM coverage for all SAP development and operations processes
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="applications" className="space-y-6">
          <div className="bg-card border rounded-lg p-4">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-11 gap-1 h-auto p-2 bg-muted">
              <TabsTrigger value="applications" className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Server className="h-4 w-4" />
                <span>App Operations</span>
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Monitor className="h-4 w-4" />
                <span>BP Monitoring</span>
              </TabsTrigger>
              <TabsTrigger value="operations" className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Activity className="h-4 w-4" />
                <span>BP Operations</span>
              </TabsTrigger>
              <TabsTrigger value="changes" className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <GitBranch className="h-4 w-4" />
                <span>Change Control</span>
              </TabsTrigger>
              <TabsTrigger value="code" className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Code className="h-4 w-4" />
                <span>Custom Code</span>
              </TabsTrigger>
              <TabsTrigger value="itsm" className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Shield className="h-4 w-4" />
                <span>IT Service Mgmt</span>
              </TabsTrigger>
              <TabsTrigger value="jobs" className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Calendar className="h-4 w-4" />
                <span>Job Scheduling</span>
              </TabsTrigger>
              <TabsTrigger value="landscape" className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Layers className="h-4 w-4" />
                <span>Landscape</span>
              </TabsTrigger>
              <TabsTrigger value="maintenance" className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <Settings className="h-4 w-4" />
                <span>Maintenance</span>
              </TabsTrigger>
              <TabsTrigger value="process-mgmt" className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Process Mgmt</span>
              </TabsTrigger>
              <TabsTrigger value="tests" className="flex flex-col items-center gap-1 p-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                <TestTube className="h-4 w-4" />
                <span>Test Suite</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Application Operations */}
          <TabsContent value="applications" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">SAP System Operations</h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Monitor New System
              </Button>
            </div>
            
            <div className="grid gap-4">
              {systems.map((system) => (
                <Card key={system.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Server className="h-5 w-5" />
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {system.name}
                            {getStatusIcon(system.status)}
                            <Badge variant={getStatusColor(system.status) as any}>
                              {system.status.toUpperCase()}
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {system.systemId} • {system.version} • {system.environment}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="outline">{system.landscape}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Components</Label>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {system.components.map(comp => (
                            <Badge key={comp} variant="secondary" className="text-xs">
                              {comp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Last Sync</Label>
                        <div className="mt-1 text-sm">
                          {new Date(system.lastSync).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Monitor className="h-4 w-4 mr-1" />
                          Monitor
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>



          {/* Change Control Management */}
          <TabsContent value="changes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Change Control Management</h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Change Request
              </Button>
            </div>

            <div className="grid gap-4">
              {changeRequests.map((change) => (
                <Card key={change.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{change.id}: {change.title}</h4>
                          <Badge variant={change.type === "emergency" ? "destructive" : change.type === "urgent" ? "warning" : "default"}>
                            {change.type}
                          </Badge>
                          <Badge variant={getStatusColor(change.status) as any}>
                            {change.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Submitter: {change.submitter}</span>
                          {change.approver && <span>Approver: {change.approver}</span>}
                          <span>Target: {change.targetSystem}</span>
                          <Badge variant="outline" className="text-xs">
                            {change.category.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={change.impact === "High" ? "destructive" : change.impact === "Medium" ? "warning" : "secondary"}>
                            {change.impact} Impact
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Scheduled: {new Date(change.scheduledDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Custom Code Management */}
          <TabsContent value="code" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Custom Code Management</h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Register Custom Object
              </Button>
            </div>

            <div className="grid gap-4">
              {customCode.map((code) => (
                <Card key={code.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          <h4 className="font-medium">{code.name}</h4>
                          <Badge variant="outline">{code.type}</Badge>
                          <Badge variant={getStatusColor(code.status) as any}>
                            {code.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Developer: {code.developer}</span>
                          <span>System: {code.system}</span>
                          <span>Modified: {new Date(code.lastModified).toLocaleDateString()}</span>
                          <Badge variant={code.complexity === "High" ? "destructive" : code.complexity === "Medium" ? "warning" : "secondary"}>
                            {code.complexity} Complexity
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <Progress value={code.codeQuality} className="w-16 h-2 mb-1" />
                          <p className="text-xs">Quality: {code.codeQuality}%</p>
                        </div>
                        <div>
                          <Progress value={code.testCoverage} className="w-16 h-2 mb-1" />
                          <p className="text-xs">Coverage: {code.testCoverage}%</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-destructive">{code.issues.length}</p>
                          <p className="text-xs text-muted-foreground">Issues</p>
                        </div>
                      </div>
                    </div>
                    {code.issues.length > 0 && (
                      <Alert className="mt-3">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          Issues: {code.issues.join(", ")}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Job Scheduling Management */}
          <TabsContent value="jobs" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Job Scheduling Management</h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Schedule New Job
              </Button>
            </div>

            <div className="grid gap-4">
              {jobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(job.status)}
                          <div>
                            <h4 className="font-medium">{job.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {job.system} • {job.type} • {job.frequency}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-sm font-medium">{job.successRate}%</p>
                          <p className="text-xs text-muted-foreground">Success Rate</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{job.duration}min</p>
                          <p className="text-xs text-muted-foreground">Duration</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(job.nextRun).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Next Run</p>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Play className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Pause className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    {job.dependencies.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <Label className="text-sm text-muted-foreground">Dependencies</Label>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {job.dependencies.map(dep => (
                            <Badge key={dep} variant="outline" className="text-xs">
                              {dep}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Landscape Management */}
          <TabsContent value="landscape" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">SAP Landscape Management</h3>
              <Button className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Landscape
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>System Landscape Overview</CardTitle>
                <CardDescription>Current SAP system landscape topology and connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-8">
                  {/* Development */}
                  <div className="text-center">
                    <div className="bg-blue-50 dark:bg-blue-950 p-6 rounded-lg border-2 border-blue-200 dark:border-blue-800">
                      <Database className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-medium mb-2">Development</h4>
                      <div className="space-y-2 text-sm">
                        {systems.filter(s => s.environment === "DEV").map(system => (
                          <div key={system.id} className="flex items-center justify-between">
                            <span>{system.systemId}</span>
                            {getStatusIcon(system.status)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quality Assurance */}
                  <div className="text-center">
                    <div className="bg-yellow-50 dark:bg-yellow-950 p-6 rounded-lg border-2 border-yellow-200 dark:border-yellow-800">
                      <TestTube className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                      <h4 className="font-medium mb-2">Quality Assurance</h4>
                      <div className="space-y-2 text-sm">
                        {systems.filter(s => s.environment === "QAS").map(system => (
                          <div key={system.id} className="flex items-center justify-between">
                            <span>{system.systemId}</span>
                            {getStatusIcon(system.status)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Production */}
                  <div className="text-center">
                    <div className="bg-red-50 dark:bg-red-950 p-6 rounded-lg border-2 border-red-200 dark:border-red-800">
                      <Shield className="h-8 w-8 mx-auto mb-2 text-red-600" />
                      <h4 className="font-medium mb-2">Production</h4>
                      <div className="space-y-2 text-sm">
                        {systems.filter(s => s.environment === "PRD").map(system => (
                          <div key={system.id} className="flex items-center justify-between">
                            <span>{system.systemId}</span>
                            {getStatusIcon(system.status)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Transport Routes */}
                <div className="mt-8">
                  <h4 className="font-medium mb-4">Transport Routes</h4>
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mx-auto mb-1"></div>
                      <span className="text-xs">DEV</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <div className="text-center">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mx-auto mb-1"></div>
                      <span className="text-xs">QAS</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    <div className="text-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full mx-auto mb-1"></div>
                      <span className="text-xs">PRD</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Test Suite */}
          <TabsContent value="tests" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Test Suite Management</h3>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Run All Tests
                </Button>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Test Case
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {testCases.map((test) => (
                <Card key={test.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.status)}
                          <div>
                            <h4 className="font-medium">{test.name}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Module: {test.module}</span>
                              <Badge variant="outline" className="text-xs">{test.type}</Badge>
                              <span>Environment: {test.environment}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-sm font-medium">{test.duration}s</p>
                          <p className="text-xs text-muted-foreground">Duration</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{test.coverage}%</p>
                          <p className="text-xs text-muted-foreground">Coverage</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-destructive">{test.defects}</p>
                          <p className="text-xs text-muted-foreground">Defects</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            {new Date(test.lastRun).toLocaleTimeString()}
                          </p>
                          <p className="text-xs text-muted-foreground">Last Run</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Test Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Test Execution Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">
                      {testCases.filter(t => t.status === "passed").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Passed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-destructive">
                      {testCases.filter(t => t.status === "failed").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">
                      {testCases.filter(t => t.status === "pending").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-muted-foreground">
                      {testCases.filter(t => t.status === "skipped").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Skipped</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Process Monitoring */}
          <TabsContent value="monitoring" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Business Process Monitoring</h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Monitor
              </Button>
            </div>

            <div className="grid gap-4">
              {businessProcesses.map((process) => (
                <Card key={process.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(process.status)}
                          <div>
                            <h4 className="font-medium">{process.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              Monitoring: Real-time KPI tracking
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm font-medium">{process.successRate}%</p>
                          <p className="text-xs text-muted-foreground">Success Rate</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{process.avgExecutionTime}min</p>
                          <p className="text-xs text-muted-foreground">Avg Time</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{process.issues}</p>
                          <p className="text-xs text-muted-foreground">Alerts</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Business Process Operations */}
          <TabsContent value="operations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Business Process Operations</h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Operational Task
              </Button>
            </div>

            <Alert className="mb-4">
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                Business Process Operations focuses on operational execution, performance optimization, and real-time process management.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              {businessProcesses.map((process) => (
                <Card key={`ops-${process.id}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Play className="h-4 w-4 text-success" />
                          <h4 className="font-medium">{process.name} - Operations</h4>
                          <Badge variant={process.status === "running" ? "default" : "secondary"}>
                            {process.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Operational Excellence: {process.successRate}%</span>
                          <span>Process Owner: {process.owner}</span>
                          <span>SLA Compliance: High</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* IT Service Management */}
          <TabsContent value="itsm" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">IT Service Management</h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Service Request
              </Button>
            </div>

            <Alert className="mb-4">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                IT Service Management provides comprehensive service delivery, incident management, and customer support capabilities integrated with Resolv.ai ticketing system.
              </AlertDescription>
            </Alert>

            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Service Catalog
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span>Access Management</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span>Hardware Provisioning</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span>Software Installation</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 border rounded">
                      <span>System Configuration</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    SLA Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Response Time</span>
                        <span>98.5%</span>
                      </div>
                      <Progress value={98.5} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Resolution Time</span>
                        <span>94.2%</span>
                      </div>
                      <Progress value={94.2} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Customer Satisfaction</span>
                        <span>96.8%</span>
                      </div>
                      <Progress value={96.8} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Maintenance Planner */}
          <TabsContent value="maintenance" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Maintenance Planner</h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Schedule Maintenance
              </Button>
            </div>

            <Alert className="mb-4">
              <Settings className="h-4 w-4" />
              <AlertDescription>
                Maintenance Planner provides comprehensive planning, scheduling, and execution of system maintenance activities across the SAP landscape.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Scheduled Maintenance Windows</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h4 className="font-medium">Monthly Patch Deployment</h4>
                        <p className="text-sm text-muted-foreground">December 28, 2024 • 02:00 - 06:00</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="warning">Scheduled</Badge>
                        <Button variant="outline" size="sm">Details</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h4 className="font-medium">Database Optimization</h4>
                        <p className="text-sm text-muted-foreground">January 15, 2025 • 01:00 - 04:00</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Planned</Badge>
                        <Button variant="outline" size="sm">Details</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded">
                      <div>
                        <h4 className="font-medium">Security Updates</h4>
                        <p className="text-sm text-muted-foreground">January 5, 2025 • 03:00 - 05:00</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Planned</Badge>
                        <Button variant="outline" size="sm">Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-success">98.5%</h4>
                      <p className="text-sm text-muted-foreground">Maintenance Success Rate</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-info">4.2h</h4>
                      <p className="text-sm text-muted-foreground">Avg Maintenance Window</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <h4 className="text-2xl font-bold text-warning">3</h4>
                      <p className="text-sm text-muted-foreground">Upcoming This Month</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Process Management */}
          <TabsContent value="process-mgmt" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Process Management</h3>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Define Process
              </Button>
            </div>

            <Alert className="mb-4">
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                Process Management provides governance, optimization, and standardization of business processes across the entire SAP landscape.
              </AlertDescription>
            </Alert>

            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Process Governance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-3">Process Categories</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Financial Processes</span>
                          <Badge variant="default">12 Active</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Supply Chain</span>
                          <Badge variant="default">8 Active</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Human Resources</span>
                          <Badge variant="default">6 Active</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Customer Management</span>
                          <Badge variant="default">9 Active</Badge>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Process Maturity</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Standardization</span>
                            <span>87%</span>
                          </div>
                          <Progress value={87} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Automation</span>
                            <span>73%</span>
                          </div>
                          <Progress value={73} />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Optimization</span>
                            <span>91%</span>
                          </div>
                          <Progress value={91} />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}