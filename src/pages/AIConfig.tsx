
import { useState } from 'react';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Settings, Activity } from 'lucide-react';
import { VoiceConfigPanel } from '@/components/admin/VoiceConfigPanel';
import { VoiceSystemPanel } from '@/components/admin/VoiceSystemPanel';

const AIConfig = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-electric-blue to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-deep-black">
                  Configuration IA
                </h1>
                <p className="text-graphite-600">
                  Paramètres avancés de Clara - Réservé aux administrateurs
                </p>
              </div>
            </div>
          </div>
          
          {/* Main Configuration Interface */}
          <Tabs defaultValue="config" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="config" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuration
              </TabsTrigger>
              <TabsTrigger value="system" className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                Système
              </TabsTrigger>
            </TabsList>

            <TabsContent value="config">
              <VoiceConfigPanel />
            </TabsContent>

            <TabsContent value="system">
              <VoiceSystemPanel />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AIConfig;
