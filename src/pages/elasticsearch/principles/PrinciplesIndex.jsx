import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers,
  FileText,
  Database,
  Search,
  Zap,
  Network,
  RefreshCw,
  ArrowRight,
  ZoomIn
} from 'lucide-react';

const PrinciplesIndex = () => {
  const topics = [
    {
      id: 'architecture-hierarchy',
      title: 'ES 架构全景图',
      description: '交互式探索从 Cluster 到 Segment 的完整架构层次，物理层、逻辑层、底层核心',
      icon: ZoomIn,
      path: '/elasticsearch/principles/architecture',
      available: true
    },
    {
      id: 'segment',
      title: 'Segment 原理',
      description: '深入理解 Segment 的存储结构、创建机制和合并策略',
      icon: FileText,
      path: '/elasticsearch/principles/segment',
      available: true
    },
    {
      id: 'inverted-index',
      title: '倒排索引原理',
      description: '倒排索引的数据结构、构建过程和查询机制',
      icon: Search,
      path: '/elasticsearch/principles/inverted-index',
      available: false
    },
    {
      id: 'storage',
      title: '存储机制',
      description: 'Translog、Refresh、Flush 等存储机制详解',
      icon: Database,
      path: '/elasticsearch/principles/storage',
      available: false
    },
    {
      id: 'query-execution',
      title: '查询执行原理',
      description: '查询流程、评分机制、聚合执行原理',
      icon: Zap,
      path: '/elasticsearch/principles/query-execution',
      available: false
    },
    {
      id: 'distributed',
      title: '分布式原理',
      description: '分布式一致性、分片路由、副本同步机制',
      icon: Network,
      path: '/elasticsearch/principles/distributed',
      available: false
    },
    {
      id: 'lifecycle',
      title: '索引生命周期',
      description: '索引创建、更新、删除的完整生命周期',
      icon: RefreshCw,
      path: '/elasticsearch/principles/lifecycle',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <header className="mb-8">
          <div className="flex items-center mb-4">
            <Layers className="text-5xl text-blue-600 mr-4" />
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                原理与架构
              </h1>
              <p className="text-lg text-gray-600">
                深入理解 Elasticsearch 的底层原理和架构设计
              </p>
            </div>
          </div>
        </header>

        {/* 介绍卡片 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-500">
          <h2 className="text-xl font-bold text-gray-900 mb-3">为什么学习原理？</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            理解 Elasticsearch 的底层原理，能够帮助我们更好地使用和优化 Elasticsearch。
            从 Segment 的存储机制到分布式一致性，从倒排索引的构建到查询的执行流程，
            这些知识将帮助你深入理解 Elasticsearch 的工作原理，从而做出更明智的技术决策。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-1">性能优化</h3>
              <p className="text-sm text-blue-700">理解原理才能找到性能瓶颈</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-1">问题排查</h3>
              <p className="text-sm text-green-700">掌握原理才能快速定位问题</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-1">架构设计</h3>
              <p className="text-sm text-purple-700">理解原理才能设计合理架构</p>
            </div>
          </div>
        </div>

        {/* 主题列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const isAvailable = topic.available;

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
                    <Icon size={28} />
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-2 text-gray-900">{topic.title}</h2>
                <p className={`text-sm mb-4 ${isAvailable ? 'text-gray-600' : 'text-gray-500'}`}>
                  {topic.description}
                </p>
                {isAvailable && (
                  <div className="flex items-center text-blue-600 font-semibold">
                    <span className="text-sm">开始学习</span>
                    <ArrowRight size={16} className="ml-2" />
                  </div>
                )}
              </div>
            );

            if (!isAvailable) {
              return <div key={topic.id}>{CardContent}</div>;
            }

            return (
              <Link key={topic.id} to={topic.path}>
                {CardContent}
              </Link>
            );
          })}
        </div>

        {/* 学习路径 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">推荐学习路径</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Segment 原理</h4>
                <p className="text-sm text-gray-600">从最基础的存储单元开始，理解 Segment 的结构和机制</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">倒排索引原理</h4>
                <p className="text-sm text-gray-600">理解 Elasticsearch 的核心数据结构</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">存储机制</h4>
                <p className="text-sm text-gray-600">掌握数据写入、刷新、持久化的完整流程</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">查询执行原理</h4>
                <p className="text-sm text-gray-600">理解查询是如何被执行的</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrinciplesIndex;

