import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ElasticsearchLayout from './components/ElasticsearchLayout';
import ElasticsearchIndex from './pages/elasticsearch/ElasticsearchIndex';
import ShardDistribution from './pages/elasticsearch/ShardDistribution';
import PrinciplesIndex from './pages/elasticsearch/principles/PrinciplesIndex';
import ArchitectureHierarchy from './pages/elasticsearch/principles/ArchitectureHierarchy';
import Segment from './pages/elasticsearch/principles/Segment';
import RocketMQLayout from './components/RocketMQLayout';
import RocketMQIndex from './pages/rocketmq/RocketMQIndex';

const App = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/elasticsearch" element={<ElasticsearchLayout />}>
          <Route index element={<ElasticsearchIndex />} />
          <Route path="shard-distribution" element={<ShardDistribution />} />
          <Route path="principles" element={<PrinciplesIndex />} />
          <Route path="principles/architecture" element={<ArchitectureHierarchy />} />
          <Route path="principles/architecture-hierarchy" element={<ArchitectureHierarchy />} />
          <Route path="principles/segment" element={<Segment />} />
        </Route>
        <Route path="/rocketmq" element={<RocketMQLayout />}>
          <Route index element={<RocketMQIndex />} />
        </Route>
      </Routes>
    </Layout>
  );
};

export default App;
