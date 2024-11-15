// src/components/Alert.tsx
interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
}

export const Alert: React.FC<AlertProps> = ({ message, type }) => {
  // Define static color classes based on the alert type
  const colorClasses = {
    success: 'text-green-700 bg-green-100',
    error: 'text-red-700 bg-red-100',
    info: 'text-blue-700 bg-blue-100',
  };

  return (
    <div className={`p-4 mb-4 text-sm rounded-lg ${colorClasses[type]}`} role="alert">
      {message}
    </div>
  );
};
