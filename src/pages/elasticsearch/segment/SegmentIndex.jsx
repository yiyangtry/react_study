import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText,
  Search,
  Database,
  ArrowRight,
  Layers
} from 'lucide-react';

const SegmentIndex = () => {
  const topics = [
    {
      id: 'principles',
      title: 'Segment 原理',
      description: '深入理解 Segment 的存储结构、创建机制和合并策略',
      icon: FileText,
      path: '/elasticsearch/segment/principles',
      available: true
    },
    {
      id: 'merge-strategy',
      title: 'Segment 合并策略',
      description: '理解 Segment 合并的触发条件、合并策略和优化方法',
      icon: Layers,
      path: '/elasticsearch/segment/merge-strategy',
      available: false
    },
    {
      id: 'inverted-index',
      title: '倒排索引原理',
      description: '倒排索引的数据结构、构建过程和查询机制',
      icon: Search,
      path: '/elasticsearch/segment/inverted-index',
      available: false
    },
    {
      id: 'storage-mechanism',
      title: '存储机制',
      description: 'Translog、Refresh、Flush 等存储机制详解',
      icon: Database,
      path: '/elasticsearch/segment/storage-mechanism',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <header className="mb-8">
          <div className="flex items-center mb-4">
            <FileText className="text-5xl text-blue-600 mr-4" />
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                段（Segment）
              </h1>
              <p className="text-lg text-gray-600">
                深入理解 Elasticsearch 最底层的存储单元 Segment 的工作原理
              </p>
            </div>
          </div>
        </header>

        {/* 介绍卡片 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-500">
          <h2 className="text-xl font-bold text-gray-900 mb-3">什么是 Segment？</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Segment 是 Elasticsearch 中最底层的存储单元，每个分片（Shard）由多个 Segment 组成。
            Segment 是不可变的，一旦创建就不会被修改。理解 Segment 的工作原理，能够帮助我们
            深入理解 Elasticsearch 的存储机制、查询性能和索引优化。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-1">不可变性</h3>
              <p className="text-sm text-blue-700">Segment 创建后不可修改，保证数据一致性</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-1">存储优化</h3>
              <p className="text-sm text-green-700">通过合并策略优化存储空间</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-1">查询性能</h3>
              <p className="text-sm text-purple-700">理解 Segment 如何影响查询性能</p>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SegmentIndex;

