import React, { useState, useEffect, useRef } from 'react';
import { Server, Database, AlertTriangle, CheckCircle, RefreshCw, Info } from 'lucide-react';

const ClusterSimulator = () => {
  // --- 核心状态 ---
  const [nodeCount, setNodeCount] = useState(3);
  const [primaryShards, setPrimaryShards] = useState(5);
  const [replicas, setReplicas] = useState(1);
  
  // 模拟集群状态
  const [clusterState, setClusterState] = useState({
    nodes: [],
    unassigned: [],
    status: 'green',
    relocatingShards: [] // 记录哪些分片刚刚发生了移动
  });

  // 上一次的分配映射，用于检测移动 { shardUniqueId: nodeId }
  const prevAllocationRef = useRef({});

  // --- 核心分配算法 (简化版 ES Logic) ---
  const rebalanceCluster = () => {
    const totalShards = [];
    // 1. 生成所有分片对象
    for (let i = 0; i < primaryShards; i++) {
      // 主分片
      totalShards.push({ 
        id: i, 
        type: 'p', 
        uid: `p-${i}`, 
        color: 'bg-blue-500 border-blue-600' 
      });
      // 副本分片
      for (let r = 0; r < replicas; r++) {
        totalShards.push({ 
          id: i, 
          type: 'r', 
          uid: `r-${i}-${r}`, 
          color: 'bg-slate-300 border-slate-400 text-slate-600' 
        });
      }
    }

    // 2. 初始化节点
    const nodes = Array.from({ length: nodeCount }, (_, i) => ({
      id: i,
      name: `Node ${i + 1}`,
      shards: []
    }));
    const unassigned = [];

    // 3. 分配逻辑 (Greedy Allocation with Anti-affinity)
    // ES 实际上使用更复杂的评分函数，这里使用简化的贪心算法：
    // 优先填满空闲节点，同时保证同一分片ID的主副本不共存。

    // 辅助函数：找到当前最适合放置该分片的节点
    const findBestNode = (shard, currentNodes) => {
      // 规则1: 必须不能包含该分片ID的其他副本（主或副）
      const validNodes = currentNodes.filter(node => {
        const hasSameShardId = node.shards.some(s => s.id === shard.id);
        return !hasSameShardId;
      });

      if (validNodes.length === 0) return null; // 没有合法节点（通常是因为节点太少，副本太多）

      // 规则2: 在合法节点中，选择负载（分片数）最小的
      // 如果分片数相同，随机选一个或者按顺序选，这里按顺序选以保持稳定
      validNodes.sort((a, b) => a.shards.length - b.shards.length);
      return validNodes[0];
    };

    // 先分配主分片 (通常主分片优先)
    const primaries = totalShards.filter(s => s.type === 'p');
    const reps = totalShards.filter(s => s.type === 'r');

    // 混合队列分配
    [...primaries, ...reps].forEach(shard => {
      const targetNode = findBestNode(shard, nodes);
      if (targetNode) {
        targetNode.shards.push(shard);
      } else {
        unassigned.push(shard);
      }
    });

    // --- 4. 状态计算与移动检测 ---
    const currentAllocation = {};
    const relocating = [];

    nodes.forEach(node => {
      node.shards.forEach(shard => {
        currentAllocation[shard.uid] = node.id;
        // 检查是否移动
        if (prevAllocationRef.current[shard.uid] !== undefined && 
            prevAllocationRef.current[shard.uid] !== node.id) {
          relocating.push(shard.uid);
        }
      });
    });

    // 确定集群健康状态
    let status = 'green';
    if (unassigned.length > 0) {
      // 如果有主分片未分配，则是 Red
      const hasUnassignedPrimary = unassigned.some(s => s.type === 'p');
      status = hasUnassignedPrimary ? 'red' : 'yellow';
    }

    // 更新状态
    prevAllocationRef.current = currentAllocation;
    setClusterState({
      nodes,
      unassigned,
      status,
      relocatingShards: relocating
    });
  };

  // 当配置变化时自动重平衡
  useEffect(() => {
    rebalanceCluster();
  }, [nodeCount, primaryShards, replicas]);

  // --- 样式辅助 ---
  const getStatusColor = (s) => {
    if (s === 'green') return 'bg-green-100 text-green-700 border-green-300';
    if (s === 'yellow') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    return 'bg-red-100 text-red-700 border-red-300';
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Database className="text-blue-600" />
              ES 集群分片动态仿真
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              调整参数，观察 Elasticsearch 如何自动分配分片并保证高可用
            </p>
          </div>
          
          <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 font-bold shadow-sm ${getStatusColor(clusterState.status)}`}>
            {clusterState.status === 'green' && <CheckCircle size={20} />}
            {clusterState.status === 'yellow' && <AlertTriangle size={20} />}
            {clusterState.status === 'red' && <AlertTriangle size={20} />}
            Status: {clusterState.status.toUpperCase()}
          </div>
        </div>

        {/* --- 控制面板 --- */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="font-semibold text-sm text-slate-700">节点数量 (Nodes)</label>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{nodeCount}</span>
            </div>
            <input 
              type="range" min="1" max="10" value={nodeCount} 
              onChange={(e) => setNodeCount(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <p className="text-xs text-slate-400">增加节点会自动触发 rebalance</p>
          </div>

          <div className="space-y-2">
             <div className="flex justify-between">
              <label className="font-semibold text-sm text-slate-700">主分片 (Primary)</label>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{primaryShards}</span>
            </div>
            <input 
              type="range" min="1" max="20" value={primaryShards} 
              onChange={(e) => setPrimaryShards(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
             <p className="text-xs text-slate-400">索引创建后通常不可改</p>
          </div>

          <div className="space-y-2">
             <div className="flex justify-between">
              <label className="font-semibold text-sm text-slate-700">副本数 (Replicas)</label>
              <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-bold">{replicas}</span>
            </div>
            <input 
              type="range" min="0" max="2" value={replicas} 
              onChange={(e) => setReplicas(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
             <p className="text-xs text-slate-400">每个主分片对应的备份数量</p>
          </div>
        </div>

        {/* --- 未分配区域 (Yellow/Red 状态展示) --- */}
        {clusterState.unassigned.length > 0 && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl flex flex-col gap-2 animate-pulse">
            <h3 className="text-red-800 font-bold flex items-center gap-2 text-sm">
              <AlertTriangle size={16}/> 
              未分配分片 ({clusterState.unassigned.length})
              <span className="font-normal opacity-75">- 可能是节点不足以满足反亲和性（副本不能和主分片在同节点）</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {clusterState.unassigned.map((shard) => (
                <div key={shard.uid} className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold shadow-sm bg-slate-300 text-slate-500 border-2 border-slate-400`}>
                  {shard.type === 'p' ? `P${shard.id}` : `R${shard.id}`}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- 集群可视化区域 --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {clusterState.nodes.map((node) => (
            <div key={node.id} className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden flex flex-col transition-all duration-300">
              {/* 节点头部 */}
              <div className="bg-slate-50 p-3 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server size={18} className="text-slate-600" />
                  <span className="font-bold text-sm text-slate-700">{node.name}</span>
                </div>
                <span className="text-xs bg-slate-200 px-2 py-0.5 rounded text-slate-600 font-mono">
                  {node.shards.length} shards
                </span>
              </div>

              {/* 分片容器 */}
              <div className="p-4 flex-1 bg-slate-50/50 min-h-[120px]">
                <div className="flex flex-wrap content-start gap-2">
                  {node.shards.length === 0 && (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs italic mt-8">
                      空闲节点
                    </div>
                  )}
                  
                  {node.shards.sort((a,b) => a.id - b.id).map((shard) => {
                    const isRelocating = clusterState.relocatingShards.includes(shard.uid);
                    return (
                      <div 
                        key={shard.uid}
                        className={`
                          relative w-10 h-10 flex items-center justify-center rounded text-xs font-bold shadow-sm border-2 cursor-help transition-all duration-500
                          ${shard.type === 'p' ? 'bg-blue-500 border-blue-600 text-white' : 'bg-white border-blue-300 text-blue-600'}
                          ${isRelocating ? 'ring-4 ring-yellow-400 scale-110 z-10' : 'hover:scale-105'}
                        `}
                        title={`${shard.type === 'p' ? 'Primary' : 'Replica'} Shard ${shard.id}`}
                      >
                        {shard.type === 'p' ? 'P' : 'R'}{shard.id}
                        
                        {/* 搬迁指示器 */}
                        {isRelocating && (
                           <span className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full p-[2px]">
                             <RefreshCw size={8} className="animate-spin" />
                           </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- 说明区域 --- */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600 bg-blue-50 p-4 rounded-xl border border-blue-100">
          <div>
            <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
              <Info size={16}/> 观察指南
            </h4>
            <ul className="list-disc pl-4 space-y-1">
              <li><strong>P</strong> = 主分片 (Primary)，<strong>R</strong> = 副本分片 (Replica)。</li>
              <li>试着把 <span className="font-mono bg-white px-1 rounded">Nodes</span> 设为 1，你会发现所有 R 分片变成未分配 (Unassigned)，集群变黄，因为副本无法和主分片放在一起。</li>
              <li>试着增加 <span className="font-mono bg-white px-1 rounded">Nodes</span>，观察带有黄色旋转图标的分片，那就是 ES 正在搬运的数据。</li>
            </ul>
          </div>
          <div>
             <h4 className="font-bold text-blue-800 mb-2">平衡策略</h4>
             <p className="leading-relaxed">
               此模拟器使用了简化的贪心算法：总是优先把分片分配给负载（分片数）最小的合法节点。这完美模拟了 ES 的 <span className="font-mono text-blue-700">cluster.routing.allocation.balance</span> 行为。
             </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ClusterSimulator;