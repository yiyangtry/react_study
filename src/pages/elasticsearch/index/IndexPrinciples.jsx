import React, { useState, useEffect } from 'react';
import { 
  Terminal, ArrowDown, Binary, Filter, HardDrive, 
  RefreshCcw, Zap, Recycle, ListTree, Box, ActivitySquare,
  Book, Shield, GitCommit, FileText, Share2, Play, CheckCircle2,
  FileJson, Layers2, DatabaseZap, TrendingUp, Scale, AlertOctagon, 
  XCircle, Flame, Snowflake, CpuIcon, Search, AlertTriangle, PlayCircle,
  Clock 
} from 'lucide-react';

const App = () => {
  // --- 模拟器核心状态 ---
  const [simDocSource, setSimDocSource] = useState('{"user": "arch", "content": "hello es"}');
  const [bufferDocs, setBufferDocs] = useState([]); 
  const [segments, setSegments] = useState([]); // [{id, docs, state, level, isOptimized}]
  const [translogSize, setTranslogSize] = useState(0);
  const [isForceMerging, setIsForceMerging] = useState(false);

  // 1. 模拟写入
  const handleSimWrite = () => {
    try {
      const parsed = JSON.parse(simDocSource);
      const newDoc = { 
        _id: Math.random().toString(36).substr(2, 5), 
        _source: parsed,
        deleted: false,
        timestamp: new Date().toLocaleTimeString() 
      };
      setBufferDocs([...bufferDocs, newDoc]);
      setTranslogSize(prev => prev + 1);
    } catch (e) {
      console.error("Invalid JSON input");
    }
  };

  // 2. 标记删除
  const toggleDelete = (segId, docId) => {
    setSegments(prev => prev.map(seg => {
      if (seg.id !== segId) return seg;
      return {
        ...seg,
        docs: seg.docs.map(d => d._id === docId ? { ...d, deleted: !d.deleted } : d)
      };
    }));
  };

  // 3. 模拟 Refresh
  const handleSimRefresh = () => {
    if (bufferDocs.length === 0) return;
    const newSegment = {
      id: `seg_${Math.floor(Math.random() * 1000)}`,
      docs: [...bufferDocs],
      state: 'cache', 
      level: 0,
      createdAt: new Date().toLocaleTimeString()
    };
    setSegments([...segments, newSegment]);
    setBufferDocs([]); 
  };

  // 4. 模拟 Flush
  const handleSimFlush = () => {
    setSegments(prev => prev.map(s => ({ ...s, state: 'disk' })));
    setTranslogSize(0); 
  };

  // 5. 普通 Merge
  const handleSimMerge = () => {
    if (segments.length <= 1) return;
    const aliveDocs = segments.reduce((acc, seg) => {
      const filtered = seg.docs.filter(d => !d.deleted);
      return [...acc, ...filtered];
    }, []);

    const optimizedSegment = {
      id: `merged_${Math.floor(Math.random() * 1000)}`,
      docs: aliveDocs,
      state: 'disk', 
      level: 1, 
      isOptimized: true,
      createdAt: new Date().toLocaleTimeString()
    };
    setSegments([optimizedSegment]);
  };

  // 6. Force Merge
  const handleForceMerge = () => {
    setIsForceMerging(true);
    setTimeout(() => {
      const allAliveDocs = segments.reduce((acc, seg) => {
        const filtered = seg.docs.filter(d => !d.deleted);
        return [...acc, ...filtered];
      }, []);

      const finalSegment = {
        id: `final_block`,
        docs: allAliveDocs,
        state: 'disk',
        level: 3, 
        isOptimized: true,
        createdAt: new Date().toLocaleTimeString()
      };
      setSegments([finalSegment]);
      setIsForceMerging(false);
    }, 1200); 
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-x-hidden pt-12">
      <main className="max-w-7xl mx-auto px-10 pb-32">
        {/* 极简标题区 */}
        <div className="mb-12 border-l-8 border-blue-600 pl-8 text-left">
          <h1 className="text-5xl font-black tracking-tighter uppercase text-slate-800 dark:text-white leading-none">索引流程</h1>
          <p className="text-lg text-slate-400 mt-3 font-medium">直观观测数据从文档分析到物理持久化的全生命周期</p>
        </div>

        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* I. 流程全景图 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 text-left">
            <section className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl"><ListTree size={24}/></div>
                <h3 className="text-xl font-black uppercase text-slate-800 dark:text-white">分析阶段</h3>
              </div>
              <div className="flex flex-col gap-5">
                <FlowCard icon={<Terminal size={22}/>} title="Character Filter" sub="原始文本清洗" />
                <div className="flex justify-center"><ArrowDown size={18} className="text-slate-200"/></div>
                <FlowCard icon={<Binary size={22}/>} title="Tokenizer" sub="生成词项 (Terms)" active />
                <div className="flex justify-center"><ArrowDown size={18} className="text-slate-200"/></div>
                <FlowCard icon={<Filter size={22}/>} title="Token Filter" sub="词项加工与规范化" />
              </div>
            </section>

            <section className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm text-left">
              <div className="flex items-center gap-4 mb-8 text-left">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><HardDrive size={24}/></div>
                <h3 className="text-xl font-black uppercase text-slate-800 dark:text-white">存储阶段</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-left">
                <PersistenceBox num="01" title="Buffer & Translog" sub="原子写入" color="blue" />
                <PersistenceBox num="02" title="Refresh" sub="段(Segment)产生" color="green" />
                <PersistenceBox num="03" title="Flush" sub="物理落盘" color="red" />
                <PersistenceBox num="04" title="Merge" sub="段合并治理" color="purple" highlight />
              </div>
              <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-left">
                <p className="text-sm text-slate-500 font-bold leading-relaxed flex gap-3 text-left">
                  <TrendingUp size={20} className="shrink-0 text-blue-500"/> 段数量越少，搜索越快；但合并过程消耗大量系统资源。
                </p>
              </div>
            </section>
          </div>

          {/* II. 交互仿真 */}
          <section className="bg-slate-900 text-white p-10 rounded-[3.5rem] shadow-2xl relative border border-slate-800 overflow-hidden text-left">
              {isForceMerging && (
                  <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-md">
                      <div className="text-center">
                          <div className="text-2xl font-black uppercase tracking-[0.4em] text-purple-400 mb-3 text-center">Force Merging...</div>
                          <div className="text-sm text-slate-400 font-medium italic text-center">物理重写所有磁盘段...</div>
                      </div>
                  </div>
              )}
              
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 text-left">
                  <div className="text-left">
                      <div className="flex items-center gap-3 mb-2 text-yellow-400 text-left">
                          <Zap size={28} fill="currentColor"/>
                          <h3 className="text-2xl font-black tracking-tight uppercase text-left">交互仿真</h3>
                      </div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest font-mono text-left">Hands-on Sandbox</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                      <StatBadge label="Translog" value={translogSize} highlight={translogSize > 0} />
                      <StatBadge label="Segments" value={segments.length} highlight={segments.length > 2} />
                  </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 text-left">
                  {/* 控制区 */}
                  <div className="xl:col-span-3 space-y-6 text-left">
                      <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-4 shadow-2xl text-left">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block font-mono text-left">文档写入</label>
                          <textarea 
                              className="w-full bg-black/40 border border-slate-700 rounded-xl px-4 py-3 text-xs font-mono focus:border-blue-500 outline-none transition-all text-blue-300 h-24 resize-none shadow-inner"
                              value={simDocSource}
                              onChange={e => setSimDocSource(e.target.value)}
                          />
                          <button onClick={handleSimWrite} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl transition-all shadow-lg font-black text-xs uppercase active:scale-95 shadow-blue-500/20">
                              执行写入
                          </button>
                      </div>

                      <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 space-y-3 text-left text-left">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block text-left text-left">生命周期控制</label>
                          <SimButton label="触发 Refresh" sub="数据变为可搜索" color="green" onClick={handleSimRefresh} disabled={bufferDocs.length === 0} />
                          <SimButton label="触发 Flush" sub="落盘并清空日志" color="red" onClick={handleSimFlush} disabled={segments.filter(s=>s.state==='cache').length === 0} />
                          <SimButton label="普通 Merge" sub="自动治理碎段" color="purple" onClick={handleSimMerge} disabled={segments.length <= 1} />
                          <SimButton label="Force Merge" sub="强制合并为单段" color="amber" onClick={handleForceMerge} disabled={segments.length === 0} />
                      </div>
                  </div>

                  {/* 视图区 */}
                  <div className="xl:col-span-9 bg-black/40 rounded-[3rem] border border-white/5 p-8 flex flex-col min-h-[450px] shadow-2xl relative text-left">
                      <div className="text-[10px] font-black text-slate-600 uppercase mb-8 tracking-[0.4em] flex items-center gap-3 border-b border-white/5 pb-4 text-left">
                          <DatabaseZap size={16}/> Physical Media Visualization
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 items-start text-left">
                          <div className="space-y-6 text-left">
                              <StageHeader label="Indexing Buffer" sub="堆内存 / 不可搜" />
                              <div className="flex flex-wrap gap-2 p-5 bg-white/5 rounded-[1.5rem] min-h-[120px] border border-dashed border-white/10 shadow-inner text-left">
                                  {bufferDocs.map(d => (
                                      <div key={d._id} className="px-2.5 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-lg text-[10px] font-mono font-bold flex items-center gap-2 animate-in zoom-in duration-300">
                                          <FileJson size={10} className="text-blue-400"/> {d._id}
                                      </div>
                                  ))}
                                  {bufferDocs.length === 0 && <span className="text-[10px] text-slate-800 font-black uppercase m-auto tracking-widest text-left">Empty</span>}
                              </div>
                          </div>

                          <div className="space-y-6 text-left">
                              <StageHeader label="OS Page Cache" sub="内存段 / 已可搜" />
                              <div className="space-y-4 p-1 min-h-[250px] text-left">
                                  {segments.filter(s => s.state === 'cache').map(seg => (
                                      <SegmentItem key={seg.id} seg={seg} onDocClick={(docId) => toggleDelete(seg.id, docId)} />
                                  ))}
                                  {segments.filter(s => s.state === 'cache').length === 0 && <span className="text-[10px] text-slate-800 font-black uppercase block text-center mt-20 tracking-widest text-left">No Segments</span>}
                              </div>
                          </div>

                          <div className="space-y-6 text-left">
                              <StageHeader label="Physical Disk" sub="持久段 / 物理落盘" />
                              <div className="space-y-4 p-1 min-h-[250px] text-left">
                                  {segments.filter(s => s.state === 'disk').map(seg => (
                                      <SegmentItem key={seg.id} seg={seg} isDisk onDocClick={(docId) => toggleDelete(seg.id, docId)} />
                                  ))}
                                  {segments.filter(s => s.state === 'disk').length === 0 && <span className="text-[10px] text-slate-800 font-black uppercase block text-center mt-20 tracking-widest text-left">Disk Idle</span>}
                              </div>
                          </div>
                      </div>

                      <div className="mt-8 flex items-start gap-4 bg-red-500/5 p-5 rounded-2xl border border-red-500/10 shadow-lg text-left text-left">
                          <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5"/>
                          <div className="text-[10px] text-red-300 leading-relaxed font-bold uppercase tracking-tight text-left text-left">
                              架构警告：只有冷数据建议 Force Merge。对热索引执行该操作会产生巨大 I/O 代价，且瞬间会被新生成的段破坏。
                          </div>
                      </div>
                  </div>
              </div>
          </section>

          {/* III. 知识手册 */}
          <section className="space-y-12 text-left text-left text-left">
              <div className="flex items-center gap-5 border-b border-slate-200 dark:border-slate-800 pb-6 text-left text-left text-left">
                  <Book className="text-blue-500" size={36}/>
                  <div className="text-left text-left text-left">
                      <h3 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white text-left text-left text-left text-left">进阶手册</h3>
                      <p className="text-base text-slate-400 font-bold uppercase tracking-widest mt-1 text-left text-left text-left text-left">Physical Architecture Reference</p>
                  </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left text-left text-left text-left text-left">
                  <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-slate-100 dark:border-slate-800 pb-12 text-left text-left text-left text-left text-left text-left text-left">
                     <ConceptCard 
                       title="分词分析" 
                       desc="结构化物理开销"
                       content="写入链路中最耗 CPU 的环节。负责将原始文本转化为 Inverted Index 项。架构师应优先考虑减少无意义的分词字段。"
                     />
                     <ConceptCard 
                       title="倒排索引" 
                       desc="搜索引擎核心"
                       content="由 Term Dictionary 和 Posting List 组成。利用 FST 结构将字典常驻内存，实现海量词项下的微秒级检索响应。"
                     />
                     <ConceptCard 
                       title="段 (Segment)" 
                       desc="物理存储单元"
                       content="Lucene 的最小独立单元，物理不可变。索引在物理上由成百上千个段组成。读取无需加锁，但删除必须通过 Merge 动作物理剔除。"
                     />
                  </div>

                  <ConceptCard title="Indexing Buffer" content="数据进入分片的第一站。Buffer 属于易失性的堆内存。只有执行 Refresh 动作，数据才会离开内存转化为物理段文件。" />
                  <ConceptCard title="Translog" content="硬件故障保险。在段落盘前，同步记录写操作。只有在 Flush 完成物理落盘后，对应的日志记录才会被安全截断。" />
                  <ConceptCard title="Refresh" content="决定搜索可见性。将 Buffer 转化为段并推送到 OS Cache。从此数据正式可搜，这是 ES NRT 特性的物理基础。" />
                  <ConceptCard title="Flush" content="物理落盘屏障。调用 fsync 将段文件写死到磁盘硬件。这是 ES 更新检查点并安全清空 Translog 日志的唯一时刻。" />
                  <ConceptCard title="普通 Merge" content="系统自愈行为。基于策略重组大小相近的碎段。旨在平衡查询 I/O 开销与合并时产生的系统负载。" />
                  <ConceptCard title="Force Merge" content="运维干预手段。物理剔除所有标记删除的记录，将段压缩到 1。仅适用于只读冷数据，可榨干硬件的搜索响应极限。" />
              </div>
          </section>
        </div>
      </main>
    </div>
  );
};

// --- 原子 UI 组件库 ---

const SegmentItem = ({ seg, isDisk, onDocClick }) => (
    <div className={`p-5 rounded-[2rem] border-2 animate-in slide-in-from-top-6 duration-500 text-left shadow-lg ${
        seg.level === 3 ? 'bg-amber-600/20 border-amber-500/50 shadow-2xl' :
        seg.isOptimized 
        ? 'bg-purple-600/20 border-purple-500/50' 
        : isDisk ? 'bg-slate-700/40 border-slate-600' : 'bg-green-600/10 border-green-500/30'
    }`}>
        <div className="flex justify-between items-center mb-4 text-left">
            <span className={`text-[10px] font-black uppercase tracking-widest ${seg.level === 3 ? 'text-amber-400' : seg.isOptimized ? 'text-purple-400' : 'text-slate-500'}`}>
                {seg.level === 3 ? 'Final Block' : seg.isOptimized ? 'Optimized' : `SEG: ${seg.id}`}
            </span>
            <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${isDisk ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                {isDisk ? 'Disk' : 'Cache'}
            </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4 text-left">
            {seg.docs.map(doc => (
                <button 
                    key={doc._id} 
                    onClick={() => onDocClick(doc._id)}
                    className={`group relative px-2 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                        doc.deleted 
                        ? 'bg-red-900/40 border-red-500 text-red-400 line-through opacity-60 scale-95' 
                        : 'bg-black/40 border-white/5 text-slate-200 hover:border-red-500/50 hover:bg-red-500/10'
                    }`}
                >
                    ID:{doc._id}
                </button>
            ))}
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-white/5 text-left text-left">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest text-left">
                {seg.docs.filter(d=>!d.deleted).length} / {seg.docs.length} Items
            </span>
            <div className="text-[9px] font-mono text-slate-700 text-left">{seg.createdAt}</div>
        </div>
    </div>
);

const SimButton = ({ label, sub, color, onClick, disabled }) => {
    const styles = {
        green: 'bg-green-600 hover:bg-green-500 disabled:bg-green-900/30',
        red: 'bg-red-600 hover:bg-red-500 disabled:bg-red-900/30',
        purple: 'bg-purple-600 hover:bg-purple-500 disabled:bg-purple-900/30',
        amber: 'bg-amber-600 hover:bg-amber-500 disabled:bg-amber-900/30',
    };
    return (
        <button 
            disabled={disabled}
            onClick={onClick} 
            className={`w-full p-4 rounded-[1.2rem] border border-transparent transition-all group ${styles[color]} ${disabled ? 'opacity-20 cursor-not-allowed grayscale' : 'shadow-xl active:scale-[0.97] hover:-translate-y-0.5'}`}
        >
            <div className="text-center overflow-hidden text-white">
                <div className="text-xs font-black uppercase tracking-widest mb-1 truncate text-center leading-none">{label}</div>
                <div className="text-[8px] font-bold opacity-60 tracking-widest uppercase truncate text-center leading-none">{sub}</div>
            </div>
        </button>
    );
};

const StatBadge = ({ label, value, highlight }) => (
    <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center gap-4 shadow-2xl text-left">
        <div className="text-xs font-black text-slate-500 uppercase tracking-widest text-left">{label}</div>
        <div className={`font-mono font-black text-2xl ${highlight ? 'text-orange-400' : 'text-slate-700'}`}>{value}</div>
    </div>
);

const StageHeader = ({ label, sub }) => (
    <div className="px-3 border-l-4 border-slate-700 pl-5 text-left text-left text-left">
        <div className="text-xs font-black text-slate-300 uppercase tracking-widest leading-none mb-1.5 text-left text-left text-left text-left">{label}</div>
        <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest text-left text-left text-left text-left">{sub}</div>
    </div>
);

const ConceptCard = ({ title, icon, desc, content }) => (
    <div className="p-10 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-6 text-left hover:shadow-2xl transition-all group cursor-default text-left">
        <div className="flex items-center gap-5 text-left text-left text-left">
            {icon && <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-[2rem] group-hover:scale-110 transition-transform shadow-sm shrink-0">{icon}</div>}
            <div className="text-left text-left text-left text-left">
                <h4 className="font-black text-2xl text-slate-800 dark:text-white uppercase tracking-tight leading-none mb-2 text-left text-left text-left text-left">{title}</h4>
                {desc && <div className="text-sm font-black text-blue-500 uppercase tracking-widest opacity-80 text-left text-left text-left text-left text-left text-left">{desc}</div>}
            </div>
        </div>
        <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed font-medium text-left text-left text-left text-left text-left text-left">{content}</p>
    </div>
);

const PersistenceBox = ({ num, title, sub, color, highlight }) => {
    const theme = {
        blue: 'bg-blue-50 border-blue-500/30 text-blue-600',
        green: 'bg-green-50 border-green-500/30 text-green-600',
        red: 'bg-red-50 border-red-500/30 text-red-600',
        purple: 'bg-purple-50 border-purple-500/30 text-purple-600'
    };
    return (
        <div className={`p-6 rounded-[2rem] border-2 z-10 transition-transform hover:scale-105 ${theme[color]} ${highlight ? 'border-dashed' : 'border-solid shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-3 text-left text-left text-left text-left">
                <span className="text-xs font-black font-mono bg-white/50 px-2.5 py-1 rounded-full shadow-sm text-left">{num}</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 font-mono text-left text-left text-left text-left text-left text-left">{sub}</span>
            </div>
            <div className="text-lg font-black tracking-tight text-left leading-none text-left text-left text-left text-left text-left text-left">{title}</div>
        </div>
    );
};

const FlowCard = ({ icon, title, sub, active }) => (
    <div className={`flex items-center gap-6 p-6 rounded-[2rem] border-2 transition-all group ${
        active ? 'bg-orange-600 border-orange-400 text-white shadow-2xl scale-105' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800'
    }`}>
        <div className={`p-4 rounded-[1.5rem] ${active ? 'bg-white/20' : 'bg-white dark:bg-slate-900 text-orange-500 shadow-sm'} group-hover:rotate-6 transition-transform text-left`}>{icon}</div>
        <div className="text-left text-left text-left text-left text-left">
            <div className="text-lg font-black uppercase tracking-tight text-left text-left text-left text-left text-left text-left">{title}</div>
            <div className={`text-xs font-black uppercase tracking-widest opacity-70 text-left text-left text-left text-left text-left text-left ${active ? 'text-orange-100' : 'text-slate-400'}`}>{sub}</div>
        </div>
    </div>
);

export default App;