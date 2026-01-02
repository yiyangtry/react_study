import React, { useState, useRef, useEffect } from 'react';
import { 
  Server, 
  Database, 
  Layers, 
  Box, 
  Activity, 
  Info,
  Network,
  ShieldCheck,
  Search,
  ZoomIn,
  FileText,
  List,
  ArrowDown,
  ChevronDown,
  ChevronUp,
  Ban, // Added for the anti-affinity visualization
  HelpCircle
} from 'lucide-react';

const concepts = {
  cluster: {
    title: "Cluster (集群)",
    icon: <Network className="w-6 h-6 text-blue-500" />,
    description: "Elasticsearch 的最高层级结构。由一个或多个节点（服务器）组成，共同保存所有数据并提供联合索引和搜索功能。",
    details: [
      "每个集群都有一个唯一的名称（默认为 'elasticsearch'）。",
      "节点通过集群名称自动加入集群。",
      "跨节点自动分配数据（分片）以实现负载均衡。"
    ],
    color: "border-blue-500 bg-blue-50"
  },
  node: {
    title: "Node (节点)",
    icon: <Server className="w-6 h-6 text-slate-600" />,
    description: "集群中的一台单独的服务器（或进程）。它是分片的容器。",
    details: [
      "Master Node：管理集群状态（元数据）。",
      "Data Node：存储分片数据，执行搜索和聚合（消耗 CPU/RAM/IO）。",
      "Coordinating Node：接收客户端请求并分发。",
      "一个节点可以包含多个索引的不同分片。"
    ],
    color: "border-slate-500 bg-slate-100"
  },
  index: {
    title: "Index (索引)",
    icon: <Database className="w-6 h-6 text-amber-500" />,
    description: "逻辑上的文档集合，相当于关系型数据库中的 Database。它是分片的逻辑父级。",
    details: [
      "用户是对 'Index' 进行读写，而不是直接对分片操作。",
      "一个 Index 会被拆分成多个 Shard。",
      "Settings（如分片数、刷新间隔）和 Mapping（字段定义）都在 Index 层面配置。"
    ],
    color: "border-amber-500 bg-amber-50"
  },
  shard_primary: {
    title: "Primary Shard (主分片)",
    icon: <Box className="w-6 h-6 text-emerald-600" />,
    description: "ES 中的基本工作单元。关键概念：一个 Shard 就是一个完整的 Lucene Index。",
    details: [
      "每个 Shard 是一个独立的搜索引擎实例。",
      "Shard 是数据搬迁和扩容的最小单位。",
      "包含多个 Lucene Segments。"
    ],
    color: "border-emerald-500 bg-emerald-100",
    isShard: true
  },
  shard_replica: {
    title: "Replica Shard (副本分片)",
    icon: <Box className="w-6 h-6 text-indigo-500" />,
    description: "主分片的完整拷贝，结构与主分片完全一致（也是一个 Lucene Index）。",
    details: [
      "重要规则：副本分片绝不会与主分片放在同一个节点上（高可用）。",
      "用于故障转移（Failover）。",
      "增加读取吞吐量（Read Scalability）。"
    ],
    color: "border-indigo-500 bg-indigo-100",
    isShard: true
  },
  lucene: {
    title: "Lucene Index (Lucene 索引)",
    icon: <Layers className="w-6 h-6 text-orange-600" />,
    description: "Elasticsearch 的底层核心。Shard 是 ES 的叫法，其实际实现就是 Lucene Index。",
    details: [
      "由多个 Segment (段) 组成。",
      "提供倒排索引、DocValues、BKD Tree 等数据结构。",
      "执行实际的文本分析、索引和搜索操作。"
    ],
    color: "border-orange-500 bg-orange-50"
  },
  segment: {
    title: "Segment (段)",
    icon: <FileText className="w-6 h-6 text-stone-600" />,
    description: "Lucene 内部的最小存储单元。它是一个不可变的倒排索引子集。",
    details: [
      "不可变性 (Immutable)：一旦写入磁盘，不再修改。",
      "Refresh 操作会生成新的小 Segment。",
      "Merge (合并)：后台进程会将小 Segment 合并成大 Segment 并标记删除旧数据。",
      "搜索时会并行查询所有 Segments 然后合并结果。"
    ],
    color: "border-stone-500 bg-stone-100"
  }
};

// --- Components ---

const Legend = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <HelpCircle size={16} className="text-slate-500" />
          <h3 className="text-sm font-bold text-slate-700">图例与符号说明 (Legend)</h3>
        </div>
        <span className="text-xs text-slate-400">对应图中各层级元素</span>
      </div>
      
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Column 1: Infrastructure */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">基础架构 (Infra)</h4>
          
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-blue-50 border border-blue-200 rounded text-blue-500"><Network size={14}/></div>
            <div className="text-xs">
              <span className="font-bold text-slate-700 block">Cluster (集群)</span>
              <span className="text-slate-400">多节点组成的逻辑整体</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-slate-100 border border-slate-300 rounded text-slate-600"><Server size={14}/></div>
            <div className="text-xs">
              <span className="font-bold text-slate-700 block">Node (节点)</span>
              <span className="text-slate-400">物理服务器/容器</span>
            </div>
          </div>
          
           <div className="flex items-center gap-3">
            <div className="p-1.5 bg-amber-50 border border-amber-200 rounded text-amber-500"><Database size={14}/></div>
            <div className="text-xs">
              <span className="font-bold text-slate-700 block">Index (索引)</span>
              <span className="text-slate-400">文档的逻辑集合</span>
            </div>
          </div>
        </div>

        {/* Column 2: Data Units */}
        <div className="space-y-3">
           <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">数据单元 (Data)</h4>
           
           <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-emerald-100 border border-emerald-400 flex items-center justify-center text-emerald-800 font-bold text-[10px]">P</div>
            <div className="text-xs">
              <span className="font-bold text-slate-700 block">Primary Shard</span>
              <span className="text-slate-400">主分片 (读写核心)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-indigo-100 border border-indigo-300 flex items-center justify-center text-indigo-700 font-bold text-[10px]">R</div>
            <div className="text-xs">
              <span className="font-bold text-slate-700 block">Replica Shard</span>
              <span className="text-slate-400">副本分片 (高可用/读)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="p-1.5 bg-orange-50 border border-orange-200 rounded text-orange-500"><Layers size={14}/></div>
             <div className="text-xs">
              <span className="font-bold text-slate-700 block">Lucene Index</span>
              <span className="text-slate-400">分片的底层实现</span>
            </div>
          </div>
        </div>

        {/* Column 3: Rules & Status */}
        <div className="space-y-3">
           <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 border-b border-slate-100 pb-1">规则与状态 (Rules)</h4>
           
           <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-red-50 border-2 border-dashed border-red-300 flex items-center justify-center text-red-500"><Ban size={12}/></div>
            <div className="text-xs">
              <span className="font-bold text-slate-700 block">互斥规则 (Anti-affinity)</span>
              <span className="text-slate-400">主副分片不可共存</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded border-2 border-orange-400 ring-2 ring-orange-200 bg-white"></div>
             <div className="text-xs">
              <span className="font-bold text-slate-700 block">选中/高亮状态</span>
              <span className="text-slate-400">表示当前查看的组件</span>
            </div>
          </div>

           <div className="flex items-center gap-3">
             <div className="p-1.5 bg-stone-100 border border-stone-300 rounded text-stone-600"><FileText size={14}/></div>
             <div className="text-xs">
              <span className="font-bold text-slate-700 block">Segment (段)</span>
              <span className="text-slate-400">不可变数据文件</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

const LuceneView = ({ onSelect, isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="h-full w-full bg-white rounded-2xl border-l-4 border-orange-400 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 flex flex-col">
      <div className="bg-orange-50 p-4 border-b border-orange-100 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 text-orange-800 font-bold">
          <Layers size={20} />
          <span>底层核心: Inside a Shard (Lucene)</span>
        </div>
        <div className="text-xs font-mono text-orange-600 bg-white px-2 py-1 rounded border border-orange-200 shadow-sm">
          Shard == Lucene Instance
        </div>
      </div>
      
      <div className="p-8 flex flex-col md:flex-row gap-12 items-center justify-center bg-gradient-to-b from-white to-orange-50/30 flex-1">
        
        {/* Shard Container Visual */}
        <div 
          className="relative group cursor-pointer transform hover:scale-105 transition-transform duration-300" 
          onClick={() => onSelect('lucene')}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-300 z-10 shadow-sm">
            ES Shard Container
          </div>
          <div className="w-64 h-48 border-4 border-emerald-400/30 rounded-2xl p-4 flex flex-col gap-2 bg-emerald-50/30 dashed-border-container">
             <div className="flex-1 border-2 border-orange-400 bg-orange-100 rounded-xl p-4 flex flex-col items-center justify-center relative shadow-sm hover:bg-orange-200 transition-colors">
                <Layers className="text-orange-500 mb-3" size={40} />
                <span className="font-bold text-orange-900 text-lg">Lucene Index</span>
                <span className="text-xs text-orange-700 text-center mt-2 px-2">倒排索引 / DocValues / FST</span>
             </div>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center text-slate-300">
           <span className="text-xs font-bold text-slate-400 mb-1">CONTAINS</span>
           <div className="w-16 h-0.5 bg-slate-300 mb-1"></div>
           <Info size={20} className="text-slate-400" />
           <div className="w-16 h-0.5 bg-slate-300 mt-1"></div>
        </div>

        {/* Segments Visual */}
        <div className="flex flex-col gap-4 items-center" onClick={() => onSelect('segment')}>
          <div className="flex items-end gap-3 p-6 border-2 border-dashed border-stone-300 rounded-2xl bg-stone-50 hover:bg-stone-100 cursor-pointer transition-all hover:shadow-md">
            {/* Segment 1 */}
            <div className="w-14 h-28 bg-stone-300 rounded-lg border border-stone-400 flex flex-col items-center justify-center relative shadow-sm hover:-translate-y-1 transition-transform">
              <span className="text-[10px] font-mono text-stone-600 rotate-90 whitespace-nowrap font-bold">Segment_1</span>
            </div>
            {/* Segment 2 */}
            <div className="w-14 h-20 bg-stone-300 rounded-lg border border-stone-400 flex flex-col items-center justify-center shadow-sm hover:-translate-y-1 transition-transform">
              <span className="text-[10px] font-mono text-stone-600 rotate-90 whitespace-nowrap font-bold">Segment_2</span>
            </div>
             {/* Segment 3 (New) */}
             <div className="w-14 h-12 bg-green-100 border-2 border-green-500 rounded-lg flex flex-col items-center justify-center shadow-sm animate-pulse hover:-translate-y-1 transition-transform">
              <span className="text-[10px] font-mono text-green-700 text-center leading-tight font-bold">Buffer</span>
            </div>
          </div>
          <div className="text-center">
             <h4 className="text-sm font-bold text-slate-600">Segments (段)</h4>
             <span className="text-xs text-slate-400">不可变文件片段</span>
          </div>
        </div>

      </div>
    </div>
  );
};

const Shard = ({ type, id, onClick, isSelected, isRelated }) => {
  const isPrimary = type === 'primary';
  const conceptKey = isPrimary ? 'shard_primary' : 'shard_replica';
  
  // Highlighting logic:
  // isSelected: User specifically clicked THIS topic type
  // isRelated: User clicked a specific shard ID, so highlight all instances of that ID (e.g. clicked P0, highlight R0 too)
  
  const baseClasses = `
    relative group cursor-pointer transition-all duration-300
    flex flex-col items-center justify-center p-2 rounded-lg border-2 shadow-sm
    min-w-[3rem] min-h-[3rem]
  `;
  
  const activeClasses = isSelected 
    ? 'ring-4 ring-offset-2 ring-orange-400 scale-110 z-10' 
    : 'hover:-translate-y-1 hover:shadow-md';

  const typeClasses = isPrimary
    ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
    : 'bg-indigo-100 border-indigo-300 text-indigo-700';

  return (
    <div 
      onClick={(e) => { e.stopPropagation(); onClick(conceptKey, id); }}
      className={`${baseClasses} ${activeClasses} ${typeClasses}`}
    >
      <div className="flex items-center gap-1">
         <div className="text-[10px] font-bold uppercase opacity-70">{isPrimary ? 'P' : 'R'}</div>
      </div>
      <div className="text-lg font-bold leading-none">{id}</div>
      
      {/* Visual hint for Lucene */}
      {isSelected && (
        <div className="absolute -bottom-6 bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm animate-bounce whitespace-nowrap">
          Lucene Core
        </div>
      )}
    </div>
  );
};

const Node = ({ name, role, shards, onSelect, selectedTopic, activeShardId }) => {
  // Logic to determine if we should show the "Banned" placeholder
  // If this node contains the active shard (either P or R), we show a banned placeholder for its counterpart
  const housingActiveShard = activeShardId !== null && shards.find(s => s.id === activeShardId);

  return (
    <div 
      onClick={(e) => { e.stopPropagation(); onSelect('node'); }}
      className={`
        flex-1 min-w-[180px] border-2 rounded-xl p-4 bg-white shadow-lg 
        transition-all duration-300 hover:shadow-xl cursor-pointer relative flex flex-col
        ${selectedTopic === 'node' ? 'border-slate-800 ring-1 ring-slate-400' : 'border-slate-200'}
      `}
    >
      {/* Node Header */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
        <div className="p-1.5 bg-slate-100 rounded-lg">
          <Server className="text-slate-600" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-sm">{name}</h3>
          <span className="text-[10px] text-slate-500 uppercase tracking-wide">{role}</span>
        </div>
      </div>

      {/* Shards Container */}
      <div className="flex-1 bg-slate-50 p-2 rounded-lg border border-slate-100 grid grid-cols-2 gap-2 content-start relative">
        {shards.map((s, idx) => {
          // Check if this specific shard should be highlighted
          // We highlight if the shard type matches selection OR if the shard ID matches the actively selected ID
          const isTypeSelected = selectedTopic === (s.type === 'primary' ? 'shard_primary' : 'shard_replica');
          const isIdActive = activeShardId === s.id;
          
          return (
            <Shard 
              key={idx} 
              type={s.type} 
              id={s.id} 
              onClick={onSelect}
              isSelected={isIdActive && isTypeSelected} // Strong highlight
              isRelated={isIdActive} // Weak highlight
            />
          );
        })}

        {/* Anti-Affinity Visual Rule - Only shows when a shard is selected AND this node holds that shard ID */}
        {housingActiveShard && (
           <div 
             className="relative group flex flex-col items-center justify-center p-2 rounded-lg border-2 border-dashed border-red-300 bg-red-50/50 min-w-[3rem] min-h-[3rem] transition-all animate-in fade-in zoom-in duration-300 opacity-60 hover:opacity-100"
             title="互斥规则：相同ID的分片不能存在于同一节点"
           >
             <div className="text-[10px] font-bold text-red-400 uppercase mb-0.5">
               {housingActiveShard.type === 'primary' ? 'R' : 'P'}{activeShardId}
             </div>
             <Ban size={20} className="text-red-500" />
             
             {/* Tooltip */}
             <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max bg-red-600 text-white text-[10px] px-2 py-1 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
               互斥: 同ID分片不能共存
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

const LogicalIndexView = ({ onSelect, selectedTopic, activeShardId }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
       <div className="p-3 bg-amber-50 border-b border-amber-100 flex justify-between items-center">
          <span className="font-semibold text-amber-800 flex items-center gap-2 text-sm">
            <Database size={16}/> 逻辑层：索引 (Index)
          </span>
       </div>
       
       <div 
         onClick={() => onSelect('index')}
         className={`p-4 flex-1 transition-all cursor-pointer ${selectedTopic === 'index' ? 'bg-amber-50/50' : 'bg-white hover:bg-slate-50'}`}
       >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><Database size={20} /></div>
            <div>
              <h3 className="font-bold text-slate-800">index_v1</h3>
              <p className="text-xs text-slate-500 font-mono">3 Primaries, 1 Replica</p>
            </div>
          </div>
          
          {/* Logical Shard Grouping */}
          <div className="flex flex-col gap-2">
             {[0, 1, 2].map(id => {
               const isActive = activeShardId === id;
               return (
               <div key={id} className={`
                 border rounded-lg p-2 flex items-center justify-between transition-colors
                 ${isActive ? 'bg-orange-50 border-orange-200' : 'bg-slate-50 border-slate-200 hover:border-amber-300'}
               `}>
                  <span className="text-xs font-bold text-slate-400 mr-2">Shard {id}</span>
                  <div className="flex gap-2">
                     <div 
                        onClick={(e) => { e.stopPropagation(); onSelect('shard_primary', id); }}
                        className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold cursor-pointer transition-all
                          ${activeShardId === id && selectedTopic === 'shard_primary' 
                            ? 'bg-emerald-500 text-white ring-2 ring-emerald-300 scale-110' 
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'}
                        `}
                     >P{id}</div>
                     <div 
                        onClick={(e) => { e.stopPropagation(); onSelect('shard_replica', id); }}
                         className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold cursor-pointer transition-all
                          ${activeShardId === id && selectedTopic === 'shard_replica'
                            ? 'bg-indigo-500 text-white ring-2 ring-indigo-300 scale-110' 
                            : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'}
                        `}
                     >R{id}</div>
                  </div>
               </div>
             )})}
          </div>
       </div>
    </div>
  )
}

export default function ESAchitecturePage() {
  const [selectedTopic, setSelectedTopic] = useState('cluster');
  const [activeShardId, setActiveShardId] = useState(null);
  
  // Refs for scrolling (Kept the ref for safety but removed auto-scroll)
  const luceneRef = useRef(null);

  const handleSelect = (topic, shardId = null) => {
    setSelectedTopic(topic);
    
    // If a shard is clicked (either P or R), we set the active ID to highlight it everywhere
    if (topic === 'shard_primary' || topic === 'shard_replica') {
      setActiveShardId(shardId);
      // Removed auto-scroll logic
    } else if (topic === 'lucene' || topic === 'segment') {
        // Do nothing to shardId, keep it valid
    } else {
      // If clicking Cluster/Node/Index, clear specific shard selection
      setActiveShardId(null);
    }
  };

  const currentInfo = concepts[selectedTopic];
  const isMicroVisible = ['shard_primary', 'shard_replica', 'lucene', 'segment'].includes(selectedTopic);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-orange-100 pb-20">
      {/* Navbar */}
      <nav className="bg-slate-900 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Layers className="text-orange-400" />
            <h1 className="text-xl font-bold tracking-wide">ES 架构全景图</h1>
          </div>
          <div className="text-sm text-slate-400 hidden sm:block">
            物理层 + 逻辑层 + 底层核心
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* Main Content Area: Split Columns */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column: Visualization Area */}
          <div className="flex-1 flex flex-col gap-6">
            
            {/* TOP ROW: Physical & Logical Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* PHYSICAL LAYER (Takes up 2/3 space) */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">
                  <div className="flex items-center gap-2"><Server size={14} /> 物理层：集群 (Cluster)</div>
                  {selectedTopic === 'cluster' && <span className="text-xs text-blue-500 animate-pulse">● 已选中</span>}
                </div>
                
                <div 
                  onClick={() => handleSelect('cluster')}
                  className={`
                    bg-white rounded-2xl shadow-sm border overflow-hidden flex-1
                    transition-all duration-300
                    ${selectedTopic === 'cluster' ? 'border-blue-400 ring-4 ring-blue-50' : 'border-slate-200 hover:border-blue-200'}
                  `}
                >
                  <div className="bg-slate-100/50 p-2 border-b border-slate-100 flex justify-between items-center">
                    <span className="text-xs font-mono text-slate-500 ml-2">cluster_name: "my-es"</span>
                    <div className="flex gap-2 text-[10px]">
                        <span className="bg-emerald-100 text-emerald-700 px-1.5 rounded">Green</span>
                    </div>
                  </div>
                  
                  <div className="p-4 flex flex-col sm:flex-row gap-3">
                    <Node 
                      name="Node-1" role="Master / Data" 
                      shards={[{ id: 0, type: 'primary' }, { id: 1, type: 'primary' }]} 
                      onSelect={handleSelect} selectedTopic={selectedTopic} activeShardId={activeShardId}
                    />
                    <Node 
                      name="Node-2" role="Data" 
                      shards={[{ id: 2, type: 'primary' }, { id: 0, type: 'replica' }]} 
                      onSelect={handleSelect} selectedTopic={selectedTopic} activeShardId={activeShardId}
                    />
                    <Node 
                      name="Node-3" role="Data" 
                      shards={[{ id: 1, type: 'replica' }, { id: 2, type: 'replica' }]} 
                      onSelect={handleSelect} selectedTopic={selectedTopic} activeShardId={activeShardId}
                    />
                  </div>
                </div>
              </div>

              {/* LOGICAL LAYER (Takes up 1/3 space) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm font-bold text-slate-500 uppercase tracking-wider ml-1">
                  <div className="flex items-center gap-2"><Database size={14} /> 逻辑层：索引 (Index)</div>
                  {selectedTopic === 'index' && <span className="text-xs text-amber-500 animate-pulse">● 已选中</span>}
                </div>
                <LogicalIndexView 
                  onSelect={handleSelect} 
                  selectedTopic={selectedTopic} 
                  activeShardId={activeShardId}
                />
              </div>
            </div>

            {/* MIDDLE: Connection Lines (Visual Polish) */}
            <div className="flex justify-center items-center gap-2 text-slate-300 py-1">
              <div className="h-px bg-slate-300 flex-1 max-w-[100px]"></div>
              <span className="text-xs uppercase font-bold tracking-widest">点击分片查看底层原理</span>
              <ChevronDown size={14} />
              <div className="h-px bg-slate-300 flex-1 max-w-[100px]"></div>
            </div>

            {/* BOTTOM: MICRO LAYER (Fixed Height Container to prevent jump) */}
            <div ref={luceneRef} className={`transition-all duration-500 h-[340px] ${isMicroVisible ? 'opacity-100' : 'opacity-40 grayscale blur-[1px]'}`}>
              <div className="flex flex-col gap-2 h-full">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-wider ml-1 shrink-0">
                    <Layers size={14} /> 底层核心 (Core / Lucene Engine)
                    {!isMicroVisible && <span className="text-xs font-normal text-slate-400 normal-case ml-2">- 请先点击上方任意分片 (P0, R1...)</span>}
                  </div>
                  {/* We render a placeholder if not visible to keep layout stable, or just the view */}
                  {isMicroVisible ? (
                    <LuceneView onSelect={handleSelect} isVisible={true} />
                  ) : (
                    <div className="h-full rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50/50 text-slate-400">
                      <div className="flex flex-col items-center gap-2">
                        <ZoomIn size={32} className="opacity-20" />
                        <span className="text-sm">选择一个分片展开底层视图</span>
                      </div>
                    </div>
                  )}
              </div>
            </div>

          </div>

          {/* Right Column: Info Panel (Sticky) */}
          <div className="lg:w-80 shrink-0">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden transition-all duration-300">
                {/* Header with dynamic color */}
                <div className={`p-5 ${currentInfo.color} border-b transition-colors duration-300`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm">
                      {currentInfo.icon}
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{currentInfo.title}</h2>
                      <span className="text-[10px] uppercase tracking-wider opacity-70 font-bold">
                        {['lucene', 'segment', 'shard_primary', 'shard_replica'].includes(selectedTopic) ? 'Core Engine' : 'Architecture'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-5">
                  <p className="text-slate-600 mb-6 leading-relaxed text-sm">
                    {currentInfo.description}
                  </p>

                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <List size={14} /> 核心知识点
                  </h3>
                  <ul className="space-y-2">
                    {currentInfo.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                        <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Status Bar */}
                <div className="bg-slate-50 p-3 border-t border-slate-100 text-xs flex justify-between items-center text-slate-500">
                  <span>{activeShardId !== null ? `Shard ID: ${activeShardId}` : '无特定分片选中'}</span>
                  {isMicroVisible && <span className="flex items-center gap-1 text-orange-500 font-bold"><Activity size={12}/> Deep Dive</span>}
                </div>
              </div>
              
              {/* Helper Tip */}
              <div className="mt-4 text-center text-xs text-slate-400">
                <p>尝试点击不同的 <b>分片(P/R)</b><br/>观察物理层与逻辑层的联动</p>
              </div>
            </div>
          </div>
        
        </div>

        {/* Bottom: LEGEND SECTION */}
        <Legend />

      </main>
    </div>
  );
}
