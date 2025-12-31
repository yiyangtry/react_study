import React from 'react';
import { 
  Map, 
  Monitor, 
  ArrowDownUp, 
  Network, 
  Server, 
  Settings, 
  Database,
  Box,
  Copy,
  List
} from 'lucide-react';

const Architecture = () => {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen">
      {/* Header */}
      <nav className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Map className="text-emerald-400" size={24} />
          <h1 className="text-xl font-bold tracking-wide">
            Elasticsearch <span className="text-emerald-400">宏观架构图</span>
          </h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left: The Architecture Diagram */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden flex-grow flex flex-col items-center justify-center">
            
            {/* SVG Connecting Lines (Background) */}
            <svg className="absolute top-0 left-0 w-full h-full overflow-visible pointer-events-none z-0">
              {/* Client to LB */}
              <path d="M400 60 L400 100" stroke="#cbd5e1" strokeWidth="2" fill="none" />
              {/* LB to Cluster */}
              <path d="M400 150 L400 200" stroke="#cbd5e1" strokeWidth="2" fill="none" />
              {/* Cluster Fan out */}
              <path d="M400 200 L180 260" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="5,5" fill="none" />
              <path d="M400 200 L400 260" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="5,5" fill="none" />
              <path d="M400 200 L620 260" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="5,5" fill="none" />
            </svg>

            <div className="flex flex-col items-center gap-10 relative z-10 w-full max-w-4xl">

              {/* Level 1: Client */}
              <div className="bg-slate-800 text-white px-8 py-3 rounded-full flex items-center gap-3 shadow-lg transform hover:-translate-y-1 transition-transform duration-300 relative z-10">
                <Monitor size={20} />
                <span className="font-semibold">Client / Application</span>
              </div>

              {/* Level 2: Load Balancer */}
              <div className="bg-slate-100 border-2 border-slate-200 text-slate-600 px-10 py-3 rounded-xl flex items-center gap-3 shadow-sm text-sm font-medium relative z-10">
                <ArrowDownUp size={18} />
                Load Balancer (HTTP 9200)
              </div>

              {/* Level 3: The Cluster */}
              <div className="w-full border-4 border-dashed border-slate-200 rounded-3xl p-8 relative bg-slate-50/50 mt-4 relative z-10">
                <div className="absolute -top-5 left-8 bg-blue-600 text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md flex items-center gap-2">
                  <Network size={16} /> Elasticsearch Cluster
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  
                  {/* Node 1 (Master) */}
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-md flex flex-col gap-4 hover:border-purple-200 transition-colors">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-100 p-2 rounded-lg">
                          <Server className="text-slate-500" size={20} />
                        </div>
                        <span className="font-bold text-slate-700">Node-1</span>
                      </div>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Master</span>
                    </div>
                    <div className="flex-grow flex items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 border-dashed text-center">
                      <div className="text-xs text-slate-500 font-medium">
                        <Settings className="inline-block mb-1 opacity-50" size={16} />
                        <br />
                        Cluster State
                        <br />
                        Metadata
                      </div>
                    </div>
                  </div>

                  {/* Node 2 (Data) */}
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-md flex flex-col gap-4 hover:border-yellow-200 transition-colors">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-100 p-2 rounded-lg">
                          <Database className="text-slate-500" size={20} />
                        </div>
                        <span className="font-bold text-slate-700">Node-2</span>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Data</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {/* P1 */}
                      <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-800 p-3 rounded-lg flex flex-col items-center justify-center shadow-sm">
                        <div className="flex items-center gap-1 text-[10px] font-bold opacity-70">
                          <span className="uppercase">P</span>
                          <Box size={10} />
                        </div>
                        <div className="font-bold text-lg">1</div>
                      </div>
                      {/* R2 */}
                      <div className="bg-indigo-50 border-2 border-indigo-300 text-indigo-700 p-3 rounded-lg flex flex-col items-center justify-center shadow-sm border-dashed">
                        <div className="flex items-center gap-1 text-[10px] font-bold opacity-70">
                          <span className="uppercase">R</span>
                          <Copy size={10} />
                        </div>
                        <div className="font-bold text-lg">2</div>
                      </div>
                    </div>
                  </div>

                  {/* Node 3 (Data) */}
                  <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-md flex flex-col gap-4 hover:border-yellow-200 transition-colors">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="bg-slate-100 p-2 rounded-lg">
                          <Database className="text-slate-500" size={20} />
                        </div>
                        <span className="font-bold text-slate-700">Node-3</span>
                      </div>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">Data</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {/* P2 */}
                      <div className="bg-emerald-100 border-2 border-emerald-400 text-emerald-800 p-3 rounded-lg flex flex-col items-center justify-center shadow-sm">
                        <div className="flex items-center gap-1 text-[10px] font-bold opacity-70">
                          <span className="uppercase">P</span>
                          <Box size={10} />
                        </div>
                        <div className="font-bold text-lg">2</div>
                      </div>
                      {/* R1 */}
                      <div className="bg-indigo-50 border-2 border-indigo-300 text-indigo-700 p-3 rounded-lg flex flex-col items-center justify-center shadow-sm border-dashed">
                        <div className="flex items-center gap-1 text-[10px] font-bold opacity-70">
                          <span className="uppercase">R</span>
                          <Copy size={10} />
                        </div>
                        <div className="font-bold text-lg">1</div>
                      </div>
                    </div>
                  </div>

                </div>
                
                {/* Internal Network Hint */}
                <div className="absolute bottom-4 right-6 text-[10px] text-slate-400 font-mono">
                  Internal: TCP Transport (9300)
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right: Legend Panel */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden sticky top-24">
            <div className="p-4 bg-slate-50 border-b border-slate-100 font-bold text-slate-700 flex items-center gap-2">
              <List size={18} /> 核心概念
            </div>
            <div className="p-5 space-y-6">
              
              {/* Legend Item */}
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                    <Network size={20} />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Cluster (集群)</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    多个节点的集合。对外表现为一个单一的系统，数据跨节点自动分布。
                  </p>
                </div>
              </div>

              {/* Legend Item */}
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-300 flex items-center justify-center text-slate-600 shadow-sm">
                    <Server size={20} />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Node (节点)</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    <span className="text-purple-600 font-bold">Master</span> 负责管理元数据（轻量）。<br />
                    <span className="text-yellow-600 font-bold">Data</span> 负责存分片、跑搜索（重资源）。
                  </p>
                </div>
              </div>

              {/* Legend Item */}
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 border border-emerald-400 flex items-center justify-center text-emerald-700 shadow-sm">
                    <span className="font-bold">P</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Primary Shard</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    主分片。索引的逻辑拆分单位，也是数据写入的第一入口。
                  </p>
                </div>
              </div>

              {/* Legend Item */}
              <div className="flex gap-4">
                <div className="mt-1 flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-300 flex items-center justify-center text-indigo-600 border-dashed shadow-sm">
                    <span className="font-bold">R</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Replica Shard</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    副本分片。主分片的完整备份。用于故障恢复 (HA) 和提升读取性能。
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Architecture;

