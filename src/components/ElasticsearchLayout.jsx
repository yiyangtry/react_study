import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  Activity, 
  BookOpen, 
  Search, 
  Server, 
  Zap, 
  BarChart3, 
  Settings,
  ArrowLeft,
  Layers,
  FileText,
  ChevronDown,
  ChevronRight,
  ZoomIn,
  Database,
  Network,
  Brain
} from 'lucide-react';

const ElasticsearchLayout = () => {
  const location = useLocation();
  
  // 根据当前路径自动展开对应的菜单
  const getInitialExpandedMenus = (pathname) => {
    const expanded = {};
    if (pathname.startsWith('/elasticsearch/cluster')) {
      expanded.cluster = true;
    }
    if (pathname.startsWith('/elasticsearch/index')) {
      expanded.index = true;
    }
    if (pathname.startsWith('/elasticsearch/shard')) {
      expanded.shard = true;
    }
    if (pathname.startsWith('/elasticsearch/query')) {
      expanded.query = true;
    }
    return expanded;
  };

  const [expandedMenus, setExpandedMenus] = useState(() => 
    getInitialExpandedMenus(location.pathname)
  );

  // 当路径变化时，自动展开对应的菜单
  useEffect(() => {
    setExpandedMenus(getInitialExpandedMenus(location.pathname));
  }, [location.pathname]);

  const toggleMenu = (menuKey) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const menuItems = [
    { 
      path: '/elasticsearch', 
      label: '课程目录', 
      icon: BookOpen,
      exact: true
    },
    { 
      path: '/elasticsearch/cluster', 
      label: '集群', 
      icon: Server,
      disabled: false,
      children: [
        {
          path: '/elasticsearch/cluster/architecture',
          label: '集群架构全景图',
          icon: ZoomIn
        },
        {
          path: '/elasticsearch/cluster/shard-distribution',
          label: '分片分布可视化',
          icon: Activity
        },
        {
          path: '/elasticsearch/cluster/shard-simulation',
          label: '分片动态仿真',
          icon: Network
        }
      ]
    },
    { 
      path: '/elasticsearch/index', 
      label: '索引', 
      icon: Database,
      disabled: false,
      children: [
        {
          path: '/elasticsearch/index/write-flow',
          label: '索引写入流程',
          icon: FileText
        },
        {
          path: '/elasticsearch/index/segment',
          label: 'Segment 原理',
          icon: FileText
        },
        {
          path: '/elasticsearch/index/inverted-index',
          label: '倒排索引',
          icon: Search
        }
      ]
    },
    { 
      path: '/elasticsearch/shard', 
      label: '分片', 
      icon: Layers,
      disabled: true,
      children: []
    },
    { 
      path: '/elasticsearch/query', 
      label: '查询原理', 
      icon: Brain,
      disabled: true,
      children: []
    },
    { 
      path: '/elasticsearch/search-api', 
      label: '搜索 API', 
      icon: Search,
      disabled: true 
    },
    { 
      path: '/elasticsearch/performance', 
      label: '性能优化', 
      icon: Zap,
      disabled: true 
    },
    { 
      path: '/elasticsearch/monitoring', 
      label: '运维与监控', 
      icon: BarChart3,
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
          <h2 className="text-lg font-bold text-gray-900">Elasticsearch</h2>
          <p className="text-xs text-gray-500 mt-1">学习教程</p>
        </div>
        
        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            const disabled = item.disabled;
            const hasChildren = item.children && item.children.length > 0;
            const menuKey = item.path.split('/').pop() || 'root';
            const isExpanded = expandedMenus[menuKey];

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
              <div key={item.path}>
                {hasChildren ? (
                  <>
                    <div className={`px-3 py-2 mb-1 text-sm rounded-md transition-colors flex items-center ${
                      active
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu(menuKey);
                        }}
                        className="cursor-pointer mr-1 flex items-center"
                      >
                        {isExpanded ? (
                          <ChevronDown size={16} />
                        ) : (
                          <ChevronRight size={16} />
                        )}
                      </div>
                      <Link
                        to={item.path}
                        className="flex items-center flex-1"
                      >
                        <Icon size={18} className="mr-2" />
                        <span>{item.label}</span>
                      </Link>
                    </div>
                    {isExpanded && (
                      <div className="ml-6 mb-1">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const childActive = isActive(child.path);
                          return (
                            <Link
                              key={child.path}
                              to={child.path}
                              className={`px-3 py-2 mb-1 text-sm rounded-md transition-colors flex items-center ${
                                childActive
                                  ? 'bg-blue-50 text-blue-700 font-semibold'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              <ChildIcon size={16} className="mr-2" />
                              <span>{child.label}</span>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.path}
                    className={`px-3 py-2 mb-1 text-sm rounded-md transition-colors flex items-center ${
                      active
                        ? 'bg-blue-100 text-blue-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={18} className="mr-3" />
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
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

export default ElasticsearchLayout;

