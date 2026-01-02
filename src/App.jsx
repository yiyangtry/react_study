import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ElasticsearchLayout from './components/ElasticsearchLayout';
import ElasticsearchIndex from './pages/elasticsearch/ElasticsearchIndex';
import PrinciplesIndex from './pages/elasticsearch/principles/PrinciplesIndex';
import ClusterIndex from './pages/elasticsearch/cluster/ClusterIndex';
import ArchitectureHierarchy from './pages/elasticsearch/cluster/ArchitectureHierarchy';
import ShardDistribution from './pages/elasticsearch/cluster/ShardDistribution';
import ShardSimulation from './pages/elasticsearch/cluster/ShardSimulation';
import IndexIndex from './pages/elasticsearch/index/IndexIndex';
import IndexPrinciples from './pages/elasticsearch/index/IndexPrinciples';
import Segment from './pages/elasticsearch/index/Segment';
import InvertedIndex from './pages/elasticsearch/index/InvertedIndex';
import RocketMQLayout from './components/RocketMQLayout';
import RocketMQIndex from './pages/rocketmq/RocketMQIndex';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/elasticsearch" element={<ElasticsearchLayout />}>
          <Route index element={<ElasticsearchIndex />} />
          {/* 集群相关路由 */}
          <Route path="cluster" element={<ClusterIndex />} />
          <Route path="cluster/architecture" element={<ArchitectureHierarchy />} />
          <Route path="cluster/shard-distribution" element={<ShardDistribution />} />
          <Route path="cluster/shard-simulation" element={<ShardSimulation />} />
          {/* 索引相关路由 */}
          <Route path="index" element={<IndexIndex />} />
          <Route path="index/write-flow" element={<IndexPrinciples />} />
          <Route path="index/segment" element={<Segment />} />
          <Route path="index/inverted-index" element={<InvertedIndex />} />
          {/* 兼容旧路径 */}
          <Route path="principles" element={<PrinciplesIndex />} />
          <Route path="principles/architecture" element={<ArchitectureHierarchy />} />
          <Route path="principles/architecture-hierarchy" element={<ArchitectureHierarchy />} />
          <Route path="principles/index-principles" element={<IndexPrinciples />} />
          <Route path="principles/segment" element={<Segment />} />
          <Route path="principles/shard-simulation" element={<ShardSimulation />} />
          <Route path="shard-distribution" element={<ShardDistribution />} />
          {/* 兼容旧路径 */}
          <Route path="segment" element={<IndexIndex />} />
          <Route path="segment/principles" element={<Segment />} />
          <Route path="segment/inverted-index" element={<InvertedIndex />} />
        </Route>
        <Route path="/rocketmq" element={<RocketMQLayout />}>
          <Route index element={<RocketMQIndex />} />
        </Route>
      </Routes>
    </Layout>
  );
};

export default App;
