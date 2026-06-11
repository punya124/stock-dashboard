import React from 'react';

const SkeletonRow: React.FC = () => (
  <tr className="border-b border-slate-100">
    <td className="px-6 py-4">
      <div className="flex items-center gap-3">
        <div className="skeleton w-8 h-8 rounded-lg" />
        <div className="space-y-1.5">
          <div className="skeleton h-3.5 w-12 rounded" />
          <div className="skeleton h-2.5 w-24 rounded" />
        </div>
      </div>
    </td>
    <td className="px-6 py-4"><div className="skeleton h-3.5 w-20 rounded ml-auto" /></td>
    <td className="px-6 py-4"><div className="skeleton h-3.5 w-16 rounded ml-auto" /></td>
    <td className="px-6 py-4"><div className="skeleton h-3.5 w-16 rounded ml-auto" /></td>
    <td className="px-6 py-4 hidden lg:table-cell"><div className="skeleton h-3.5 w-16 rounded ml-auto" /></td>
    <td className="px-6 py-4 hidden lg:table-cell"><div className="skeleton h-3.5 w-16 rounded ml-auto" /></td>
    <td className="px-6 py-4"><div className="skeleton h-5 w-16 rounded ml-auto" /></td>
  </tr>
);

const Loader: React.FC = () => (
  <>
    {Array.from({ length: 8 }).map((_, i) => (
      <SkeletonRow key={i} />
    ))}
  </>
);

export default Loader;
