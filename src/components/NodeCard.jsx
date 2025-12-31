import React from 'react';
import { Server } from 'lucide-react';
import ShardBox from './ShardBox';

const NodeCard = ({ name, ip, shards, totalStore, isHot }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden flex-1 min-w-[280px]">
    <div className={`p-4 ${isHot ? 'bg-red-50' : 'bg-gray-50'} border-b border-gray-200`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-800 flex items-center">
            <Server size={16} className="mr-2 text-gray-600" />
            {name.split('-').slice(-1)}
          </h3>
          <p className="text-sm text-gray-500 font-mono mt-1">{ip}</p>
        </div>
        {isHot && (
          <span className="bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
            写入压力高
          </span>
        )}
      </div>
    </div>
    <div className="p-4">
      <div className="text-xs font-semibold text-gray-400 uppercase mb-3 tracking-wider">承载分片</div>
      {shards.map((s, i) => (
        <ShardBox key={i} {...s} />
      ))}
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-500 text-gray-400">总计存储</span>
        <span className="text-sm font-bold text-gray-700">{totalStore} GB</span>
      </div>
    </div>
  </div>
);

export default NodeCard;

