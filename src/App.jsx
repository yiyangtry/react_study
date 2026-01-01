import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ElasticsearchLayout from './components/ElasticsearchLayout';
import ElasticsearchIndex from './pages/elasticsearch/ElasticsearchIndex';
import ShardDistribution from './pages/elasticsearch/ShardDistribution';
import PrinciplesIndex from './pages/elasticsearch/principles/PrinciplesIndex';
import ArchitectureHierarchy from './pages/elasticsearch/principles/ArchitectureHierarchy';
import IndexPrinciples from './pages/elasticsearch/principles/IndexPrinciples';
import Segment from './pages/elasticsearch/principles/Segment';
import ShardSimulation from './pages/elasticsearch/principles/ShardSimulation';
import ClusterIndex from './pages/elasticsearch/cluster/ClusterIndex';
import IndexIndex from './pages/elasticsearch/index/IndexIndex';
import SegmentIndex from './pages/elasticsearch/segment/SegmentIndex';
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
          {/* 段相关路由 */}
          <Route path="segment" element={<SegmentIndex />} />
          <Route path="segment/principles" element={<Segment />} />
          {/* 兼容旧路径 */}
          <Route path="principles" element={<PrinciplesIndex />} />
          <Route path="principles/architecture" element={<ArchitectureHierarchy />} />
          <Route path="principles/architecture-hierarchy" element={<ArchitectureHierarchy />} />
          <Route path="principles/index-principles" element={<IndexPrinciples />} />
          <Route path="principles/segment" element={<Segment />} />
          <Route path="principles/shard-simulation" element={<ShardSimulation />} />
          <Route path="shard-distribution" element={<ShardDistribution />} />
        </Route>
        <Route path="/rocketmq" element={<RocketMQLayout />}>
          <Route index element={<RocketMQIndex />} />
        </Route>
      </Routes>
    </Layout>
  );
};

export default App;
