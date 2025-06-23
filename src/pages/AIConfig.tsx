
import Header from '@/components/layout/Header';
import { Brain } from 'lucide-react';
import { MultiAIManager } from '@/components/admin/MultiAIManager';

const AIConfig = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pure-white via-graphite-50 to-graphite-100">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-electric-blue to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-deep-black">
                  Gestion des IA
                </h1>
                <p className="text-graphite-600">
                  Configurez et gérez toutes vos assistantes IA selon les besoins de vos clients
                </p>
              </div>
            </div>
          </div>
          
          {/* Multi-AI Manager */}
          <MultiAIManager />
        </div>
      </div>
    </div>
  );
};

export default AIConfig;
