import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Database, Code, Server, Cloud, Settings, Rocket } from 'lucide-react';

const Home = () => {
  const modules = [
    {
      id: 'elasticsearch',
      title: 'Elasticsearch',
      description: '从基础概念到高级应用，系统学习 Elasticsearch 分布式搜索引擎',
      icon: Database,
      color: 'blue',
      path: '/elasticsearch'
    },
    {
      id: 'rocketmq',
      title: 'RocketMQ',
      description: '学习 RocketMQ 分布式消息中间件，掌握高并发消息队列技术',
      icon: Rocket,
      color: 'orange',
      path: '/rocketmq'
    },
    {
      id: 'react',
      title: 'React 基础',
      description: 'React 组件、Hooks、状态管理等核心概念',
      icon: Code,
      color: 'cyan',
      path: '/react',
      comingSoon: true
    },
    {
      id: 'nodejs',
      title: 'Node.js 后端',
      description: 'Node.js、Express、API 开发等后端技术',
      icon: Server,
      color: 'green',
      path: '/nodejs',
      comingSoon: true
    },
    {
      id: 'cloud',
      title: '云服务',
      description: 'AWS、Docker、Kubernetes 等云原生技术',
      icon: Cloud,
      color: 'purple',
      path: '/cloud',
      comingSoon: true
    },
    {
      id: 'tools',
      title: '开发工具',
      description: 'Git、Vite、Webpack 等开发工具使用',
      icon: Settings,
      color: 'orange',
      path: '/tools',
      comingSoon: true
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-600',
      cyan: 'bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-600',
      green: 'bg-green-500 hover:bg-green-600 text-white border-green-600',
      purple: 'bg-purple-500 hover:bg-purple-600 text-white border-purple-600',
      orange: 'bg-orange-500 hover:bg-orange-600 text-white border-orange-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 头部 */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="text-6xl text-blue-600" />
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            技术学习教程
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            系统化的技术学习平台，涵盖前端、后端、数据库、云服务等多个领域
          </p>
        </header>

        {/* 模块网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            const isComingSoon = module.comingSoon;
            
            const CardContent = (
              <div className={`relative h-full p-6 rounded-xl shadow-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                isComingSoon 
                  ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-60' 
                  : `${getColorClasses(module.color)} cursor-pointer`
              }`}>
                {isComingSoon && (
                  <span className="absolute top-3 right-3 bg-gray-600 text-white text-xs font-bold px-2 py-1 rounded">
                    即将推出
                  </span>
                )}
                <div className="flex items-start mb-4">
                  <div className={`p-3 rounded-lg ${isComingSoon ? 'bg-gray-400' : 'bg-white bg-opacity-20'}`}>
                    <Icon size={32} className={isComingSoon ? 'text-gray-600' : 'text-white'} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">{module.title}</h2>
                <p className={`text-sm ${isComingSoon ? 'text-gray-600' : 'text-white text-opacity-90'}`}>
                  {module.description}
                </p>
                {!isComingSoon && (
                  <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                    <span className="text-sm font-semibold">点击进入 →</span>
                  </div>
                )}
              </div>
            );

            if (isComingSoon) {
              return <div key={module.id}>{CardContent}</div>;
            }

            return (
              <Link key={module.id} to={module.path}>
                {CardContent}
              </Link>
            );
          })}
        </div>

        {/* 底部信息 */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-xl shadow-md p-6 inline-block">
            <p className="text-gray-600 mb-2">
              <span className="font-semibold">当前版本：</span> v1.0.0
            </p>
            <p className="text-sm text-gray-500">
              持续更新中，更多内容即将推出...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

