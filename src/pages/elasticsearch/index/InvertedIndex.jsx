import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  ArrowRightLeft, 
  BookOpen, 
  Hash, 
  Layers,
  MousePointer2,
  Table as TableIcon,
  List,
  Zap,
  HelpCircle
} from 'lucide-react';

const App = () => {
  const [inputText, setInputText] = useState("Elasticsearch is powerful\nInverted index is fast\nElasticsearch uses index");
  const [searchQuery, setSearchQuery] = useState("");

  // --- 核心逻辑：从文档生成倒排索引 ---
  const { docs, invertedIndex } = useMemo(() => {
    const lines = inputText.split('\n').filter(l => l.trim().length > 0);
    const indexMap = {};

    lines.forEach((content, index) => {
      const docId = index + 1;
      const tokens = content.toLowerCase().split(/\s+/).filter(t => t.length > 0);
      
      tokens.forEach((token) => {
        if (!indexMap[token]) {
          indexMap[token] = new Set();
        }
        indexMap[token].add(docId);
      });
    });

    const sortedIndex = Object.keys(indexMap).sort().map(term => ({
      term,
      postings: Array.from(indexMap[term]).sort((a, b) => a - b)
    }));

    return { docs: lines, invertedIndex: sortedIndex };
  }, [inputText]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans text-sm md:text-base">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-10 px-6 text-center">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">倒排索引 (Inverted Index) 介绍</h1>
          <p className="text-slate-500 mt-2 text-lg">理解搜索引擎实现“秒级响应”的核心数据结构</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-10 space-y-12">
        
        {/* 1. 深度概念对比 */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="text-indigo-600" size={20} />
            <h2 className="text-xl font-bold text-slate-700">为什么叫“倒排”？</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* 正排索引卡片 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-slate-600">
                  <BookOpen size={20} />
                  <h3 className="font-bold uppercase tracking-wider text-xs">正排索引 (Forward Index)</h3>
                </div>
                <span className="text-[10px] bg-slate-100 text-slate-400 px-2 py-1 rounded font-bold">由文档找词</span>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  {[
                    { id: 1, words: "Elasticsearch, is, powerful" },
                    { id: 2, words: "Inverted, index, is, fast" },
                    { id: 3, words: "Elasticsearch, uses, index" }
                  ].map(d => (
                    <div key={d.id} className="flex gap-3 items-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="w-8 h-8 rounded-lg bg-white shadow-sm border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-400">#{d.id}</span>
                      <ArrowRightLeft size={12} className="text-slate-300" />
                      <span className="text-slate-700 font-mono text-xs">{d.words}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-4 border-t border-slate-50">
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    <span className="text-indigo-600 font-bold block mb-1">🔍 搜索场景：</span>
                    “我想看 1 号文档写了什么内容？” —— 这种结构非常快。但如果你想搜哪个文档有“index”，则需要遍历全表。
                  </p>
                </div>
              </div>
            </div>

            {/* 倒排索引卡片 */}
            <div className="bg-indigo-600 p-6 rounded-3xl shadow-xl shadow-indigo-100 text-white flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 opacity-90">
                  <Layers size={20} />
                  <h3 className="font-bold uppercase tracking-wider text-xs">倒排索引 (Inverted Index)</h3>
                </div>
                <span className="text-[10px] bg-indigo-500 text-indigo-100 px-2 py-1 rounded font-bold">由词找文档</span>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  {[
                    { word: "Elasticsearch", ids: [1, 3] },
                    { word: "index", ids: [2, 3] },
                    { word: "fast", ids: [2] }
                  ].map((w, i) => (
                    <div key={i} className="flex gap-3 items-center p-2 bg-indigo-500/50 rounded-xl border border-indigo-400">
                      <span className="w-20 font-bold text-xs truncate text-indigo-100">{w.word}</span>
                      <ArrowRightLeft size={12} className="text-indigo-300" />
                      <div className="flex gap-1">
                        {w.ids.map(id => (
                          <span key={id} className="w-6 h-6 rounded bg-white text-indigo-600 flex items-center justify-center font-bold text-[10px] shadow-sm">#{id}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-4 border-t border-indigo-500">
                  <p className="text-xs text-indigo-100 leading-relaxed font-medium">
                    <span className="text-yellow-400 font-bold block mb-1">🔍 搜索场景：</span>
                    “谁提到了 index 这个词？” —— 直接定位到词项，瞬间拿到文档 ID 列表 [2, 3]，无需扫描全文。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 交互式构建演示 */}
        <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h2 className="font-bold text-slate-700 flex items-center gap-2 text-lg">
              <TableIcon size={20} className="text-indigo-600" />
              构建演示：实时将文档“倒过来”
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <MousePointer2 size={14} /> 尝试修改下方文档
            </div>
          </div>

          <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            {/* 左侧：输入与源文档 */}
            <div className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                  <FileText size={14} /> 模拟源文档 (每行一个)
                </label>
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-mono transition-all leading-relaxed"
                />
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">源文档预览</label>
                {docs.map((doc, i) => (
                  <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl text-sm flex gap-4 items-center shadow-sm">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-400 text-xs flex items-center justify-center font-bold">#{i+1}</span>
                    <span className="text-slate-600 font-medium">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 右侧：倒排表 */}
            <div className="p-6 bg-slate-50/30">
              <div className="flex items-center justify-between mb-6">
                <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-widest">
                  <List size={14} /> 自动生成的倒排表
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                  <input 
                    type="text" 
                    placeholder="过滤词项..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-full text-xs outline-none focus:ring-2 focus:ring-indigo-500 w-40 shadow-sm"
                  />
                </div>
              </div>

              <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-400 font-black uppercase">
                    <tr>
                      <th className="py-3 px-6">词项 (Term)</th>
                      <th className="py-3 px-6">倒排列表 (Postings)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invertedIndex
                      .filter(item => item.term.includes(searchQuery.toLowerCase()))
                      .map((item, idx) => (
                      <tr key={idx} className="hover:bg-indigo-50/30 transition-colors group">
                        <td className="py-4 px-6 font-mono font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">{item.term}</td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-2">
                            {item.postings.map(id => (
                              <span key={id} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded shadow-sm border border-indigo-200">
                                DOC #{id}
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 3. 核心术语卡片 */}
        <section className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 text-center space-y-4 group hover:border-indigo-200 transition-colors shadow-sm">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
              <Hash size={24} />
            </div>
            <h3 className="font-bold text-slate-800">词项 (Term)</h3>
            <p className="text-xs text-slate-500 leading-relaxed px-2">文档经过分词后的最小检索单位。在倒排索引中，它是唯一的 Key。</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 text-center space-y-4 group hover:border-indigo-200 transition-colors shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
              <List size={24} />
            </div>
            <h3 className="font-bold text-slate-800">倒排列表 (Postings List)</h3>
            <p className="text-xs text-slate-500 leading-relaxed px-2">记录了包含某个词项的所有文档 ID 列表，是搜索结果的源泉。</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 text-center space-y-4 group hover:border-indigo-200 transition-colors shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
              <Zap size={24} />
            </div>
            <h3 className="font-bold text-slate-800">词典 (Dictionary)</h3>
            <p className="text-xs text-slate-500 leading-relaxed px-2">存储所有 Term 的有序集合。搜索引擎先在词典中查找，再去翻对应的倒排列表。</p>
          </div>
        </section>

        {/* 4. 为什么快？ */}
        <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
          <div className="flex-1 space-y-6 relative z-10">
            <h2 className="text-3xl font-bold tracking-tight">为什么倒排索引是秒级的？</h2>
            <p className="text-slate-400 leading-relaxed">
              在传统数据库中，查找包含“苹果”的文档需要进行<b>全表扫描</b>。如果有 1 亿行，就要做 1 亿次检查。
            </p>
            <p className="text-slate-400 leading-relaxed">
              但在倒排索引中，查找变成了<b>精准定位</b>。因为词典是排好序的（类似字典索引），你可以在毫秒内找到词项，然后直接拿走它后面挂着的 ID 列表。
            </p>
          </div>
          <div className="w-full md:w-56 aspect-square bg-indigo-500/20 rounded-[3rem] flex items-center justify-center border border-indigo-500/30 relative z-10 backdrop-blur-sm">
            <div className="text-center">
              <div className="text-5xl font-black text-indigo-400 tracking-tighter shadow-indigo-500/50">O(1)</div>
              <div className="text-[10px] font-black text-indigo-300 uppercase tracking-[0.2em] mt-2">检索效率</div>
            </div>
          </div>
          {/* 背景装饰 */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
        </div>
      </main>

      <footer className="mt-20 py-12 border-t border-slate-200 text-center text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
        Elasticsearch Inverted Index Introduction
      </footer>
    </div>
  );
};

export default App;