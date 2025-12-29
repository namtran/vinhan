import { User } from 'lucide-react';

export default function OrgNode({ node, onClick, isSelected }) {
  const getRoleColor = (role) => {
    const colors = {
      'gia_truong': 'bg-gradient-to-br from-amber-500 to-amber-600',
      'lien_doan_truong': 'bg-gradient-to-br from-purple-500 to-purple-600',
      'lien_doan_pho': 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'thu_ky': 'bg-gradient-to-br from-blue-500 to-blue-600',
      'thu_quy': 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      'doan_truong': 'bg-gradient-to-br from-cyan-500 to-cyan-600',
      'doan_pho': 'bg-gradient-to-br from-teal-500 to-teal-600',
    };
    return colors[role] || 'bg-gradient-to-br from-gray-500 to-gray-600';
  };

  return (
    <div
      className={`
        cursor-pointer transition-all duration-200
        hover:scale-105 hover:shadow-lg
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
      onClick={() => onClick(node)}
    >
      <div className={`
        ${getRoleColor(node.roleCode)}
        text-white rounded-lg p-3 min-w-[140px] shadow-md
      `}>
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            {node.photoUrl ? (
              <img
                src={node.photoUrl}
                alt={node.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5" />
            )}
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm">{node.name || 'Chưa có'}</p>
            <p className="text-xs opacity-80">{node.role}</p>
            {node.phapDanh && (
              <p className="text-xs opacity-70 italic">{node.phapDanh}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
