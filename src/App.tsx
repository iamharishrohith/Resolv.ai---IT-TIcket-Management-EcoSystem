import React, { useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LoginScreen } from './components/LoginScreen';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { TicketDetails } from './components/TicketDetails';
import { CreateTicket } from './components/CreateTicket';
import { AIChat } from './components/AIChat';
import { AdminUserManagement } from './components/AdminUserManagement';
import { AdminRolePermissions } from './components/AdminRolePermissions';
import { AdminHierarchy } from './components/AdminHierarchy';
import { InfrastructureStatus } from './components/InfrastructureStatus';
import { NetworkMonitoring } from './components/NetworkMonitoring';
import { TicketOverview } from './components/TicketOverview';

export interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isCustom: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  manager?: string;
  isAdmin: boolean;
  customPermissions?: string[]; // Individual user permissions that override role permissions
  status: 'active' | 'inactive';
}

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  users: User[];
  setUsers: (users: User[]) => void;
  roles: Role[];
  setRoles: (roles: Role[]) => void;
  permissions: Permission[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

const mockPermissions: Permission[] = [
  // Ticket Management
  { id: 'create_ticket', name: 'Create Tickets', description: 'Can create support tickets', category: 'Tickets' },
  { id: 'view_own_tickets', name: 'View Own Tickets', description: 'Can view their own tickets', category: 'Tickets' },
  { id: 'view_all_tickets', name: 'View All Tickets', description: 'Can view tickets from all users', category: 'Tickets' },
  { id: 'approve_tickets', name: 'Approve Tickets', description: 'Can approve tickets requiring approval', category: 'Tickets' },
  
  // Access Management
  { id: 'request_database_access', name: 'Request Database Access', description: 'Can request access to databases', category: 'Access' },
  { id: 'self_approve_basic', name: 'Self-Approve Basic Requests', description: 'Can approve their own basic access requests', category: 'Access' },
  { id: 'approve_access_requests', name: 'Approve Access Requests', description: 'Can approve access requests from team members', category: 'Access' },
  
  // System Management
  { id: 'view_system_status', name: 'View System Status', description: 'Can view system health and status', category: 'System' },
  { id: 'manage_infrastructure', name: 'Manage Infrastructure', description: 'Can manage cloud infrastructure', category: 'System' },
  { id: 'access_admin_panel', name: 'Access Admin Panel', description: 'Can access administrative functions', category: 'System' },
  
  // AI Features
  { id: 'chat_with_ai', name: 'Chat with AI Guardian', description: 'Can interact with AI assistant', category: 'AI' },
  { id: 'view_proactive_alerts', name: 'View Proactive Alerts', description: 'Can see AI-generated proactive alerts', category: 'AI' },
  
  // Hardware Management
  { id: 'request_hardware', name: 'Request Hardware', description: 'Can request hardware replacements', category: 'Hardware' },
  { id: 'manage_hardware', name: 'Manage Hardware', description: 'Can manage hardware inventory', category: 'Hardware' },
  
  // User Management
  { id: 'manage_users', name: 'Manage Users', description: 'Can add, edit, and delete users', category: 'Admin' },
  { id: 'manage_roles', name: 'Manage Roles', description: 'Can create and modify roles', category: 'Admin' },
  { id: 'view_analytics', name: 'View Analytics', description: 'Can access system analytics and reports', category: 'Admin' }
];

const mockRoles: Role[] = [
  {
    id: 'junior_developer',
    name: 'Junior Developer',
    description: 'Entry-level developer with guided access',
    isCustom: false,
    permissions: [
      'create_ticket',
      'view_own_tickets',
      'request_database_access',
      'view_system_status',
      'chat_with_ai',
      'view_proactive_alerts',
      'request_hardware'
    ]
  },
  {
    id: 'senior_developer',
    name: 'Senior Developer',
    description: 'Experienced developer with broader access',
    isCustom: false,
    permissions: [
      'create_ticket',
      'view_own_tickets',
      'view_all_tickets',
      'request_database_access',
      'self_approve_basic',
      'approve_tickets',
      'view_system_status',
      'manage_infrastructure',
      'chat_with_ai',
      'view_proactive_alerts',
      'request_hardware'
    ]
  },
  {
    id: 'solutions_architect',
    name: 'Solutions Architect',
    description: 'Senior technical role with advanced system access',
    isCustom: false,
    permissions: [
      'create_ticket',
      'view_own_tickets',
      'view_all_tickets',
      'approve_tickets',
      'request_database_access',
      'self_approve_basic',
      'approve_access_requests',
      'view_system_status',
      'manage_infrastructure',
      'chat_with_ai',
      'view_proactive_alerts',
      'request_hardware'
    ]
  },
  {
    id: 'it_admin',
    name: 'IT Administrator',
    description: 'Full administrative access to all systems',
    isCustom: false,
    permissions: mockPermissions.map(p => p.id) // All permissions
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Harish Rohith S',
    email: 'harish@resolv.ai',
    role: 'it_admin',
    department: 'IT Administration',
    isAdmin: true,
    status: 'active'
  },
  {
    id: '2',
    name: 'Subhaharini',
    email: 'subhaharini@resolv.ai',
    role: 'junior_developer',
    department: 'Engineering',
    manager: 'Karthikeyan',
    isAdmin: false,
    status: 'active'
  },
  {
    id: '3',
    name: 'Hairni',
    email: 'hairni@resolv.ai',
    role: 'junior_developer',
    department: 'Engineering',
    manager: 'Karthikeyan',
    isAdmin: false,
    status: 'active'
  },
  {
    id: '4',
    name: 'Kevin S',
    email: 'kevin.s@resolv.ai',
    role: 'senior_developer',
    department: 'Engineering',
    manager: 'Karthikeyan',
    isAdmin: false,
    status: 'active'
  },
  {
    id: '5',
    name: 'Karthikeyan',
    email: 'karthikeyan@resolv.ai',
    role: 'solutions_architect',
    department: 'Engineering',
    isAdmin: false,
    status: 'active'
  },
  {
    id: '6',
    name: 'Kevin R',
    email: 'kevin.r@resolv.ai',
    role: 'senior_developer',
    department: 'Engineering',
    manager: 'Karthikeyan',
    isAdmin: false,
    status: 'active'
  },
  {
    id: '7',
    name: 'Dhina',
    email: 'dhina@resolv.ai',
    role: 'junior_developer',
    department: 'Engineering',
    manager: 'Karthikeyan',
    isAdmin: false,
    status: 'active'
  },
  {
    id: '8',
    name: 'Sathya',
    email: 'sathya@resolv.ai',
    role: 'senior_developer',
    department: 'Engineering',
    manager: 'Karthikeyan',
    isAdmin: false,
    status: 'active'
  },
  {
    id: '9',
    name: 'Barani',
    email: 'barani@resolv.ai',
    role: 'junior_developer',
    department: 'Quality Assurance',
    manager: 'Naveen',
    isAdmin: false,
    status: 'active'
  },
  {
    id: '10',
    name: 'Chiranjeevi',
    email: 'chiranjeevi@resolv.ai',
    role: 'senior_developer',
    department: 'DevOps',
    manager: 'Ranjithkumar',
    isAdmin: false,
    status: 'active'
  },
  {
    id: '11',
    name: 'Bhubana',
    email: 'bhubana@resolv.ai',
    role: 'junior_developer',
    department: 'Frontend',
    manager: 'Naveen',
    isAdmin: false,
    status: 'active'
  },
  {
    id: '12',
    name: 'Amrin',
    email: 'amrin@resolv.ai',
    role: 'senior_developer',
    department: 'Backend',
    manager: 'Ranjithkumar',
    isAdmin: false,
    status: 'active'
  },
  {
    id: '13',
    name: 'Naveen',
    email: 'naveen@resolv.ai',
    role: 'solutions_architect',
    department: 'Product Engineering',
    isAdmin: false,
    status: 'active'
  },
  {
    id: '14',
    name: 'Ranjithkumar',
    email: 'ranjithkumar@resolv.ai',
    role: 'solutions_architect',
    department: 'Infrastructure',
    isAdmin: false,
    status: 'active'
  }
];

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [permissions] = useState<Permission[]>(mockPermissions);
  const isAuthenticated = user !== null;

  const handleLogin = (email: string) => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <AppContext.Provider value={{ user, setUser, isAuthenticated, users, setUsers, roles, setRoles, permissions }}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                  <Navigate to={user?.isAdmin ? "/admin" : "/dashboard"} replace /> :
                  <LoginScreen onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated && !user?.isAdmin ? 
                  <EmployeeDashboard onLogout={handleLogout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/admin" 
              element={
                isAuthenticated && user?.isAdmin ? 
                  <AdminDashboard onLogout={handleLogout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                isAuthenticated && user?.isAdmin ? 
                  <AdminUserManagement onLogout={handleLogout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/admin/roles" 
              element={
                isAuthenticated && user?.isAdmin ? 
                  <AdminRolePermissions onLogout={handleLogout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/admin/hierarchy" 
              element={
                isAuthenticated && user?.isAdmin ? 
                  <AdminHierarchy onLogout={handleLogout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/ticket/:id" 
              element={
                isAuthenticated ? 
                  <TicketDetails onLogout={handleLogout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/create-ticket" 
              element={
                isAuthenticated && !user?.isAdmin ? 
                  <CreateTicket onLogout={handleLogout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/chat" 
              element={
                isAuthenticated && !user?.isAdmin ? 
                  <AIChat onLogout={handleLogout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/infrastructure" 
              element={
                isAuthenticated && user?.role === 'solutions_architect' ? 
                  <InfrastructureStatus onLogout={handleLogout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/network" 
              element={
                isAuthenticated && user?.role === 'solutions_architect' ? 
                  <NetworkMonitoring onLogout={handleLogout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/tickets" 
              element={
                isAuthenticated ? 
                  <TicketOverview onLogout={handleLogout} /> : 
                  <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/" 
              element={
                <Navigate to={
                  isAuthenticated ? 
                    (user?.isAdmin ? "/admin" : "/dashboard") : 
                    "/login"
                } replace />
              } 
            />
            <Route 
              path="*" 
              element={
                <Navigate to={
                  isAuthenticated ? 
                    (user?.isAdmin ? "/admin" : "/dashboard") : 
                    "/login"
                } replace />
              } 
            />
          </Routes>
        </div>
      </Router>
    </AppContext.Provider>
  );
}