import React, { useState, useEffect } from "react";
import { 
  Link, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Settings, 
  Database, 
  ArrowUpDown, 
  Activity, 
  Zap, 
  Globe,
  Shield,
  Key,
  Calendar,
  BarChart3,
  Download,
  Upload,
  FileText,
  Server
} from "lucide-react";
import { AppHeader } from "./AppHeader";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { useAppContext } from "../App";

interface ExternalConnector {
  id: string;
  name: string;
  type: "glpi" | "solman" | "servicenow" | "jira" | "freshdesk" | "custom";
  description: string;
  status: "connected" | "disconnected" | "error" | "syncing";
  endpoint: string;
  authentication: {
    type: "apikey" | "oauth" | "basic" | "token";
    configured: boolean;
  };
  syncSettings: {
    enabled: boolean;
    frequency: "realtime" | "5min" | "15min" | "hourly" | "daily";
    direction: "bidirectional" | "import" | "export";
    lastSync: string | null;
    nextSync: string | null;
  };
  mapping: {
    ticketFields: { [key: string]: string };
    priorityMapping: { [key: string]: string };
    statusMapping: { [key: string]: string };
  };
  statistics: {
    totalSynced: number;
    successRate: number;
    lastSyncDuration: number;
    errors: number;
    lastError?: string;
  };
}

interface SyncOperation {
  id: string;
  connectorId: string;
  operation: "import" | "export" | "sync";
  status: "running" | "completed" | "failed" | "queued";
  startTime: string;
  endTime?: string;
  recordsProcessed: number;
  recordsTotal: number;
  errors: string[];
  details: {
    ticketsCreated?: number;
    ticketsUpdated?: number;
    ticketsFailed?: number;
  };
}

const mockConnectors: ExternalConnector[] = [
  {
    id: "conn001",
    name: "GLPI Production",
    type: "glpi",
    description: "Main GLPI instance for production tickets",
    status: "connected",
    endpoint: "https://glpi.resolv.ai/apirest.php",
    authentication: {
      type: "apikey",
      configured: true
    },
    syncSettings: {
      enabled: true,
      frequency: "15min",
      direction: "bidirectional",
      lastSync: "2024-12-15T10:45:00Z",
      nextSync: "2024-12-15T11:00:00Z"
    },
    mapping: {
      ticketFields: {
        "title": "name",
        "description": "content",
        "priority": "priority",
        "status": "status",
        "assignee": "users_id_assign"
      },
      priorityMapping: {
        "Low": "1",
        "Medium": "2", 
        "High": "3",
        "Critical": "4"
      },
      statusMapping: {
        "Open": "1",
        "In Progress": "2",
        "Resolved": "5",
        "Closed": "6"
      }
    },
    statistics: {
      totalSynced: 2340,
      successRate: 98.7,
      lastSyncDuration: 1250,
      errors: 3,
      lastError: null
    }
  },
  {
    id: "conn002", 
    name: "SAP Solution Manager",
    type: "solman",
    description: "SAP Solution Manager for enterprise ALM with full lifecycle management capabilities",
    status: "connected",
    endpoint: "https://solman.resolv.ai:8443/sap/bc/rest/",
    authentication: {
      type: "basic",
      configured: true
    },
    syncSettings: {
      enabled: true,
      frequency: "hourly",
      direction: "bidirectional",
      lastSync: "2024-12-15T10:00:00Z", 
      nextSync: "2024-12-15T11:00:00Z"
    },
    mapping: {
      ticketFields: {
        "title": "SHORT_DESCRIPTION",
        "description": "DESCRIPTION",
        "priority": "PRIORITY",
        "status": "STATUS",
        "component": "COMPONENT",
        "system_role": "SYSTEM_ROLE"
      },
      priorityMapping: {
        "Low": "4",
        "Medium": "3",
        "High": "2", 
        "Critical": "1"
      },
      statusMapping: {
        "Open": "E0001",
        "In Progress": "E0002",
        "Resolved": "E0004",
        "Closed": "E0005",
        "On Hold": "E0003"
      }
    },
    statistics: {
      totalSynced: 3890,
      successRate: 96.8,
      lastSyncDuration: 2800,
      errors: 8,
      lastError: null
    }
  },
  {
    id: "conn003",
    name: "ServiceNow Instance",
    type: "servicenow", 
    description: "ServiceNow for IT service management",
    status: "error",
    endpoint: "https://resolvai.service-now.com/api/now/table/incident",
    authentication: {
      type: "oauth",
      configured: false
    },
    syncSettings: {
      enabled: false,
      frequency: "realtime",
      direction: "bidirectional",
      lastSync: "2024-12-14T16:30:00Z",
      nextSync: null
    },
    mapping: {
      ticketFields: {
        "title": "short_description",
        "description": "description", 
        "priority": "priority",
        "status": "state"
      },
      priorityMapping: {
        "Low": "4",
        "Medium": "3",
        "High": "2",
        "Critical": "1"
      },
      statusMapping: {
        "Open": "1",
        "In Progress": "2",
        "Resolved": "6",
        "Closed": "7"
      }
    },
    statistics: {
      totalSynced: 567,
      successRate: 87.4,
      lastSyncDuration: 0,
      errors: 45,
      lastError: "OAuth token expired"
    }
  }
];

const mockSyncOperations: SyncOperation[] = [
  {
    id: "sync001",
    connectorId: "conn001",
    operation: "sync",
    status: "completed",
    startTime: "2024-12-15T10:45:00Z",
    endTime: "2024-12-15T10:46:15Z",
    recordsProcessed: 23,
    recordsTotal: 23,
    errors: [],
    details: {
      ticketsCreated: 5,
      ticketsUpdated: 18,
      ticketsFailed: 0
    }
  },
  {
    id: "sync002",
    connectorId: "conn002", 
    operation: "import",
    status: "completed",
    startTime: "2024-12-15T10:00:00Z",
    endTime: "2024-12-15T10:03:20Z",
    recordsProcessed: 45,
    recordsTotal: 45,
    errors: [],
    details: {
      ticketsCreated: 12,
      ticketsUpdated: 33,
      ticketsFailed: 0
    }
  },
  {
    id: "sync003",
    connectorId: "conn003",
    operation: "sync",
    status: "failed", 
    startTime: "2024-12-15T09:30:00Z",
    endTime: "2024-12-15T09:31:00Z",
    recordsProcessed: 0,
    recordsTotal: 34,
    errors: ["OAuth token expired", "Connection timeout"],
    details: {
      ticketsCreated: 0,
      ticketsUpdated: 0,
      ticketsFailed: 34
    }
  }
];

interface ExternalConnectorsProps {
  onLogout: () => void;
}

export function ExternalConnectors({ onLogout }: ExternalConnectorsProps) {
  const { user } = useAppContext();
  const [connectors, setConnectors] = useState(mockConnectors);
  const [syncOperations] = useState(mockSyncOperations);
  const [selectedConnector, setSelectedConnector] = useState<ExternalConnector | null>(null);
  const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "error":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "syncing":
        return <RefreshCw className="h-4 w-4 text-warning animate-spin" />;
      case "disconnected":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getConnectorIcon = (type: string) => {
    switch (type) {
      case "glpi":
        return <Database className="h-5 w-5" />;
      case "solman":
        return <Server className="h-5 w-5" />;
      case "servicenow":
        return <Globe className="h-5 w-5" />;
      case "jira":
        return <FileText className="h-5 w-5" />;
      case "freshdesk":
        return <Activity className="h-5 w-5" />;
      default:
        return <Link className="h-5 w-5" />;
    }
  };

  const triggerSync = async (connectorId: string) => {
    setIsSyncing(true);
    
    // Update connector status
    setConnectors(prev => prev.map(conn =>
      conn.id === connectorId 
        ? { ...conn, status: "syncing" as const }
        : conn
    ));

    // Simulate sync operation
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Update connector status and sync time
    setConnectors(prev => prev.map(conn =>
      conn.id === connectorId 
        ? { 
            ...conn, 
            status: "connected" as const,
            syncSettings: {
              ...conn.syncSettings,
              lastSync: new Date().toISOString()
            },
            statistics: {
              ...conn.statistics,
              totalSynced: conn.statistics.totalSynced + Math.floor(Math.random() * 20)
            }
          }
        : conn
    ));

    setIsSyncing(false);
  };

  const toggleConnector = (connectorId: string) => {
    setConnectors(prev => prev.map(conn =>
      conn.id === connectorId
        ? {
            ...conn,
            syncSettings: {
              ...conn.syncSettings,
              enabled: !conn.syncSettings.enabled
            }
          }
        : conn
    ));
  };

  const getOverallStats = () => {
    const totalSynced = connectors.reduce((sum, conn) => sum + conn.statistics.totalSynced, 0);
    const avgSuccessRate = connectors.reduce((sum, conn) => sum + conn.statistics.successRate, 0) / connectors.length;
    const activeConnectors = connectors.filter(conn => conn.status === "connected").length;
    const totalErrors = connectors.reduce((sum, conn) => sum + conn.statistics.errors, 0);

    return { totalSynced, avgSuccessRate, activeConnectors, totalErrors };
  };

  const stats = getOverallStats();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        user={user}
        onLogout={onLogout}
        title="External Connectors"
        subtitle="Manage integrations with GLPI, SAP Solution Manager, and other systems"
      />

      <div className="container mx-auto p-6 space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Connectors</p>
                  <p className="text-2xl font-bold">{stats.activeConnectors}</p>
                </div>
                <Link className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Synced</p>
                  <p className="text-2xl font-bold">{stats.totalSynced.toLocaleString()}</p>
                </div>
                <ArrowUpDown className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">{Math.round(stats.avgSuccessRate)}%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Errors</p>
                  <p className="text-2xl font-bold">{stats.totalErrors}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="connectors" className="space-y-4">
          <TabsList>
            <TabsTrigger value="connectors" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              Connectors
            </TabsTrigger>
            <TabsTrigger value="sync-history" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Sync History
            </TabsTrigger>
            <TabsTrigger value="mapping" className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Field Mapping
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connectors" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">External System Connectors</h3>
              <Button className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                Add Connector
              </Button>
            </div>

            <div className="grid gap-4">
              {connectors.map((connector) => (
                <Card key={connector.id} className={`transition-all ${connector.status === 'connected' ? 'border-success/50' : connector.status === 'error' ? 'border-destructive/50' : 'border-muted'}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getConnectorIcon(connector.type)}
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {connector.name}
                            {getStatusIcon(connector.status)}
                            <Badge variant={connector.status === 'connected' ? 'default' : connector.status === 'error' ? 'destructive' : 'secondary'}>
                              {connector.status}
                            </Badge>
                          </CardTitle>
                          <CardDescription>{connector.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={connector.syncSettings.enabled}
                          onCheckedChange={() => toggleConnector(connector.id)}
                          disabled={connector.status === 'error'}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => triggerSync(connector.id)}
                          disabled={isSyncing || connector.status === 'error'}
                        >
                          <RefreshCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
                        </Button>
                        <Dialog open={isConfigDialogOpen && selectedConnector?.id === connector.id} onOpenChange={setIsConfigDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedConnector(connector)}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Configure {connector.name}</DialogTitle>
                              <DialogDescription>
                                Manage connection settings and sync configuration
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="endpoint">Endpoint URL</Label>
                                <Input
                                  id="endpoint"
                                  value={connector.endpoint}
                                  placeholder="https://your-system.com/api"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor="auth-type">Authentication Type</Label>
                                  <Select value={connector.authentication.type}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="apikey">API Key</SelectItem>
                                      <SelectItem value="oauth">OAuth 2.0</SelectItem>
                                      <SelectItem value="basic">Basic Auth</SelectItem>
                                      <SelectItem value="token">Bearer Token</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor="sync-frequency">Sync Frequency</Label>
                                  <Select value={connector.syncSettings.frequency}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="realtime">Real-time</SelectItem>
                                      <SelectItem value="5min">Every 5 minutes</SelectItem>
                                      <SelectItem value="15min">Every 15 minutes</SelectItem>
                                      <SelectItem value="hourly">Hourly</SelectItem>
                                      <SelectItem value="daily">Daily</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="sync-direction">Sync Direction</Label>
                                <Select value={connector.syncSettings.direction}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="bidirectional">Bidirectional</SelectItem>
                                    <SelectItem value="import">Import Only</SelectItem>
                                    <SelectItem value="export">Export Only</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" onClick={() => setIsConfigDialogOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={() => setIsConfigDialogOpen(false)}>
                                  Save Configuration
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Sync Settings</Label>
                        <div className="mt-1 space-y-1">
                          <div className="text-sm">
                            <Badge variant="outline" className="text-xs">{connector.syncSettings.frequency}</Badge>
                            <Badge variant="outline" className="text-xs ml-1">{connector.syncSettings.direction}</Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Last: {connector.syncSettings.lastSync ? new Date(connector.syncSettings.lastSync).toLocaleString() : "Never"}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Authentication</Label>
                        <div className="mt-1 flex items-center gap-2">
                          <Badge variant={connector.authentication.configured ? "default" : "destructive"} className="text-xs">
                            {connector.authentication.type.toUpperCase()}
                          </Badge>
                          {connector.authentication.configured ? (
                            <CheckCircle className="h-3 w-3 text-success" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 text-destructive" />
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Statistics</Label>
                        <div className="mt-1 space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">{connector.statistics.totalSynced.toLocaleString()}</span>
                            <span className="text-muted-foreground ml-1">synced</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={connector.statistics.successRate} className="flex-1 h-1" />
                            <span className="text-xs">{connector.statistics.successRate}%</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Performance</Label>
                        <div className="mt-1 space-y-1">
                          <div className="text-sm">
                            <span className="font-medium">{connector.statistics.lastSyncDuration}ms</span>
                            <span className="text-muted-foreground ml-1">last sync</span>
                          </div>
                          {connector.statistics.errors > 0 && (
                            <div className="text-xs text-destructive">
                              {connector.statistics.errors} errors
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {connector.status === 'error' && connector.statistics.lastError && (
                      <Alert className="mt-4">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Error:</strong> {connector.statistics.lastError}
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sync-history" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Synchronization History</h3>
              <Select defaultValue="all">
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Connectors</SelectItem>
                  {connectors.map(conn => (
                    <SelectItem key={conn.id} value={conn.id}>{conn.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {syncOperations.map((operation) => {
                const connector = connectors.find(c => c.id === operation.connectorId);
                return (
                  <Card key={operation.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {connector && getConnectorIcon(connector.type)}
                          <div>
                            <h4 className="font-medium flex items-center gap-2">
                              {connector?.name} - {operation.operation}
                              <Badge variant={
                                operation.status === 'completed' ? 'default' :
                                operation.status === 'failed' ? 'destructive' :
                                operation.status === 'running' ? 'secondary' : 'outline'
                              }>
                                {operation.status}
                              </Badge>
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {operation.recordsProcessed}/{operation.recordsTotal} records processed
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                              <span>Started: {new Date(operation.startTime).toLocaleString()}</span>
                              {operation.endTime && (
                                <span>Completed: {new Date(operation.endTime).toLocaleString()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Progress 
                            value={(operation.recordsProcessed / operation.recordsTotal) * 100} 
                            className="w-32 h-2 mb-2" 
                          />
                          {operation.details && (
                            <div className="text-xs text-muted-foreground space-y-1">
                              {operation.details.ticketsCreated !== undefined && (
                                <div className="flex items-center gap-1">
                                  <Upload className="h-3 w-3" />
                                  {operation.details.ticketsCreated} created
                                </div>
                              )}
                              {operation.details.ticketsUpdated !== undefined && (
                                <div className="flex items-center gap-1">
                                  <RefreshCw className="h-3 w-3" />
                                  {operation.details.ticketsUpdated} updated
                                </div>
                              )}
                              {operation.details.ticketsFailed !== undefined && operation.details.ticketsFailed > 0 && (
                                <div className="flex items-center gap-1 text-destructive">
                                  <AlertTriangle className="h-3 w-3" />
                                  {operation.details.ticketsFailed} failed
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      {operation.errors.length > 0 && (
                        <Alert className="mt-3">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Errors:</strong> {operation.errors.join(", ")}
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="mapping" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Field Mapping Configuration</h3>
              <Select 
                value={selectedConnector?.id || ""}
                onValueChange={(value) => setSelectedConnector(connectors.find(c => c.id === value) || null)}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select connector" />
                </SelectTrigger>
                <SelectContent>
                  {connectors.map(conn => (
                    <SelectItem key={conn.id} value={conn.id}>{conn.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedConnector && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ticket Field Mapping</CardTitle>
                    <CardDescription>
                      Map Resolv.ai fields to {selectedConnector.name} fields
                      {selectedConnector.type === "solman" && (
                        <span className="block mt-1 text-xs text-info">
                          ✨ SAP Solution Manager supports extended ALM fields for comprehensive Application Lifecycle Management
                        </span>
                      )}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {Object.entries(selectedConnector.mapping.ticketFields).map(([resolvField, externalField]) => (
                        <div key={resolvField} className="grid grid-cols-2 gap-4 items-center">
                          <div>
                            <Label className="text-sm font-medium">{resolvField}</Label>
                            <p className="text-xs text-muted-foreground">
                              Resolv.ai field
                              {selectedConnector.type === "solman" && (resolvField === "component" || resolvField === "system_role") && (
                                <span className="block text-info">SAP ALM Extension</span>
                              )}
                            </p>
                          </div>
                          <div>
                            <Input value={externalField} placeholder="External system field" />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {selectedConnector.type === "solman" && (
                      <Alert className="mt-4">
                        <Database className="h-4 w-4" />
                        <AlertDescription>
                          <strong>SAP Solution Manager ALM Integration:</strong> This connector provides full Application Lifecycle Management including:
                          <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                            <li>Application Operations monitoring</li>
                            <li>Business Process Monitoring & Operations</li>
                            <li>Change Control Management</li>
                            <li>Custom Code Management</li>
                            <li>Job Scheduling Management</li>
                            <li>Landscape Management</li>
                            <li>Process Management</li>
                            <li>Test Suite management</li>
                          </ul>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto mt-2" 
                            onClick={() => window.open('/sap-solution-manager', '_blank')}
                          >
                            → Open SAP Solution Manager Console
                          </Button>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Priority Mapping</CardTitle>
                    <CardDescription>
                      Map priority values between systems
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {Object.entries(selectedConnector.mapping.priorityMapping).map(([resolvPriority, externalPriority]) => (
                        <div key={resolvPriority} className="grid grid-cols-2 gap-4 items-center">
                          <div>
                            <Badge variant="outline">{resolvPriority}</Badge>
                          </div>
                          <div>
                            <Input value={externalPriority} placeholder="External priority value" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Status Mapping</CardTitle>
                    <CardDescription>
                      Map status values between systems
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {Object.entries(selectedConnector.mapping.statusMapping).map(([resolvStatus, externalStatus]) => (
                        <div key={resolvStatus} className="grid grid-cols-2 gap-4 items-center">
                          <div>
                            <Badge variant="outline">{resolvStatus}</Badge>
                          </div>
                          <div>
                            <Input value={externalStatus} placeholder="External status value" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Button>Save Mapping Configuration</Button>
                </div>
              </div>
            )}

            {!selectedConnector && (
              <Card>
                <CardContent className="p-8 text-center">
                  <ArrowUpDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Select a Connector</h3>
                  <p className="text-muted-foreground">
                    Choose a connector from the dropdown to configure field mapping
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}