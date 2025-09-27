import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Shield, 
  Wifi, 
  Globe, 
  Router,
  Activity,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Signal
} from 'lucide-react';

interface NetworkMonitoringProps {
  onLogout: () => void;
}

export function NetworkMonitoring({ onLogout }: NetworkMonitoringProps) {
  const navigate = useNavigate();

  const networkInterfaces = [
    {
      name: 'Primary Gateway',
      ip: '192.168.1.1',
      status: 'healthy',
      bandwidth: 85,
      latency: '12ms',
      packetLoss: '0.1%',
      throughput: '847 Mbps'
    },
    {
      name: 'Secondary Gateway',
      ip: '192.168.1.2',
      status: 'healthy',
      bandwidth: 42,
      latency: '18ms',
      packetLoss: '0.0%',
      throughput: '423 Mbps'
    },
    {
      name: 'VPN Tunnel',
      ip: '10.0.0.1',
      status: 'warning',
      bandwidth: 78,
      latency: '45ms',
      packetLoss: '2.3%',
      throughput: '156 Mbps'
    },
    {
      name: 'DMZ Interface',
      ip: '203.0.113.1',
      status: 'healthy',
      bandwidth: 23,
      latency: '8ms',
      packetLoss: '0.0%',
      throughput: '234 Mbps'
    }
  ];

  const endpoints = [
    { name: 'DNS Server 1', ip: '8.8.8.8', status: 'healthy', responseTime: '12ms' },
    { name: 'DNS Server 2', ip: '8.8.4.4', status: 'healthy', responseTime: '15ms' },
    { name: 'External API', ip: '203.0.113.50', status: 'healthy', responseTime: '89ms' },
    { name: 'CDN Provider', ip: '151.101.1.140', status: 'healthy', responseTime: '34ms' },
    { name: 'Backup Site', ip: '198.51.100.1', status: 'warning', responseTime: '234ms' }
  ];

  const trafficData = [
    { time: '00:00', inbound: 234, outbound: 156 },
    { time: '04:00', inbound: 189, outbound: 134 },
    { time: '08:00', inbound: 567, outbound: 389 },
    { time: '12:00', inbound: 834, outbound: 567 },
    { time: '16:00', inbound: 923, outbound: 612 },
    { time: '20:00', inbound: 678, outbound: 445 }
  ];

  const securityEvents = [
    {
      timestamp: '14:23:45',
      type: 'Blocked IP',
      description: 'Suspicious activity from 198.51.100.123',
      severity: 'medium'
    },
    {
      timestamp: '13:45:12',
      type: 'Port Scan',
      description: 'Port scan detected from external source',
      severity: 'high'
    },
    {
      timestamp: '12:34:56',
      type: 'DDoS Mitigation',
      description: 'Automated DDoS protection activated',
      severity: 'high'
    }
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

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertCircle;
      case 'critical': return AlertCircle;
      default: return Activity;
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
            <h1 className="text-lg font-semibold">Network Monitoring</h1>
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
                  <p className="text-sm text-gray-600">Total Bandwidth</p>
                  <p className="text-2xl font-bold">1.6 Gbps</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Avg Latency</p>
                  <p className="text-2xl font-bold">21ms</p>
                </div>
                <Activity className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Packet Loss</p>
                  <p className="text-2xl font-bold">0.1%</p>
                </div>
                <Signal className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Security Events</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <AlertCircle className="w-8 h-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Network Interfaces */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Router className="w-5 h-5" />
              Network Interfaces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {networkInterfaces.map((interface_, index) => {
                const StatusIcon = getStatusIcon(interface_.status);
                return (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`w-5 h-5 ${getStatusColor(interface_.status)}`} />
                        <div>
                          <h3 className="font-medium">{interface_.name}</h3>
                          <p className="text-sm text-gray-600">{interface_.ip}</p>
                        </div>
                      </div>
                      <Badge className={getStatusBadge(interface_.status)}>
                        {interface_.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Bandwidth Usage</p>
                        <div className="mt-1">
                          <Progress value={interface_.bandwidth} className="h-2" />
                          <p className="text-sm mt-1">{interface_.bandwidth}%</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Latency</p>
                        <p className="text-lg font-semibold">{interface_.latency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Packet Loss</p>
                        <p className="text-lg font-semibold">{interface_.packetLoss}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Throughput</p>
                        <p className="text-lg font-semibold">{interface_.throughput}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Endpoint Monitoring */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Endpoint Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {endpoints.map((endpoint, index) => {
                  const StatusIcon = getStatusIcon(endpoint.status);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <StatusIcon className={`w-4 h-4 ${getStatusColor(endpoint.status)}`} />
                        <div>
                          <h4 className="font-medium text-sm">{endpoint.name}</h4>
                          <p className="text-xs text-gray-600">{endpoint.ip}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={`text-xs ${getStatusBadge(endpoint.status)}`}>
                          {endpoint.status}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-1">{endpoint.responseTime}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Security Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityEvents.map((event, index) => (
                  <div key={index} className="border-l-4 border-amber-400 bg-amber-50 p-3 rounded-r-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{event.type}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${getSeverityBadge(event.severity)}`}>
                          {event.severity}
                        </Badge>
                        <span className="text-xs text-gray-600">{event.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{event.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Traffic Overview (Last 24 Hours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              {trafficData.map((data, index) => (
                <div key={index} className="text-center p-3 border rounded-lg">
                  <p className="text-xs text-gray-600 mb-2">{data.time}</p>
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-1">
                      <TrendingUp className="w-3 h-3 text-green-600" />
                      <span className="text-sm font-medium">{data.inbound}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1">
                      <TrendingDown className="w-3 h-3 text-blue-600" />
                      <span className="text-sm font-medium">{data.outbound}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 mt-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-sm">Inbound (Mbps)</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Outbound (Mbps)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}