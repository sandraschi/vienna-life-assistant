import React from 'react';
import { CategoryBadge } from './components/CategoryBadge';

interface DailyConsolidatedProps {
  data: {
    date: string;
    content: {
      highlights?: any;
      metrics?: any;
      achievements?: any;
      priorities?: any;
    };
    metadata?: any;
  };
}

export const DailyConsolidated: React.FC<DailyConsolidatedProps> = ({ data }) => {
  const { date, content } = data;

  // Mock data structure for demonstration - in real implementation this would parse the ADN content
  const mockData = {
    highlights: {
      'new-projects': {
        antigravity: ['readly-mcp configured across all clients ⭐'],
        cursor: ['IDE Ecosystem Framework v2.0 completed ⭐', 'DaVinci Resolve MCP startup fixed ⭐']
      },
      'maintenance': {
        antigravity: ['MCP documentation centralized ✅'],
        cursor: ['MyAI platform Docker diagnostics ✅', 'DaVinci Resolve compatibility fixes ✅']
      },
      'research': {
        antigravity: ['Directmedia DKI analysis research 📚'],
        cursor: ['MCP ecosystem catalog (15+ servers) 📚', 'IDE collaboration patterns documented 📚']
      },
      'insights': {
        antigravity: ['Force Commit protocol established 🔍'],
        cursor: ['Cross-IDE intelligence amplification 🔍', 'FastMCP 2.14.1 best practices 🔍']
      },
      'mcp-news': {
        antigravity: ['Ghidra integration completed 🆕'],
        cursor: ['DaVinci Resolve MCP (33 tools) 🆕', 'Cross-MCP ADN ↔ MyAI ↔ DaVinci integration 🆕']
      }
    },
    metrics: {
      activeProjects: 2,
      maintenanceTasks: 3,
      researchOutputs: 3,
      keyInsights: 3,
      mcpTools: 15
    },
    achievement: 'Categorized Development Intelligence Framework - IDE ecosystem now provides structured insights across all development domains!',
    priorities: [
      'Continue readly-mcp integration and expand IDE ecosystem to Windsurf/Zed',
      'Monitor MyAI platform stability and test DaVinci Resolve functionality',
      'Document CDC testing methodology and analyze performance patterns',
      'Develop cross-IDE collaboration protocols and optimize workflows'
    ]
  };

  const renderCategorySection = (category: keyof typeof mockData.highlights, title: string, icon: string) => {
    const categoryData = mockData.highlights[category];
    const hasContent = Object.values(categoryData).some((items: any) => items.length > 0);

    if (!hasContent) return null;

    return (
      <section className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-xl">{icon}</span>
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <CategoryBadge
              category={category}
              count={Object.values(categoryData).flat().length}
              size="sm"
            />
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {Object.entries(categoryData).map(([ide, items]: [string, any]) => {
              if (!items || items.length === 0) return null;

              return (
                <div key={ide} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-900 mb-3 capitalize">
                    {ide === 'antigravity' && '🛠️ Antigravity'}
                    {ide === 'cursor' && '🤖 Cursor'}
                    {ide === 'windsurf' && '🌊 Windsurf'}
                    {ide === 'zed' && '⚡ Zed'}
                  </h3>
                  <ul className="space-y-2">
                    {items.map((item: string, index: number) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-green-600 mt-1">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="daily-consolidated space-y-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-6 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Daily Consolidated: {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </h1>
              <p className="text-blue-100 mt-1">Best highlights from all active IDE streams</p>
            </div>
            <div className="text-right">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-blue-100 text-sm">Development Intelligence</div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{mockData.metrics.activeProjects}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{mockData.metrics.maintenanceTasks}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Maintenance</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{mockData.metrics.researchOutputs}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Research</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{mockData.metrics.keyInsights}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Insights</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-600">{mockData.metrics.mcpTools}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">MCP Tools</div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Banner */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">🎖️</div>
          <div>
            <h3 className="font-semibold text-lg">Achievement Unlocked</h3>
            <p className="mt-1">{mockData.achievement}</p>
          </div>
        </div>
      </div>

      {/* Work Category Sections */}
      <div className="grid gap-6">
        {renderCategorySection('new-projects', 'New Project Highlights', '🚀')}
        {renderCategorySection('maintenance', 'Maintenance & Fixes', '🔧')}
        {renderCategorySection('research', 'Research & Documentation', '🔍')}
        {renderCategorySection('insights', 'Insights & Learnings', '💡')}
        {renderCategorySection('mcp-news', 'MCP Ecosystem Updates', '📰')}
      </div>

      {/* Tomorrow's Priorities */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-xl">🎯</span>
            <h2 className="text-lg font-semibold text-gray-900">Priority Focus for Tomorrow</h2>
          </div>
        </div>

        <div className="p-6">
          <ol className="space-y-3">
            {mockData.priorities.map((priority, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-700 leading-relaxed">{priority}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-8 border-t border-gray-200">
        <p className="text-gray-600">
          This consolidated daily note pulls the best highlights from all active IDE sessions.
          Each IDE maintains its own specialized stream while contributing to the unified development narrative.
        </p>
        <div className="mt-4 flex justify-center space-x-4 text-sm text-gray-500">
          <span>🤝 IDE Ecosystem Collaboration</span>
          <span>•</span>
          <span>📊 Development Intelligence</span>
          <span>•</span>
          <span>🚀 Continuous Improvement</span>
        </div>
      </div>
    </div>
  );
};