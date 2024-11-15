import { LucideIcon } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface HealthMetricsCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  trend?: string;
  color: 'rose' | 'blue' | 'amber' | 'indigo' | 'emerald' | 'cyan';
}

const colorVariants = {
  rose: 'bg-rose-50 text-rose-600',
  blue: 'bg-blue-50 text-blue-600',
  amber: 'bg-amber-50 text-amber-600',
  indigo: 'bg-indigo-50 text-indigo-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  cyan: 'bg-cyan-50 text-cyan-600',
};

export function HealthMetricsCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  color,
}: HealthMetricsCardProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-center">
        <div className={cn('rounded-lg p-3', colorVariants[color])}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <span className="ml-auto text-sm font-medium text-green-600">
            {trend}%
          </span>
        )}
      </div>
      <h3 className="mt-4 text-sm font-medium text-gray-500">{title}</h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {unit && <span className="ml-1 text-sm text-gray-500">{unit}</span>}
      </div>
    </div>
  );
}