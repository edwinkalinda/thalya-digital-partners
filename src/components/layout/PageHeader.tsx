
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const PageHeader = ({ title, subtitle, children }: PageHeaderProps) => {
  return (
    <motion.div 
      className="text-center space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold text-deep-black">{title}</h1>
      {subtitle && (
        <p className="text-xl text-graphite-600">{subtitle}</p>
      )}
      {children}
    </motion.div>
  );
};
