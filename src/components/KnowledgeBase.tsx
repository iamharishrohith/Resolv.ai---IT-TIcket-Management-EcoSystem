import React, { useState, useEffect } from "react";
import { Search, BookOpen, ThumbsUp, ThumbsDown, Star, Clock, TrendingUp, Filter, Plus, Edit, Trash2, Eye, MessageSquare } from "lucide-react";
import { AppHeader } from "./AppHeader";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAppContext } from "../App";

interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  author: string;
  lastUpdated: string;
  views: number;
  helpfulCount: number;
  notHelpfulCount: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedReadTime: number;
  relatedTickets: string[];
  aiGenerated: boolean;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  popularity: number;
  lastUpdated: string;
}

interface AIRecommendation {
  articleId: string;
  relevanceScore: number;
  reason: string;
  context: string;
}

const mockArticles: KnowledgeArticle[] = [
  {
    id: "kb001",
    title: "Setting Up Database Access Permissions",
    content: `# Database Access Setup Guide

## Prerequisites
- Admin access to the database server
- VPN connection established
- User account created in Active Directory

## Step-by-Step Process

### 1. Request Database Access
Submit a ticket through the IT portal with the following information:
- Database name and environment (dev/staging/prod)
- Required access level (read-only/read-write/admin)
- Business justification
- Duration of access needed

### 2. Security Review
All database access requests undergo a security review process:
- Manager approval required for production databases
- Security team validates business need
- Compliance check for sensitive data access

### 3. Access Provisioning
Once approved:
1. Database administrator creates user account
2. Appropriate permissions are granted
3. Connection credentials are shared securely
4. Access is logged for audit purposes

## Best Practices
- Use least privilege principle
- Regularly review access permissions
- Report any suspicious activities
- Use parameterized queries to prevent SQL injection

## Troubleshooting
**Connection Issues:**
- Verify VPN connection
- Check firewall rules
- Validate credentials

**Permission Denied:**
- Contact database administrator
- Verify role assignments
- Check temporary access restrictions`,
    summary: "Complete guide for requesting and setting up database access permissions with security best practices.",
    category: "Database Management",
    tags: ["database", "permissions", "security", "access-control"],
    author: "Karthikeyan",
    lastUpdated: "2024-12-15",
    views: 1250,
    helpfulCount: 98,
    notHelpfulCount: 5,
    difficulty: "Intermediate",
    estimatedReadTime: 8,
    relatedTickets: ["TIK-001", "TIK-045", "TIK-089"],
    aiGenerated: false
  },
  {
    id: "kb002",
    title: "Resolving VPN Connection Issues",
    content: `# VPN Troubleshooting Guide

## Common VPN Issues and Solutions

### Unable to Connect to VPN

**Symptoms:**
- Connection timeout errors
- Authentication failures
- Certificate errors

**Solutions:**
1. **Check Internet Connection**
   - Verify basic internet connectivity
   - Test with different networks

2. **Verify Credentials**
   - Ensure username/password are correct
   - Check for account lockouts
   - Verify 2FA token

3. **Update VPN Client**
   - Download latest client version
   - Clear client cache
   - Reinstall if necessary

### Slow VPN Performance

**Symptoms:**
- Slow browsing/downloading
- High latency
- Frequent disconnections

**Solutions:**
1. **Server Selection**
   - Try different VPN servers
   - Use geographically closer servers
   - Check server load status

2. **Protocol Optimization**
   - Switch to faster protocols (WireGuard/IKEv2)
   - Adjust encryption settings
   - Enable compression

### DNS Resolution Issues

**Symptoms:**
- Cannot access internal resources
- Domain name resolution failures
- Inconsistent connectivity

**Solutions:**
1. **DNS Configuration**
   - Set custom DNS servers
   - Flush DNS cache
   - Verify DNS leak protection

## Emergency Procedures

If VPN is completely unavailable:
1. Contact IT helpdesk immediately
2. Use backup access methods if available
3. Document the outage for review

## Prevention Tips
- Keep VPN client updated
- Regularly test connections
- Monitor connection logs
- Report persistent issues`,
    summary: "Comprehensive troubleshooting guide for common VPN connection issues and performance problems.",
    category: "Network Security",
    tags: ["vpn", "networking", "troubleshooting", "connectivity"],
    author: "Ranjithkumar",
    lastUpdated: "2024-12-14",
    views: 2100,
    helpfulCount: 156,
    notHelpfulCount: 12,
    difficulty: "Beginner",
    estimatedReadTime: 6,
    relatedTickets: ["TIK-012", "TIK-034", "TIK-067"],
    aiGenerated: false
  },
  {
    id: "kb003",
    title: "AI-Assisted Code Review Best Practices",
    content: `# AI-Assisted Code Review Guidelines

## Introduction
This guide outlines best practices for leveraging AI tools in code review processes while maintaining code quality and security.

## AI Tools Integration

### Supported AI Tools
- **GitHub Copilot**: Code suggestions and completions
- **SonarQube**: Static code analysis with AI insights
- **CodeClimate**: Automated code quality assessment
- **DeepCode**: AI-powered security vulnerability detection

### Setup and Configuration
1. **Tool Installation**
   - Install AI extensions in your IDE
   - Configure organization-wide settings
   - Set up API keys and permissions

2. **Integration with CI/CD**
   - Add AI analysis to build pipelines
   - Configure quality gates
   - Set up automated reporting

## Review Process

### Pre-Review (AI-Assisted)
1. **Automated Analysis**
   - Run static code analysis
   - Check for common patterns and anti-patterns
   - Generate initial code quality metrics

2. **AI Suggestions**
   - Review AI-generated improvement suggestions
   - Assess security vulnerability alerts
   - Evaluate performance optimization recommendations

### Human Review
1. **Business Logic Validation**
   - Verify requirements alignment
   - Check edge case handling
   - Validate error scenarios

2. **Architecture Compliance**
   - Ensure design pattern adherence
   - Verify API consistency
   - Check integration points

## Quality Standards

### Code Quality Metrics
- Complexity score < 10
- Test coverage > 80%
- Security vulnerability score: 0 critical, < 5 medium
- Performance regression: < 5%

### AI Tool Thresholds
- SonarQube: Grade A required
- CodeClimate: Maintainability A-B
- Security scan: No critical issues

## Best Practices

### Do's
✅ Use AI for initial code analysis
✅ Combine AI insights with human judgment
✅ Continuously update AI tool configurations
✅ Train team on AI tool capabilities

### Don'ts
❌ Rely solely on AI recommendations
❌ Ignore false positives without investigation
❌ Skip manual security reviews
❌ Bypass established review processes`,
    summary: "Guidelines for integrating AI tools into code review processes while maintaining quality and security standards.",
    category: "Development Practices",
    tags: ["ai", "code-review", "development", "best-practices", "automation"],
    author: "AI Guardian",
    lastUpdated: "2024-12-13",
    views: 890,
    helpfulCount: 67,
    notHelpfulCount: 3,
    difficulty: "Advanced",
    estimatedReadTime: 12,
    relatedTickets: ["TIK-078", "TIK-091", "TIK-123"],
    aiGenerated: true
  }
];

const mockFAQs: FAQ[] = [
  {
    id: "faq001",
    question: "How do I reset my password?",
    answer: "You can reset your password by clicking the 'Forgot Password' link on the login page, or contact IT support for immediate assistance.",
    category: "Account Management",
    popularity: 95,
    lastUpdated: "2024-12-10"
  },
  {
    id: "faq002",
    question: "What are the VPN server addresses?",
    answer: "VPN servers: Primary: vpn1.resolv.ai (US East), Secondary: vpn2.resolv.ai (US West), EU: vpn-eu.resolv.ai (Frankfurt). Use the closest server for best performance.",
    category: "Network Access",
    popularity: 87,
    lastUpdated: "2024-12-08"
  },
  {
    id: "faq003",
    question: "How do I request new software installation?",
    answer: "Submit a software request ticket through the IT portal. Include software name, version, business justification, and department approval. Processing time is typically 2-3 business days.",
    category: "Software Management",
    popularity: 76,
    lastUpdated: "2024-12-12"
  }
];

const categories = ["All", "Database Management", "Network Security", "Development Practices", "Hardware", "Software Management", "Account Management"];

interface KnowledgeBaseProps {
  onLogout: () => void;
}

export function KnowledgeBase({ onLogout }: KnowledgeBaseProps) {
  const { user } = useAppContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [articles, setArticles] = useState(mockArticles);
  const [faqs] = useState(mockFAQs);
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [aiRecommendations, setAiRecommendations] = useState<AIRecommendation[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: "",
    content: "",
    summary: "",
    category: "",
    tags: "",
    difficulty: "Beginner" as const
  });

  // Simulate AI recommendations based on user context
  useEffect(() => {
    if (user) {
      const mockRecommendations: AIRecommendation[] = [
        {
          articleId: "kb001",
          relevanceScore: 0.92,
          reason: "Based on your recent database access requests",
          context: "You've submitted 3 database access tickets this month"
        },
        {
          articleId: "kb002",
          relevanceScore: 0.85,
          reason: "Common issue for your role",
          context: "85% of developers experience VPN issues in their first month"
        }
      ];
      setAiRecommendations(mockRecommendations);
    }
  }, [user]);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleArticleView = (article: KnowledgeArticle) => {
    setSelectedArticle(article);
    // Simulate view count increment
    setArticles(prev => prev.map(a => 
      a.id === article.id ? { ...a, views: a.views + 1 } : a
    ));
  };

  const handleHelpfulVote = (articleId: string, helpful: boolean) => {
    setArticles(prev => prev.map(article => 
      article.id === articleId 
        ? { 
            ...article, 
            helpfulCount: helpful ? article.helpfulCount + 1 : article.helpfulCount,
            notHelpfulCount: !helpful ? article.notHelpfulCount + 1 : article.notHelpfulCount
          }
        : article
    ));
  };

  const handleCreateArticle = () => {
    const article: KnowledgeArticle = {
      id: `kb${Date.now()}`,
      ...newArticle,
      tags: newArticle.tags.split(',').map(tag => tag.trim()),
      author: user?.name || "Unknown",
      lastUpdated: new Date().toISOString().split('T')[0],
      views: 0,
      helpfulCount: 0,
      notHelpfulCount: 0,
      estimatedReadTime: Math.ceil(newArticle.content.length / 200),
      relatedTickets: [],
      aiGenerated: false
    };
    
    setArticles(prev => [article, ...prev]);
    setIsCreateDialogOpen(false);
    setNewArticle({
      title: "",
      content: "",
      summary: "",
      category: "",
      tags: "",
      difficulty: "Beginner"
    });
  };

  const getAIRecommendations = () => {
    return aiRecommendations.map(rec => {
      const article = articles.find(a => a.id === rec.articleId);
      return article ? { ...rec, article } : null;
    }).filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        user={user}
        onLogout={onLogout}
        title="Knowledge Base"
        subtitle="AI-powered knowledge management and recommendations"
      />

      <div className="container mx-auto p-6 space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search articles, FAQs, or ask a question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {category}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {user?.isAdmin && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Create Article
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Knowledge Article</DialogTitle>
                  <DialogDescription>
                    Create a new knowledge base article to help your team
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newArticle.title}
                      onChange={(e) => setNewArticle(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Article title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="summary">Summary</Label>
                    <Input
                      id="summary"
                      value={newArticle.summary}
                      onChange={(e) => setNewArticle(prev => ({ ...prev, summary: e.target.value }))}
                      placeholder="Brief summary of the article"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={newArticle.category} onValueChange={(value) => setNewArticle(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.slice(1).map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select value={newArticle.difficulty} onValueChange={(value: "Beginner" | "Intermediate" | "Advanced") => setNewArticle(prev => ({ ...prev, difficulty: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={newArticle.tags}
                      onChange={(e) => setNewArticle(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="database, security, troubleshooting"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content (Markdown supported)</Label>
                    <Textarea
                      id="content"
                      value={newArticle.content}
                      onChange={(e) => setNewArticle(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Write your article content here..."
                      className="min-h-[200px]"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreateArticle}>
                      Create Article
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* AI Recommendations */}
        {getAIRecommendations().length > 0 && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                AI Recommendations for You
              </CardTitle>
              <CardDescription>
                Personalized recommendations based on your role and recent activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {getAIRecommendations().map((rec: any) => (
                  <div 
                    key={rec.articleId}
                    className="flex items-center justify-between p-4 rounded-lg border bg-background cursor-pointer hover:bg-muted/50"
                    onClick={() => handleArticleView(rec.article)}
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium">{rec.article.title}</h4>
                      <p className="text-sm text-muted-foreground">{rec.reason}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Relevance: {Math.round(rec.relevanceScore * 100)}%</span>
                        <span>•</span>
                        <span>{rec.context}</span>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {Math.round(rec.relevanceScore * 100)}% match
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="articles" className="space-y-4">
          <TabsList>
            <TabsTrigger value="articles" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Articles ({filteredArticles.length})
            </TabsTrigger>
            <TabsTrigger value="faqs" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              FAQs ({filteredFAQs.length})
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Trending
            </TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-4">
            <div className="grid gap-4">
              {filteredArticles.map((article) => (
                <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleArticleView(article)}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="flex items-center gap-2">
                          {article.title}
                          {article.aiGenerated && (
                            <Badge variant="secondary" className="text-xs">
                              AI Generated
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>{article.summary}</CardDescription>
                      </div>
                      <Badge variant="outline">{article.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {article.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {article.estimatedReadTime} min read
                        </div>
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-4 w-4" />
                          {article.helpfulCount}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {article.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {article.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span>{article.author}</span>
                        <span>•</span>
                        <span>{article.lastUpdated}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="faqs" className="space-y-4">
            <div className="grid gap-4">
              {filteredFAQs.map((faq) => (
                <Card key={faq.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{faq.category}</Badge>
                      <Badge variant="secondary" className="text-xs">
                        {faq.popularity}% helpful
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          Helpful
                        </Button>
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                          <ThumbsDown className="h-3 w-3" />
                          Not Helpful
                        </Button>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Updated {faq.lastUpdated}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            <div className="grid gap-4">
              {articles
                .sort((a, b) => b.views - a.views)
                .slice(0, 5)
                .map((article, index) => (
                  <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleArticleView(article)}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{article.title}</h4>
                          <p className="text-sm text-muted-foreground">{article.summary}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <span>{article.views} views</span>
                            <span>•</span>
                            <span>{article.helpfulCount} helpful votes</span>
                            <span>•</span>
                            <span>{article.category}</span>
                          </div>
                        </div>
                        <TrendingUp className="h-5 w-5 text-success" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Article Detail Dialog */}
        <Dialog open={selectedArticle !== null} onOpenChange={() => setSelectedArticle(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            {selectedArticle && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {selectedArticle.title}
                    {selectedArticle.aiGenerated && (
                      <Badge variant="secondary">AI Generated</Badge>
                    )}
                  </DialogTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>By {selectedArticle.author}</span>
                    <span>•</span>
                    <span>Updated {selectedArticle.lastUpdated}</span>
                    <span>•</span>
                    <span>{selectedArticle.estimatedReadTime} min read</span>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      {selectedArticle.difficulty}
                    </Badge>
                  </div>
                </DialogHeader>
                <Separator />
                <div className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                      {selectedArticle.content}
                    </pre>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Was this helpful?</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => handleHelpfulVote(selectedArticle.id, true)}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        Yes ({selectedArticle.helpfulCount})
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex items-center gap-1"
                        onClick={() => handleHelpfulVote(selectedArticle.id, false)}
                      >
                        <ThumbsDown className="h-3 w-3" />
                        No ({selectedArticle.notHelpfulCount})
                      </Button>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Eye className="h-4 w-4" />
                      {selectedArticle.views} views
                    </div>
                  </div>
                  {selectedArticle.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {selectedArticle.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}