import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  BarChart3, 
  Server,
  Zap,
  Shield,
  Network
} from 'lucide-react';

const RocketMQIndex = () => {
  const lessons = [
    {
      id: 'basic-concepts',
      title: '基础概念',
      description: '消息队列、Producer、Consumer、Topic、Queue 等核心概念',
      icon: BookOpen,
      path: '/rocketmq/basic-concepts',
      available: false
    },
    {
      id: 'architecture',
      title: '架构设计',
      description: 'NameServer、Broker、消息存储、高可用架构详解',
      icon: Network,
      path: '/rocketmq/architecture',
      available: false
    },
    {
      id: 'producer-consumer',
      title: '生产者与消费者',
      description: '消息发送、消费模式、负载均衡、消息过滤',
      icon: MessageSquare,
      path: '/rocketmq/producer-consumer',
      available: false
    },
    {
      id: 'message-types',
      title: '消息类型',
      description: '普通消息、顺序消息、延时消息、事务消息',
      icon: Rocket,
      path: '/rocketmq/message-types',
      available: false
    },
    {
      id: 'performance',
      title: '性能优化',
      description: '消息堆积处理、批量发送、消费性能优化',
      icon: Zap,
      path: '/rocketmq/performance',
      available: false
    },
    {
      id: 'monitoring',
      title: '监控运维',
      description: 'RocketMQ Console、监控指标、告警配置',
      icon: BarChart3,
      path: '/rocketmq/monitoring',
      available: false
    },
    {
      id: 'deployment',
      title: '部署实践',
      description: '集群部署、配置管理、故障处理',
      icon: Server,
      path: '/rocketmq/deployment',
      available: false
    },
    {
      id: 'security',
      title: '安全配置',
      description: 'ACL 访问控制、消息加密、权限管理',
      icon: Shield,
      path: '/rocketmq/security',
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 头部 */}
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Rocket className="text-6xl text-orange-600" />
          </div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            RocketMQ 学习教程
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            从零开始学习 RocketMQ 分布式消息中间件，掌握高并发、高可用的消息队列技术
          </p>
        </header>

        {/* 课程列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {lessons.map((lesson) => {
            const Icon = lesson.icon;
            const isAvailable = lesson.available;

            const CardContent = (
              <div className={`relative h-full p-6 rounded-xl shadow-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                isAvailable 
                  ? 'bg-white border-orange-300 cursor-pointer hover:border-orange-500 hover:shadow-xl' 
                  : 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-60'
              }`}>
                {!isAvailable && (
                  <span className="absolute top-3 right-3 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded">
                    即将推出
                  </span>
                )}
                <div className="flex items-start mb-4">
                  <div className={`p-3 rounded-lg ${
                    isAvailable ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <Icon size={32} />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-gray-900">{lesson.title}</h2>
                <p className={`text-sm ${isAvailable ? 'text-gray-600' : 'text-gray-500'}`}>
                  {lesson.description}
                </p>
                {isAvailable && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="text-sm font-semibold text-orange-600">开始学习 →</span>
                  </div>
                )}
              </div>
            );

            if (!isAvailable) {
              return <div key={lesson.id}>{CardContent}</div>;
            }

            return (
              <Link key={lesson.id} to={lesson.path}>
                {CardContent}
              </Link>
            );
          })}
        </div>

        {/* 学习建议 */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">学习建议</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <div className="bg-orange-100 rounded-full p-2">
                <BookOpen className="text-orange-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">循序渐进</h4>
                <p className="text-sm text-gray-600">建议先理解基础概念，再深入学习架构和高级特性</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-red-100 rounded-full p-2">
                <Zap className="text-red-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">实践为主</h4>
                <p className="text-sm text-gray-600">每个章节都配有代码示例，建议动手实践加深理解</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RocketMQIndex;

