import React, { useState, useEffect } from "react";
import { Brain, Zap, Target, TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Alert, AlertDescription } from "./ui/alert";

interface ClassificationResult {
  category: string;
  subcategory: string;
  confidence: number;
  priority: "Low" | "Medium" | "High" | "Critical";
  urgency: "Low" | "Medium" | "High" | "Critical";
  suggestedAssignee: string;
  estimatedResolutionTime: string;
  similarTickets: string[];
  keywords: string[];
  sentiment: "Positive" | "Neutral" | "Negative" | "Frustrated";
  sentimentScore: number;
}

interface MLModel {
  name: string;
  version: string;
  accuracy: number;
  lastTrained: string;
  totalPredictions: number;
  status: "Active" | "Training" | "Deprecated";
}

interface TicketClassificationProps {
  ticketContent?: string;
  onClassificationComplete?: (result: ClassificationResult) => void;
}

export function TicketClassification({ ticketContent, onClassificationComplete }: TicketClassificationProps) {
  const [isClassifying, setIsClassifying] = useState(false);
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null);
  const [models] = useState<MLModel[]>([
    {
      name: "BERT-Ticket-Classifier",
      version: "v2.1.0",
      accuracy: 94.2,
      lastTrained: "2024-12-10",
      totalPredictions: 15420,
      status: "Active"
    },
    {
      name: "Priority-Predictor",
      version: "v1.8.3",
      accuracy: 91.7,
      lastTrained: "2024-12-08",
      totalPredictions: 12850,
      status: "Active"
    },
    {
      name: "Sentiment-Analyzer",
      version: "v1.5.2",
      accuracy: 89.4,
      lastTrained: "2024-12-05",
      totalPredictions: 18960,
      status: "Active"
    }
  ]);

  // Mock NLP classification function
  const classifyTicket = async (content: string): Promise<ClassificationResult> => {
    // Simulate API call to Python/Node backend with BERT model
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock classification logic based on content keywords
    const words = content.toLowerCase();
    
    let category = "General";
    let subcategory = "Other";
    let priority: "Low" | "Medium" | "High" | "Critical" = "Medium";
    let urgency: "Low" | "Medium" | "High" | "Critical" = "Medium";
    let suggestedAssignee = "IT Support";
    let estimatedResolutionTime = "2-4 hours";
    
    // Database-related classification
    if (words.includes("database") || words.includes("sql") || words.includes("connection") || words.includes("query")) {
      category = "Database Management";
      subcategory = words.includes("connection") ? "Connection Issues" : 
                   words.includes("access") ? "Access Request" : "Performance";
      suggestedAssignee = "Database Administrator";
      estimatedResolutionTime = "1-2 hours";
      if (words.includes("production") || words.includes("critical")) {
        priority = "Critical";
        urgency = "High";
      }
    }
    
    // Network-related classification
    else if (words.includes("vpn") || words.includes("network") || words.includes("connection") || words.includes("slow")) {
      category = "Network Security";
      subcategory = words.includes("vpn") ? "VPN Issues" : 
                   words.includes("slow") ? "Performance" : "Connectivity";
      suggestedAssignee = "Network Administrator";
      estimatedResolutionTime = "30 minutes - 1 hour";
    }
    
    // Hardware-related classification
    else if (words.includes("laptop") || words.includes("computer") || words.includes("hardware") || words.includes("broken")) {
      category = "Hardware";
      subcategory = "Hardware Failure";
      priority = words.includes("broken") ? "High" : "Medium";
      suggestedAssignee = "Hardware Support";
      estimatedResolutionTime = "2-24 hours";
    }
    
    // Software-related classification
    else if (words.includes("software") || words.includes("application") || words.includes("install") || words.includes("update")) {
      category = "Software Management";
      subcategory = words.includes("install") ? "Installation" : "Configuration";
      suggestedAssignee = "Software Support";
      estimatedResolutionTime = "1-3 hours";
    }

    // Sentiment analysis
    let sentiment: "Positive" | "Neutral" | "Negative" | "Frustrated" = "Neutral";
    let sentimentScore = 0.5;
    
    if (words.includes("urgent") || words.includes("critical") || words.includes("broken") || words.includes("not working")) {
      sentiment = "Frustrated";
      sentimentScore = 0.2;
      urgency = "High";
    } else if (words.includes("please") || words.includes("thank") || words.includes("help")) {
      sentiment = "Positive";
      sentimentScore = 0.8;
    } else if (words.includes("issue") || words.includes("problem")) {
      sentiment = "Negative";
      sentimentScore = 0.3;
    }

    const confidence = Math.random() * 0.3 + 0.7; // 70-100% confidence

    return {
      category,
      subcategory,
      confidence: Math.round(confidence * 100) / 100,
      priority,
      urgency,
      suggestedAssignee,
      estimatedResolutionTime,
      similarTickets: ["TIK-" + Math.floor(Math.random() * 100).toString().padStart(3, '0')],
      keywords: extractKeywords(content),
      sentiment,
      sentimentScore: Math.round(sentimentScore * 100) / 100
    };
  };

  const extractKeywords = (content: string): string[] => {
    const words = content.toLowerCase().match(/\b\w+\b/g) || [];
    const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'can', 'may', 'might', 'a', 'an']);
    const keywords = words
      .filter(word => word.length > 3 && !commonWords.has(word))
      .reduce((acc: { [key: string]: number }, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {});
    
    return Object.entries(keywords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  };

  const handleClassify = async () => {
    if (!ticketContent) return;
    
    setIsClassifying(true);
    try {
      const result = await classifyTicket(ticketContent);
      setClassificationResult(result);
      onClassificationComplete?.(result);
    } catch (error) {
      console.error("Classification failed:", error);
    } finally {
      setIsClassifying(false);
    }
  };

  useEffect(() => {
    if (ticketContent && ticketContent.length > 10) {
      handleClassify();
    }
  }, [ticketContent]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "destructive";
      case "High": return "warning";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "secondary";
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "Positive": return "bg-success";
      case "Neutral": return "bg-secondary";
      case "Negative": return "bg-warning";
      case "Frustrated": return "bg-destructive";
      default: return "bg-secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Classification Header */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI-Powered Ticket Classification
          </CardTitle>
          <CardDescription>
            Using BERT and advanced NLP models to automatically categorize and prioritize tickets
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="classification" className="space-y-4">
        <TabsList>
          <TabsTrigger value="classification" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Classification Results
          </TabsTrigger>
          <TabsTrigger value="models" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            ML Models Status
          </TabsTrigger>
        </TabsList>

        <TabsContent value="classification" className="space-y-4">
          {isClassifying && (
            <Alert>
              <Brain className="h-4 w-4 animate-pulse" />
              <AlertDescription className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                Analyzing ticket content with NLP models...
              </AlertDescription>
            </Alert>
          )}

          {classificationResult && (
            <div className="grid gap-6">
              {/* Main Classification Results */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Category Classification
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{classificationResult.category}</span>
                        <Badge variant="secondary">{classificationResult.subcategory}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Confidence:</span>
                        <Progress value={classificationResult.confidence * 100} className="flex-1 h-2" />
                        <span>{Math.round(classificationResult.confidence * 100)}%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-muted-foreground">Priority</span>
                        <div className="mt-1">
                          <Badge variant={getPriorityColor(classificationResult.priority) as any}>
                            {classificationResult.priority}
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground">Urgency</span>
                        <div className="mt-1">
                          <Badge variant={getPriorityColor(classificationResult.urgency) as any}>
                            {classificationResult.urgency}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Assignment Suggestion
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Suggested Assignee</span>
                      <div className="mt-1 font-medium">{classificationResult.suggestedAssignee}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Estimated Resolution</span>
                      <div className="mt-1 font-medium">{classificationResult.estimatedResolutionTime}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Similar Tickets</span>
                      <div className="mt-1 flex gap-1">
                        {classificationResult.similarTickets.map(ticket => (
                          <Badge key={ticket} variant="outline" className="text-xs">
                            {ticket}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sentiment Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Sentiment Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getSentimentColor(classificationResult.sentiment)}`}></div>
                      <span className="font-medium">{classificationResult.sentiment}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm text-muted-foreground">Score:</span>
                      <Progress value={classificationResult.sentimentScore * 100} className="flex-1 h-2" />
                      <span className="text-sm">{Math.round(classificationResult.sentimentScore * 100)}%</span>
                    </div>
                  </div>
                  {classificationResult.sentiment === "Frustrated" && (
                    <Alert className="mt-4">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Customer appears frustrated. Consider prioritizing this ticket and providing immediate acknowledgment.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Extracted Keywords
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {classificationResult.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!isClassifying && !classificationResult && ticketContent && (
            <div className="text-center py-8">
              <Button onClick={handleClassify} className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Classify Ticket
              </Button>
            </div>
          )}

          {!ticketContent && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                No ticket content provided for classification. Enter ticket details to see AI analysis.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="models" className="space-y-4">
          <div className="grid gap-4">
            {models.map((model) => (
              <Card key={model.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      {model.name}
                    </CardTitle>
                    <Badge variant={model.status === "Active" ? "default" : "secondary"}>
                      {model.status}
                    </Badge>
                  </div>
                  <CardDescription>Version {model.version}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Accuracy</span>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={model.accuracy} className="flex-1 h-2" />
                        <span className="text-sm font-medium">{model.accuracy}%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Last Trained</span>
                      <div className="mt-1 font-medium">{model.lastTrained}</div>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Total Predictions</span>
                      <div className="mt-1 font-medium">{model.totalPredictions.toLocaleString()}</div>
                    </div>
                  </div>
                  {model.status === "Active" && (
                    <div className="flex items-center gap-2 mt-4 text-sm text-success">
                      <CheckCircle className="h-4 w-4" />
                      Model is active and processing tickets
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Model Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Overall classification system performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">94.2%</div>
                  <div className="text-sm text-muted-foreground">Overall Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-success">1.2s</div>
                  <div className="text-sm text-muted-foreground">Avg Processing Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-info">47.2K</div>
                  <div className="text-sm text-muted-foreground">Total Classifications</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warning">99.8%</div>
                  <div className="text-sm text-muted-foreground">Model Uptime</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}