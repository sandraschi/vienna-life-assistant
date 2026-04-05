import React from 'react';

export type WorkCategory = 'new-projects' | 'maintenance' | 'research' | 'insights' | 'mcp-news';

interface CategoryBadgeProps {
  category: WorkCategory;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({
  category,
  count,
  size = 'md'
}) => {
  const categoryConfig = {
    'new-projects': {
      icon: '🚀',
      label: 'New Projects',
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      hoverColor: 'hover:bg-blue-200'
    },
    'maintenance': {
      icon: '🔧',
      label: 'Maintenance',
      color: 'bg-green-100 text-green-800 border-green-200',
      hoverColor: 'hover:bg-green-200'
    },
    'research': {
      icon: '🔍',
      label: 'Research',
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      hoverColor: 'hover:bg-purple-200'
    },
    'insights': {
      icon: '💡',
      label: 'Insights',
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      hoverColor: 'hover:bg-yellow-200'
    },
    'mcp-news': {
      icon: '📰',
      label: 'MCP News',
      color: 'bg-pink-100 text-pink-800 border-pink-200',
      hoverColor: 'hover:bg-pink-200'
    }
  };

  const config = categoryConfig[category];
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span className={`
      inline-flex items-center rounded-full border font-medium transition-colors
      ${config.color} ${config.hoverColor} ${sizeClasses[size]}
    `}>
      <span className="mr-1">{config.icon}</span>
      <span>{config.label}</span>
      {count !== undefined && count > 0 && (
        <span className="ml-1.5 bg-current bg-opacity-20 px-1.5 py-0.5 rounded-full text-xs">
          {count}
        </span>
      )}
    </span>
  );
};