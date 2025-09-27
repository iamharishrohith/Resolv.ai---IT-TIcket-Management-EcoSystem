import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, User } from '../App';
import { AppHeader } from './AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Search, 
  Filter, 
  Edit, 
  Plus, 
  Mail,
  Building,
  UserCog,
  Settings,
  Trash2,
  Copy
} from 'lucide-react';

interface AdminUserManagementProps {
  onLogout: () => void;
}

export function AdminUserManagement({ onLogout }: AdminUserManagementProps) {
  const { user, users, setUsers, roles, permissions } = useAppContext();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterRole, setFilterRole] = useState('all');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    department: '',
    manager: '',
    customPermissions: [] as string[]
  });

  const departments = Array.from(new Set(users.map(u => u.department))).filter(Boolean);

  const filteredUsers = users.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment;
    const matchesRole = filterRole === 'all' || employee.role === filterRole;
    
    return matchesSearch && matchesDepartment && matchesRole;
  });

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.role && newUser.department) {
      const userToAdd: User = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        department: newUser.department,
        manager: newUser.manager || undefined,
        isAdmin: newUser.role === 'it_admin',
        customPermissions: newUser.customPermissions.length > 0 ? newUser.customPermissions : undefined,
        status: 'active'
      };
      
      setUsers([...users, userToAdd]);
      setNewUser({
        name: '',
        email: '',
        role: '',
        department: '',
        manager: '',
        customPermissions: []
      });
      setIsAddUserOpen(false);
      setActiveTab('basic');
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ));
  };

  const deleteUser = (userId: string) => {
    setUsers(users.filter(u => u.id !== userId));
  };

  const duplicateUser = (userToDuplicate: User) => {
    const duplicatedUser: User = {
      ...userToDuplicate,
      id: Date.now().toString(),
      name: `${userToDuplicate.name} (Copy)`,
      email: `copy.${userToDuplicate.email}`
    };
    setUsers([...users, duplicatedUser]);
  };

  const editUser = (userToEdit: User) => {
    setEditingUser(userToEdit);
  };

  const saveUserEdit = (editedUser: User) => {
    setUsers(users.map(u => u.id === editedUser.id ? editedUser : u));
    setEditingUser(null);
  };

  const getUserPermissions = (employee: User) => {
    const role = roles.find(r => r.id === employee.role);
    const rolePermissions = role?.permissions || [];
    const customPerms = employee.customPermissions || [];
    
    // Custom permissions override role permissions
    const allPermissions = [...new Set([...rolePermissions, ...customPerms])];
    
    return allPermissions.reduce((acc, permId) => {
      const perm = permissions.find(p => p.id === permId);
      if (perm) {
        if (!acc[perm.category]) acc[perm.category] = [];
        acc[perm.category].push(perm);
      }
      return acc;
    }, {} as Record<string, typeof permissions>);
  };

  const headerActions = (
    <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new user account with role and permissions
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="permissions">Custom Permissions</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input
                  placeholder="John Doe"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input
                  type="email"
                  placeholder="john@company.com"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={newUser.role} onValueChange={(value) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={newUser.department} onValueChange={(value) => setNewUser({ ...newUser, department: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Engineering">Engineering</SelectItem>
                    <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
                    <SelectItem value="DevOps">DevOps</SelectItem>
                    <SelectItem value="Frontend">Frontend</SelectItem>
                    <SelectItem value="Backend">Backend</SelectItem>
                    <SelectItem value="Product Engineering">Product Engineering</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="IT Administration">IT Administration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Manager</Label>
              <Select value={newUser.manager} onValueChange={(value) => setNewUser({ ...newUser, manager: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select manager (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {users.filter(u => u.role === 'solutions_architect' || u.role === 'it_admin').map((manager) => (
                    <SelectItem key={manager.id} value={manager.name}>
                      {manager.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>
          <TabsContent value="permissions" className="space-y-4">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Grant additional permissions beyond the selected role. These will override role permissions.
              </p>
              <div className="grid grid-cols-1 gap-3 max-h-64 overflow-y-auto">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center space-x-3 p-3 border border-border rounded-lg">
                    <Switch
                      checked={newUser.customPermissions?.includes(permission.id) || false}
                      onCheckedChange={(checked) => {
                        const current = newUser.customPermissions || [];
                        if (checked) {
                          setNewUser({
                            ...newUser,
                            customPermissions: [...current, permission.id]
                          });
                        } else {
                          setNewUser({
                            ...newUser,
                            customPermissions: current.filter(p => p !== permission.id)
                          });
                        }
                      }}
                    />
                    <div className="flex-1">
                      <div className="text-sm">{permission.name}</div>
                      <div className="text-xs text-muted-foreground">{permission.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddUser}>
            Add User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        onLogout={onLogout}
        title="User Management"
        subtitle="Manage employee roles and permissions"
        showBackButton={true}
        backTo="/admin"
        actions={headerActions}
      />

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Filters and Search */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>{role.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setFilterDepartment('all');
                    setFilterRole('all');
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle>Users ({filteredUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((employee) => {
                  const role = roles.find(r => r.id === employee.role);
                  const userPermissions = getUserPermissions(employee);
                  
                  return (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div>{employee.name}</div>
                            {employee.isAdmin && (
                              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                Admin
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Mail className="w-3 h-3" />
                            {employee.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-border/50">
                          {role?.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Building className="w-3 h-3" />
                          {employee.department}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {employee.manager || 'None'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={employee.status === 'active'}
                            onCheckedChange={() => toggleUserStatus(employee.id)}
                          />
                          <span className="text-xs">
                            {employee.status === 'active' ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {Object.entries(userPermissions).map(([category, perms]) => (
                            <div key={category} className="text-xs">
                              <span className="text-muted-foreground">{category}:</span> {perms.length}
                            </div>
                          ))}
                          {employee.customPermissions && employee.customPermissions.length > 0 && (
                            <Badge variant="outline" className="text-xs bg-warning/10 text-warning border-warning/20">
                              Custom Permissions
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => editUser(employee)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => duplicateUser(employee)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          {employee.id !== user?.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteUser(employee.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}