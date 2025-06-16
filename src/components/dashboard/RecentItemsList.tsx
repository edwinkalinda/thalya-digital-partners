
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { motion } from "framer-motion";

interface RecentItem {
  id: string;
  name: string;
  description?: string;
  status?: string;
  date: string;
  icon?: React.ReactNode;
  gradient?: string;
  borderColor?: string;
}

interface RecentItemsListProps {
  title: string;
  items: RecentItem[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: any;
  onEmptyAction?: () => void;
  emptyActionLabel?: string;
}

export const RecentItemsList = ({ 
  title, 
  items, 
  loading = false,
  emptyMessage = "Aucun élément récent",
  emptyIcon = Activity,
  onEmptyAction,
  emptyActionLabel
}: RecentItemsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-deep-black flex items-center">
          <Activity className="w-6 h-6 mr-2 text-electric-blue" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingSpinner text="Chargement des données..." />
        ) : items.length === 0 ? (
          <EmptyState
            icon={emptyIcon}
            title="Aucune donnée"
            description={emptyMessage}
            actionLabel={emptyActionLabel}
            onAction={onEmptyAction}
          />
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <motion.div 
                key={item.id} 
                className={`p-4 rounded-lg border ${item.gradient || 'bg-gray-50'} ${item.borderColor || 'border-gray-200'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {item.icon && (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        {item.icon}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-deep-black">{item.name}</p>
                      {item.description && (
                        <p className="text-sm text-graphite-600">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-deep-black">
                      {new Date(item.date).toLocaleDateString('fr-FR')}
                    </p>
                    {item.status && (
                      <p className="text-sm text-graphite-600 capitalize">{item.status}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
