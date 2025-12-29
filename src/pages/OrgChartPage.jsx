import { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import OrgChart from '../components/OrgChart/OrgChart';
import MemberForm from '../components/Members/MemberForm';
import { useAuth } from '../context/AuthContext';
import { useDocument, setDocumentWithId } from '../hooks/useFirestore';
import { useCollection } from '../hooks/useFirestore';
import toast from 'react-hot-toast';

export default function OrgChartPage() {
  const { isAdmin } = useAuth();
  const { document: organization, loading } = useDocument('settings', 'organization');
  const { documents: members } = useCollection('members');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    if (organization) {
      setEditData(organization);
    }
  }, [organization]);

  const handleSave = async () => {
    try {
      const { id, ...data } = editData;
      console.log('Saving organization data:', data);
      await setDocumentWithId('settings', 'organization', data);
      console.log('Save successful!');
      toast.success('Đã lưu cấu hình!');
      setIsEditing(false);
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Lỗi: ' + error.message);
    }
  };

  const handleAssignMember = async (positionKey, memberId) => {
    try {
      const currentData = organization || {};
      const { id, ...data } = currentData;
      const newData = { ...data, [positionKey]: memberId };
      await setDocumentWithId('settings', 'organization', newData);
      toast.success('Đã phân công thành công!');
    } catch (error) {
      console.error('Assign error:', error);
      toast.error('Lỗi: ' + error.message);
    }
  };

  const memberOptions = members.map(m => ({
    value: m.id,
    label: `${m.hoTen}${m.phapDanh ? ` (${m.phapDanh})` : ''}`,
    ...m
  }));

  const getMemberById = (id) => {
    if (!id) return null;
    const member = members.find(m => m.id === id);
    if (!member) return null;
    return {
      id: member.id,
      name: member.hoTen,
      phapDanh: member.phapDanh,
      phone: member.phone,
      address: member.address,
      birthYear: member.birthYear,
      capBac: member.capBac,
      chucVu: member.chucVu,
      nganh: member.nganh,
      quaTrinhSinhHoat: member.quaTrinhSinhHoat,
      photoUrl: member.photoUrl,
    };
  };

  // Use saved organization data for display, editData only for editing form
  const savedData = organization || {};

  const orgStructure = {
    giaTruong: getMemberById(savedData.giaTruongId),
    lienDoanTruong: getMemberById(savedData.lienDoanTruongId),
    lienDoanPho: getMemberById(savedData.lienDoanPhoId),
    thuKy: getMemberById(savedData.thuKyId),
    thuQuy: getMemberById(savedData.thuQuyId),
    branches: {
      thanh_nam: {
        doanTruong: getMemberById(savedData.doanTruongThanhNamId),
        doanPho: getMemberById(savedData.doanPhoThanhNamId),
      },
      thanh_nu: {
        doanTruong: getMemberById(savedData.doanTruongThanhNuId),
        doanPho: getMemberById(savedData.doanPhoThanhNuId),
      },
      thieu_nam: {
        doanTruong: getMemberById(savedData.doanTruongThieuNamId),
        doanPho: getMemberById(savedData.doanPhoThieuNamId),
      },
      thieu_nu: {
        doanTruong: getMemberById(savedData.doanTruongThieuNuId),
        doanPho: getMemberById(savedData.doanPhoThieuNuId),
      },
      oanh_nam: {
        doanTruong: getMemberById(savedData.doanTruongOanhNamId),
        doanPho: getMemberById(savedData.doanPhoOanhNamId),
      },
      oanh_nu: {
        doanTruong: getMemberById(savedData.doanTruongOanhNuId),
        doanPho: getMemberById(savedData.doanPhoOanhNuId),
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const renderPositionSelect = (label, field) => (
    <div className="form-control">
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <select
        className="select select-bordered select-sm"
        value={editData[field] || ''}
        onChange={(e) => setEditData({ ...editData, [field]: e.target.value })}
      >
        <option value="">-- Chọn --</option>
        {memberOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sơ Đồ Tổ Chức GĐPT Vĩnh An</h1>
        {isAdmin && (
          <button
            className={`btn ${isEditing ? 'btn-success' : 'btn-outline'}`}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? 'Lưu' : <><Settings className="w-4 h-4" /> Chỉnh Sửa</>}
          </button>
        )}
      </div>

      {isEditing && isAdmin && (
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title">Cấu Hình Tổ Chức</h3>
            <p className="text-sm opacity-70 mb-4">
              Chọn thành viên cho từng chức vụ. Thành viên phải được thêm vào danh sách trước.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="col-span-full">
                <h4 className="font-semibold mb-2">Ban Huynh Trưởng</h4>
              </div>
              {renderPositionSelect('Gia Trưởng', 'giaTruongId')}
              {renderPositionSelect('Liên Đoàn Trưởng', 'lienDoanTruongId')}
              {renderPositionSelect('Liên Đoàn Phó', 'lienDoanPhoId')}
              {renderPositionSelect('Thư Ký', 'thuKyId')}
              {renderPositionSelect('Thủ Quỹ', 'thuQuyId')}

              <div className="col-span-full mt-4">
                <h4 className="font-semibold mb-2">Ngành Thanh</h4>
              </div>
              {renderPositionSelect('Đoàn Trưởng Thanh Nam', 'doanTruongThanhNamId')}
              {renderPositionSelect('Đoàn Phó Thanh Nam', 'doanPhoThanhNamId')}
              {renderPositionSelect('Đoàn Trưởng Thanh Nữ', 'doanTruongThanhNuId')}
              {renderPositionSelect('Đoàn Phó Thanh Nữ', 'doanPhoThanhNuId')}

              <div className="col-span-full mt-4">
                <h4 className="font-semibold mb-2">Ngành Thiếu</h4>
              </div>
              {renderPositionSelect('Đoàn Trưởng Thiếu Nam', 'doanTruongThieuNamId')}
              {renderPositionSelect('Đoàn Phó Thiếu Nam', 'doanPhoThieuNamId')}
              {renderPositionSelect('Đoàn Trưởng Thiếu Nữ', 'doanTruongThieuNuId')}
              {renderPositionSelect('Đoàn Phó Thiếu Nữ', 'doanPhoThieuNuId')}

              <div className="col-span-full mt-4">
                <h4 className="font-semibold mb-2">Ngành Oanh</h4>
              </div>
              {renderPositionSelect('Đoàn Trưởng Oanh Nam', 'doanTruongOanhNamId')}
              {renderPositionSelect('Đoàn Phó Oanh Nam', 'doanPhoOanhNamId')}
              {renderPositionSelect('Đoàn Trưởng Oanh Nữ', 'doanTruongOanhNuId')}
              {renderPositionSelect('Đoàn Phó Oanh Nữ', 'doanPhoOanhNuId')}
            </div>

            <div className="card-actions justify-end mt-4">
              <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                Lưu Thay Đổi
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card bg-base-200">
        <div className="card-body">
          <OrgChart
            organization={orgStructure}
            isAdmin={isAdmin}
            members={members}
            onEditMember={(member) => {
              // Convert back to original member format for editing
              const originalMember = members.find(m => m.id === member.memberId);
              if (originalMember) {
                setEditingMember(originalMember);
              }
            }}
            onAssignMember={handleAssignMember}
          />
        </div>
      </div>

      {/* Member Edit Form */}
      <MemberForm
        member={editingMember}
        isOpen={!!editingMember}
        onClose={() => setEditingMember(null)}
        onSuccess={() => setEditingMember(null)}
      />

      <div className="text-center text-sm opacity-60">
        {isAdmin
          ? 'Nhấn vào ô để xem chi tiết hoặc phân công chức vụ'
          : 'Nhấn vào các ô để xem thông tin chi tiết'}
      </div>
    </div>
  );
}
