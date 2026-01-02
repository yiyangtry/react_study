import React from 'react';
import { FileText, Layers, RefreshCw, Zap, Database, AlertCircle, CheckCircle } from 'lucide-react';

const Segment = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* 头部 */}
        <header className="mb-8">
          <div className="flex items-center mb-4">
            <FileText className="text-4xl text-blue-600 mr-3" />
            <h1 className="text-4xl font-extrabold text-gray-900">
              Segment 原理
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            深入理解 Elasticsearch 中 Segment 的存储结构、创建机制和合并策略
          </p>
        </header>

        {/* 什么是 Segment */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Layers className="mr-2 text-blue-600" />
            什么是 Segment？
          </h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              Segment（段）是 Elasticsearch 索引的底层存储单位。每个分片（Shard）由多个 Segment 组成。
              Segment 是 Elasticsearch 存储和检索数据的核心组件。
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
              <p className="text-blue-900 font-semibold mb-2">核心理解：</p>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>每个分片（Shard）包含多个 Segment</li>
                <li>Segment 是倒排索引的物理存储单位</li>
                <li>Segment 是不可变的（immutable）</li>
                <li>查询时需要搜索所有 Segment</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Segment 的特性 */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Segment 的关键特性</h2>
          
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 bg-green-50 p-4">
              <div className="flex items-start">
                <CheckCircle className="text-green-600 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">不可变性（Immutable）</h3>
                  <p className="text-green-800 text-sm">
                    Segment 一旦创建就不会被修改。当文档需要更新时，Elasticsearch 不会修改现有的 Segment，
                    而是标记旧文档为删除，并在新的 Segment 中写入更新后的文档。
                  </p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
              <div className="flex items-start">
                <CheckCircle className="text-blue-600 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">追加写入（Append-Only）</h3>
                  <p className="text-blue-800 text-sm">
                    新的文档总是写入到新的 Segment 中，而不是修改现有的 Segment。
                    这种设计简化了并发控制，提高了写入性能。
                  </p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
              <div className="flex items-start">
                <CheckCircle className="text-purple-600 mr-3 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h3 className="font-semibold text-purple-900 mb-2">独立索引</h3>
                  <p className="text-purple-800 text-sm">
                    每个 Segment 都包含一个完整的倒排索引，可以独立进行搜索。
                    查询时需要搜索所有 Segment，然后合并结果。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Segment 的结构 */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Database className="mr-2 text-blue-600" />
            Segment 的结构
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Segment 由多个文件组成，每个文件存储不同类型的数据。这些文件共同构成了完整的倒排索引。
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Segment 包含的文件：</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-200 px-2 py-1 rounded text-sm">.si</code>
                  <span className="text-sm text-gray-700">Segment 信息文件</span>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-200 px-2 py-1 rounded text-sm">.cfs</code>
                  <span className="text-sm text-gray-700">复合文件（包含多个文件）</span>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-200 px-2 py-1 rounded text-sm">.cfe</code>
                  <span className="text-sm text-gray-700">复合文件索引</span>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-200 px-2 py-1 rounded text-sm">.fdt</code>
                  <span className="text-sm text-gray-700">存储字段数据</span>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-200 px-2 py-1 rounded text-sm">.fdx</code>
                  <span className="text-sm text-gray-700">字段数据索引</span>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-200 px-2 py-1 rounded text-sm">.tim</code>
                  <span className="text-sm text-gray-700">词条字典</span>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-200 px-2 py-1 rounded text-sm">.tip</code>
                  <span className="text-sm text-gray-700">词条索引</span>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-200 px-2 py-1 rounded text-sm">.doc</code>
                  <span className="text-sm text-gray-700">倒排列表</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Segment 的创建 */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <RefreshCw className="mr-2 text-blue-600" />
            Segment 的创建过程
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              当文档被索引时，Elasticsearch 会创建一个新的 Segment。这个过程涉及多个步骤：
            </p>
            <div className="space-y-3">
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">文档写入</h3>
                  <p className="text-gray-700">文档首先写入内存缓冲区（In-Memory Buffer）</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Refresh 操作</h3>
                  <p className="text-gray-700">定期将内存缓冲区的内容刷新到磁盘，创建新的 Segment。默认每 1 秒执行一次 Refresh。</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Segment 可见</h3>
                  <p className="text-gray-700">新创建的 Segment 立即可用于搜索，无需等待 Flush 操作。</p>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mt-4">
              <p className="text-yellow-900 font-semibold mb-1">注意：</p>
              <p className="text-yellow-800 text-sm">
                Refresh 操作只是将数据从内存刷新到文件系统缓存，并没有真正写入磁盘。
                真正的持久化需要等待 Flush 操作（默认每 30 分钟或 Translog 达到 512MB）。
              </p>
            </div>
          </div>
        </section>

        {/* Segment 合并 */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Zap className="mr-2 text-blue-600" />
            Segment 合并（Merge）
          </h2>
          <div className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              随着文档的不断写入，Segment 的数量会不断增加。为了保持查询性能，
              Elasticsearch 会定期将多个小的 Segment 合并成更大的 Segment。
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4">
              <p className="text-yellow-900 font-semibold mb-2">合并的好处：</p>
              <ul className="list-disc list-inside text-yellow-800 space-y-1">
                <li>减少 Segment 数量，提高查询性能</li>
                <li>删除已标记删除的文档</li>
                <li>优化倒排索引结构</li>
                <li>释放磁盘空间</li>
              </ul>
            </div>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <p className="text-blue-900 font-semibold mb-2">合并策略：</p>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li><strong>Tiered Merge Policy</strong>（分层合并策略）- 默认策略，将 Segment 按大小分层</li>
                <li><strong>Log Byte Size Merge Policy</strong>（日志字节大小合并策略）- 基于 Segment 大小</li>
                <li><strong>Log Doc Merge Policy</strong>（日志文档合并策略）- 基于文档数量</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg mt-4">
              <h3 className="font-semibold text-gray-900 mb-2">合并过程：</h3>
              <ol className="list-decimal list-inside text-gray-700 space-y-1">
                <li>选择需要合并的 Segment（通常是小 Segment）</li>
                <li>读取这些 Segment 的数据</li>
                <li>合并倒排索引，删除已标记删除的文档</li>
                <li>写入新的 Segment</li>
                <li>删除旧的 Segment</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Segment 的作用 */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Segment 的作用</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">1. 数据存储</h3>
              <p className="text-gray-700 text-sm">
                Segment 是 Elasticsearch 存储文档和倒排索引的物理单位。
                所有索引的数据最终都存储在 Segment 中。
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">2. 查询执行</h3>
              <p className="text-gray-700 text-sm">
                查询时需要搜索所有 Segment，然后合并各个 Segment 的查询结果。
                Segment 数量越少，查询性能越好。
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">3. 写入优化</h3>
              <p className="text-gray-700 text-sm">
                通过不可变性和追加写入的设计，简化了并发控制，
                提高了写入性能。
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">4. 数据管理</h3>
              <p className="text-gray-700 text-sm">
                通过 Segment 合并机制，可以删除已标记删除的文档，
                优化索引结构，释放磁盘空间。
              </p>
            </div>
          </div>
        </section>

        {/* 性能影响 */}
        <section className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">性能影响</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">查询性能</h3>
              <p className="text-green-800 text-sm">
                Segment 数量越少，查询时需要搜索的 Segment 就越少，查询性能越好。
                但合并操作本身会消耗 CPU 和 I/O 资源。
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-orange-900 mb-2">写入性能</h3>
              <p className="text-orange-800 text-sm">
                频繁的合并操作会影响写入性能。需要根据业务场景平衡 Segment 数量和合并频率。
                可以通过调整 merge policy 的参数来优化。
              </p>
            </div>
          </div>
        </section>

        {/* 重要提示 */}
        <section className="bg-yellow-50 border-l-4 border-yellow-500 rounded-xl p-6">
          <div className="flex items-start">
            <AlertCircle className="text-yellow-600 mr-3 mt-1 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-yellow-900 mb-2">重要提示</h3>
              <p className="text-yellow-800 text-sm mb-2">
                理解 Segment 的概念对于优化 Elasticsearch 性能非常重要：
              </p>
              <ul className="list-disc list-inside text-yellow-800 text-sm space-y-1">
                <li>Segment 数量过多会影响查询性能，建议控制在合理范围内</li>
                <li>Segment 合并会消耗 CPU 和 I/O 资源，需要平衡合并频率</li>
                <li>可以通过 <code className="bg-yellow-100 px-1 rounded">_cat/segments</code> API 查看 Segment 信息</li>
                <li>理解 Segment 有助于排查性能问题和优化索引配置</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Segment;

