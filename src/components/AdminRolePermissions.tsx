import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  MessageSquare,
  Lock,
  Settings,
  AlertTriangle,
  HardDrive,
  Shield,
  Plus,
  Trash2,
  Copy,
  Save,
  Users
} from 'lucide-react';

interface AdminRolePermissionsProps {
  onLogout: () => void;
}

export function AdminRolePermissions({ onLogout }: AdminRolePermissionsProps) {
  const { roles, setRoles, permissions } = useAppContext();
  const navigate = useNavigate();
  
  const [selectedRole, setSelectedRole] = useState(roles[0]?.id || '');
  const [hasChanges, setHasChanges] = useState(false);
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  
  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  });

  const currentRole = roles.find(r => r.id === selectedRole);

  const togglePermission = (permissionId: string) => {
    if (!currentRole) return;

    const updatedRoles = roles.map(role => {
      if (role.id === selectedRole) {
        const newPermissions = role.permissions.includes(permissionId)
          ? role.permissions.filter(p => p !== permissionId)
          : [...role.permissions, permissionId];
        
        return { ...role, permissions: newPermissions };
      }
      return role;
    });

    setRoles(updatedRoles);
    setHasChanges(true);
  };

  const saveChanges = () => {
    // In a real app, this would save to the backend
    setHasChanges(false);
  };

  const handleCreateRole = () => {
    if (!newRole.name.trim()) return;

    const roleId = newRole.name.toLowerCase().replace(/\s+/g, '_');
    const role = {
      id: roleId,
      name: newRole.name,
      description: newRole.description,
      permissions: newRole.permissions,
      isCustom: true
    };

    setRoles([...roles, role]);
    setSelectedRole(roleId);
    setNewRole({ name: '', description: '', permissions: [] });
    setIsCreateRoleOpen(false);
    setHasChanges(true);
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role?.isCustom) return; // Can't delete system roles

    const updatedRoles = roles.filter(r => r.id !== roleId);
    setRoles(updatedRoles);
    if (selectedRole === roleId) {
      setSelectedRole(updatedRoles[0]?.id || '');
    }
    setHasChanges(true);
  };

  const handleDuplicateRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    const duplicatedRole = {
      id: `${role.id}_copy_${Date.now()}`,
      name: `${role.name} (Copy)`,
      description: role.description,
      permissions: [...role.permissions],
      isCustom: true
    };

    setRoles([...roles, duplicatedRole]);
    setSelectedRole(duplicatedRole.id);
    setHasChanges(true);
  };

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = [];
    }
    acc[permission.category].push(permission);
    return acc;
  }, {} as Record<string, typeof permissions>);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Tickets': return MessageSquare;
      case 'Access': return Lock;
      case 'System': return Settings;
      case 'AI': return AlertTriangle;
      case 'Hardware': return HardDrive;
      case 'Admin': return Shield;
      default: return Settings;
    }
  };

  const getUserCount = (roleId: string) => {
    // This would come from the users context in a real app
    const userCounts: Record<string, number> = {
      'junior_developer': 12,
      'senior_developer': 18,
      'solutions_architect': 6,
      'it_admin': 3
    };
    return userCounts[roleId] || 0;
  };

  const headerActions = (
    <div className="flex items-center space-x-2">
      <Dialog open={isCreateRoleOpen} onOpenChange={setIsCreateRoleOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create Role
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Role</DialogTitle>
            <DialogDescription>
              Define a new role with custom permissions
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Role Name</Label>
              <Input
                placeholder="e.g. DevOps Engineer"
                value={newRole.name}
                onChange={(e) => setNewRole({ ...newRole, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe the role's responsibilities..."
                value={newRole.description}
                onChange={(e) => setNewRole({ ...newRole, description: e.target.value })}
              />
            </div>
            <div className="space-y-3">
              <Label>Permissions</Label>
              {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => {
                const Icon = getCategoryIcon(category);
                return (
                  <div key={category} className="border border-border rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-4 h-4" />
                      <span className="text-sm">{category}</span>
                    </div>
                    <div className="space-y-2">
                      {categoryPermissions.map((permission) => (
                        <div key={permission.id} className="flex items-center justify-between">
                          <div>
                            <div className="text-sm">{permission.name}</div>
                            <div className="text-xs text-muted-foreground">{permission.description}</div>
                          </div>
                          <Switch
                            checked={newRole.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setNewRole({
                                  ...newRole,
                                  permissions: [...newRole.permissions, permission.id]
                                });
                              } else {
                                setNewRole({
                                  ...newRole,
                                  permissions: newRole.permissions.filter(p => p !== permission.id)
                                });
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setIsCreateRoleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateRole}>
              Create Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {hasChanges && (
        <Button onClick={saveChanges}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        onLogout={onLogout}
        title="Role & Permissions"
        subtitle="Configure access control and permissions"
        showBackButton={true}
        backTo="/admin"
        actions={headerActions}
      />

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Roles List */}
          <Card className="lg:col-span-1 shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Roles
              </CardTitle>
              <CardDescription>Select a role to edit permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedRole === role.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-accent/50'
                  }`}
                  onClick={() => setSelectedRole(role.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm">{role.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {getUserCount(role.id)} users
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {role.isCustom && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateRole(role.id);
                            }}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteRole(role.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                      {!role.isCustom && (
                        <Badge variant="outline" className="text-xs">
                          System
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Permissions Grid */}
          <div className="lg:col-span-3 space-y-6">
            {currentRole && (
              <>
                <Card className="shadow-sm border-border/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {currentRole.name}
                          {!currentRole.isCustom && (
                            <Badge variant="outline" className="text-xs">
                              System Role
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{currentRole.description}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDuplicateRole(currentRole.id)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Duplicate
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                </Card>

                {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => {
                  const Icon = getCategoryIcon(category);
                  const enabledCount = categoryPermissions.filter(p => 
                    currentRole.permissions.includes(p.id)
                  ).length;

                  return (
                    <Card key={category} className="shadow-sm border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className="w-5 h-5" />
                            {category}
                          </div>
                          <Badge variant="outline" className="border-border/50">
                            {enabledCount}/{categoryPermissions.length} enabled
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {categoryPermissions.map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center justify-between p-3 border border-border rounded-lg"
                            >
                              <div className="flex-1">
                                <div className="text-sm">{permission.name}</div>
                                <div className="text-xs text-muted-foreground">{permission.description}</div>
                              </div>
                              <Switch
                                checked={currentRole.permissions.includes(permission.id)}
                                onCheckedChange={() => togglePermission(permission.id)}
                                disabled={!currentRole.isCustom}
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}