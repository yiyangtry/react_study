import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Database,
  FileText,
  RefreshCw,
  Settings,
  ArrowRight,
  BookOpen,
  Search
} from 'lucide-react';

const IndexIndex = () => {
  const topics = [
    {
      id: 'inverted-index',
      title: '倒排索引',
      description: '倒排索引介绍',
      icon: Search,
      path: '/elasticsearch/index/inverted-index',
      available: true
    },
    {
      id: 'write-flow',
      title: '索引写入流程',
      description: '深入理解文档从写入请求到持久化存储的完整流程',
      icon: FileText,
      path: '/elasticsearch/index/write-flow',
      available: true
    },
    {
      id: 'basic-concepts',
      title: '索引基础概念',
      description: '索引、文档、字段、映射等核心概念详解',
      icon: BookOpen,
      path: '/elasticsearch/index/basic-concepts',
      available: false
    },
    {
      id: 'create-management',
      title: '索引创建与管理',
      description: '索引创建、更新、删除、别名管理等操作',
      icon: Settings,
      path: '/elasticsearch/index/create-management',
      available: false
    },
    {
      id: 'lifecycle',
      title: '索引生命周期（ILM）',
      description: '索引创建、更新、删除的完整生命周期管理',
      icon: RefreshCw,
      path: '/elasticsearch/index/lifecycle',
      available: false
    },
    {
      id: 'template-alias',
      title: '索引模板与别名',
      description: '索引模板的创建和使用，别名的管理和切换',
      icon: Database,
      path: '/elasticsearch/index/template-alias',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <header className="mb-8">
          <div className="flex items-center mb-4">
            <Database className="text-5xl text-blue-600 mr-4" />
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                索引（Index）
              </h1>
              <p className="text-lg text-gray-600">
                深入理解 Elasticsearch 索引的创建、管理和数据写入流程
              </p>
            </div>
          </div>
        </header>

        {/* 介绍卡片 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-500">
          <h2 className="text-xl font-bold text-gray-900 mb-3">什么是索引？</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            索引是 Elasticsearch 中存储相关文档的集合。每个索引都有自己的映射（Mapping）和设置（Settings）。
            理解索引的工作原理，能够帮助我们更好地设计数据结构、优化写入性能和管理索引生命周期。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-1">数据组织</h3>
              <p className="text-sm text-blue-700">通过索引组织和管理数据</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-1">写入性能</h3>
              <p className="text-sm text-green-700">优化索引配置提升写入速度</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-1">生命周期管理</h3>
              <p className="text-sm text-purple-700">通过 ILM 管理索引的完整生命周期</p>
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
                <h4 className="font-semibold text-gray-900 mb-1">索引基础概念</h4>
                <p className="text-sm text-gray-600">先理解索引、文档、映射等基本概念</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">索引写入流程</h4>
                <p className="text-sm text-gray-600">深入理解文档写入的完整流程</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">索引创建与管理</h4>
                <p className="text-sm text-gray-600">掌握索引的创建、更新、删除等操作</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexIndex;

