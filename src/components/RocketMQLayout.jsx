import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Rocket,
  BookOpen, 
  Network,
  MessageSquare,
  Zap, 
  BarChart3, 
  Server,
  Shield,
  ArrowLeft
} from 'lucide-react';

const RocketMQLayout = () => {
  const location = useLocation();

  const menuItems = [
    { 
      path: '/rocketmq', 
      label: '课程目录', 
      icon: BookOpen,
      exact: true
    },
    { 
      path: '/rocketmq/basic-concepts', 
      label: '基础概念', 
      icon: BookOpen,
      disabled: true 
    },
    { 
      path: '/rocketmq/architecture', 
      label: '架构设计', 
      icon: Network,
      disabled: true 
    },
    { 
      path: '/rocketmq/producer-consumer', 
      label: '生产者与消费者', 
      icon: MessageSquare,
      disabled: true 
    },
    { 
      path: '/rocketmq/message-types', 
      label: '消息类型', 
      icon: Rocket,
      disabled: true 
    },
    { 
      path: '/rocketmq/performance', 
      label: '性能优化', 
      icon: Zap,
      disabled: true 
    },
    { 
      path: '/rocketmq/monitoring', 
      label: '监控运维', 
      icon: BarChart3,
      disabled: true 
    },
    { 
      path: '/rocketmq/deployment', 
      label: '部署实践', 
      icon: Server,
      disabled: true 
    },
    { 
      path: '/rocketmq/security', 
      label: '安全配置', 
      icon: Shield,
      disabled: true 
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* 侧边栏 */}
      <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex-shrink-0">
        <div className="p-4 border-b border-gray-200">
          <Link 
            to="/" 
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft size={18} className="mr-2" />
            <span className="text-sm font-medium">返回首页</span>
          </Link>
          <h2 className="text-lg font-bold text-gray-900">RocketMQ</h2>
          <p className="text-xs text-gray-500 mt-1">学习教程</p>
        </div>
        
        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            const disabled = item.disabled;

            if (disabled) {
              return (
                <div
                  key={item.path}
                  className="px-3 py-2 mb-1 text-sm text-gray-400 cursor-not-allowed flex items-center rounded-md"
                  title="即将推出"
                >
                  <Icon size={18} className="mr-3" />
                  <span>{item.label}</span>
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 mb-1 text-sm rounded-md transition-colors flex items-center ${
                  active
                    ? 'bg-orange-100 text-orange-700 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} className="mr-3" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* 主内容区 */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default RocketMQLayout;

