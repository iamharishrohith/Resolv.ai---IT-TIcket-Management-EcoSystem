import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Shield } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onLogin(email);
    }
  };

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    onLogin(demoEmail);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-info rounded-2xl flex items-center justify-center shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
              Resolv.ai
            </CardTitle>
            <CardDescription className="text-base text-muted-foreground">
              AI-Powered Proactive IT Support
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-foreground/80">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 bg-white border-border/50 focus:border-primary/50 focus:ring-primary/20"
                required
              />
            </div>
            <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90 transition-all duration-200 shadow-lg">
              Sign In with SSO
            </Button>
          </form>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="bg-border/60" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-4 text-xs uppercase tracking-wider text-muted-foreground/80">
                Demo Accounts
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start h-14 hover:bg-accent/50 hover:border-primary/30 transition-all duration-200"
              onClick={() => handleDemoLogin('subhaharini@resolv.ai')}
            >
              <div className="text-left">
                <div className="font-medium text-foreground">Subhaharini</div>
                <div className="text-xs text-muted-foreground">Junior Developer</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-14 hover:bg-accent/50 hover:border-primary/30 transition-all duration-200"
              onClick={() => handleDemoLogin('karthikeyan@resolv.ai')}
            >
              <div className="text-left">
                <div className="font-medium text-foreground">Karthikeyan</div>
                <div className="text-xs text-muted-foreground">Solutions Architect</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-14 hover:bg-accent/50 hover:border-primary/30 transition-all duration-200"
              onClick={() => handleDemoLogin('harish@resolv.ai')}
            >
              <div className="text-left">
                <div className="font-medium text-foreground">Harish Rohith S</div>
                <div className="text-xs text-muted-foreground">IT Administrator</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}