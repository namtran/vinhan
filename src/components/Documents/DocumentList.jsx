import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCollection, addDocument, deleteDocument } from '../../hooks/useFirestore';
import {
  Folder,
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  Music,
  BookOpen,
  Wrench,
  Gamepad2,
  ChevronRight,
  Home,
  Video,
  Image,
  Link as LinkIcon,
  Youtube,
} from 'lucide-react';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { id: 'phat-phap', name: 'Phật Pháp', icon: BookOpen, color: 'text-amber-500' },
  { id: 'ky-nang', name: 'Kỹ Năng Chuyên Môn', icon: Wrench, color: 'text-blue-500' },
  { id: 'bai-hat', name: 'Bài Hát Sinh Hoạt', icon: Music, color: 'text-pink-500' },
  { id: 'tro-choi', name: 'Tổng Hợp Trò Chơi', icon: Gamepad2, color: 'text-green-500' },
];

const LINK_TYPES = [
  { value: 'document', label: 'Tài liệu (PDF, Word)', icon: FileText },
  { value: 'audio', label: 'Âm thanh (MP3)', icon: Music },
  { value: 'video', label: 'Video', icon: Video },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'image', label: 'Hình ảnh', icon: Image },
  { value: 'other', label: 'Link khác', icon: LinkIcon },
];

export default function DocumentList() {
  const { isAdmin } = useAuth();
  const { documents, loading } = useCollection('documents');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'document',
    description: '',
  });

  // Filter documents by category
  const categoryDocuments = useMemo(() => {
    if (!currentCategory) return [];
    return documents.filter(doc => doc.category === currentCategory.id);
  }, [documents, currentCategory]);

  // Count documents per category
  const categoryCounts = useMemo(() => {
    return documents.reduce((acc, doc) => {
      acc[doc.category] = (acc[doc.category] || 0) + 1;
      return acc;
    }, {});
  }, [documents]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.url.trim()) {
      toast.error('Vui lòng nhập đủ thông tin');
      return;
    }

    // Validate URL
    try {
      new URL(formData.url);
    } catch {
      toast.error('URL không hợp lệ');
      return;
    }

    try {
      await addDocument('documents', {
        ...formData,
        category: currentCategory.id,
      });
      toast.success('Đã thêm tài liệu!');
      setIsModalOpen(false);
      setFormData({ title: '', url: '', type: 'document', description: '' });
    } catch (error) {
      toast.error('Lỗi: ' + error.message);
    }
  };

  const handleDelete = async (doc) => {
    if (!confirm(`Bạn có chắc muốn xóa "${doc.title}"?`)) return;

    try {
      await deleteDocument('documents', doc.id);
      toast.success('Đã xóa tài liệu');
    } catch (error) {
      toast.error('Lỗi: ' + error.message);
    }
  };

  const getTypeIcon = (type) => {
    const found = LINK_TYPES.find(t => t.value === type);
    return found?.icon || LinkIcon;
  };

  const getYouTubeId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return match ? match[1] : null;
  };

  // Category selection view
  if (!currentCategory) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Tài Liệu</h2>
        <p className="opacity-70">Chọn danh mục để xem tài liệu</p>

        {loading ? (
          <div className="flex justify-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORIES.map(category => {
              const Icon = category.icon;
              const count = categoryCounts[category.id] || 0;
              return (
                <div
                  key={category.id}
                  className="card bg-base-200 hover:bg-base-300 cursor-pointer transition-colors"
                  onClick={() => setCurrentCategory(category)}
                >
                  <div className="card-body flex-row items-center gap-4">
                    <div className={`p-3 rounded-lg bg-base-100 ${category.color}`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="card-title">{category.name}</h3>
                      <p className="text-sm opacity-70">
                        {count} tài liệu
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 opacity-50" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Instructions for adding documents */}
        <div className="alert alert-info">
          <div>
            <p className="font-semibold">Hướng dẫn thêm tài liệu:</p>
            <ol className="list-decimal list-inside text-sm mt-2 space-y-1">
              <li>Upload file lên <strong>Google Drive</strong> và copy link chia sẻ</li>
              <li>Hoặc copy link từ <strong>YouTube</strong>, <strong>SoundCloud</strong></li>
              <li>Vào danh mục → Thêm Tài Liệu → Dán link</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  // File list view
  const CategoryIcon = currentCategory.icon;

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <div className="breadcrumbs text-sm">
        <ul>
          <li>
            <button
              className="flex items-center gap-1 hover:text-primary"
              onClick={() => setCurrentCategory(null)}
            >
              <Home className="w-4 h-4" />
              Tài Liệu
            </button>
          </li>
          <li>
            <span className={`flex items-center gap-1 ${currentCategory.color}`}>
              <CategoryIcon className="w-4 h-4" />
              {currentCategory.name}
            </span>
          </li>
        </ul>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <CategoryIcon className={`w-6 h-6 ${currentCategory.color}`} />
          {currentCategory.name}
        </h2>

        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            Thêm Tài Liệu
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      {/* Empty state */}
      {!loading && categoryDocuments.length === 0 && (
        <div className="text-center py-12 opacity-70">
          <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Chưa có tài liệu nào</p>
          {isAdmin && <p className="text-sm mt-2">Nhấn "Thêm Tài Liệu" để thêm link</p>}
        </div>
      )}

      {/* Document list */}
      {!loading && categoryDocuments.length > 0 && (
        <div className="grid gap-3">
          {categoryDocuments.map(doc => {
            const TypeIcon = getTypeIcon(doc.type);
            const youtubeId = doc.type === 'youtube' ? getYouTubeId(doc.url) : null;

            return (
              <div
                key={doc.id}
                className="card bg-base-200"
              >
                <div className="card-body p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-base-300 ${currentCategory.color}`}>
                      <TypeIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold">{doc.title}</h3>
                      {doc.description && (
                        <p className="text-sm opacity-70 mt-1">{doc.description}</p>
                      )}

                      {/* YouTube embed preview */}
                      {youtubeId && (
                        <div className="mt-3 aspect-video max-w-md">
                          <iframe
                            className="w-full h-full rounded-lg"
                            src={`https://www.youtube.com/embed/${youtubeId}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-ghost btn-sm"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Mở
                      </a>
                      {isAdmin && (
                        <button
                          className="btn btn-ghost btn-sm text-error"
                          onClick={() => handleDelete(doc)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Document Modal */}
      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Thêm Tài Liệu</h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Tiêu đề *</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                placeholder="VD: Bài Ca Sen Trắng"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Loại tài liệu</span>
              </label>
              <select
                className="select select-bordered"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {LINK_TYPES.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Link URL *</span>
              </label>
              <input
                type="url"
                className="input input-bordered"
                placeholder="https://drive.google.com/... hoặc https://youtube.com/..."
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
              <label className="label">
                <span className="label-text-alt opacity-70">
                  Dán link từ Google Drive, YouTube, SoundCloud, v.v.
                </span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Mô tả (tùy chọn)</span>
              </label>
              <textarea
                className="textarea textarea-bordered"
                placeholder="Mô tả ngắn về tài liệu..."
                rows={2}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
              <button type="submit" className="btn btn-primary">
                Thêm
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsModalOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
}
