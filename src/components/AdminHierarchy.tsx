import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { AppHeader } from './AppHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { 
  ArrowLeft, 
  Shield, 
  LogOut,
  Search,
  GitBranch,
  User,
  Users,
  Edit,
  Building,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface AdminHierarchyProps {
  onLogout: () => void;
}

interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  manager?: string;
  directReports: string[];
}

interface HierarchyNode extends Employee {
  children: HierarchyNode[];
  expanded?: boolean;
}

export function AdminHierarchy({ onLogout }: AdminHierarchyProps) {
  const { user } = useAppContext();
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [hierarchyData, setHierarchyData] = useState<HierarchyNode[]>([]);
  const [allExpanded, setAllExpanded] = useState(true);

  const mockEmployees: Employee[] = [
    {
      id: '1',
      name: 'Harish Rohith S',
      email: 'harish@resolv.ai',
      role: 'CEO',
      department: 'Executive',
      directReports: ['2', '3', '4']
    },
    {
      id: '2',
      name: 'Naveen',
      email: 'naveen@resolv.ai',
      role: 'CTO',
      department: 'Engineering',
      manager: 'Harish Rohith S',
      directReports: ['5', '6']
    },
    {
      id: '3',
      name: 'Ranjithkumar',
      email: 'ranjithkumar@resolv.ai',
      role: 'VP Infrastructure',
      department: 'Infrastructure',
      manager: 'Harish Rohith S',
      directReports: ['7', '8']
    },
    {
      id: '4',
      name: 'Karthikeyan',
      email: 'karthikeyan@resolv.ai',
      role: 'VP Engineering',
      department: 'Engineering',
      manager: 'Harish Rohith S',
      directReports: ['9', '10', '11', '12']
    },
    {
      id: '5',
      name: 'Bhubana',
      email: 'bhubana@resolv.ai',
      role: 'Lead Frontend',
      department: 'Frontend',
      manager: 'Naveen',
      directReports: []
    },
    {
      id: '6',
      name: 'Barani',
      email: 'barani@resolv.ai',
      role: 'QA Lead',
      department: 'Quality Assurance',
      manager: 'Naveen',
      directReports: []
    },
    {
      id: '7',
      name: 'Chiranjeevi',
      email: 'chiranjeevi@resolv.ai',
      role: 'DevOps Engineer',
      department: 'DevOps',
      manager: 'Ranjithkumar',
      directReports: []
    },
    {
      id: '8',
      name: 'Amrin',
      email: 'amrin@resolv.ai',
      role: 'Backend Engineer',
      department: 'Backend',
      manager: 'Ranjithkumar',
      directReports: []
    },
    {
      id: '9',
      name: 'Subhaharini',
      email: 'subhaharini@resolv.ai',
      role: 'Junior Developer',
      department: 'Engineering',
      manager: 'Karthikeyan',
      directReports: []
    },
    {
      id: '10',
      name: 'Hairni',
      email: 'hairni@resolv.ai',
      role: 'Junior Developer',
      department: 'Engineering',
      manager: 'Karthikeyan',
      directReports: []
    },
    {
      id: '11',
      name: 'Kevin S',
      email: 'kevin.s@resolv.ai',
      role: 'Senior Developer',
      department: 'Engineering',
      manager: 'Karthikeyan',
      directReports: []
    },
    {
      id: '12',
      name: 'Kevin R',
      email: 'kevin.r@resolv.ai',
      role: 'Senior Developer',
      department: 'Engineering',
      manager: 'Karthikeyan',
      directReports: []
    },
    {
      id: '13',
      name: 'Dhina',
      email: 'dhina@resolv.ai',
      role: 'Junior Developer',
      department: 'Engineering',
      manager: 'Karthikeyan',
      directReports: []
    },
    {
      id: '14',
      name: 'Sathya',
      email: 'sathya@resolv.ai',
      role: 'Senior Developer',
      department: 'Engineering',
      manager: 'Karthikeyan',
      directReports: []
    }
  ];

  const buildHierarchy = (employees: Employee[]): HierarchyNode[] => {
    const employeeMap = new Map(employees.map(emp => [emp.id, { ...emp, children: [], expanded: true }]));
    const roots: HierarchyNode[] = [];

    employees.forEach(employee => {
      const node = employeeMap.get(employee.id)!;
      if (employee.manager) {
        const managerNode = employeeMap.get(
          employees.find(e => e.name === employee.manager)?.id || ''
        );
        if (managerNode) {
          managerNode.children.push(node);
        }
      } else {
        roots.push(node);
      }
    });

    return roots;
  };

  React.useEffect(() => {
    setHierarchyData(buildHierarchy(mockEmployees));
  }, []);

  // Filter employees based on search term
  const filteredEmployees = React.useMemo(() => {
    if (!searchTerm.trim()) return mockEmployees;
    
    const searchLower = searchTerm.toLowerCase();
    return mockEmployees.filter(employee => 
      employee.name.toLowerCase().includes(searchLower) ||
      employee.role.toLowerCase().includes(searchLower) ||
      employee.department.toLowerCase().includes(searchLower) ||
      employee.email.toLowerCase().includes(searchLower)
    );
  }, [searchTerm]);

  // Update hierarchy when search changes
  React.useEffect(() => {
    setHierarchyData(buildHierarchy(filteredEmployees));
  }, [filteredEmployees]);

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  const handleSaveEmployee = () => {
    if (!selectedEmployee) return;
    
    // Update the employee in the mock data
    const employeeIndex = mockEmployees.findIndex(e => e.id === selectedEmployee.id);
    if (employeeIndex !== -1) {
      mockEmployees[employeeIndex] = selectedEmployee;
      setHierarchyData(buildHierarchy(mockEmployees));
    }
    
    setIsEditDialogOpen(false);
    setSelectedEmployee(null);
  };

  const toggleExpanded = (nodeId: string) => {
    const updateNode = (nodes: HierarchyNode[]): HierarchyNode[] => {
      return nodes.map(node => {
        if (node.id === nodeId) {
          return { ...node, expanded: !node.expanded };
        }
        return { ...node, children: updateNode(node.children) };
      });
    };
    
    setHierarchyData(updateNode(hierarchyData));
  };

  const expandAll = () => {
    const updateAllNodes = (nodes: HierarchyNode[]): HierarchyNode[] => {
      return nodes.map(node => ({
        ...node,
        expanded: true,
        children: updateAllNodes(node.children)
      }));
    };
    setHierarchyData(updateAllNodes(hierarchyData));
    setAllExpanded(true);
  };

  const collapseAll = () => {
    const updateAllNodes = (nodes: HierarchyNode[]): HierarchyNode[] => {
      return nodes.map(node => ({
        ...node,
        expanded: false,
        children: updateAllNodes(node.children)
      }));
    };
    setHierarchyData(updateAllNodes(hierarchyData));
    setAllExpanded(false);
  };

  const renderHierarchyNode = (node: HierarchyNode, level: number = 0) => {
    const hasChildren = node.children.length > 0;
    const isExpanded = node.expanded;
    
    return (
      <div key={node.id} className="select-none">
        <div 
          className="flex items-center gap-2 p-3 hover:bg-accent/20 rounded-lg cursor-pointer transition-colors"
          style={{ marginLeft: level * 24 }}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="w-6 h-6 p-0"
              onClick={() => toggleExpanded(node.id)}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </Button>
          ) : (
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-2 h-2 bg-muted-foreground/30 rounded-full"></div>
            </div>
          )}
          
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm text-primary">
              {node.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-medium">{node.name}</span>
              <Badge variant="outline" className="text-xs">
                {node.role.replace('_', ' ')}
              </Badge>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Building className="w-3 h-3" />
                {node.department}
              </span>
              {node.directReports.length > 0 && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {node.directReports.length} reports
                </span>
              )}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditEmployee(node)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {node.children.map(child => renderHierarchyNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const availableManagers = mockEmployees.filter(emp => 
    emp.id !== selectedEmployee?.id &&
    emp.role !== 'junior_developer' &&
    !emp.directReports.includes(selectedEmployee?.id || '')
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        onLogout={onLogout}
        title="Organization Hierarchy"
        subtitle="Manage reporting relationships"
        showBackButton={true}
        backTo="/admin"
      />

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Search and Controls */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-info" />
              </div>
              Search Organization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search employees by name, role, or department"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={expandAll}>
                Expand All
              </Button>
              <Button variant="outline" onClick={collapseAll}>
                Collapse All
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Organization Chart */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <GitBranch className="w-4 h-4 text-primary" />
              </div>
              Organization Chart
            </CardTitle>
            <CardDescription>
              Interactive hierarchy view - click to expand/collapse, click edit to modify reporting relationships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {hierarchyData.map(node => renderHierarchyNode(node))}
            </div>
          </CardContent>
        </Card>

        {/* Key for Demo Flow */}
        <Card className="border-info/20 bg-info/5 shadow-sm">
          <CardHeader>
            <CardTitle className="text-info flex items-center gap-2">
              <div className="w-6 h-6 bg-info/10 rounded-lg flex items-center justify-center">
                <GitBranch className="w-4 h-4 text-info" />
              </div>
              Demo Flow
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-info/80">
              Click the <Edit className="w-4 h-4 inline mx-1" /> button next to "Subhaharini" 
              to change her manager and complete the demo flow!
            </p>
          </CardContent>
        </Card>

        {/* Department Summary */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                <Building className="w-4 h-4 text-success" />
              </div>
              Department Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['Engineering', 'Infrastructure', 'Frontend', 'Executive'].map(dept => {
                const deptEmployees = mockEmployees.filter(e => e.department === dept);
                return (
                  <div key={dept} className="text-center p-4 border border-border/50 rounded-lg hover:bg-accent/20 transition-colors">
                    <h3 className="mb-2">{dept}</h3>
                    <p className="text-3xl text-primary mb-1">{deptEmployees.length}</p>
                    <p className="text-sm text-muted-foreground">employees</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Edit Employee Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Edit Reporting Relationship
              </DialogTitle>
              <DialogDescription>
                Update {selectedEmployee?.name}'s manager and department
              </DialogDescription>
            </DialogHeader>
            {selectedEmployee && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Employee</Label>
                  <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
                    <div className="text-foreground">{selectedEmployee.name}</div>
                    <div className="text-sm text-muted-foreground">{selectedEmployee.role}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Current Manager</Label>
                  <div className="p-3 bg-muted/50 rounded-lg border border-border/50">
                    {selectedEmployee.manager || 'No manager assigned'}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>New Manager</Label>
                  <Select 
                    value={selectedEmployee.manager || 'no-manager'} 
                    onValueChange={(value) => setSelectedEmployee({
                      ...selectedEmployee, 
                      manager: value === 'no-manager' ? undefined : value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a manager" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-manager">No manager</SelectItem>
                      {availableManagers.map(manager => (
                        <SelectItem key={manager.id} value={manager.name}>
                          {manager.name} ({manager.role})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Department</Label>
                  <Select 
                    value={selectedEmployee.department} 
                    onValueChange={(value) => setSelectedEmployee({
                      ...selectedEmployee, 
                      department: value
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Product">Product</SelectItem>
                      <SelectItem value="Design">Design</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEmployee} className="bg-primary hover:bg-primary/90">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}