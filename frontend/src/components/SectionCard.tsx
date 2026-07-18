import React from 'react';

interface SectionCardProps {
  title: string;
  subtitle: string;
  metricValue: number;
  metricSuffix: string;
  trend: 'up' | 'down' | 'neutral';
  onEdit: () => void;
  onDelete: () => void;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  subtitle,
  metricValue,
  metricSuffix,
  trend,
  onEdit,
  onDelete
}) => {
  const trendClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-500'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-1">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onEdit}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Modifica"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 hover:text-gray-900" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Elimina"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600 hover:text-red-900" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.38l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 01-2 0V8zm5-1a1 1 0 000 2v6a1 1 0 000 2h2a1 1 0 000-2v-6a1 1 0 000-2h-2zm4-1a1 1 0 010 2H7a1 1 0 010-2h2z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      <div className="text-right">
        <div className="text-3xl font-bold text-gray-900">
          {metricValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{metricSuffix}
        </div>
        <div className={`flex items-center mt-2 ${trendClasses[trend]}`}>
          <span className="mr-1">
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '→'}
          </span>
          <span className="text-sm font-medium">
            {trend === 'up' ? '+2.4%' : trend === 'down' ? '-1.2%' : '→ 0.0%'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SectionCard;