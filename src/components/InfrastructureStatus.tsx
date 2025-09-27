import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Shield, 
  Server, 
  Database, 
  Cloud, 
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Cpu,
  HardDrive,
  MemoryStick
} from 'lucide-react';

interface InfrastructureStatusProps {
  onLogout: () => void;
}

export function InfrastructureStatus({ onLogout }: InfrastructureStatusProps) {
  const navigate = useNavigate();

  const servers = [
    {
      id: 'web-01',
      name: 'Web Server 01',
      status: 'healthy',
      cpu: 23,
      memory: 67,
      disk: 45,
      uptime: '15 days',
      region: 'US-East'
    },
    {
      id: 'web-02',
      name: 'Web Server 02',
      status: 'healthy',
      cpu: 18,
      memory: 52,
      disk: 38,
      uptime: '12 days',
      region: 'US-West'
    },
    {
      id: 'db-01',
      name: 'Database Primary',
      status: 'warning',
      cpu: 78,
      memory: 89,
      disk: 67,
      uptime: '23 days',
      region: 'US-East'
    },
    {
      id: 'cache-01',
      name: 'Redis Cache',
      status: 'healthy',
      cpu: 12,
      memory: 34,
      disk: 23,
      uptime: '8 days',
      region: 'US-East'
    }
  ];

  const services = [
    { name: 'API Gateway', status: 'healthy', responseTime: '142ms', uptime: '99.9%' },
    { name: 'Authentication Service', status: 'healthy', responseTime: '67ms', uptime: '99.8%' },
    { name: 'Database Service', status: 'warning', responseTime: '340ms', uptime: '99.2%' },
    { name: 'File Storage', status: 'healthy', responseTime: '89ms', uptime: '99.9%' },
    { name: 'Email Service', status: 'healthy', responseTime: '234ms', uptime: '99.7%' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600';
      case 'warning': return 'text-amber-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'critical': return AlertCircle;
      default: return Clock;
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
            <h1 className="text-lg font-semibold">Infrastructure Status</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Servers</p>
                  <p className="text-2xl font-bold">4</p>
                </div>
                <Server className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Services</p>
                  <p className="text-2xl font-bold">5</p>
                </div>
                <Cloud className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Response</p>
                  <p className="text-2xl font-bold">174ms</p>
                </div>
                <Activity className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Uptime</p>
                  <p className="text-2xl font-bold">99.7%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Servers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="w-5 h-5" />
              Server Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {servers.map((server) => {
                const StatusIcon = getStatusIcon(server.status);
                return (
                  <div key={server.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`w-5 h-5 ${getStatusColor(server.status)}`} />
                        <div>
                          <h3 className="font-medium">{server.name}</h3>
                          <p className="text-sm text-gray-600">{server.region} • Uptime: {server.uptime}</p>
                        </div>
                      </div>
                      <Badge className={getStatusBadge(server.status)}>
                        {server.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <Cpu className="w-4 h-4" />
                            CPU
                          </span>
                          <span>{server.cpu}%</span>
                        </div>
                        <Progress value={server.cpu} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <MemoryStick className="w-4 h-4" />
                            Memory
                          </span>
                          <span>{server.memory}%</span>
                        </div>
                        <Progress value={server.memory} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-1">
                            <HardDrive className="w-4 h-4" />
                            Disk
                          </span>
                          <span>{server.disk}%</span>
                        </div>
                        <Progress value={server.disk} className="h-2" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Services */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Service Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {services.map((service, index) => {
                const StatusIcon = getStatusIcon(service.status);
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`w-5 h-5 ${getStatusColor(service.status)}`} />
                      <div>
                        <h4 className="font-medium">{service.name}</h4>
                        <p className="text-sm text-gray-600">Response: {service.responseTime}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusBadge(service.status)}>
                        {service.status}
                      </Badge>
                      <p className="text-sm text-gray-600 mt-1">Uptime: {service.uptime}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}