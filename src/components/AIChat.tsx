import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { AppHeader } from './AppHeader';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, Sparkles, ExternalLink } from 'lucide-react';

interface AIChatProps {
  onLogout: () => void;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  actions?: Array<{
    label: string;
    action: string;
    variant?: 'default' | 'outline';
  }>;
  links?: Array<{
    label: string;
    url: string;
  }>;
}

export function AIChat({ onLogout }: AIChatProps) {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hi ${user?.name}! I'm AI Guardian, your proactive IT assistant. I can help you with troubleshooting, access requests, system status, and more. What can I help you with today?`,
      sender: 'ai',
      timestamp: new Date(Date.now() - 5000),
      actions: [
        { label: 'Check System Status', action: 'system_status' },
        { label: 'Create Ticket', action: 'create_ticket', variant: 'outline' }
      ]
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = (userMessage: string): Message => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('battery') || lowerMessage.includes('laptop')) {
      return {
        id: Date.now().toString(),
        text: 'I can see you\'re asking about your laptop battery. Good news - I\'ve already detected this issue proactively! Your battery capacity is at 78% and I\'ve already ordered a replacement. A technician appointment is scheduled for Thursday at 2PM.',
        sender: 'ai',
        timestamp: new Date(),
        actions: [
          { label: 'View Ticket Details', action: 'view_ticket_alert-1' },
          { label: 'Reschedule Appointment', action: 'reschedule', variant: 'outline' }
        ],
        links: [
          { label: 'Battery Health Guide', url: '#' }
        ]
      };
    }
    
    if (lowerMessage.includes('database') || lowerMessage.includes('access')) {
      return {
        id: Date.now().toString(),
        text: 'I can help with database access requests. Based on your role as a Junior Developer, database access requests require manager approval. I can help you create a detailed access request that includes all the necessary information to speed up the approval process.',
        sender: 'ai',
        timestamp: new Date(),
        actions: [
          { label: 'Create Access Request', action: 'create_access_request' },
          { label: 'View Pending Requests', action: 'view_pending', variant: 'outline' }
        ]
      };
    }
    
    if (lowerMessage.includes('vpn') || lowerMessage.includes('network')) {
      return {
        id: Date.now().toString(),
        text: 'I can help troubleshoot VPN and network issues. Let me run a quick diagnostic on your connection... Your VPN client is connected, but I\'m detecting some packet loss. Try these steps: 1) Disconnect and reconnect to VPN 2) Switch to a different server location 3) Restart your network adapter.',
        sender: 'ai',
        timestamp: new Date(),
        actions: [
          { label: 'Run Full Diagnostic', action: 'run_diagnostic' },
          { label: 'Create Network Ticket', action: 'create_network_ticket', variant: 'outline' }
        ]
      };
    }
    
    if (lowerMessage.includes('status') || lowerMessage.includes('health')) {
      return {
        id: Date.now().toString(),
        text: 'Your system health is looking good overall! Here\'s a quick summary: ✅ Laptop Performance: 92% ✅ Network: 98% ⚠️ Battery: 78% (replacement in progress) ✅ Security: 88%. The only active issue is your battery, which I\'m already handling proactively.',
        sender: 'ai',
        timestamp: new Date(),
        actions: [
          { label: 'View Detailed Report', action: 'view_report' },
          { label: 'Back to Dashboard', action: 'dashboard', variant: 'outline' }
        ]
      };
    }
    
    // Default response
    return {
      id: Date.now().toString(),
      text: 'I understand you need help with that. Let me create a ticket for you so our support team can assist you properly. What category would this fall under: Hardware, Software, Network, Security, or Access Request?',
      sender: 'ai',
      timestamp: new Date(),
      actions: [
        { label: 'Create Ticket', action: 'create_ticket' },
        { label: 'Browse Knowledge Base', action: 'knowledge_base', variant: 'outline' }
      ]
    };
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputText.trim();
    if (!messageText) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = simulateAIResponse(messageText);
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleActionClick = (action: string) => {
    switch (action) {
      case 'system_status':
        handleSendMessage('What is my system status?');
        break;
      case 'create_ticket':
        navigate('/create-ticket');
        break;
      case 'view_ticket_alert-1':
        navigate('/ticket/alert-1');
        break;
      case 'create_access_request':
        navigate('/create-ticket');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      default:
        handleSendMessage(`I'd like to ${action.replace('_', ' ')}`);
    }
  };

  const quickSuggestions = [
    'Check my system status',
    'Help with VPN connection',
    'Request database access',
    'Software installation'
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader 
        onLogout={onLogout}
        title="AI Guardian"
        subtitle="Your intelligent IT assistant"
        showBackButton={true}
        backTo="/dashboard"
        actions={<div className="w-2 h-2 bg-success rounded-full" title="AI Guardian is online"></div>}
      />

      {/* Messages Area */}
      <div className="flex-1 max-w-4xl mx-auto w-full p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                {message.sender === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                      <Sparkles className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">AI Guardian</span>
                  </div>
                )}
                <Card className={`${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border-gray-200'
                }`}>
                  <CardContent className="p-4">
                    <p className={`text-sm leading-relaxed ${
                      message.sender === 'user' ? 'text-white' : 'text-gray-800'
                    }`}>
                      {message.text}
                    </p>
                    
                    {message.actions && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {message.actions.map((action, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant={action.variant || 'default'}
                            onClick={() => handleActionClick(action.action)}
                            className={action.variant === 'outline' ? 'border-gray-300' : 'bg-blue-600 hover:bg-blue-700'}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                    
                    {message.links && (
                      <div className="mt-3 space-y-1">
                        {message.links.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="w-3 h-3" />
                            {link.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                <p className="text-xs text-gray-500 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%]">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">AI Guardian</span>
                </div>
                <Card className="bg-white border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick Suggestions */}
      {messages.length === 1 && (
        <div className="max-w-4xl mx-auto w-full px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(suggestion)}
                className="text-gray-600 hover:text-gray-800"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-3">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button 
              type="submit" 
              disabled={!inputText.trim() || isTyping}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}