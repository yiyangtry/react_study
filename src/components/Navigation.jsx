import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Database, Code, Server, Cloud, Settings, Home, Rocket } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/elasticsearch', label: 'Elasticsearch', icon: Database },
    { path: '/rocketmq', label: 'RocketMQ', icon: Rocket },
    { path: '/react', label: 'React', icon: Code, disabled: true },
    { path: '/nodejs', label: 'Node.js', icon: Server, disabled: true },
    { path: '/cloud', label: '云服务', icon: Cloud, disabled: true },
    { path: '/tools', label: '工具', icon: Settings, disabled: true }
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <BookOpen className="text-blue-600" size={24} />
            <span className="text-xl font-bold text-gray-900">技术教程</span>
          </Link>

          {/* 导航菜单 */}
          <div className="flex items-center space-x-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const disabled = item.disabled;

              if (disabled) {
                return (
                  <div
                    key={item.path}
                    className="px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed flex items-center space-x-1"
                    title="即将推出"
                  >
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-1 ${
                    active
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

