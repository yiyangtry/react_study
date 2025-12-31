import React from 'react';
import { HardDrive } from 'lucide-react';

const ShardBox = ({ type, id, docs, store, isPrimary }) => (
  <div className={`p-3 mb-2 rounded-lg border-2 flex flex-col ${
    isPrimary 
      ? 'bg-blue-50 border-blue-500 shadow-sm' 
      : 'bg-orange-50 border-orange-300 border-dashed'
  }`}>
    <div className="flex justify-between items-center mb-1">
      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${isPrimary ? 'bg-blue-600 text-white' : 'bg-orange-400 text-white'}`}>
        {isPrimary ? 'P' : 'R'}{id}
      </span>
      <span className="text-[10px] text-gray-500 font-mono">STARTED</span>
    </div>
    <div className="text-xs text-gray-700 font-medium">文档: {(docs / 100000000).toFixed(2)} 亿</div>
    <div className="flex items-center text-[10px] text-gray-500 mt-1">
      <HardDrive size={10} className="mr-1" />
      {store}
    </div>
  </div>
);

export default ShardBox;

