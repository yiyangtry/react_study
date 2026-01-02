import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Database, 
  Activity, 
  Search, 
  Settings, 
  BarChart3, 
  Server,
  BookOpen,
  Zap,
  Layers,
  FileText,
  Brain
} from 'lucide-react';

const ElasticsearchIndex = () => {
  const lessons = [
    {
      id: 'cluster',
      title: '集群',
      description: '集群架构、分片分布、节点管理等集群相关知识',
      icon: Server,
      path: '/elasticsearch/cluster',
      available: true
    },
    {
      id: 'index',
      title: '索引',
      description: '索引操作、Segment 原理、倒排索引、存储机制等完整知识体系',
      icon: Database,
      path: '/elasticsearch/index',
      available: true
    },
    {
      id: 'shard',
      title: '分片',
      description: '分片原理、路由机制、副本同步等分片相关知识',
      icon: Layers,
      path: '/elasticsearch/shard',
      available: false
    },
    {
      id: 'query',
      title: '查询原理',
      description: '查询执行流程、评分机制、查询优化等查询原理',
      icon: Brain,
      path: '/elasticsearch/query',
      available: false
    },
    {
      id: 'search-api',
      title: '搜索 API',
      description: 'Query DSL、聚合查询、全文搜索等搜索功能',
      icon: Search,
      path: '/elasticsearch/search-api',
      available: false
    },
    {
      id: 'performance',
      title: '性能优化',
      description: '查询优化、索引优化、硬件配置建议',
      icon: Zap,
      path: '/elasticsearch/performance',
      available: false
    },
    {
      id: 'monitoring',
      title: '运维与监控',
      description: '集群健康检查、性能指标监控、告警配置',
      icon: BarChart3,
      path: '/elasticsearch/monitoring',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 头部 */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Database className="text-6xl text-blue-600" />
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Elasticsearch 学习教程
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            从基础概念到高级应用，系统学习 Elasticsearch 分布式搜索引擎的核心知识
          </p>
        </header>

        {/* 课程列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {lessons.map((lesson) => {
            const Icon = lesson.icon;
            const isAvailable = lesson.available;

            const CardContent = (
              <div className={`relative h-full p-6 rounded-xl shadow-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                isAvailable 
                  ? 'bg-white border-blue-300 cursor-pointer hover:border-blue-500 hover:shadow-xl' 
                  : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60'
              }`}>
                {!isAvailable && (
                  <span className="absolute top-3 right-3 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded">
                    即将推出
                  </span>
                )}
                <div className="flex items-start mb-4">
                  <div className={`p-3 rounded-lg ${
                    isAvailable ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <Icon size={32} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900">{lesson.title}</h2>
                <p className={`text-sm ${isAvailable ? 'text-gray-600' : 'text-gray-500'}`}>
                  {lesson.description}
                </p>
                {isAvailable && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-sm font-semibold text-blue-600">开始学习 →</span>
                  </div>
                )}
              </div>
            );

            if (!isAvailable) {
              return <div key={lesson.id}>{CardContent}</div>;
            }

            return (
              <Link key={lesson.id} to={lesson.path}>
                {CardContent}
              </Link>
            );
          })}
        </div>

        {/* 学习进度提示 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">学习建议</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 rounded-full p-2">
                <BookOpen className="text-blue-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">循序渐进</h4>
                <p className="text-sm text-gray-600">建议按照课程顺序学习，先掌握基础概念</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-green-100 rounded-full p-2">
                <Zap className="text-green-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">动手实践</h4>
                <p className="text-sm text-gray-600">每个章节都配有实际案例，建议动手操作</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ElasticsearchIndex;

