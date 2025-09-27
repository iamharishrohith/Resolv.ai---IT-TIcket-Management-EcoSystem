import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Shield, 
  Bell, 
  Settings, 
  LogOut, 
  Users, 
  BarChart3, 
  UserCog, 
  GitBranch,
  MessageSquare,
  Plus,
  Database,
  Network,
  ArrowLeft
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';

interface AppHeaderProps {
  onLogout: () => void;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
  backTo?: string;
  actions?: React.ReactNode;
}

export function AppHeader({ 
  onLogout, 
  title, 
  subtitle, 
  showBackButton = false, 
  backTo,
  actions 
}: AppHeaderProps) {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getDefaultTitle = () => {
    if (user?.isAdmin) return 'Resolv.ai Admin';
    return 'Resolv.ai';
  };

  const getDefaultSubtitle = () => {
    return `Welcome back, ${user?.name}`;
  };

  const handleBackClick = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(user?.isAdmin ? '/admin' : '/dashboard');
    }
  };

  return (
    <header className="bg-card/95 backdrop-blur-sm border-b border-border px-4 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Back Button */}
          {showBackButton && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBackClick}
              className="hover:bg-accent/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}

          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-info rounded-xl flex items-center justify-center shadow-md">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                {title || getDefaultTitle()}
              </h1>
              <p className="text-sm text-muted-foreground">
                {subtitle || getDefaultSubtitle()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Quick Navigation for Admin */}
          {user?.isAdmin && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/users')}
                className="hover:bg-accent/50 border-border/50"
              >
                <Users className="w-4 h-4 mr-2" />
                Users
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/roles')}
                className="hover:bg-accent/50 border-border/50"
              >
                <UserCog className="w-4 h-4 mr-2" />
                Roles
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin/hierarchy')}
                className="hover:bg-accent/50 border-border/50"
              >
                <GitBranch className="w-4 h-4 mr-2" />
                Hierarchy
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/tickets')}
                className="hover:bg-accent/50 border-border/50"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Tickets
              </Button>
            </div>
          )}

          {/* Quick Actions for Employees */}
          {!user?.isAdmin && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/chat')}
                className="hover:bg-accent/50 border-border/50"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Chat
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/create-ticket')}
                className="hover:bg-accent/50 border-border/50"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Ticket
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/tickets')}
                className="hover:bg-accent/50 border-border/50"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Tickets
              </Button>
              {user?.role === 'solutions_architect' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/infrastructure')}
                    className="hover:bg-accent/50 border-border/50"
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Infrastructure
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/network')}
                    className="hover:bg-accent/50 border-border/50"
                  >
                    <Network className="w-4 h-4 mr-2" />
                    Network
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Custom Actions */}
          {actions}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-accent/50 relative">
                <Bell className="w-4 h-4" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-destructive text-destructive-foreground text-xs">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4 border-b border-border">
                <h4 className="font-medium">Notifications</h4>
                <p className="text-sm text-muted-foreground">You have 3 new notifications</p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                <DropdownMenuItem className="p-4 hover:bg-accent/50">
                  <div className="space-y-1">
                    <p className="text-sm">Battery replacement scheduled</p>
                    <p className="text-xs text-muted-foreground">Your laptop battery will be replaced tomorrow at 2 PM</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-4 hover:bg-accent/50">
                  <div className="space-y-1">
                    <p className="text-sm">Database access approved</p>
                    <p className="text-xs text-muted-foreground">Your request for analytics database access has been approved</p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-4 hover:bg-accent/50">
                  <div className="space-y-1">
                    <p className="text-sm">Security update available</p>
                    <p className="text-xs text-muted-foreground">Docker Desktop security update is ready for installation</p>
                  </div>
                </DropdownMenuItem>
              </div>
              <div className="p-2 border-t border-border">
                <Button variant="ghost" size="sm" className="w-full justify-center">
                  View All Notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-accent/50 p-1">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {user?.name ? getInitials(user.name) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <div className="p-4 border-b border-border">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user?.name ? getInitials(user.name) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <Badge variant="outline" className="text-xs">
                      {user?.role?.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
              <DropdownMenuItem className="hover:bg-accent/50">
                <Settings className="w-4 h-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-accent/50">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="hover:bg-accent/50 text-destructive focus:text-destructive"
                onClick={onLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}