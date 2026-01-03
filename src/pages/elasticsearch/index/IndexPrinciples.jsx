import React, { useState, useEffect, useMemo } from 'react';
import { 
  Terminal, ArrowDown, Binary, Filter, HardDrive, 
  RefreshCcw, Zap, Recycle, ListTree, Box, ActivitySquare,
  Book, Shield, GitCommit, FileText, Share2, Play, CheckCircle2,
  FileJson, Layers2, DatabaseZap, TrendingUp, Scale, AlertOctagon, 
  XCircle, Flame, Snowflake, CpuIcon, Search, AlertTriangle, PlayCircle,
  Clock, Server, Network, ArrowRight, Info, Database, ChevronRight,
  Cpu, MousePointer2, MoveRight, AlertCircle, Bookmark, Compass
} from 'lucide-react';

// --- 模拟工具函数：简易哈希计算 ---
const getShardId = (id, shardCount = 3) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0; 
  }
  return Math.abs(hash) % shardCount;
};

const App = () => {
  // --- 集群配置 ---
  const shardCount = 3;
  const initialNodes = [
    { id: 'Node-A', roles: ['Master', 'Data'], shards: [{ id: 0, type: 'P' }, { id: 2, type: 'R' }] },
    { id: 'Node-B', roles: ['Data'], shards: [{ id: 1, type: 'P' }, { id: 0, type: 'R' }] },
    { id: 'Node-C', roles: ['Data'], shards: [{ id: 2, type: 'P' }, { id: 1, type: 'R' }] },
  ];

  // --- 仿真状态 ---
  const [simDocId, setSimDocId] = useState('doc_123');
  const [simContent, setSimContent] = useState('{"title": "ES Deep Dive"}');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simPhase, setSimPhase] = useState('idle'); // idle, routing, primary_write, replica_sync, done
  const [targetShardId, setTargetShardId] = useState(null);
  const [focusedShardId, setFocusedShardId] = useState(0); 
  const [errorHint, setErrorHint] = useState('');

  // --- 分片物理存储状态 (Shard 0, 1, 2) ---
  const [shardsData, setShardsData] = useState({
    0: { buffer: [], segments: [], translog: 0 },
    1: { buffer: [], segments: [], translog: 0 },
    2: { buffer: [], segments: [], translog: 0 },
  });

  const checkIdConflict = (id, sid) => {
    const shard = shardsData[sid];
    if (shard.buffer.some(d => d._id === id)) return true;
    return shard.segments.some(seg => seg.docs.some(d => d._id === id));
  };

  const handleWriteAction = async () => {
    if (isSimulating) return;
    const sid = getShardId(simDocId, shardCount);
    if (checkIdConflict(simDocId, sid)) {
      setErrorHint(`Document [${simDocId}] 已存在于分片 ${sid} 中`);
      return;
    }
    setIsSimulating(true);
    setErrorHint('');

    setSimPhase('routing');
    setTargetShardId(sid);
    await new Promise(r => setTimeout(r, 1000));

    setSimPhase('primary_write');
    const newDoc = { 
      uid: Math.random().toString(36).substr(2, 9), 
      _id: simDocId, 
      _source: simContent, 
      timestamp: new Date().toLocaleTimeString() 
    };
    setShardsData(prev => ({
      ...prev,
      [sid]: { ...prev[sid], buffer: [...prev[sid].buffer, newDoc], translog: prev[sid].translog + 1 }
    }));
    setFocusedShardId(sid); 
    await new Promise(r => setTimeout(r, 800));

    setSimPhase('replica_sync');
    await new Promise(r => setTimeout(r, 800));

    setSimPhase('done');
    setTimeout(() => {
      setIsSimulating(false);
      setSimPhase('idle');
      setTargetShardId(null);
    }, 1000);
  };

  const handleRefresh = (sid) => {
    setShardsData(prev => {
      const shard = prev[sid];
      if (shard.buffer.length === 0) return prev;
      const newSeg = { id: `seg_${Math.floor(Math.random()*1000)}`, docs: [...shard.buffer], state: 'cache', createdAt: new Date().toLocaleTimeString() };
      return { ...prev, [sid]: { ...shard, buffer: [], segments: [...shard.segments, newSeg] } };
    });
  };

  // --- 核心修复：Flush 隐式触发 Refresh ---
  const handleFlush = (sid) => {
    setShardsData(prev => {
      const shard = prev[sid];
      let currentSegments = [...shard.segments];
      let currentBuffer = shard.buffer;

      // 1. 隐式 Refresh：如果 Buffer 有数据，先生成 Segment
      if (currentBuffer.length > 0) {
        const newSeg = {
          id: `seg_${Math.floor(Math.random() * 1000)}`,
          docs: [...currentBuffer],
          state: 'cache', // 概念上的中间状态
          createdAt: new Date().toLocaleTimeString()
        };
        currentSegments.push(newSeg);
        currentBuffer = []; // 清空 buffer
      }

      // 2. 物理落盘：将所有 Segment (包含刚生成的) 状态置为 disk，并截断 Translog
      const flushedSegments = currentSegments.map(s => ({ ...s, state: 'disk' }));

      return {
        ...prev,
        [sid]: {
          ...shard,
          buffer: currentBuffer, // 此时应为空
          segments: flushedSegments, // 全部落盘
          translog: 0 // 截断日志
        }
      };
    });
  };

  const handleMerge = (sid, isForce = false) => {
    setShardsData(prev => {
      const shard = prev[sid];
      if (shard.segments.length === 0) return prev;
      const aliveDocs = shard.segments.reduce((acc, seg) => [...acc, ...seg.docs.filter(d => !d.deleted)], []);
      const newSeg = { id: isForce ? 'final_block' : `merged_${Math.floor(Math.random()*100)}`, docs: aliveDocs, state: 'disk', isOptimized: true, createdAt: new Date().toLocaleTimeString() };
      return { ...prev, [sid]: { ...shard, segments: [newSeg] } };
    });
  };

  const toggleDocDelete = (sid, segId, docUid) => {
    setShardsData(prev => {
      const shard = prev[sid];
      return {
        ...prev,
        [sid]: {
          ...shard,
          segments: shard.segments.map(seg => seg.id === segId ? { ...seg, docs: seg.docs.map(d => d.uid === docUid ? { ...d, deleted: !d.deleted } : d) } : seg)
        }
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-x-hidden pt-12 text-left">
      <main className="max-w-7xl mx-auto px-10 pb-32">
        
        {/* 标题 */}
        <div className="mb-12 border-l-8 border-blue-600 pl-8">
          <h1 className="text-5xl font-black tracking-tighter uppercase">Elasticsearch 索引流程指南</h1>
          <p className="text-xl text-slate-500 mt-3 font-medium">从分布式节点协作到物理分段持久化的全链路闭环深度解析</p>
        </div>

        {/* I. 交互仿真实验室 */}
        <section className="bg-slate-900 text-white p-12 rounded-[4rem] shadow-2xl relative border border-slate-800 overflow-hidden mb-20 text-left">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-12 items-start text-left">
            <div className="lg:col-span-4 space-y-6 text-left">
              <div className="flex items-center gap-3 text-yellow-400 mb-2 text-left">
                <Zap size={28} fill="currentColor"/>
                <h3 className="text-2xl font-black uppercase tracking-tight">集群控制台</h3>
              </div>
              <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 space-y-4 shadow-inner text-left">
                <div className="space-y-2 text-left">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono">Document _id</label>
                   <input 
                     className={`w-full bg-black/40 border ${errorHint ? 'border-red-500 animate-pulse' : 'border-slate-700'} rounded-xl px-4 py-2 text-xs font-mono text-blue-300 outline-none focus:border-blue-500 text-left`}
                     value={simDocId} onChange={e => { setSimDocId(e.target.value); setErrorHint(''); }}
                   />
                   {errorHint && <div className="flex items-center gap-2 text-red-400 text-[9px] font-black mt-1"><AlertCircle size={12}/> {errorHint}</div>}
                </div>
                <div className="space-y-2 text-left text-left">
                   <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono text-left">Body (JSON)</label>
                   <textarea 
                     className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-2 text-xs font-mono text-blue-300 h-20 resize-none outline-none focus:border-blue-500 text-left"
                     value={simContent} onChange={e => setSimContent(e.target.value)}
                   />
                </div>
                <button 
                  onClick={handleWriteAction} disabled={isSimulating}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-30 py-4 rounded-2xl transition-all shadow-xl font-black text-xs uppercase shadow-blue-500/20 flex items-center justify-center gap-3"
                >
                  {isSimulating ? <RefreshCcw size={16} className="animate-spin text-left"/> : <MousePointer2 size={16} className="text-left"/>}
                  执行全链路索引请求
                </button>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6 text-left">
              <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 relative text-left">
                {simPhase === 'routing' && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-blue-600/90 backdrop-blur-sm rounded-[3rem] animate-in zoom-in duration-300 text-left">
                    <div className="text-center text-left">
                      <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 text-left">Routing Calculation</div>
                      <div className="text-2xl font-mono font-black tracking-widest text-left">hash("{simDocId}") % 3 = <span className="text-yellow-300 text-left">{targetShardId}</span></div>
                      <p className="text-[10px] mt-2 opacity-70 font-bold uppercase text-left">确定目标主分片节点...</p>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4 text-left">
                   <div className="flex items-center gap-3 text-left">
                      <Server size={18} className="text-slate-500 text-left text-left"/>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-500 text-left">Cluster Topology View</span>
                   </div>
                   {simPhase !== 'idle' && <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-[10px] font-black uppercase text-blue-400 animate-pulse text-left">PHASE: {simPhase.replace('_', ' ')}</div>}
                </div>
                <div className="grid grid-cols-3 gap-6 text-left">
                  {initialNodes.map(node => (
                    <div key={node.id} className="p-5 bg-black/40 border border-white/5 rounded-[2rem] space-y-4 text-left">
                      <div className="flex justify-between items-center text-left">
                        <span className="text-[10px] font-black text-slate-500 font-mono text-left">{node.id}</span>
                        <div className="flex gap-1 text-left text-left">
                          {node.roles.map(r => <span key={r} className="px-1.5 py-0.5 bg-slate-800 text-[8px] rounded uppercase font-bold text-left">{r}</span>)}
                        </div>
                      </div>
                      <div className="flex gap-3 text-left text-left">
                        {node.shards.map(shard => {
                          const isActive = (targetShardId === shard.id && shard.type === 'P' && simPhase === 'primary_write') || (targetShardId === shard.id && shard.type === 'R' && simPhase === 'replica_sync');
                          const isFocused = focusedShardId === shard.id;
                          return (
                            <button key={`${shard.id}-${shard.type}`} onClick={() => setFocusedShardId(shard.id)} className={`flex-1 p-3 rounded-xl border-2 transition-all group relative text-left ${isActive ? 'bg-blue-600 border-yellow-400 scale-110 shadow-lg z-10' : isFocused ? 'bg-white/10 border-blue-500 shadow-md' : 'bg-white/5 border-transparent opacity-60'}`}>
                              <div className="text-xs font-black mb-0.5 text-left">{shard.type}{shard.id}</div>
                              <div className="text-[8px] font-bold opacity-40 uppercase text-left">Shard</div>
                              {isActive && <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping text-left"/>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 text-left">
            <div className="xl:col-span-3 space-y-3 text-left">
               <div className="px-6 py-4 bg-blue-600/10 border border-blue-500/20 rounded-[1.5rem] mb-4 text-left">
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 text-left">Observing Detail</div>
                  <div className="text-xl font-black text-white text-left">Shard {focusedShardId} <span className="text-xs text-slate-600 ml-2 font-mono text-left">Internal View</span></div>
               </div>
               <SimButton label="触发 Refresh" sub="写入 OS Cache 并对搜索可见" color="green" onClick={() => handleRefresh(focusedShardId)} disabled={shardsData[focusedShardId].buffer.length === 0} />
               <SimButton label="触发 Flush" sub="物理落盘并截断事务日志" color="red" onClick={() => handleFlush(focusedShardId)} disabled={shardsData[focusedShardId].segments.filter(s=>s.state==='cache').length === 0 && shardsData[focusedShardId].buffer.length === 0} />
               <SimButton label="执行 Merge" sub="自动重组物理碎段" color="purple" onClick={() => handleMerge(focusedShardId, false)} disabled={shardsData[focusedShardId].segments.length <= 1} />
               <SimButton label="Force Merge" sub="强力压缩至单一物理段" color="amber" onClick={() => handleMerge(focusedShardId, true)} disabled={shardsData[focusedShardId].segments.length === 0} />
            </div>

            <div className="xl:col-span-9 bg-black/40 rounded-[3rem] border border-white/5 p-8 flex flex-col min-h-[450px] shadow-2xl relative text-left">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 items-start text-left">
                  <div className="space-y-6 text-left">
                    <StageHeader label="Indexing Buffer" sub="Heap RAM / 正在分词构建" />
                    <div className="flex flex-wrap gap-2 p-5 bg-white/5 rounded-[1.5rem] min-h-[120px] border border-dashed border-white/10 shadow-inner text-left text-left">
                      {shardsData[focusedShardId].buffer.map(d => (
                        <div key={d.uid} className="px-2.5 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-lg text-[10px] font-mono font-bold flex items-center gap-2 animate-in zoom-in duration-300 text-left">
                          <FileJson size={10} className="text-blue-400 text-left"/> {d._id}
                        </div>
                      ))}
                      {shardsData[focusedShardId].buffer.length === 0 && <span className="text-[10px] text-slate-800 font-black uppercase m-auto tracking-widest text-left">Idle</span>}
                    </div>
                  </div>
                  <div className="space-y-6 text-left">
                    <StageHeader label="OS Page Cache" sub="内核级文件缓存 / 搜索可见" />
                    <div className="space-y-4 p-1 min-h-[250px] text-left">
                      {shardsData[focusedShardId].segments.filter(s => s.state === 'cache').map(seg => (
                        <SegmentItem key={seg.id} seg={seg} onDocClick={(docUid) => toggleDocDelete(focusedShardId, seg.id, docUid)} />
                      ))}
                      {shardsData[focusedShardId].segments.filter(s => s.state === 'cache').length === 0 && <span className="text-[10px] text-slate-800 font-black uppercase block text-center mt-20 tracking-widest text-left">No Segments</span>}
                    </div>
                  </div>
                  <div className="space-y-6 text-left">
                    <StageHeader label="Physical Disk" sub="物理介质存储 / 持久安全" />
                    <div className="space-y-4 p-1 min-h-[250px] text-left">
                      {shardsData[focusedShardId].segments.filter(s => s.state === 'disk').map(seg => (
                        <SegmentItem key={seg.id} seg={seg} isDisk onDocClick={(docUid) => toggleDocDelete(focusedShardId, seg.id, docUid)} />
                      ))}
                      {shardsData[focusedShardId].segments.filter(s => s.state === 'disk').length === 0 && <span className="text-[10px] text-slate-800 font-black uppercase block text-center mt-20 tracking-widest text-left">Disk Idle</span>}
                    </div>
                  </div>
               </div>
               <div className="mt-8 flex items-start gap-4 bg-white/5 p-5 rounded-2xl border border-white/5 shadow-lg text-left text-left">
                  <div className="flex gap-4 items-center text-left">
                    <div className="flex items-center gap-2 text-left">
                      <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)] text-left"/>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Translog Size: {shardsData[focusedShardId].translog} ops</span>
                    </div>
                    <div className="h-4 w-[1px] bg-white/10 text-left"/>
                    <div className="text-[10px] text-slate-400 font-medium italic text-left text-left">
                      观察：点击全链路写入。你会看到数据同时进入 Buffer 和 Translog。Refresh 解决的是“可见性”，Flush 解决的是“安全性”。
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* III. 进阶手册 - 深度白皮书重构 */}
        <section className="space-y-24 text-left">
          
          <div className="flex flex-col gap-4 border-b-2 border-slate-200 dark:border-slate-800 pb-10">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-blue-600 text-white rounded-3xl shadow-xl shadow-blue-500/20"><Book size={32}/></div>
              <div>
                <h3 className="text-4xl font-black tracking-tight text-slate-800 dark:text-white uppercase">3. 进阶手册：ES 索引内幕全景</h3>
                <p className="text-lg text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">From Node Coordination to Physical Bitstreams</p>
              </div>
            </div>
            <p className="text-slate-500 max-w-4xl leading-relaxed text-left text-left">
              本手册旨在填补“只会调接口”与“精通架构”之间的鸿沟。我们参考了 PDAl 等权威技术站的内容，通过 4 个核心章节，由浅入深地为您解密 Elasticsearch 如何处理每一比特的数据。
            </p>
          </div>

          <div className="space-y-32 text-left">
            {/* 第一章：分布式接力 */}
            <div className="text-left">
              <div className="flex items-center gap-4 mb-10 text-left">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center font-black text-xl shadow-inner text-left">01</div>
                <h4 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white uppercase text-left">分布式接力：文档索引的 6 步旅程</h4>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 text-left">
                <div className="lg:col-span-5 space-y-8 text-left text-left">
                   <div className="p-8 bg-white dark:bg-slate-900 border-2 border-indigo-50 dark:border-indigo-900/30 rounded-[3rem] shadow-sm text-left">
                      <h5 className="font-black text-indigo-600 text-sm uppercase tracking-widest mb-4 flex items-center gap-2"><Compass size={16}/> 核心机制：路由算法</h5>
                      <p className="text-sm text-slate-500 leading-relaxed mb-6 text-left text-left">
                        在分布式系统中，第一步永远是“分发”。当写请求到达 Coordinating Node（协调节点）后，它必须立刻决定数据该飞往何处。
                      </p>
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 font-mono text-xs text-blue-600 mb-6 text-left text-left">
                         shard_id = hash(_routing) % number_of_shards
                      </div>
                      <p className="text-xs text-slate-400 italic text-left text-left text-left text-left">
                        这就是为什么主分片数量一旦确定不可更改的原因：因为哈希取模算法依赖固定的底数，否则旧数据将永远无法被检索。
                      </p>
                   </div>
                </div>
                <div className="lg:col-span-7 text-left text-left text-left">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left text-left">
                      <StepBox num="1" title="请求接入" content="客户端向 Node 1 发送索引请求。Node 1 成为该请求的 Coordinating Node。" />
                      <StepBox num="2" title="路由决策" content="根据 hash(_id) 计算出目标为 Shard 0，通过 Cluster State 发现主分片在 Node 3。" />
                      <StepBox num="3" title="主分片写" content="请求转发至 Node 3。在本地完成索引逻辑。这是写操作的核心控制点。" />
                      <StepBox num="4" title="副本分发" content="Primary 并行向所有 Replica 节点发送写请求，确保数据冗余。" />
                      <StepBox num="5" title="确认 ACK" content="所有副本完成写入并反馈 Primary。这一步取决于 consistency 设置。" />
                      <StepBox num="6" title="响应完成" content="Primary 反馈 Coord，最后由 Coord 通知客户端 201 Created。旅程结束。" />
                   </div>
                </div>
              </div>
            </div>

            {/* 第二章：NRT 的物理接力 */}
            <div className="text-left text-left">
              <div className="flex items-center gap-4 mb-10 text-left text-left text-left">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center font-black text-xl shadow-inner text-left text-left">02</div>
                <h4 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white uppercase text-left text-left">NRT 的物理代偿：持久化三剑客</h4>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 text-left">
                <ConceptPanel 
                   icon={<RefreshCcw className="text-green-600"/>}
                   title="Refresh (刷新)" 
                   label="可见性之魂"
                   media="RAM {'->'} OS Cache"
                   content="默认 1s 执行一次。它将 Indexing Buffer（堆内存）中的文档转化为物理 Segment 存入 OS Page Cache。这一刻，数据对 IndexSearcher 正式可见。NRT（近实时）的本质，就是让搜索操作在昂贵的物理落盘之前，先在内存和内核缓存中运行。"
                />
                <ConceptPanel 
                   icon={<Shield className="text-orange-600"/>}
                   title="Translog (预写日志)" 
                   label="硬件保险栓"
                   media="Sequential Disk Write"
                   content="Refresh 虽然带来了速度，但带来了风险：如果宕机，Page Cache 里的数据会蒸发。Translog 通过磁盘顺序追加记录了所有未落盘的写操作。即便硬件故障，重启后 ES 也能通过回放日志，在几分钟内重构出消失的内存 Segment。"
                />
                <ConceptPanel 
                   icon={<Zap className="text-red-600"/>}
                   title="Flush (冲刷)" 
                   label="持久化终点"
                   media="Cache {'->'} Physical Disk"
                   content="这是沉重的 Lucene Commit 过程。它强制将所有内核缓存中的段文件执行 fsync 真正同步到物理磁盘，并建立 Checkpoint。Flush 成功后，Translog 才会放心地截断重置。通常每 30 分钟或日志达 512MB 时触发一次。"
                />
              </div>
            </div>

            {/* 第三章：Lucene 与 ES 的接力 */}
            <div className="text-left text-left text-left text-left">
              <div className="flex items-center gap-4 mb-10 text-left text-left">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-full flex items-center justify-center font-black text-xl shadow-inner text-left">03</div>
                <h4 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white uppercase text-left">深度协作：Lucene 内核与 ES 封装</h4>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-[3.5rem] border-2 border-slate-100 dark:border-slate-800 p-12 text-left">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 text-left">
                    <div className="space-y-6 text-left">
                       <h5 className="text-xl font-black flex items-center gap-3 text-slate-800 dark:text-white text-left"><Binary className="text-blue-500"/> Lucene：纯粹的原子引擎</h5>
                       <p className="text-sm text-slate-500 leading-relaxed text-left text-left">
                         Lucene 不认识集群，它只管好自己的一亩三分地。它负责把文本打碎成分词（Tokens），构建复杂的倒排索引字典，并将它们以 **Segment（段）** 的形式封存在物理文件中。
                       </p>
                       <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border-l-4 border-blue-500 text-left">
                          <p className="text-xs text-blue-700 font-bold leading-relaxed text-left text-left">
                             “段是不可变的（Immutable）。这种不可变性是 Lucene 高性能的核心——读取无需加锁，且极大方便了 OS 缓存。”
                          </p>
                       </div>
                    </div>
                    <div className="space-y-6 text-left">
                       <h5 className="text-xl font-black flex items-center gap-3 text-slate-800 dark:text-white text-left"><DatabaseZap className="text-orange-500"/> ES：工业级的分布式增强</h5>
                       <p className="text-sm text-slate-500 leading-relaxed text-left text-left">
                         ES 在 Lucene 之上盖了房子。因为 Lucene 的持久化（Commit）开销极大，如果每个写请求都同步落盘，ES 的吞吐量将惨不忍睹。ES 引入了 Translog 来解耦“搜索可见”与“物理持久”，在满足高吞吐的同时，利用集群一致性协议确保了数据的高可用。
                       </p>
                       <div className="grid grid-cols-2 gap-4 text-left">
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-left">
                             <div className="text-[10px] font-black text-slate-400 uppercase mb-1 text-left">ES 职责</div>
                             <div className="text-xs font-bold text-slate-700 dark:text-slate-200 text-left">分布式一致性、路由、Translog、段合并策略、故障转移。</div>
                          </div>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-left">
                             <div className="text-[10px] font-black text-slate-400 uppercase mb-1 text-left">Lucene 职责</div>
                             <div className="text-xs font-bold text-slate-700 dark:text-slate-200 text-left">倒排索引构建、分词计算、段文件物理格式、本地文件寻址。</div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* 第四章：段治理与物理剔除 */}
            <div className="text-left text-left text-left text-left text-left">
              <div className="flex items-center gap-4 mb-10 text-left">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 rounded-full flex items-center justify-center font-black text-xl shadow-inner text-left">04</div>
                <h4 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white uppercase text-left">段治理：Segment Merge 的物理真相</h4>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 text-left">
                 <div className="p-10 bg-purple-600 text-white rounded-[3.5rem] shadow-xl shadow-purple-500/20 text-left text-left">
                    <div className="flex items-center gap-4 mb-6 text-left">
                       <Recycle size={32} className="text-purple-200"/>
                       <h5 className="text-2xl font-black uppercase text-left">为什么必须合并？</h5>
                    </div>
                    <p className="text-sm text-purple-100 leading-relaxed mb-6 text-left text-left">
                      Refresh 像一台碎纸机，每秒都会产生几 KB 的微小段文件。这些小文件不仅消耗文件句柄，更会导致搜索时的 I/O 扇出开销剧增。
                    </p>
                    <div className="space-y-4 text-left">
                       <div className="flex gap-4 items-start text-left">
                          <CheckCircle2 size={16} className="text-purple-300 shrink-0 mt-1"/>
                          <p className="text-xs font-bold text-left">减少段数量：平衡搜索速度与内存消耗。</p>
                       </div>
                       <div className="flex gap-4 items-start text-left text-left">
                          <CheckCircle2 size={16} className="text-purple-300 shrink-0 mt-1"/>
                          <p className="text-xs font-bold text-left text-left">空间回收：物理剔除被标记删除的文档。</p>
                       </div>
                    </div>
                 </div>

                 <div className="p-10 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[3.5rem] text-left">
                    <h5 className="text-xl font-black mb-6 flex items-center gap-3 text-slate-800 dark:text-white text-left"><Layers2 size={24} className="text-purple-600"/> 删除的“逻辑标记”假象</h5>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6 text-left text-left text-left">
                      在磁盘上，文档是不能直接被抹掉的。当你执行 DELETE 请求时，ES 只是在 `.del` 位图文件中为该 ID 盖了一个“已删除”的戳。
                    </p>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 text-left text-left">
                       <h6 className="text-xs font-black text-slate-400 uppercase mb-2 text-left">Merge 时的物理剔除流程</h6>
                       <p className="text-xs text-slate-500 leading-relaxed text-left text-left">
                         在 Merge 阶段，Lucene 会读取多个旧段，在内存中重新构建倒排索引。此时，它会主动<span className="text-purple-600 font-black">跳过</span>那些被标记删除的文档，从而写出一个不含废数据的“纯净大段”。这是磁盘空间被真正回收的唯一时刻。
                       </p>
                    </div>
                 </div>
              </div>
            </div>

          </div>
        </section>

      </main>
    </div>
  );
};

// --- 子组件库 ---

const StepBox = ({ num, title, content }) => (
  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-left">
    <div className="flex items-center gap-3 mb-2 text-left">
      <span className="text-xs font-black bg-indigo-600 text-white w-5 h-5 rounded-md flex items-center justify-center font-mono text-left">0{num}</span>
      <h6 className="font-black text-slate-800 dark:text-white text-sm uppercase text-left">{title}</h6>
    </div>
    <p className="text-xs text-slate-500 leading-relaxed text-left text-left">{content}</p>
  </div>
);

const ConceptPanel = ({ icon, title, label, media, content }) => (
  <div className="flex flex-col gap-5 p-8 bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-900 rounded-[3rem] shadow-sm hover:shadow-xl transition-all text-left">
    <div className="flex items-center gap-4 text-left text-left">
       <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-left">{icon}</div>
       <div className="text-left text-left">
          <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest text-left">{label}</div>
          <h5 className="text-xl font-black text-slate-800 dark:text-white text-left">{title}</h5>
       </div>
    </div>
    <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded text-[9px] font-black text-slate-500 uppercase inline-block self-start text-left">Media: {media}</div>
    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-left text-left">{content}</p>
  </div>
);

const StageHeader = ({ label, sub }) => (
  <div className="px-3 border-l-4 border-slate-700 pl-5 text-left text-left">
    <div className="text-xs font-black text-slate-300 uppercase tracking-widest leading-none mb-1.5 text-left text-left">{label}</div>
    <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest text-left text-left">{sub}</div>
  </div>
);

const SegmentItem = ({ seg, isDisk, onDocClick }) => (
  <div className={`p-4 rounded-[1.5rem] border-2 animate-in slide-in-from-top-6 duration-500 text-left shadow-lg ${seg.isOptimized ? 'bg-purple-600/20 border-purple-500/50' : isDisk ? 'bg-slate-700/40 border-slate-600' : 'bg-green-600/10 border-green-500/30'}`}>
    <div className="flex justify-between items-center mb-3 text-left">
      <span className={`text-[9px] font-black uppercase tracking-widest ${seg.isOptimized ? 'text-purple-400' : 'text-slate-500'} text-left text-left`}>{seg.id}</span>
      <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${isDisk ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'} text-left text-left`}>{isDisk ? 'Disk' : 'Cache'}</div>
    </div>
    <div className="flex flex-wrap gap-1.5 mb-3 text-left text-left">
      {seg.docs.map(doc => (
        <button key={doc.uid} onClick={() => onDocClick(doc.uid)} className={`px-2 py-1 rounded-lg text-[9px] font-mono border transition-all ${doc.deleted ? 'bg-red-900/40 border-red-500 text-red-400 line-through opacity-60' : 'bg-black/40 border-white/5 text-slate-200 hover:border-blue-500'} text-left text-left`}>ID:{doc._id}</button>
      ))}
    </div>
    <div className="flex justify-between items-center pt-2 border-t border-white/5 text-left text-left">
      <span className="text-[8px] font-bold text-slate-500 uppercase text-left">{seg.docs.filter(d=>!d.deleted).length}/{seg.docs.length} Alive</span>
      <div className="text-[8px] font-mono text-slate-700 text-left text-left">{seg.createdAt}</div>
    </div>
  </div>
);

const SimButton = ({ label, sub, color, onClick, disabled }) => {
  const styles = { green: 'bg-green-600 hover:bg-green-50 disabled:bg-green-900/30', red: 'bg-red-600 hover:bg-red-50 disabled:bg-red-900/30', purple: 'bg-purple-600 hover:bg-purple-50 disabled:bg-purple-900/30', amber: 'bg-amber-600 hover:bg-amber-50 disabled:bg-amber-900/30' };
  return (
    <button disabled={disabled} onClick={onClick} className={`w-full p-4 rounded-[1.2rem] border border-transparent transition-all group ${styles[color]} ${disabled ? 'opacity-20 cursor-not-allowed grayscale' : 'shadow-xl active:scale-[0.97] hover:-translate-y-0.5'} text-left text-left`}>
      <div className="text-center overflow-hidden text-white text-left text-left">
        <div className="text-xs font-black uppercase tracking-widest mb-1 truncate text-center leading-none text-left text-left text-left text-left">{label}</div>
        <div className="text-[8px] font-bold opacity-60 tracking-widest uppercase truncate text-center leading-none text-left text-left text-left text-left">{sub}</div>
      </div>
    </button>
  );
};

const StatBadge = ({ label, value, highlight }) => (
  <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3 text-left text-left text-left text-left text-left">
    <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-left text-left text-left text-left text-left">{label}</div>
    <div className={`font-mono font-black text-lg ${highlight ? 'text-orange-400' : 'text-slate-700'} text-left text-left text-left`}>{value}</div>
  </div>
);

export default App;