import { useState } from 'react';
import { X, UserPlus, Search } from 'lucide-react';

export default function AssignMemberModal({ position, isOpen, onClose, members, onAssign }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMemberId, setSelectedMemberId] = useState('');

  if (!isOpen || !position) return null;

  const filteredMembers = members?.filter(m => {
    const search = searchTerm.toLowerCase();
    return (
      m.hoTen?.toLowerCase().includes(search) ||
      m.phapDanh?.toLowerCase().includes(search)
    );
  }) || [];

  const handleAssign = () => {
    if (selectedMemberId) {
      onAssign(selectedMemberId);
      setSelectedMemberId('');
      setSearchTerm('');
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={() => {
            onClose();
            setSelectedMemberId('');
            setSearchTerm('');
          }}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Phân Công Chức Vụ</h3>
            <p className="text-sm text-base-content/70">{position.role}</p>
          </div>
        </div>

        {/* Search */}
        <div className="form-control mb-4">
          <div className="input input-bordered flex items-center gap-2">
            <Search className="w-4 h-4 opacity-50" />
            <input
              type="text"
              placeholder="Tìm kiếm thành viên..."
              className="grow bg-transparent outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Member List */}
        <div className="max-h-64 overflow-y-auto space-y-2">
          {filteredMembers.length === 0 ? (
            <p className="text-center text-base-content/50 py-4">
              Không tìm thấy thành viên
            </p>
          ) : (
            filteredMembers.map(member => (
              <label
                key={member.id}
                className={`
                  flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors
                  ${selectedMemberId === member.id
                    ? 'bg-primary/10 ring-2 ring-primary'
                    : 'bg-base-200 hover:bg-base-300'}
                `}
              >
                <input
                  type="radio"
                  name="member"
                  className="radio radio-primary"
                  checked={selectedMemberId === member.id}
                  onChange={() => setSelectedMemberId(member.id)}
                />
                <div className="flex-1">
                  <p className="font-medium">{member.hoTen}</p>
                  {member.phapDanh && (
                    <p className="text-sm text-base-content/60 italic">
                      {member.phapDanh}
                    </p>
                  )}
                </div>
                {member.photoUrl && (
                  <img
                    src={member.photoUrl}
                    alt={member.hoTen}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
              </label>
            ))
          )}
        </div>

        <div className="modal-action">
          <button
            className="btn"
            onClick={() => {
              onClose();
              setSelectedMemberId('');
              setSearchTerm('');
            }}
          >
            Hủy
          </button>
          <button
            className="btn btn-primary"
            disabled={!selectedMemberId}
            onClick={handleAssign}
          >
            <UserPlus className="w-4 h-4" />
            Phân Công
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
