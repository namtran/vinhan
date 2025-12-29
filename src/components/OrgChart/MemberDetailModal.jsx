import { X, User, Phone, MapPin, Calendar, Award, Briefcase, Pencil, Users } from 'lucide-react';

const NGANH_CHINH_NAMES = {
  'ban_huynh_truong': 'Ban Huynh Trưởng',
  'nganh_thanh': 'Ngành Thanh',
  'nganh_thieu': 'Ngành Thiếu',
  'nganh_oanh': 'Ngành Oanh',
};

export default function MemberDetailModal({ member, isOpen, onClose, isAdmin, onEdit }) {
  if (!isOpen || !member) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex flex-col items-center gap-4">
          {/* Avatar */}
          <div className="avatar placeholder">
            <div className="bg-primary text-primary-content rounded-full w-24">
              {member.photoUrl ? (
                <img src={member.photoUrl} alt={member.name} />
              ) : (
                <User className="w-12 h-12" />
              )}
            </div>
          </div>

          {/* Name & Role */}
          <div className="text-center">
            <h3 className="font-bold text-xl">{member.name}</h3>
            <p className="text-primary font-medium">{member.role}</p>
            {member.phapDanh && (
              <p className="text-sm opacity-70 italic">Pháp danh: {member.phapDanh}</p>
            )}
          </div>

          {/* Details */}
          <div className="w-full space-y-3 mt-4">
            {member.birthYear && (
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span>Năm sinh: {member.birthYear}</span>
              </div>
            )}

            {member.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span>{member.phone}</span>
              </div>
            )}

            {member.address && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span>{member.address}</span>
              </div>
            )}

            {member.capBac && (
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-primary" />
                <span>Cấp bậc: {member.capBac}</span>
              </div>
            )}

            {member.chucVu && (
              <div className="flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-primary" />
                <span>Chức vụ: {member.chucVu}</span>
              </div>
            )}

            {member.nganhChinh && (
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <span>Ngành: {NGANH_CHINH_NAMES[member.nganhChinh] || member.nganhChinh}</span>
              </div>
            )}

            {member.quaTrinhSinhHoat && (
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Quá trình sinh hoạt:</h4>
                <p className="text-sm bg-base-200 p-3 rounded-lg whitespace-pre-wrap">
                  {member.quaTrinhSinhHoat}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-action">
          {isAdmin && onEdit && (
            <button
              className="btn btn-primary"
              onClick={() => onEdit(member)}
            >
              <Pencil className="w-4 h-4" />
              Chỉnh Sửa
            </button>
          )}
          <button className="btn" onClick={onClose}>Đóng</button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
