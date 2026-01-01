import React, { useState, useEffect } from 'react';
import { 
  Database, Search, Layers, Zap, HardDrive, RefreshCcw, 
  Settings, Terminal, Code, Filter, FastForward, Info, 
  LayoutDashboard, Activity, Cpu, MousePointer2,
  ChevronRight, ShieldCheck, BarChart3, AlertTriangle, PlayCircle,
  Clock, Server, BookOpen, Recycle, CpuIcon, Trash2, ArrowDown,
  ArrowRight, Binary, ListTree, Box, Layers3, ActivitySquare,
  Book, Shield, GitCommit, FileText, Share2, Play, CheckCircle2,
  ChevronDown, MoveRight, FileJson, Layers2, DatabaseZap,
  TrendingUp, Scale, AlertOctagon, XCircle, Flame, Snowflake
} from 'lucide-react';

const App = () => {
  const [selectedTopic, setSelectedTopic] = useState('overview');
  
  // --- 模拟器核心状态 ---
  const [simDocSource, setSimDocSource] = useState('{"user": "arch", "content": "es is powerful"}');
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
    }, 1500); 
  };

  const [doc1, setDoc1] = useState("Elasticsearch is powerful");
  const [invertedIndex, setInvertedIndex] = useState({});

  useEffect(() => {
    const buildIndex = () => {
      const index = {};
      const process = (text, id) => {
        text.toLowerCase().split(' ').forEach(word => {
          if (!index[word]) index[word] = [];
          if (!index[word].includes(id)) index[word].push(id);
        });
      };
      process(doc1, "Doc_1");
      setInvertedIndex(index);
    };
    buildIndex();
  }, [doc1]);

  const topics = [
    { id: 'overview', title: '索引核心全景', subtitle: 'Learning Path', icon: <LayoutDashboard size={20}/>, color: 'text-blue-500' },
    { id: 'engine', title: '透视倒排索引', subtitle: 'The Mechanics', icon: <Search size={20}/>, color: 'text-orange-500' },
    { id: 'mapping', title: '手把手教建模', subtitle: 'Mapping Guide', icon: <Layers size={20}/>, color: 'text-purple-500' },
    { id: 'production', title: '实战别名管理', subtitle: 'Ops Practice', icon: <Filter size={20}/>, color: 'text-emerald-500' },
    { id: 'tuning', title: '榨干写入性能', subtitle: 'Performance', icon: <Zap size={20}/>, color: 'text-yellow-500' },
    { id: 'reindex', title: '平滑索引迁移', subtitle: 'Data Migration', icon: <RefreshCcw size={20}/>, color: 'text-red-500' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      {/* Sidebar - 侧边导航 */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm text-left">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <BookOpen className="text-blue-600" size={26} />
            <h1 className="font-black tracking-tighter text-xl uppercase leading-none">ES 索引<br/>进阶实验室</h1>
          </div>
          <div className="text-xs text-blue-600 font-bold uppercase tracking-widest border border-blue-100 bg-blue-50 dark:bg-blue-900/20 rounded py-1.5 mt-3 text-center">架构师深度教程</div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 font-black">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTopic(t.id)}
              className={`w-full group flex flex-col gap-1 px-4 py-4 rounded-xl transition-all ${
                selectedTopic === t.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={selectedTopic === t.id ? 'text-white' : t.color}>{t.icon}</span>
                <span className="text-base font-bold tracking-tight">{t.title}</span>
              </div>
              <span className={`text-[10px] pl-8 opacity-70 uppercase tracking-widest font-mono ${selectedTopic === t.id ? 'text-blue-100' : ''}`}>
                {t.subtitle}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content - 主显示区域 */}
      <main className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50 text-left">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-black tracking-tight uppercase text-slate-800 dark:text-white">{topics.find(t => t.id === selectedTopic).title}</h2>
              <p className="text-lg text-slate-500 mt-2 font-medium italic text-left">解密架构：为什么有些段合并了，有些却没有？</p>
            </div>
            <div className="flex gap-3">
              <span className="px-4 py-1.5 bg-red-100 text-red-600 text-xs font-black rounded-full uppercase border border-red-200 shadow-sm flex items-center gap-2"><Flame size={14}/> 热写入态</span>
              <span className="px-4 py-1.5 bg-blue-100 text-blue-600 text-xs font-black rounded-full uppercase border border-blue-200 shadow-sm flex items-center gap-2"><Snowflake size={14}/> 冷归档态</span>
            </div>
          </div>

          <div className="space-y-16 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-20">
            
            {selectedTopic === 'overview' && (
              <>
                {/* I. 流程全景图 (保持大字体) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                  <section className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4 mb-10 text-left">
                      <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl"><ListTree size={24}/></div>
                      <h3 className="text-xl font-black tracking-tight uppercase">工序一：数据索引分析</h3>
                    </div>
                    <div className="flex flex-col gap-6">
                      <FlowCard icon={<Terminal size={20}/>} title="Character Filter" sub="清洗原始文本" />
                      <div className="flex justify-center"><ArrowDown size={18} className="text-slate-200"/></div>
                      <FlowCard icon={<Binary size={20}/>} title="Tokenizer" sub="生成词项 (Terms)" active />
                      <div className="flex justify-center"><ArrowDown size={18} className="text-slate-200"/></div>
                      <FlowCard icon={<Filter size={20}/>} title="Token Filter" sub="词项加工" />
                    </div>
                  </section>

                  <section className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4 mb-10 text-left">
                      <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl"><HardDrive size={24}/></div>
                      <h3 className="text-xl font-black tracking-tight uppercase">工序二：数据持久化与合并</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <PersistenceBox num="01" title="Buffer & Translog" sub="原子写入" color="blue" />
                      <PersistenceBox num="02" title="Refresh" sub="段产生(NRT)" color="green" />
                      <PersistenceBox num="03" title="Flush" sub="物理落盘" color="red" />
                      <PersistenceBox num="04" title="Merge" sub="持续合并治理" color="purple" highlight />
                    </div>
                    <div className="mt-10 p-6 bg-purple-50 dark:bg-purple-900/10 rounded-3xl border border-purple-100 text-left">
                      <p className="text-sm text-purple-600 font-bold leading-relaxed flex gap-3">
                        <TrendingUp size={18} className="shrink-0"/> 重点：只有执行 Merge，标记删除的内容才会物理消失。
                      </p>
                    </div>
                  </section>
                </div>

                {/* II. 交互模拟器 (按钮优化：无图标，纯文字) */}
                <section className="bg-slate-900 text-white p-12 rounded-[3.5rem] shadow-2xl relative border border-slate-800 text-left">
                    {isForceMerging && (
                        <div className="absolute inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-md">
                            <div className="text-center">
                                <div className="text-2xl font-black uppercase tracking-[0.4em] text-purple-400 mb-2 animate-pulse">Force Merging...</div>
                                <div className="text-sm text-slate-400 font-medium italic">物理重写所有段文件中...</div>
                            </div>
                        </div>
                    )}
                    
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                        <div>
                            <div className="flex items-center gap-3 mb-2 text-yellow-400">
                                <Zap size={28} fill="currentColor"/>
                                <h3 className="text-3xl font-black tracking-tight uppercase">物理流实时模拟器</h3>
                            </div>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest font-mono italic">Shard Physical State Sandbox</p>
                        </div>
                        <div className="flex gap-5">
                            <StatBadge label="Translog" value={translogSize} highlight={translogSize > 0} />
                            <StatBadge label="Segments" value={segments.length} highlight={segments.length > 2} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* 控制区 - 按钮移除图标 */}
                        <div className="lg:col-span-3 space-y-8">
                            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-5">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block font-mono">1. API 模拟写入</label>
                                <textarea 
                                    className="w-full bg-black/40 border border-slate-700 rounded-2xl px-5 py-4 text-xs font-mono focus:border-blue-500 outline-none transition-all text-blue-300 h-28 resize-none"
                                    value={simDocSource}
                                    onChange={e => setSimDocSource(e.target.value)}
                                />
                                <button onClick={handleSimWrite} className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl transition-all shadow-lg font-black text-sm uppercase">
                                    执行写入请求
                                </button>
                            </div>

                            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-4">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">2. 物理阶段触发</label>
                                <SimButton label="Refresh" sub="生成段 (可搜索)" color="green" onClick={handleSimRefresh} disabled={bufferDocs.length === 0} />
                                <SimButton label="Flush" sub="物理落盘 (清空日志)" color="red" onClick={handleSimFlush} disabled={segments.filter(s=>s.state==='cache').length === 0} />
                            </div>

                            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 space-y-4">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest block">3. 磁盘段治理</label>
                                <SimButton label="Normal Merge" sub="系统自动平衡段数量" color="purple" onClick={handleSimMerge} disabled={segments.length <= 1} />
                                <SimButton label="Force Merge" sub="强制合并为唯一段" color="amber" onClick={handleForceMerge} disabled={segments.length === 0} />
                            </div>
                        </div>

                        {/* 可视化区 (维持大字体与专业间距) */}
                        <div className="lg:col-span-9 bg-black/40 rounded-[3rem] border border-white/5 p-10 flex flex-col min-h-[500px] text-left">
                            <div className="text-xs font-black text-slate-600 uppercase mb-10 tracking-[0.4em] flex items-center gap-3 border-b border-white/5 pb-5">
                                <DatabaseZap size={16}/> Shard Physical Memory & Disk States
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1 items-start text-left">
                                <div className="space-y-6">
                                    <StageHeader label="Indexing Buffer" sub="Heap RAM / 搜不到" />
                                    <div className="flex flex-wrap gap-3 p-6 bg-white/5 rounded-[2rem] min-h-[140px] border border-dashed border-white/10">
                                        {bufferDocs.map(d => (
                                            <div key={d._id} className="px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-xl text-xs font-mono font-bold flex items-center gap-2 animate-in zoom-in">
                                                <FileJson size={12} className="text-blue-400"/> {d._id}
                                            </div>
                                        ))}
                                        {bufferDocs.length === 0 && <span className="text-[10px] text-slate-700 font-black uppercase m-auto tracking-widest">Empty Buffer</span>}
                                    </div>
                                </div>

                                <div className="space-y-6 text-left">
                                    <StageHeader label="OS Page Cache" sub="内存段 / 已可搜" />
                                    <div className="space-y-4 p-1 min-h-[250px]">
                                        {segments.filter(s => s.state === 'cache').map(seg => (
                                            <SegmentItem key={seg.id} seg={seg} onDocClick={(docId) => toggleDelete(seg.id, docId)} />
                                        ))}
                                        {segments.filter(s => s.state === 'cache').length === 0 && <span className="text-[10px] text-slate-700 font-black uppercase block text-center mt-24 tracking-widest">No Segments</span>}
                                    </div>
                                </div>

                                <div className="space-y-6 text-left">
                                    <StageHeader label="Physical Disk" sub="持久化段 / 安全" />
                                    <div className="space-y-4 p-1 min-h-[250px]">
                                        {segments.filter(s => s.state === 'disk').map(seg => (
                                            <SegmentItem key={seg.id} seg={seg} isDisk onDocClick={(docId) => toggleDelete(seg.id, docId)} />
                                        ))}
                                        {segments.filter(s => s.state === 'disk').length === 0 && <span className="text-[10px] text-slate-700 font-black uppercase block text-center mt-24 tracking-widest">Disk Idle</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex items-start gap-4 bg-red-500/10 p-6 rounded-3xl border border-red-500/20 shadow-lg text-left">
                                <AlertTriangle size={20} className="text-red-400 shrink-0 mt-0.5"/>
                                <div className="text-xs text-red-300 leading-relaxed font-bold uppercase tracking-tight">
                                    架构警告：当前仍有 Buffer 写入。对热索引执行 Force Merge 是极度昂贵的。新产生的 Segment 会瞬间破坏单段结构。
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* III. 深度知识手册 (维持清晰的大字体) */}
                <section className="space-y-12 text-left">
                    <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                        <Book className="text-blue-500" size={32}/>
                        <div>
                            <h3 className="text-3xl font-black tracking-tight">进阶手册：核心概念深度解码</h3>
                            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Deep Dive into ES Shard Anatomy</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-10 border-b border-slate-100 dark:border-slate-800 pb-12">
                           <ConceptCard 
                             title="Analysis (分析)" 
                             icon={<CpuIcon className="text-orange-500" size={24}/>}
                             desc="结构化物理开销"
                             content="写入链路中最耗 CPU 的环节。架构师在优化写入吞吐时，应优先考虑使用 Keyword 类型以跳过该阶段。"
                           />
                           <ConceptCard 
                             title="Inverted Index" 
                             icon={<Search className="text-orange-500" size={24}/>}
                             desc="核心数据结构"
                             content="由词项字典(FST)和倒排列表组成。FST 结构被设计为常驻内存，确保了海量词项下搜索定位的微秒级响应。"
                           />
                           <ConceptCard 
                             title="Segment (段)" 
                             icon={<Layers2 className="text-blue-600" size={24}/>}
                             desc="物理存储单元"
                             content="Lucene 的最小独立单元，具备物理不可变性。这意味着读取无需加锁，且索引本质上是这些段的逻辑集合。"
                           />
                        </div>

                        <ConceptCard title="Indexing Buffer" icon={<Box className="text-blue-500" size={24}/>} content="数据进入分片的第一站。Buffer 是易失的 JVM 内存空间。只有执行 Refresh 动作，数据才会离开内存转化为段。" />
                        <ConceptCard title="Translog (日志)" icon={<Shield className="text-orange-500" size={24}/>} content="硬件故障保险。在段真正物理落盘前，Translog 顺序记录所有写操作。只有在 Flush 完成落盘后，日志才会被截断。" />
                        <ConceptCard title="Refresh (刷新)" icon={<Clock className="text-green-500" size={24}/>} content="决定搜索可见性。将 Buffer 转化为段并推送至 OS Cache。从此数据正式可被搜索，这是 ES NRT 特性的基础。" />
                        <ConceptCard title="Flush (冲刷)" icon={<Zap className="text-red-500" size={24}/>} content="执行物理 Commit。调用系统 fsync 将 Page Cache 中的段写死到磁盘硬件。这是更新 Checkpoint 并清空日志的时刻。" />
                        <ConceptCard title="Normal Merge" icon={<Recycle className="text-purple-600" size={24}/>} content="系统的自动治理。基于策略自动寻找大小相近的碎段进行重组，旨在平衡“查询 IO 扇出”与“合并开销”。" />
                        <ConceptCard title="Force Merge" icon={<AlertOctagon className="text-amber-500" size={24}/>} content="运维强制干预。物理剔除所有已删除文档，将段数量压缩到 1。仅适用于只读的冷数据归档，极其消耗 IO。" />
                    </div>
                </section>
              </>
            )}

            {/* 其他模块逻辑相同 */}
          </div>
        </div>
      </main>
    </div>
  );
};

// --- 原子 UI 组件库 ---

const SegmentItem = ({ seg, isDisk, onDocClick }) => (
    <div className={`p-6 rounded-[2rem] border-2 animate-in slide-in-from-top-4 duration-500 text-left ${
        seg.level === 3 ? 'bg-amber-600/20 border-amber-500/50 shadow-2xl' :
        seg.isOptimized 
        ? 'bg-purple-600/20 border-purple-500/50 shadow-xl' 
        : isDisk ? 'bg-slate-700/40 border-slate-600' : 'bg-green-600/10 border-green-500/30'
    }`}>
        <div className="flex justify-between items-center mb-4">
            <span className={`text-xs font-black uppercase tracking-widest ${seg.level === 3 ? 'text-amber-400' : seg.isOptimized ? 'text-purple-400' : 'text-slate-500'}`}>
                {seg.level === 3 ? 'Final Segment' : seg.isOptimized ? 'Optimized' : `SEG: ${seg.id}`}
            </span>
            <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${isDisk ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {isDisk ? 'Disk' : 'Cache'}
            </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
            {seg.docs.map(doc => (
                <button 
                    key={doc._id} 
                    onClick={() => onDocClick(doc._id)}
                    className={`group relative px-2.5 py-1.5 rounded-xl text-xs font-mono border transition-all ${
                        doc.deleted 
                        ? 'bg-red-900/40 border-red-500 text-red-400 line-through opacity-60 scale-95' 
                        : 'bg-black/40 border-white/5 text-slate-300 hover:border-red-500/50'
                    }`}
                >
                    ID:{doc._id}
                </button>
            ))}
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-white/5">
            <span className="text-[10px] font-bold text-slate-500 uppercase">
                {seg.docs.filter(d=>!d.deleted).length} / {seg.docs.length} Docs
            </span>
            <div className="text-[10px] font-mono text-slate-700">{seg.createdAt}</div>
        </div>
    </div>
);

// 重构按钮组件：移除图标，强化文字布局
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
            className={`w-full p-5 rounded-[1.5rem] border border-transparent transition-all group ${styles[color]} ${disabled ? 'opacity-20 cursor-not-allowed grayscale' : 'shadow-lg active:scale-[0.98]'}`}
        >
            <div className="text-center overflow-hidden text-white">
                <div className="text-sm font-black uppercase tracking-widest mb-1 truncate">{label}</div>
                <div className="text-[10px] font-bold opacity-60 tracking-widest uppercase truncate">{sub}</div>
            </div>
        </button>
    );
};

const StatBadge = ({ label, value, highlight }) => (
    <div className="px-5 py-3 bg-white/5 border border-white/10 rounded-3xl flex items-center gap-4">
        <div className="text-xs font-black text-slate-500 uppercase tracking-tighter">{label}</div>
        <div className={`font-mono font-black text-2xl ${highlight ? 'text-orange-400' : 'text-slate-700'}`}>{value}</div>
    </div>
);

const StageHeader = ({ label, sub }) => (
    <div className="px-2 border-l-4 border-slate-800 pl-4 text-left">
        <div className="text-xs font-black text-slate-300 uppercase tracking-widest leading-none mb-1.5">{label}</div>
        <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{sub}</div>
    </div>
);

const ConceptCard = ({ title, icon, desc, content }) => (
    <div className="p-10 bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-5 text-left hover:shadow-md transition-all group">
        <div className="flex items-center gap-5">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl group-hover:scale-110 transition-transform">{icon}</div>
            <div className="text-left">
                <h4 className="font-black text-xl text-slate-800 dark:text-white uppercase tracking-tight leading-none mb-1.5">{title}</h4>
                <div className="text-xs font-black text-blue-500 uppercase tracking-widest">{desc}</div>
            </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{content}</p>
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
        <div className={`p-6 rounded-[2rem] border-2 z-10 ${theme[color]} ${highlight ? 'border-dashed' : 'border-solid shadow-sm'}`}>
            <div className="flex items-center gap-3 mb-2 text-left">
                <span className="text-xs font-black font-mono bg-white/50 px-2 py-0.5 rounded-full">{num}</span>
                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 font-mono">{sub}</span>
            </div>
            <div className="text-sm font-black tracking-tight text-left">{title}</div>
        </div>
    );
};

const FlowCard = ({ icon, title, sub, active }) => (
    <div className={`flex items-center gap-5 p-5 rounded-[1.5rem] border-2 transition-all ${
        active ? 'bg-orange-600 border-orange-400 text-white shadow-xl scale-105' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800'
    }`}>
        <div className={`p-3 rounded-2xl ${active ? 'bg-white/20' : 'bg-white dark:bg-slate-900 text-orange-500 shadow-sm'}`}>{icon}</div>
        <div className="text-left text-left">
            <div className="text-sm font-black uppercase tracking-tight">{title}</div>
            <div className={`text-[10px] font-black uppercase tracking-widest opacity-70 ${active ? 'text-orange-100' : 'text-slate-400'}`}>{sub}</div>
        </div>
    </div>
);

export default App;