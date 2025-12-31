import React, { useState, useEffect } from 'react';
import { 
  Database, Search, Layers, Zap, HardDrive, RefreshCcw, 
  Settings, Terminal, Code, Filter, FastForward, Info, 
  LayoutDashboard, BookOpen, Activity, Cpu, MousePointer2
} from 'lucide-react';

const App = () => {
  const [selectedTopic, setSelectedTopic] = useState('overview');
  
  // 模拟倒排索引数据
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

  const topics = [
    { id: 'overview', title: '索引全景图', icon: <LayoutDashboard size={18}/>, color: 'text-blue-500' },
    { id: 'engine', title: '倒排索引引擎', icon: <Search size={18}/>, color: 'text-orange-500' },
    { id: 'mapping', title: '数据建模与映射', icon: <Layers size={18}/>, color: 'text-purple-500' },
    { id: 'production', title: '生产策略 (Alias/Template)', icon: <Filter size={18}/>, color: 'text-emerald-500' },
    { id: 'tuning', title: '写入性能调优', icon: <Zap size={18}/>, color: 'text-yellow-500' },
    { id: 'reindex', title: '索引维护与重建', icon: <RefreshCcw size={18}/>, color: 'text-red-500' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-sm">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <Database className="text-blue-600" size={24} />
            <h1 className="font-black tracking-tighter text-lg uppercase">ES Index Hub</h1>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Mastery Edition</p>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTopic(t.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                selectedTopic === t.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className={selectedTopic === t.id ? 'text-white' : t.color}>{t.icon}</span>
              {t.title}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
            <Activity size={14} /> CLUSTER STATUS: GREEN
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black tracking-tight">{topics.find(t => t.id === selectedTopic).title}</h2>
              <p className="text-slate-500 mt-1">深度探索 Elasticsearch 索引的核心机制与生产实践</p>
            </div>
            <div className="flex gap-2">
              <div className="px-3 py-1 bg-slate-200 dark:bg-slate-800 rounded-full text-[10px] font-bold">V 8.12</div>
              <div className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full text-[10px] font-bold">PRODUCTION READY</div>
            </div>
          </div>

          {/* Dynamic Content Modules */}
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {/* Overview / Dashboard View */}
            {selectedTopic === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="核心原理" desc="倒排索引 (Inverted Index)" icon={<Search className="text-orange-500"/>} />
                <StatCard title="物理单位" desc="分段 (Lucene Segments)" icon={<HardDrive className="text-blue-500"/>} />
                <StatCard title="管理工具" desc="ILM 索引生命周期" icon={<Settings className="text-purple-500"/>} />
                
                <div className="md:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Cpu size={120} />
                  </div>
                  <h3 className="text-xl font-bold mb-4">索引数据流全景</h3>
                  <div className="flex items-center justify-between mt-8 relative">
                    <FlowStep icon={<Terminal/>} label="写入请求" />
                    <FlowLine active />
                    <FlowStep icon={<Settings/>} label="分词/映射" active />
                    <FlowLine active />
                    <FlowStep icon={<Cpu/>} label="内存 Buffer" active />
                    <FlowLine />
                    <FlowStep icon={<HardDrive/>} label="持久化 Segment" />
                  </div>
                  <div className="mt-10 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                      从请求进入到最终存储，索引不仅是数据的容器，更是一系列流水线的产物。<strong>精通索引</strong> 意味着你需要掌控每一个节点的参数优化。
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2rem] p-6 text-white flex flex-col justify-between">
                   <h4 className="font-bold flex items-center gap-2"><Zap size={16} className="text-yellow-400"/> 快速导航</h4>
                   <div className="space-y-2 mt-4">
                     <button onClick={()=>setSelectedTopic('tuning')} className="w-full text-left p-2 hover:bg-white/10 rounded text-xs transition-colors">→ 如何提升 10 倍写入速度？</button>
                     <button onClick={()=>setSelectedTopic('mapping')} className="w-full text-left p-2 hover:bg-white/10 rounded text-xs transition-colors">→ 为什么不能修改映射？</button>
                     <button onClick={()=>setSelectedTopic('engine')} className="w-full text-left p-2 hover:bg-white/10 rounded text-xs transition-colors">→ 倒排索引是如何工作的？</button>
                   </div>
                </div>
              </div>
            )}

            {/* Inverted Index Engine View */}
            {selectedTopic === 'engine' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold mb-4 flex items-center gap-2 text-orange-500"><Search size={18}/> 文档输入源</h3>
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Document 1</label>
                        <input className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs" value={doc1} onChange={e=>setDoc1(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Document 2</label>
                        <input className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg text-xs" value={doc2} onChange={e=>setDoc2(e.target.value)} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30 rounded-2xl">
                    <p className="text-xs text-orange-700 dark:text-orange-400 font-medium">
                      底层还存储了 <strong>Term Frequency (TF)</strong> 和 <strong>Positions</strong>，用于复杂的短语匹配。
                    </p>
                  </div>
                </div>
                <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h3 className="font-bold mb-4">生成的倒排索引表</h3>
                  <div className="grid grid-cols-2 gap-px bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-inner">
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 font-bold text-[10px] uppercase text-slate-400">词条 (Term)</div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-800 font-bold text-[10px] uppercase text-slate-400">文档列表 (Posting List)</div>
                    {Object.entries(invertedIndex).map(([term, ids]) => (
                      <React.Fragment key={term}>
                        <div className="p-3 bg-white dark:bg-slate-900 text-xs font-mono text-blue-600 font-bold">{term}</div>
                        <div className="p-3 bg-white dark:bg-slate-900 text-xs font-mono flex gap-1">
                          {ids.map(id => <span key={id} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 border rounded text-[10px]">{id}</span>)}
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Mapping & Modeling View */}
            {selectedTopic === 'mapping' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-900 p-6 rounded-3xl text-green-400 font-mono text-xs shadow-xl">
                  <div className="flex items-center gap-2 mb-4 text-slate-500 border-b border-slate-800 pb-2">
                    <Code size={14}/> INDEX_MAPPINGS.JSON
                  </div>
                  <pre>{`{
  "mappings": {
    "dynamic": "strict", 
    "properties": {
      "user_id": { "type": "keyword" },
      "desc": { 
        "type": "text",
        "fields": {
          "raw": { "type": "keyword" }
        }
      },
      "tags": { "type": "keyword" },
      "location": { "type": "geo_point" }
    }
  }
}`}</pre>
                </div>
                <div className="space-y-4">
                  <MasteryPoint title="为什么用 Keyword?" desc="用于精确匹配、聚合、排序。不分词，由于内部使用二进制 Doc Values，性能极高。" />
                  <MasteryPoint title="Multi-fields 技巧" desc="同一个字段存储两次。一个 text 用于模糊搜索，一个 keyword 用于排序。例如：desc 和 desc.raw。" />
                  <MasteryPoint title="Dynamic: Strict" desc="生产环境必须设置。防止脏数据进入导致映射爆炸。任何新字段必须手动定义。" />
                </div>
              </div>
            )}

            {/* Performance Tuning View */}
            {selectedTopic === 'tuning' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <TuneCard 
                    title="Refresh 策略" 
                    value="refresh_interval: 30s" 
                    desc="默认 1s 的刷新频率会导致产生过多细碎的小段（Segments），严重拖累写入速度。在批量导入时可以暂时设为 -1。" 
                  />
                  <TuneCard 
                    title="Translog 异步" 
                    value="durability: async" 
                    desc="默认是 request（每条写完 FSync）。改为 async 可以显著提升并发能力，权衡点是存在几秒的数据丢失风险。" 
                  />
                  <TuneCard 
                    title="Bulk 并发" 
                    value="Batch Size: 10MB" 
                    desc="单条写入会导致频繁的上下文切换。Bulk 写入是官方唯一推荐的高性能写入方式。" 
                  />
                  <TuneCard 
                    title="Index Buffer" 
                    value="buffer_size: 10%~20%" 
                    desc="增加索引缓冲区。给 JVM 堆内存分配更多的占比用于 Indexing，而不是 Search。" 
                  />
                </div>
                <div className="p-6 bg-yellow-50 dark:bg-yellow-900/10 border-l-4 border-yellow-400 rounded-r-2xl">
                   <h4 className="font-bold text-yellow-700 dark:text-yellow-400 text-sm mb-1">精通者必修：分片规划</h4>
                   <p className="text-xs text-slate-500 dark:text-slate-400">
                     单分片建议在 20GB~40GB。如果单个索引数据量巨大，应结合 <strong>Rollover API</strong> 实现索引自动切分。
                   </p>
                </div>
              </div>
            )}

            {/* Reindex View */}
            {selectedTopic === 'reindex' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <h3 className="font-black text-xl mb-6">三步实现零停机索引重建 (Reindex)</h3>
                  <div className="space-y-6">
                    <ReindexStep num="01" title="创建新索引 (New Index)" desc="定义好更优化的映射和设置。" />
                    <ReindexStep num="02" title="执行 _reindex 任务" desc="利用后台任务将旧数据迁移至新索引。" />
                    <ReindexStep num="03" title="原子切换别名 (Alias Switch)" desc="一瞬间完成切换，客户端感知不到任何中断。" />
                  </div>
                </div>
                <div className="lg:col-span-4 bg-red-900 p-6 rounded-3xl text-white flex flex-col">
                  <h4 className="font-bold flex items-center gap-2 mb-4"><Info size={16}/> 避坑指南</h4>
                  <ul className="text-xs space-y-4 opacity-80">
                    <li>• <strong>不要修改映射！</strong> 字段类型无法在位修改（除了个别如增加 sub-fields）。</li>
                    <li>• <strong>使用 Slices：</strong> 大数据量 Reindex 时，开启 slices 参数实现多线程并行。</li>
                    <li>• <strong>先关副本：</strong> Reindex 期间可以先设 <code>number_of_replicas: 0</code>，迁移完再恢复，速度提升 50%。</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Alias / Production View */}
            {selectedTopic === 'production' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
                   <h3 className="text-xl font-bold mb-6">别名 (Alias) 是生产环境的救命稻草</h3>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FeatureBox title="零停机切换" desc="通过别名指向不同索引，客户端代码永远不需要改连接地址。" icon={<RefreshCcw size={16}/>} />
                      <FeatureBox title="索引过滤" desc="可以创建只包含特定标签数据的别名，提升查询隔离度。" icon={<Filter size={16}/>} />
                      <FeatureBox title="滚动更新" desc="结合 Rollover，实现按天/按大小自动创建新索引并更新别名。" icon={<MousePointer2 size={16}/>} />
                   </div>
                </div>
                <div className="bg-slate-800 p-6 rounded-3xl text-blue-300 font-mono text-xs">
                   <div className="mb-2 text-slate-500"># 别名切换示例</div>
                   <pre>{`POST /_aliases
{
  "actions": [
    { "remove": { "index": "logs_v1", "alias": "logs_current" } },
    { "add":    { "index": "logs_v2", "alias": "logs_current" } }
  ]
}`}</pre>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

// UI Components
const StatCard = ({ title, desc, icon }) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-default">
    <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl">{icon}</div>
    <div>
      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</div>
      <div className="text-sm font-black">{desc}</div>
    </div>
  </div>
);

const FlowStep = ({ icon, label, active }) => (
  <div className="flex flex-col items-center gap-2 z-10">
    <div className={`p-4 rounded-2xl ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold ${active ? 'text-blue-600' : 'text-slate-400'}`}>{label}</span>
  </div>
);

const FlowLine = ({ active }) => (
  <div className="flex-1 h-0.5 mx-2 bg-slate-200 dark:bg-slate-800 relative min-w-[30px]">
    {active && <div className="absolute inset-0 bg-blue-500 animate-pulse" />}
  </div>
);

const MasteryPoint = ({ title, desc }) => (
  <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
    <h4 className="font-bold text-sm mb-1">{title}</h4>
    <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const TuneCard = ({ title, value, desc }) => (
  <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-yellow-400 transition-colors">
    <div className="flex justify-between items-start mb-3">
      <h4 className="font-bold text-sm">{title}</h4>
      <span className="text-[10px] font-mono bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 px-2 py-0.5 rounded-full">{value}</span>
    </div>
    <p className="text-[11px] text-slate-500 leading-tight">{desc}</p>
  </div>
);

const ReindexStep = ({ num, title, desc }) => (
  <div className="flex gap-4">
    <div className="text-2xl font-black text-slate-100 dark:text-slate-800 select-none">{num}</div>
    <div>
      <h4 className="font-bold text-sm">{title}</h4>
      <p className="text-xs text-slate-500">{desc}</p>
    </div>
  </div>
);

const FeatureBox = ({ title, desc, icon }) => (
  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
    <div className="text-blue-500 mb-2">{icon}</div>
    <h4 className="font-bold text-xs mb-1">{title}</h4>
    <p className="text-[10px] text-slate-500 leading-tight">{desc}</p>
  </div>
);

export default App;