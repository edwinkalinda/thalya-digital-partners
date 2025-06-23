
import Header from '@/components/layout/Header';
import { Settings } from 'lucide-react';
import { MultiAIManager } from '@/components/admin/MultiAIManager';

const AIConfig = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-16 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Configuration des IA
                </h1>
                <p className="text-gray-600">
                  Gérez et configurez vos assistantes IA selon les besoins de vos clients
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
