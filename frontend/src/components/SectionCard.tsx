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
  onDelete,
}) => {
  const trendClass = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-500';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            ✏️
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            🗑️
          </button>
        </div>
      </div>
      <div className="text-right mb-4">
        <span className="text-3xl font-bold text-gray-800">
          {metricValue}{metricSuffix}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className={`text-sm font-medium>font-medium ${trendClass}`}>
          {trend === 'up' && '▲'}
          {trend === 'down' && '▼'}
          {trend === 'neutral' && '●'}
        </span>
        <span className="text-xs text-gray-400">Ultimo aggiornamento: oggi</span>
      </div>
    </div>
  );
};

export default SectionCard;
