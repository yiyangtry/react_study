import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Server,
  ZoomIn,
  Activity,
  Network,
  ArrowRight
} from 'lucide-react';

const ClusterIndex = () => {
  const topics = [
    {
      id: 'architecture',
      title: '集群架构全景图',
      description: '交互式探索从 Cluster 到 Segment 的完整架构层次，物理层、逻辑层、底层核心',
      icon: ZoomIn,
      path: '/elasticsearch/cluster/architecture',
      available: true
    },
    {
      id: 'shard-distribution',
      title: '分片分布可视化',
      description: '可视化展示 ES 集群中分片的分布情况，理解分片在节点间的分配机制',
      icon: Activity,
      path: '/elasticsearch/cluster/shard-distribution',
      available: true
    },
    {
      id: 'shard-simulation',
      title: '分片动态仿真',
      description: '动态仿真 ES 集群分片的分布、迁移和负载均衡过程',
      icon: Network,
      path: '/elasticsearch/cluster/shard-simulation',
      available: true
    },
    {
      id: 'node-management',
      title: '节点管理',
      description: '节点角色、节点发现、节点加入和退出机制',
      icon: Server,
      path: '/elasticsearch/cluster/node-management',
      available: false
    },
    {
      id: 'cluster-health',
      title: '集群健康监控',
      description: '集群状态、健康检查、故障检测和恢复机制',
      icon: Activity,
      path: '/elasticsearch/cluster/health',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 头部 */}
        <header className="mb-8">
          <div className="flex items-center mb-4">
            <Server className="text-5xl text-blue-600 mr-4" />
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                集群（Cluster）
              </h1>
              <p className="text-lg text-gray-600">
                深入理解 Elasticsearch 集群的架构、分片分布和节点管理
              </p>
            </div>
          </div>
        </header>

        {/* 介绍卡片 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-l-4 border-blue-500">
          <h2 className="text-xl font-bold text-gray-900 mb-3">什么是集群？</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Elasticsearch 集群是由一个或多个节点组成的分布式系统。集群提供了高可用性、
            水平扩展能力和数据冗余。理解集群的工作原理，能够帮助我们更好地设计和管理 Elasticsearch 系统。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-1">高可用性</h3>
              <p className="text-sm text-blue-700">通过副本机制保证服务可用</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-1">水平扩展</h3>
              <p className="text-sm text-green-700">通过增加节点提升集群性能</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900 mb-1">负载均衡</h3>
              <p className="text-sm text-purple-700">自动分配分片实现负载均衡</p>
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
                <h4 className="font-semibold text-gray-900 mb-1">集群架构全景图</h4>
                <p className="text-sm text-gray-600">先了解集群的整体架构，理解节点、索引、分片的关系</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">分片分布可视化</h4>
                <p className="text-sm text-gray-600">理解分片在集群中的分布机制</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">分片动态仿真</h4>
                <p className="text-sm text-gray-600">深入理解分片的迁移和负载均衡过程</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClusterIndex;

