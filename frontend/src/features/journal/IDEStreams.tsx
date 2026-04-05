import React, { useState } from 'react';
import { CategoryBadge, WorkCategory } from './components/CategoryBadge';

interface IDEStreamsProps {
  data: {
    date: string;
    streams?: Record<string, any>;
    metadata?: any;
  };
}

const IDE_CONFIG = {
  antigravity: {
    name: 'Antigravity',
    icon: '🛠️',
    color: 'bg-orange-100 text-orange-800',
    description: 'Code review, refactoring, bulk operations, performance optimization'
  },
  cursor: {
    name: 'Cursor',
    icon: '🤖',
    color: 'bg-blue-100 text-blue-800',
    description: 'MCP ecosystem, AI tool integration, cross-platform workflows'
  },
  windsurf: {
    name: 'Windsurf',
    icon: '🌊',
    color: 'bg-cyan-100 text-cyan-800',
    description: 'UI/UX development, design systems, creative workflows'
  },
  zed: {
    name: 'Zed',
    icon: '⚡',
    color: 'bg-purple-100 text-purple-800',
    description: 'High-performance coding, systems programming, low-level optimization'
  }
};

export const IDEStreams: React.FC<IDEStreamsProps> = ({ data }) => {
  const [selectedIDE, setSelectedIDE] = useState<string>('cursor');
  const { date, streams = {} } = data;

  // Mock data for demonstration - in real implementation this would parse the ADN streams
  const mockStreams = {
    antigravity: {
      sessionStart: '14:30',
      newProjects: [
        { name: 'readly-mcp', day: 3, maxDays: 10, progress: 30, status: 'active' }
      ],
      maintenance: [
        'MCP documentation centralized in mcp-central-docs ✅',
        'Git .gitignore updated for Node.js build artifacts ✅'
      ],
      research: [
        'Directmedia DKI format reverse engineering research 📚',
        'CDC (Compilation-Decompilation-Comparison) testing methodology 📚'
      ],
      insights: [
        'UI bottleneck identified: "Review Changes" interface for bulk updates 🔍',
        'Force Commit protocol established for efficient bulk operations 🔍'
      ],
      mcpNews: [
        'Ghidra integration completed via LaurieWired MCP plugin 🆕',
        'Rate limits and security updates in Antigravity Dec 2025 🆕'
      ],
      metrics: {
        activeProjects: 1,
        maintenanceTasks: 2,
        researchOutputs: 2,
        keyInsights: 2,
        mcpToolsUpdated: 2
      }
    },
    cursor: {
      sessionStart: '16:30',
      newProjects: [
        { name: 'IDE Ecosystem Framework', day: 1, maxDays: 3, progress: 67, status: 'active' },
        { name: 'DaVinci Resolve MCP Integration', day: 1, maxDays: 1, progress: 100, status: 'completed' }
      ],
      maintenance: [
        'MyAI Platform: Docker daemon diagnostics and startup guidance ✅',
        'DaVinci Resolve MCP: FastMCP 2.14.1 compatibility fixes ✅',
        'MCP Tool Registration: Portmanteau system fixes ✅'
      ],
      research: [
        'MCP Server Ecosystem: Comprehensive catalog of 15+ servers 📚',
        'IDE Collaboration Patterns: Multi-assistant development workflows 📚',
        'FastMCP Integration: v2.14.1 patterns and best practices 📚'
      ],
      insights: [
        'Cross-IDE intelligence amplification through specialized streams + consolidation 🔍',
        'MCP tool registration requires async functions and proper decorators 🔍',
        'Docker daemon status is critical path for AI service availability 🔍'
      ],
      mcpNews: [
        'DaVinci Resolve MCP: 33 video editing tools now available 🆕',
        'Filesystem MCP: Comprehensive file operations with Docker integration 🆕',
        'Cross-MCP ADN ↔ MyAI ↔ DaVinci integration established 🆕'
      ],
      metrics: {
        activeProjects: 2,
        maintenanceTasks: 3,
        researchOutputs: 3,
        keyInsights: 3,
        mcpToolsUpdated: 15
      }
    }
  };

  const currentStream = mockStreams[selectedIDE as keyof typeof mockStreams] || mockStreams.cursor;

  const renderCategorySection = (
    category: WorkCategory,
    title: string,
    icon: string,
    items: any[]
  ) => {
    if (!items || items.length === 0) return null;

    return (
      <section className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <span className="text-xl">{icon}</span>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <CategoryBadge category={category} count={items.length} size="sm" />
          </div>
        </div>

        <div className="p-6">
          {category === 'new-projects' ? (
            <div className="space-y-4">
              {items.map((project, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{project.name}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        Day {project.day}/{project.maxDays}
                      </span>
                      {project.status === 'completed' && (
                        <span className="text-green-600">✅</span>
                      )}
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>

                  <div className="text-sm text-gray-600">
                    Progress: {project.progress}% complete
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-3">
              {items.map((item, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-green-600 mt-1">•</span>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    );
  };

  return (
    <div className="ide-streams">
      {/* IDE Selector */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">IDE Streams</h2>
          <p className="text-gray-600 text-sm mt-1">Select an IDE to view its specialized daily stream</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(IDE_CONFIG).map(([id, config]) => (
              <button
                key={id}
                onClick={() => setSelectedIDE(id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedIDE === id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">{config.icon}</div>
                  <div className="font-medium text-gray-900">{config.name}</div>
                  <div className="text-xs text-gray-600 mt-1 leading-tight">
                    {config.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected IDE Stream */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className={`px-6 py-6 ${
          selectedIDE === 'antigravity' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
          selectedIDE === 'cursor' ? 'bg-gradient-to-r from-blue-500 to-purple-500' :
          selectedIDE === 'windsurf' ? 'bg-gradient-to-r from-cyan-500 to-blue-500' :
          'bg-gradient-to-r from-purple-500 to-pink-500'
        } text-white`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Daily {IDE_CONFIG[selectedIDE as keyof typeof IDE_CONFIG].name}: {new Date(date).toLocaleDateString()}
              </h1>
              <p className="mt-1 opacity-90">
                Session started at {currentStream.sessionStart}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl mb-2">
                {IDE_CONFIG[selectedIDE as keyof typeof IDE_CONFIG].icon}
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-blue-600">{currentStream.metrics.activeProjects}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Projects</div>
            </div>
            <div>
              <div className="text-xl font-bold text-green-600">{currentStream.metrics.maintenanceTasks}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Maintenance</div>
            </div>
            <div>
              <div className="text-xl font-bold text-purple-600">{currentStream.metrics.researchOutputs}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Research</div>
            </div>
            <div>
              <div className="text-xl font-bold text-yellow-600">{currentStream.metrics.keyInsights}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">Insights</div>
            </div>
            <div>
              <div className="text-xl font-bold text-pink-600">{currentStream.metrics.mcpToolsUpdated}</div>
              <div className="text-xs text-gray-600 uppercase tracking-wide">MCP Tools</div>
            </div>
          </div>
        </div>

        {/* Work Sections */}
        <div className="p-6 space-y-6">
          {renderCategorySection('new-projects', '🚀 New Projects', '🚀', currentStream.newProjects)}
          {renderCategorySection('maintenance', '🔧 Project Maintenance', '🔧', currentStream.maintenance)}
          {renderCategorySection('research', '🔍 Research & Documentation', '🔍', currentStream.research)}
          {renderCategorySection('insights', '💡 Insights & Learnings', '💡', currentStream.insights)}
          {renderCategorySection('mcp-news', '📰 MCP Server Zoo News', '📰', currentStream.mcpNews)}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center py-6 border-t border-gray-200">
        <p className="text-gray-600 mb-4">
          Each IDE maintains its own specialized focus area while contributing to the unified development narrative.
        </p>
        <div className="flex justify-center space-x-6 text-sm text-gray-500">
          <span>🎯 Specialized Intelligence</span>
          <span>•</span>
          <span>🤝 Collaborative Development</span>
          <span>•</span>
          <span>📊 Categorized Insights</span>
        </div>
      </div>
    </div>
  );
};