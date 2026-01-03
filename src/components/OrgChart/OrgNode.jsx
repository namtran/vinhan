import lotusIcon from '../../assets/lotus.svg';

export default function OrgNode({ node, onClick, isSelected }) {
  // Peaceful, harmonious colors for Buddhist pagoda context
  // Using solid colors for Safari compatibility (no opacity modifiers)
  const getRoleColor = (role) => {
    const colors = {
      // Leadership - warm, gentle gold/brown tones
      'gia_truong': 'bg-gradient-to-br from-amber-600 to-amber-700',
      'lien_doan_truong': 'bg-gradient-to-br from-amber-500 to-amber-600',
      'lien_doan_pho': 'bg-gradient-to-br from-stone-500 to-stone-600',
      'thu_ky': 'bg-gradient-to-br from-stone-400 to-stone-500',
      'thu_quy': 'bg-gradient-to-br from-stone-400 to-stone-500',
      // Branch leaders - soft, calming earth tones
      'doan_truong': 'bg-gradient-to-br from-emerald-600 to-emerald-700',
      'doan_pho': 'bg-gradient-to-br from-teal-500 to-teal-600',
    };
    return colors[role] || 'bg-gradient-to-br from-stone-400 to-stone-500';
  };

  return (
    <div
      className={`
        cursor-pointer transition-all duration-200
        hover:scale-105 hover:shadow-lg inline-block
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
      `}
      onClick={() => onClick(node)}
    >
      <div className={`
        ${getRoleColor(node.roleCode)}
        text-white rounded-lg p-2 md:p-4 shadow-md w-[120px] md:w-[180px] min-h-[140px] md:min-h-[200px]
      `}>
        <div className="flex flex-col items-center justify-center gap-1 md:gap-2 h-full">
          <div className="w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
            {node.photoUrl ? (
              <img
                src={node.photoUrl}
                alt={node.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <img src={lotusIcon} alt="Hoa Sen" className="w-6 h-6 md:w-8 md:h-8" />
            )}
          </div>
          <div className="text-center">
            <p className="font-semibold text-xs md:text-sm leading-tight">{node.name || 'Chưa có'}</p>
            <p className="text-[10px] md:text-xs opacity-90 mt-0.5 md:mt-1">{node.role}</p>
            {node.phapDanh && (
              <p className="text-[10px] md:text-xs opacity-80 italic">{node.phapDanh}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
