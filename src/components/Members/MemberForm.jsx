import { useState, useEffect } from 'react';
import { X, User } from 'lucide-react';
import toast from 'react-hot-toast';

// Convert Google Drive share link to direct image URL
const convertGoogleDriveUrl = (url) => {
  if (!url) return '';

  // Already a direct link or non-Google Drive URL
  if (!url.includes('drive.google.com')) return url;

  // Extract file ID from various Google Drive URL formats
  let fileId = null;

  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch) fileId = fileMatch[1];

  // Format: https://drive.google.com/open?id=FILE_ID
  const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (!fileId && openMatch) fileId = openMatch[1];

  // Format: https://drive.google.com/uc?id=FILE_ID
  const ucMatch = url.match(/\/uc\?.*id=([a-zA-Z0-9_-]+)/);
  if (!fileId && ucMatch) fileId = ucMatch[1];

  if (fileId) {
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`;
  }

  return url;
};
import { addDocument, updateDocument } from '../../hooks/useFirestore';

const NGANH_CHINH_OPTIONS = [
  { value: 'ban_huynh_truong', label: 'Ban Huynh Trưởng' },
  { value: 'nganh_thanh', label: 'Ngành Thanh' },
  { value: 'nganh_thieu', label: 'Ngành Thiếu' },
  { value: 'nganh_oanh', label: 'Ngành Oanh' },
];

const NGANH_OPTIONS = [
  { value: 'oanh_nam', label: 'Oanh Nam' },
  { value: 'oanh_nu', label: 'Oanh Nữ' },
  { value: 'thieu_nam', label: 'Thiếu Nam' },
  { value: 'thieu_nu', label: 'Thiếu Nữ' },
  { value: 'thanh_nam', label: 'Thanh Nam' },
  { value: 'thanh_nu', label: 'Thanh Nữ' },
  { value: 'ban_huynh_truong', label: 'Ban Huynh Trưởng' },
];

const CHUC_VU_OPTIONS = [
  { value: 'doan_sinh', label: 'Đoàn Sinh' },
  { value: 'doan_pho', label: 'Đoàn Phó' },
  { value: 'doan_truong', label: 'Đoàn Trưởng' },
  { value: 'thu_quy', label: 'Thủ Quỹ' },
  { value: 'thu_ky', label: 'Thư Ký' },
  { value: 'lien_doan_pho', label: 'Liên Đoàn Phó' },
  { value: 'lien_doan_truong', label: 'Liên Đoàn Trưởng' },
  { value: 'gia_truong', label: 'Gia Trưởng' },
];

const initialFormData = {
  hoTen: '',
  phapDanh: '',
  birthYear: '',
  address: '',
  chucVu: 'doan_sinh',
  capBac: '',
  nganhChinh: 'nganh_oanh',
  nganh: 'oanh_nam',
  phone: '',
  quaTrinhSinhHoat: '',
  photoUrl: '',
};

export default function MemberForm({ member, isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        hoTen: member.hoTen || '',
        phapDanh: member.phapDanh || '',
        birthYear: member.birthYear || '',
        address: member.address || '',
        chucVu: member.chucVu || 'doan_sinh',
        capBac: member.capBac || '',
        nganhChinh: member.nganhChinh || 'nganh_oanh',
        nganh: member.nganh || 'oanh_nam',
        phone: member.phone || '',
        quaTrinhSinhHoat: member.quaTrinhSinhHoat || '',
        photoUrl: member.photoUrl || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setImageError(false);
  }, [member]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'photoUrl') {
      setImageError(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = {
        ...formData,
        birthYear: parseInt(formData.birthYear, 10),
        photoUrl: convertGoogleDriveUrl(formData.photoUrl),
      };

      if (member) {
        await updateDocument('members', member.id, data);
        toast.success('Cập nhật thành công!');
      } else {
        await addDocument('members', data);
        toast.success('Thêm thành viên thành công!');
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Error saving member:', error);
      toast.error('Lỗi: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </button>

        <h3 className="font-bold text-lg mb-4">
          {member ? 'Chỉnh Sửa Thành Viên' : 'Thêm Thành Viên Mới'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo URL with Preview */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Ảnh Đại Diện (Link Google Drive hoặc URL)</span>
            </label>
            <div className="flex gap-4 items-start">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-lg border-2 border-dashed border-base-300 flex items-center justify-center overflow-hidden bg-base-200">
                  {formData.photoUrl && !imageError ? (
                    <img
                      src={convertGoogleDriveUrl(formData.photoUrl)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <User className="w-10 h-10 text-base-content/30" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <input
                  type="url"
                  name="photoUrl"
                  value={formData.photoUrl}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                  placeholder="https://drive.google.com/file/d/xxx/view"
                />
                <p className="text-xs text-base-content/60 mt-1">
                  Dán link chia sẻ từ Google Drive (đảm bảo quyền xem cho mọi người)
                </p>
                {imageError && (
                  <p className="text-xs text-error mt-1">
                    Không thể tải ảnh. Kiểm tra lại link và quyền chia sẻ.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Họ Tên */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Họ và Tên *</span>
              </label>
              <input
                type="text"
                name="hoTen"
                value={formData.hoTen}
                onChange={handleChange}
                className="input input-bordered"
                required
              />
            </div>

            {/* Pháp Danh */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Pháp Danh</span>
              </label>
              <input
                type="text"
                name="phapDanh"
                value={formData.phapDanh}
                onChange={handleChange}
                className="input input-bordered"
              />
            </div>

            {/* Năm Sinh */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Năm Sinh *</span>
              </label>
              <input
                type="number"
                name="birthYear"
                value={formData.birthYear}
                onChange={handleChange}
                className="input input-bordered"
                min="1900"
                max={new Date().getFullYear()}
                required
              />
            </div>

            {/* SĐT */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Số Điện Thoại</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input input-bordered"
              />
            </div>

            {/* Ngành Chính */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Ngành *</span>
              </label>
              <select
                name="nganhChinh"
                value={formData.nganhChinh}
                onChange={handleChange}
                className="select select-bordered"
                required
              >
                {NGANH_CHINH_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Ngành Sinh Hoạt */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Đơn Vị Sinh Hoạt *</span>
              </label>
              <select
                name="nganh"
                value={formData.nganh}
                onChange={handleChange}
                className="select select-bordered"
                required
              >
                {NGANH_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Chức Vụ */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Chức Vụ</span>
              </label>
              <select
                name="chucVu"
                value={formData.chucVu}
                onChange={handleChange}
                className="select select-bordered"
              >
                {CHUC_VU_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Cấp Bậc */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Cấp Bậc</span>
              </label>
              <input
                type="text"
                name="capBac"
                value={formData.capBac}
                onChange={handleChange}
                className="input input-bordered"
              />
            </div>
          </div>

          {/* Địa Chỉ */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Địa Chỉ</span>
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="input input-bordered"
            />
          </div>

          {/* Quá Trình Sinh Hoạt */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Quá Trình Sinh Hoạt</span>
            </label>
            <textarea
              name="quaTrinhSinhHoat"
              value={formData.quaTrinhSinhHoat}
              onChange={handleChange}
              className="textarea textarea-bordered h-24"
              placeholder="Nhập quá trình sinh hoạt..."
            />
          </div>

          <div className="modal-action">
            <button type="button" className="btn" onClick={onClose}>
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : member ? (
                'Cập Nhật'
              ) : (
                'Thêm'
              )}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
}
