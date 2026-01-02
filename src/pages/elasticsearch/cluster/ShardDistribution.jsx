import React from 'react';
import { Activity, Database } from 'lucide-react';
import NodeCard from '../../../components/NodeCard';

const ShardDistribution = () => {
  const data = [
    {
      name: "es-cn-node-0001",
      ip: "172.16.44.28",
      totalStore: "229.5",
      isHot: true,
      shards: [
        { id: 1, type: 'p', docs: 340229580, store: '115gb', isPrimary: true },
        { id: 2, type: 'p', docs: 337601751, store: '114.5gb', isPrimary: true }
      ]
    },
    {
      name: "es-cn-node-0002",
      ip: "172.16.44.19",
      totalStore: "229.3",
      isHot: false,
      shards: [
        { id: 0, type: 'p', docs: 337640291, store: '114gb', isPrimary: true },
        { id: 1, type: 'r', docs: 340229580, store: '115.3gb', isPrimary: false }
      ]
    },
    {
      name: "es-cn-node-0003",
      ip: "172.16.44.27",
      totalStore: "227.9",
      isHot: false,
      shards: [
        { id: 2, type: 'r', docs: 337601751, store: '114.2gb', isPrimary: false },
        { id: 0, type: 'r', docs: 337640290, store: '113.7gb', isPrimary: false }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center">
            <Activity className="mr-2 text-blue-600" />
            reach_data_channel_subtask_v1 分片分布图
          </h1>
          <p className="text-gray-600 mt-2">集群健康度：<span className="text-green-600 font-bold">GREEN</span> | 共 3 主分片，3 副本分片</p>
        </header>

        <div className="flex flex-wrap gap-6 mb-8">
          {data.map((node, idx) => (
            <NodeCard key={idx} {...node} />
          ))}
        </div>

        <div className="bg-blue-900 text-white rounded-xl p-6 shadow-xl">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <Database className="mr-2" />
            数据洞察 (Insights)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-800 p-4 rounded-lg">
              <div className="text-blue-200 text-xs uppercase font-bold mb-1">总文档数</div>
              <div className="text-2xl font-mono">1,015,471,622</div>
              <div className="text-xs text-blue-300 mt-1">约 10.15 亿条记录</div>
            </div>
            <div className="bg-blue-800 p-4 rounded-lg">
              <div className="text-blue-200 text-xs uppercase font-bold mb-1">物理总存储</div>
              <div className="text-2xl font-mono">686.7 GB</div>
              <div className="text-xs text-blue-300 mt-1">含所有主副分片</div>
            </div>
            <div className="bg-blue-800 p-4 rounded-lg">
              <div className="text-blue-200 text-xs uppercase font-bold mb-1">平均分片大小</div>
              <div className="text-2xl font-mono">114.4 GB</div>
              <div className="text-xs text-yellow-300 mt-1">⚠️ 超过建议值 (50GB)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShardDistribution;

