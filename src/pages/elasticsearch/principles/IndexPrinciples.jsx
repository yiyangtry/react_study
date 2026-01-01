import React, { useState, useEffect } from 'react';
import { 
  Database, Search, Layers, Zap, HardDrive, RefreshCcw, 
  Settings, Terminal, Code, Filter, FastForward, Info, 
  LayoutDashboard, Activity, Cpu, MousePointer2,
  ChevronRight, ShieldCheck, BarChart3, AlertTriangle, PlayCircle,
  Clock, Server, BookOpen, Recycle
} from 'lucide-react';

const App = () => {
  const [selectedTopic, setSelectedTopic] = useState('overview');
  const [activeIndexId, setActiveIndexId] = useState('v1'); 
  
  const [doc1, setDoc1] = useState("Elasticsearch is powerful");
  const [doc2, setDoc2] = useState("Search is fast");
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
      process(doc2, "Doc_2");
      setInvertedIndex(index);
    };
    buildIndex();
  }, [doc1, doc2]);

  const indexData = {
    v1: {
      name: "订单搜索场景 (v1)",
      shards: [
        { id: 0, type: 'Primary 主分片', segments: ['Large_Seg_01', 'Large_Seg_02'] },
        { id: 1, type: 'Replica 副本', segments: ['Large_Seg_01', 'Large_Seg_02'] }
      ],
      desc: "【搜索优化例】订单索引经过 Force Merge 强制合并，段数量极少，查询速度最快。"
    },
    v2: {
      name: "日志写入场景 (v2)",
      shards: [
        { id: 0, type: 'Primary 主分片', segments: ['Tiny_01', 'Tiny_02', 'Tiny_03', 'Tiny_04'] },
        { id: 1, type: 'Primary 主分片', segments: ['Tiny_05', 'Tiny_06', 'Tiny_07', 'Tiny_08'] },
        { id: 2, type: 'Replica 副本', segments: ['Tiny_01', 'Tiny_02', 'Tiny_03', 'Tiny_04'] }
      ],
      desc: "【高频写入例】日志正在疯狂写入，产生大量细碎段。此时应关注合并性能。"
    }
  };

  const topics = [
    { id: 'overview', title: '索引核心全景', subtitle: 'Learning Path', icon: <LayoutDashboard size={18}/>, color: 'text-blue-500' },
    { id: 'engine', title: '透视倒排索引', subtitle: 'The Mechanics', icon: <Search size={18}/>, color: 'text-orange-500' },
    { id: 'mapping', title: '手把手教建模', subtitle: 'Mapping Guide', icon: <Layers size={18}/>, color: 'text-purple-500' },
    { id: 'production', title: '实战别名管理', subtitle: 'Ops Practice', icon: <Filter size={18}/>, color: 'text-emerald-500' },
    { id: 'tuning', title: '榨干写入性能', subtitle: 'Performance', icon: <Zap size={18}/>, color: 'text-yellow-500' },
    { id: 'reindex', title: '平滑索引迁移', subtitle: 'Data Migration', icon: <RefreshCcw size={18}/>, color: 'text-red-500' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      {/* 侧边导航栏 */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm">
        <div className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <BookOpen className="text-blue-600" size={24} />
            <h1 className="font-black tracking-tighter text-lg uppercase leading-none text-slate-800 dark:text-white">ES 索引<br/>进阶实验室</h1>
          </div>
          <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest border border-blue-100 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-900/20 rounded py-1 mt-2 tracking-tighter">从入门到精通教程</div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto mt-4">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTopic(t.id)}
              className={`w-full group flex flex-col gap-0.5 px-4 py-3 rounded-xl transition-all ${
                selectedTopic === t.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={selectedTopic === t.id ? 'text-white' : t.color}>{t.icon}</span>
                <span className="text-sm font-bold tracking-tight">{t.title}</span>
              </div>
              <span className={`text-[9px] pl-7 opacity-70 font-medium font-mono uppercase ${selectedTopic === t.id ? 'text-blue-100' : ''}`}>
                {t.subtitle}
              </span>
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <Activity size={14} className="text-green-500" /> 教学基准: V 7.10 OSS
          </div>
        </div>
      </aside>

      {/* 主内容区域 */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white uppercase">{topics.find(t => t.id === selectedTopic).title}</h2>
              <p className="text-slate-500 mt-1 font-medium">带你深入索引底层，掌握应对海量数据的实战技巧</p>
            </div>
            <div className="flex gap-2">
              <span className="px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-200 dark:border-blue-800">进阶必修</span>
            </div>
          </div>

          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {/* 1. 索引全景看板 */}
            {selectedTopic === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard title="分片配置" subtitle="Shard Plan" value="主副均衡" sub="分布式存储的核心" status="bg-green-500" />
                  <MetricCard title="写入能力" subtitle="Write Speed" value="12.5k" sub="每秒处理文档数" />
                  <MetricCard title="内存消耗" subtitle="RAM Cost" value="1.2 GB" sub="词典(FST)常驻内存" />
                  <MetricCard title="合并压力" subtitle="Merge Task" value="低" sub="磁盘 I/O 处于健康状态" />
                </div>

                {/* 写入数据流优化 */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                  <h3 className="text-lg font-black mb-8 flex items-center gap-2 uppercase tracking-tight text-slate-800 dark:text-white">
                    <Server size={18} className="text-blue-500"/> 
                    核心原理：索引数据的物理旅程 (Memory {'->'} Disk)
                  </h3>
                  
                  <div className="relative flex flex-col gap-10">
                    {/* Phase 01: 原子写入 */}
                    <div className="flex items-center gap-4">
                      <div className="w-24 text-[10px] font-black text-slate-400 uppercase font-mono tracking-widest text-center">第一步<br/><span className="text-[8px] opacity-60 font-normal tracking-tighter">原子写入</span></div>
                      <div className="flex-1 flex gap-4">
                        <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-blue-500/30">
                          <div className="text-[10px] font-black text-blue-500 mb-1 tracking-widest uppercase">Indexing Buffer</div>
                          <div className="text-xs font-bold text-slate-700 dark:text-slate-300">写入缓冲区。此时对搜索<span className="text-red-500 px-1 font-black underline">不可见</span>。</div>
                        </div>
                        <div className="w-1/3 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border-2 border-orange-500/30 border-dashed text-center">
                          <div className="text-[10px] font-black text-orange-500 mb-1 tracking-widest uppercase font-mono">Translog</div>
                          <div className="text-xs font-medium text-slate-500 leading-tight">同步写日志。保障断电安全性。</div>
                        </div>
                      </div>
                    </div>

                    {/* Trigger: Refresh */}
                    <div className="flex items-center gap-4">
                      <div className="w-24 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center font-mono flex flex-col">
                        <Clock size={14} className="mx-auto mb-1 opacity-40"/>
                        触发 Refresh
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                         <div className="h-[2px] w-full bg-slate-200 dark:bg-slate-800 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-[9px] font-black tracking-widest shadow-lg shadow-blue-500/20 uppercase">
                              可见性转换：Buffer 转化为 Segment
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* Phase 02: 内存段可见性 */}
                    <div className="flex items-center gap-4">
                      <div className="w-24 text-[10px] font-black text-slate-400 uppercase font-mono tracking-widest text-center">第二步<br/><span className="text-[8px] opacity-60 font-normal tracking-tighter">搜索可见</span></div>
                      <div className="flex-1 flex gap-4">
                        <div className="flex-1 p-4 bg-green-50 dark:bg-green-900/10 rounded-2xl border-2 border-green-500/30 relative overflow-hidden group">
                          <div className="text-[10px] font-black text-green-500 mb-1 tracking-widest uppercase font-mono tracking-tighter">OS Page Cache (Segments)</div>
                          <div className="text-xs font-bold text-slate-700 dark:text-slate-300 font-medium">转为段文件。搜索可查，但尚未完成<span className="text-blue-600 px-1 font-black">持久化落盘</span>。</div>
                        </div>
                      </div>
                    </div>

                    {/* Trigger: Flush */}
                    <div className="flex items-center gap-4">
                      <div className="w-24 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center font-mono flex flex-col">
                        <Zap size={14} className="mx-auto mb-1 opacity-40 text-red-500"/>
                        触发 Flush
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                         <div className="h-[2px] w-full bg-red-100 dark:bg-red-900/30 border-t-2 border-dashed border-red-400 relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-[9px] font-black tracking-widest shadow-lg shadow-blue-500/20 uppercase font-black">
                              物理落盘：确保持久化安全
                            </div>
                         </div>
                      </div>
                    </div>

                    {/* Phase 03: 物理持久化 */}
                    <div className="flex items-center gap-4">
                      <div className="w-24 text-[10px] font-black text-slate-400 uppercase font-mono tracking-widest text-center tracking-tighter">第三步<br/><span className="text-[8px] opacity-60 font-normal tracking-tighter tracking-tighter">落盘归档</span></div>
                      <div className="flex-1 flex gap-4">
                        <div className="flex-1 p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border-2 border-slate-400/30 relative">
                          <div className="text-[10px] font-black text-slate-400 mb-1 tracking-widest uppercase">Physical Storage</div>
                          <div className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-tight">调用 Fsync 物理落盘。彻底持久化，并清理旧日志。</div>
                        </div>
                      </div>
                    </div>

                    {/* Background Process: Merge (优化后更加显眼) */}
                    <div className="flex items-center gap-4">
                      <div className="w-24 text-[10px] font-black text-purple-400 uppercase font-mono tracking-widest text-center tracking-tighter">异步整理<br/><span className="text-[8px] opacity-60 font-normal font-black">ASYNC</span></div>
                      <div className="flex-1 p-5 bg-purple-50 dark:bg-purple-950/20 border-2 border-dashed border-purple-500/40 rounded-[2rem] relative">
                         <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-500 text-white rounded-2xl shadow-lg shadow-purple-500/20 animate-spin-slow">
                               <Recycle size={20}/>
                            </div>
                            <div>
                               <div className="text-[10px] font-black text-purple-600 dark:text-purple-400 mb-1 uppercase tracking-widest">Background Segment Merge (段合并)</div>
                               <div className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-relaxed italic">
                                 后台异步将物理碎段重组。不仅减少文件数以提升搜索效率，更会<strong>真正物理剔除</strong>标记删除的文档。
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-4">
                    <div className="flex-1 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-2xl border border-orange-100 dark:border-orange-900/20">
                      <h4 className="text-xs font-black text-orange-700 dark:text-orange-400 flex items-center gap-1 mb-1 uppercase tracking-wider"><Settings size={14}/> 核心考点：Refresh vs Flush</h4>
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        记住：<strong>刷新(Refresh)是为了搜得到，冲刷(Flush)是为了丢不了。</strong> 而后台的 Merge 操作则是为了保持系统长期运行的性能稳定和空间利用率。
                      </p>
                    </div>
                  </div>
                </div>

                {/* 索引解剖结构交互区 */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="bg-slate-950 text-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-800 relative overflow-hidden transition-all">
                    <h4 className="text-sm font-black mb-6 flex items-center gap-2 text-purple-400 uppercase tracking-tight">
                      <HardDrive size={18}/> 索引物理构造 (Anatomy)
                    </h4>
                    
                    <div className="space-y-6 text-center md:text-left">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 relative">
                         <div className="text-[9px] text-slate-500 font-black uppercase mb-3 tracking-widest">
                           【第一层】索引 (Index) - 逻辑容器
                         </div>
                         <div className="flex gap-2">
                           {Object.entries(indexData).map(([id, data]) => (
                             <button 
                               key={id}
                               onClick={() => setActiveIndexId(id)}
                               className={`flex-1 h-8 rounded-xl flex items-center justify-center text-[10px] font-black transition-all border tracking-tighter ${
                                 activeIndexId === id 
                                 ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/20' 
                                 : 'bg-white/5 border-white/10 text-slate-500 hover:bg-white/10'
                               }`}
                             >
                               {data.name}
                             </button>
                           ))}
                         </div>
                         <div className="absolute -bottom-6 left-1/2 w-px h-6 bg-slate-800" />
                      </div>

                      <div className="space-y-3">
                        {indexData[activeIndexId].shards.map((shard, sIdx) => (
                          <div key={sIdx} className="p-4 bg-blue-900/10 rounded-2xl border-2 border-blue-500/40 relative animate-in fade-in slide-in-from-right-2">
                            <div className="text-[9px] text-blue-400 font-black uppercase mb-3 tracking-widest flex justify-between items-center">
                              <span>【第二层】分片 #{shard.id} ({shard.type})</span>
                              <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[7px] font-black uppercase tracking-widest">LUCENE 实例</span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 p-2 bg-slate-900/50 rounded-xl border border-white/5">
                              {shard.segments.map((seg, gIdx) => (
                                <div key={gIdx} className="p-2 bg-blue-600/20 border border-blue-400/30 rounded-lg flex flex-col gap-1 hover:bg-blue-600/40 transition-colors">
                                  <span className="text-[7px] font-mono font-black text-blue-300 uppercase truncate">【第三层】{seg}</span>
                                  <div className="h-0.5 w-full bg-blue-500/20 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-400 w-2/3" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-purple-900/20 border border-purple-500/20 rounded-2xl">
                      <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                        <strong>场景解析:</strong> {indexData[activeIndexId].desc}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h4 className="font-black text-xs mb-4 uppercase tracking-widest text-slate-400 flex items-center gap-2 font-black tracking-widest uppercase"><Info size={14}/> 专家巡检笔记</h4>
                    <ul className="space-y-3">
                      <CheckItem text="分片尺寸建议维持在 20GB~40GB" />
                      <CheckItem text="避免分片数超过堆内存承载能力" />
                      <CheckItem text="生产环境务必禁用无用的 _source" />
                      <CheckItem text="对只读索引定期执行 Force Merge" />
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 2. 倒排索引引擎 */}
            {selectedTopic === 'engine' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-6 text-center md:text-left">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="font-black mb-4 flex items-center gap-2 text-orange-500 uppercase tracking-tighter"><Search size={20}/> 实验：实时索引模拟器</h3>
                    <div className="space-y-4 text-left">
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">输入文档内容 (试试修改它)</label>
                        <input className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-xs font-medium focus:border-blue-500 outline-none transition-all" value={doc1} onChange={e=>setDoc1(e.target.value)} />
                      </div>
                      <div className="space-y-1 text-left">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">输入另一份文档</label>
                        <input className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl text-xs font-medium focus:border-blue-500 outline-none transition-all" value={doc2} onChange={e=>setDoc2(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-lg text-left">
                    <h4 className="font-bold text-sm mb-2 text-orange-400 uppercase tracking-wider font-black">进阶笔记：为什么 ES 搜索快？</h4>
                    <p className="text-xs opacity-80 leading-relaxed font-medium">
                      秘密在于 <strong>FST (有限状态转换器)</strong>。它像一个超高度压缩的字典，把海量的词条(Terms)存放在内存里。搜词时不需要扫磁盘，毫秒间就能定位到文档。
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-center md:text-left">
                  <h3 className="font-black mb-4 flex justify-between items-center text-sm uppercase tracking-tight font-black">
                    数据透视：生成的词典与倒排列表
                    <span className="text-[9px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-400 font-black tracking-widest uppercase">自动按字典序排列</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 font-black text-[10px] uppercase text-slate-400 tracking-tighter">词项 Term (分词结果)</div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 font-black text-[10px] uppercase text-slate-400 tracking-tighter">倒排列表 Posting List (文档 ID)</div>
                    {Object.entries(invertedIndex).sort().map(([term, ids]) => (
                      <React.Fragment key={term}>
                        <div className="p-3 bg-white dark:bg-slate-900 text-xs font-mono text-blue-600 font-bold">{term}</div>
                        <div className="p-3 bg-white dark:bg-slate-900 text-xs font-mono flex gap-1 justify-center md:justify-start">
                          {ids.map(id => <span key={id} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 rounded text-[10px] font-black">{id}</span>)}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. 建模映射策略 */}
            {selectedTopic === 'mapping' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-green-400 font-mono text-xs shadow-2xl relative border border-slate-800">
                  <div className="flex items-center gap-2 mb-6 text-slate-500 border-b border-slate-800 pb-2 uppercase font-black tracking-widest font-black">
                    <Terminal size={14}/> 实战代码：定义你的生产 Mapping
                  </div>
                  <pre className="leading-relaxed font-mono">
{`{
  "mappings": {
    "dynamic": "strict", // 重点：严禁动态映射
    "properties": {
      "user_id": { "type": "keyword" },
      "message": { 
        "type": "text",
        "analyzer": "ik_max_word",
        "fields": {
          "raw": { 
            "type": "keyword", 
            "ignore_above": 256 
          }
        }
      }
    }
  }
}`}
                  </pre>
                </div>
                <div className="space-y-4 text-center md:text-left">
                  <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-purple-500">
                    <h4 className="font-black text-sm mb-2 uppercase flex items-center gap-2 tracking-tight font-black">
                      <ShieldCheck size={16} className="text-purple-500"/> 
                      重点强调：为什么不能乱开“动态映射”?
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      在生产环境中，让 ES 猜类型是非常危险的。猜错了（比如把数值当成字符串）会导致整个索引必须重来。通过 <code>dynamic: strict</code> 强制要求手动定义每一个字段，这是高手入门的第一课。
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <MasteryPoint title="Keyword 怎么选？" desc="不需要分词的字段全用 keyword。排序、聚合、精确匹配都靠它，性能快到飞起。" />
                    <MasteryPoint title="什么是多字段策略？" desc="想搜得准又想排得好？同一份数据存为两种类型（text+keyword），兼顾灵活性与速度。" />
                  </div>
                </div>
              </div>
            )}

            {/* 4. 写入性能调优 */}
            {selectedTopic === 'tuning' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TuneCard title="降低刷新频率" value="Refresh: 60s" desc="别为了实时性搞垮了 I/O。在大规模写入时调大它，性能提升立竿见影。" />
                  <TuneCard title="开启日志异步化" value="Translog: Async" desc="追求吞吐量的终极武器。虽然有极小丢数据风险，但并发能力翻倍。" />
                  <TuneCard title="控制批写规模" value="Bulk: 10MB" desc="Bulk 不是越大越好。太大会撑爆内存(OOM)，太小会慢在网络上。10MB 是黄金点。" />
                  <TuneCard title="选择压缩算法" value="Codec: LZ4" desc="默认首选，速度快。磁盘不够用再考虑压缩比更高的 DEFLATE。" />
                </div>
                <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white flex items-center gap-8 shadow-xl">
                   <div className="hidden md:block p-4 bg-white/10 rounded-3xl"><BarChart3 size={40}/></div>
                   <div>
                     <h4 className="text-xl font-black mb-2 uppercase tracking-tight font-black underline decoration-blue-400 font-black tracking-tight">进阶：分片规划的“金法则”</h4>
                     <p className="text-sm opacity-90 leading-relaxed max-w-2xl font-medium">
                       分片(Shard)过多是集群卡顿的头号原因。每个分片都要占内存，请记住：<strong>单分片控制在 20-40GB 左右</strong>，千万不要把索引分得太碎！
                     </p>
                   </div>
                </div>
              </div>
            )}

            {/* 5. 索引重建迁移 */}
            {selectedTopic === 'reindex' && (
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
               <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative">
                 <h3 className="font-black text-2xl mb-8 flex items-center gap-3 tracking-tighter uppercase font-black tracking-tighter font-black tracking-tighter"><RefreshCcw className="text-red-500 animate-spin-slow"/> 手把手：零停机索引重建</h3>
                 <div className="space-y-10 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-1 before:bg-slate-100 dark:before:bg-slate-800 text-left">
                   <ReindexStep num="1" title="先创建 v2 索引" desc="按照新 Mapping 准备好坑位，记得先把副本关了提速。" />
                   <ReindexStep num="2" title="执行异步迁移任务" desc="用 _reindex 把数据搬过去，开启 slices 像多线程一样开足马力。" />
                   <ReindexStep num="3" title="无缝切换别名" desc="数据搬完后，一键切换指向，业务代码连重启都不用。" />
                 </div>
               </div>
               <div className="lg:col-span-4 space-y-4">
                  <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-3xl border-2 border-red-100 text-red-700 dark:text-red-400 shadow-sm font-bold text-left md:text-left">
                    <h4 className="font-black text-xs mb-4 flex items-center gap-2 uppercase tracking-widest font-black tracking-widest uppercase tracking-widest">⚠️ 重建避坑指南</h4>
                    <ul className="space-y-4 text-[11px] font-black">
                      <li>❌ 数据多的时候一定要加 slices，不然搬一天都搬不完。</li>
                      <li>❌ 别在老索引上硬改类型，那是改不掉的。</li>
                      <li>❌ 搬家的时候记得把刷新频率关了，能快 30% 以上。</li>
                    </ul>
                  </div>
                </div>
             </div>
            )}

            {/* 6. 实战别名管理 */}
            {selectedTopic === 'production' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm text-center md:text-left">
                   <h3 className="text-xl font-black mb-6 tracking-tight flex items-center gap-2 font-black tracking-tight font-black tracking-tight"><Filter className="text-emerald-500"/> 进阶技巧：别名(Alias) 是生产环境的救命稻草</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FeatureBox title="版本隔离" desc="通过别名隐藏版本号，版本升级时客户端完全没感觉。" icon={<RefreshCcw size={16}/>} />
                      <FeatureBox title="冷热分流" desc="让新数据跑在 SSD 上，老数据自动滚到 HDD，性能成本两不误。" icon={<Layers size={16}/>} />
                      <FeatureBox title="多租户视图" desc="用一个别名过滤出特定客户的数据，既安全又高效。" icon={<MousePointer2 size={16}/>} />
                   </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

// UI 原子组件
const MetricCard = ({ title, subtitle, value, sub, status }) => (
  <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md group">
    <div className="flex items-center justify-between mb-1 text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest">
      <span className="truncate pr-2 font-black">{title}</span>
      {status && <div className={`w-2 h-2 rounded-full ${status} animate-pulse shrink-0`} />}
    </div>
    <div className="text-[9px] font-bold text-slate-400 mb-2 uppercase tracking-tighter font-mono">{subtitle}</div>
    <div className="text-xl font-black tracking-tighter uppercase group-hover:text-blue-600 transition-colors">{value}</div>
    <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase opacity-60 tracking-tighter">{sub}</div>
  </div>
);

const MasteryPoint = ({ title, desc }) => (
  <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm border-l-4 border-l-blue-500">
    <h4 className="font-black text-sm mb-1 uppercase tracking-tighter leading-tight font-black">{title}</h4>
    <p className="text-xs text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

const TuneCard = ({ title, value, desc }) => (
  <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-blue-500 transition-all text-left">
    <div className="flex justify-between items-start mb-4 font-black">
      <h4 className="text-sm tracking-tight">{title}</h4>
      <span className="text-[9px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-3 py-1 rounded-full font-mono uppercase font-black">{value}</span>
    </div>
    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
  </div>
);

const ReindexStep = ({ num, title, desc }) => (
  <div className="flex gap-6 group relative z-10">
    <div className="w-8 h-8 rounded-full bg-slate-950 text-white text-[12px] font-black flex items-center justify-center shrink-0 shadow-xl group-hover:scale-110 transition-transform border border-slate-800 font-mono font-black">{num}</div>
    <div className="pb-2">
      <h4 className="font-black text-sm uppercase tracking-tighter font-black">{title}</h4>
      <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);

const FeatureBox = ({ title, desc, icon }) => (
  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border-2 border-transparent hover:border-emerald-500 transition-all cursor-default group text-center">
    <div className="text-emerald-500 mb-3 group-hover:scale-110 transition-transform flex justify-center">{icon}</div>
    <h4 className="font-black text-xs mb-2 uppercase tracking-widest font-black">{title}</h4>
    <p className="text-[10px] text-slate-500 leading-relaxed font-bold font-bold">{desc}</p>
  </div>
);

const CheckItem = ({ text }) => (
  <li className="flex items-start gap-3 group text-left">
    <div className="mt-1 flex-shrink-0"><ShieldCheck size={16} className="text-green-500 group-hover:scale-125 transition-transform"/></div>
    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 leading-tight tracking-tight uppercase tracking-tight font-bold">{text}</span>
  </li>
);

export default App;