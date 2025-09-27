import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { AppHeader } from './AppHeader';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sparkles, Upload, X, Image, Video } from 'lucide-react';
import { TICKET_CATEGORIES } from './TicketOverview';

interface CreateTicketProps {
  onLogout: () => void;
}

export function CreateTicket({ onLogout }: CreateTicketProps) {
  const { user } = useAppContext();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium'
  });
  
  const [aiSuggestion, setAiSuggestion] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleDescriptionChange = (description: string) => {
    setFormData({ ...formData, description });
    
    // Enhanced AI analysis using the ticket categories
    if (description.length > 20) {
      setIsAnalyzing(true);
      setTimeout(() => {
        const lowerDescription = description.toLowerCase();
        
        // Find the best matching category based on keywords
        let bestMatch = null;
        let maxMatches = 0;
        
        Object.values(TICKET_CATEGORIES).forEach(category => {
          const matches = category.keywords.filter(keyword => 
            lowerDescription.includes(keyword.toLowerCase())
          ).length;
          
          if (matches > maxMatches) {
            maxMatches = matches;
            bestMatch = category;
          }
        });

        if (bestMatch && maxMatches > 0) {
          const suggestions = {
            access_request: `This appears to be an access request. ${bestMatch.requiresApproval ? 'I\'ll route this to your manager for approval.' : 'I can help process this request.'}`,
            hardware: 'This looks like a hardware issue. I can help arrange diagnostics or replacement if needed.',
            software: 'This appears to be a software-related request. I\'ll check if this software is pre-approved and help with installation.',
            network: 'This looks like a network connectivity issue. I can help troubleshoot this immediately.',
            security: 'This appears to be a security-related issue. I\'ll prioritize this for immediate attention.',
            infrastructure: 'This looks like an infrastructure issue. I\'ll escalate this to the infrastructure team.',
            other: 'I\'ll help categorize this request and route it to the appropriate team.'
          };

          const categoryTitles = {
            access_request: 'Access Request',
            hardware: 'Hardware Issue',
            software: 'Software Request',
            network: 'Network Issue',
            security: 'Security Issue',
            infrastructure: 'Infrastructure Issue',
            other: 'General Request'
          };

          setAiSuggestion(suggestions[bestMatch.id as keyof typeof suggestions] || 'I can help process this request.');
          setFormData(prev => ({ 
            ...prev, 
            category: bestMatch.id,
            title: prev.title || categoryTitles[bestMatch.id as keyof typeof categoryTitles] || 'Support Request'
          }));
        } else {
          setAiSuggestion('I\'ll help categorize this request once you provide more details.');
        }
        setIsAnalyzing(false);
      }, 1500);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      return isImage || isVideo;
    });
    
    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate ticket creation
    const ticketId = 'ticket-new-' + Date.now();
    navigate(`/ticket/${ticketId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        onLogout={onLogout}
        title="Create New Ticket"
        subtitle="Describe your issue and get AI-powered assistance"
        showBackButton={true}
        backTo="/dashboard"
      />

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Describe Your Issue</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Brief summary of your issue"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Please describe your issue in detail..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleDescriptionChange(e.target.value)}
                  required
                />
              </div>

              {/* AI Suggestion */}
              {(aiSuggestion || isAnalyzing) && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        {isAnalyzing ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Sparkles className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-blue-800 mb-1">AI Guardian</p>
                        <p className="text-blue-700 text-sm">
                          {isAnalyzing ? 'Analyzing your request...' : aiSuggestion}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(TICKET_CATEGORIES).map(category => {
                        const Icon = category.icon;
                        return (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <Icon className="w-4 h-4" />
                              <span>{category.name}</span>
                              {category.requiresApproval && (
                                <span className="text-xs text-amber-600">(Approval Required)</span>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Media Upload */}
              <div className="space-y-4">
                <Label>Attachments (Images & Videos)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drop files here or click to upload
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Supports images (JPG, PNG, GIF) and videos (MP4, MOV, AVI)
                  </p>
                  <Input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" size="sm">
                      Choose Files
                    </Button>
                  </Label>
                </div>

                {/* Uploaded Files Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="space-y-2">
                    <Label>Uploaded Files ({uploadedFiles.length})</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border">
                          <div className="flex items-center gap-3">
                            {file.type.startsWith('image/') ? (
                              <Image className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Video className="w-5 h-5 text-purple-600" />
                            )}
                            <div>
                              <p className="text-sm font-medium truncate max-w-48">{file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Approval Notice */}
              {formData.category && TICKET_CATEGORIES[formData.category as keyof typeof TICKET_CATEGORIES]?.requiresApproval && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="pt-4">
                    <p className="text-amber-700 text-sm">
                      <strong>Note:</strong> This category requires approval{user?.role === 'junior_developer' ? ` from your manager (${user.manager})` : ''}. 
                      {user?.role === 'junior_developer' ? 'They' : 'The appropriate approver'} will be notified automatically once you submit this ticket.
                    </p>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-3">
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                  Create Ticket
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}