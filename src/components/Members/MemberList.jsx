import { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  FileSpreadsheet,
  FileJson,
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { useCollection, deleteDocument } from '../../hooks/useFirestore';
import { calculateAge, shouldTransitionBranch, BRANCH_NAMES } from '../../utils/ageUtils';
import { seedDemoData } from '../../utils/seedData';
import { exportToCSV, exportToJSON, exportToPDF } from '../../utils/exportData';
import MemberForm from './MemberForm';
import MemberDetailModal from '../OrgChart/MemberDetailModal';
import { useDocument } from '../../hooks/useFirestore';

const NGANH_CHINH_FILTER_OPTIONS = [
  { value: '', label: 'Tất cả Ngành' },
  { value: 'ban_huynh_truong', label: 'Ban Huynh Trưởng' },
  { value: 'nganh_thanh', label: 'Ngành Thanh' },
  { value: 'nganh_thieu', label: 'Ngành Thiếu' },
  { value: 'nganh_oanh', label: 'Ngành Oanh' },
];

const NGANH_CHINH_NAMES = {
  'ban_huynh_truong': 'Ban Huynh Trưởng',
  'nganh_thanh': 'Ngành Thanh',
  'nganh_thieu': 'Ngành Thiếu',
  'nganh_oanh': 'Ngành Oanh',
};

const NGANH_FILTER_OPTIONS = [
  { value: '', label: 'Tất cả Đơn Vị' },
  { value: 'oanh_nam', label: 'Oanh Nam' },
  { value: 'oanh_nu', label: 'Oanh Nữ' },
  { value: 'thieu_nam', label: 'Thiếu Nam' },
  { value: 'thieu_nu', label: 'Thiếu Nữ' },
  { value: 'thanh_nam', label: 'Thanh Nam' },
  { value: 'thanh_nu', label: 'Thanh Nữ' },
  { value: 'ban_huynh_truong', label: 'Ban Huynh Trưởng' },
];

export default function MemberList() {
  const { isAdmin } = useAuth();
  const { documents: members, loading } = useCollection('members', 'hoTen');
  const { document: orgData } = useDocument('settings', 'organization');

  const [searchQuery, setSearchQuery] = useState('');
  const [nganhChinhFilter, setNganhChinhFilter] = useState('');
  const [nganhFilter, setNganhFilter] = useState('');
  const [showAlerts, setShowAlerts] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [seeding, setSeeding] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Filter members
  const filteredMembers = useMemo(() => {
    let result = members;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        m =>
          m.hoTen?.toLowerCase().includes(query) ||
          m.phapDanh?.toLowerCase().includes(query) ||
          m.phone?.includes(query)
      );
    }

    // Filter by ngành chính
    if (nganhChinhFilter) {
      result = result.filter(m => m.nganhChinh === nganhChinhFilter);
    }

    // Filter by ngành (đơn vị sinh hoạt)
    if (nganhFilter) {
      result = result.filter(m => m.nganh === nganhFilter);
    }

    // Filter by age alerts
    if (showAlerts) {
      result = result.filter(m => shouldTransitionBranch(m.birthYear, m.nganh, m.chucVu));
    }

    return result;
  }, [members, searchQuery, nganhChinhFilter, nganhFilter, showAlerts]);

  // Table columns
  const columns = useMemo(
    () => [
      {
        accessorKey: 'hoTen',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting()}
          >
            Họ Tên
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: ({ row }) => (
          <div className="min-w-[120px]">
            <p className="font-medium">{row.original.hoTen}</p>
            {row.original.phapDanh && (
              <p className="text-sm opacity-70 italic">{row.original.phapDanh}</p>
            )}
          </div>
        ),
      },
      {
        accessorKey: 'birthYear',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting()}
          >
            Năm Sinh
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: ({ row }) => {
          const age = calculateAge(row.original.birthYear);
          return (
            <div>
              <span>{row.original.birthYear}</span>
              <span className="text-sm opacity-70 ml-1">({age} tuổi)</span>
            </div>
          );
        },
      },
      {
        accessorKey: 'nganhChinh',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting()}
          >
            Ngành
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: ({ row }) => {
          const nganhChinh = row.original.nganhChinh;
          return (
            <span className="badge badge-primary badge-outline">
              {NGANH_CHINH_NAMES[nganhChinh] || nganhChinh || '-'}
            </span>
          );
        },
      },
      {
        accessorKey: 'nganh',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting()}
          >
            Đơn Vị
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: ({ row }) => {
          const transition = shouldTransitionBranch(row.original.birthYear, row.original.nganh, row.original.chucVu);
          return (
            <div className="flex items-center gap-2">
              <span className="badge badge-outline">
                {BRANCH_NAMES[row.original.nganh] || row.original.nganh}
              </span>
              {transition && (
                <div className="tooltip" data-tip={`Nên chuyển sang ${transition.toBranchName}`}>
                  <AlertTriangle className="w-4 h-4 text-warning" />
                </div>
              )}
            </div>
          );
        },
      },
      {
        accessorKey: 'chucVu',
        header: ({ column }) => (
          <button
            className="flex items-center gap-1"
            onClick={() => column.toggleSorting()}
          >
            Chức Vụ
            <ArrowUpDown className="w-4 h-4" />
          </button>
        ),
        cell: ({ row }) => row.original.chucVu || '-',
      },
      {
        accessorKey: 'phone',
        header: 'SĐT',
        cell: ({ row }) => row.original.phone || '-',
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          if (!isAdmin) return null;
          return (
            <div className="flex gap-2">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => handleEdit(row.original)}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                className="btn btn-ghost btn-sm text-error"
                onClick={() => handleDelete(row.original)}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        },
      },
    ],
    [isAdmin]
  );

  const table = useReactTable({
    data: filteredMembers,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  const handleEdit = (member) => {
    setEditingMember(member);
    setIsFormOpen(true);
  };

  const handleDelete = async (member) => {
    if (!confirm(`Bạn có chắc muốn xóa ${member.hoTen}?`)) return;

    try {
      await deleteDocument('members', member.id);
      toast.success('Đã xóa thành viên');
    } catch (error) {
      toast.error('Lỗi khi xóa: ' + error.message);
    }
  };

  const handleAdd = () => {
    setEditingMember(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingMember(null);
  };

  const handleSeedData = async () => {
    if (!confirm('Thêm dữ liệu demo (12 thành viên mẫu)?')) return;

    setSeeding(true);
    try {
      const results = await seedDemoData();
      const successCount = results.filter(r => r.success).length;
      toast.success(`Đã thêm ${successCount} thành viên demo!`);
    } catch (error) {
      toast.error('Lỗi: ' + error.message);
    } finally {
      setSeeding(false);
    }
  };

  // Count alerts
  const alertCount = members.filter(m => shouldTransitionBranch(m.birthYear, m.nganh, m.chucVu)).length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
          {/* Search */}
          <div className="form-control">
            <label className="input input-bordered flex items-center gap-2">
              <Search className="w-4 h-4 opacity-50" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="grow"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </div>

          {/* Ngành Chính Filter */}
          <select
            className="select select-bordered"
            value={nganhChinhFilter}
            onChange={(e) => setNganhChinhFilter(e.target.value)}
          >
            {NGANH_CHINH_FILTER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Đơn Vị Filter */}
          <select
            className="select select-bordered"
            value={nganhFilter}
            onChange={(e) => setNganhFilter(e.target.value)}
          >
            {NGANH_FILTER_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {/* Alert Filter */}
          {alertCount > 0 && (
            <button
              className={`btn ${showAlerts ? 'btn-warning' : 'btn-outline btn-warning'}`}
              onClick={() => setShowAlerts(!showAlerts)}
            >
              <AlertTriangle className="w-4 h-4" />
              Cảnh báo ({alertCount})
            </button>
          )}
        </div>

        {/* Add Buttons */}
        {isAdmin && (
          <div className="flex gap-2">
            {members.length === 0 && (
              <button
                className="btn btn-outline btn-secondary"
                onClick={handleSeedData}
                disabled={seeding}
              >
                {seeding ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : (
                  'Thêm Demo'
                )}
              </button>
            )}

            {/* Export Dropdown */}
            {members.length > 0 && (
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-outline btn-success">
                  <Download className="w-4 h-4" />
                  Xuất Dữ Liệu
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                  <li>
                    <button onClick={() => exportToCSV(members, orgData)}>
                      <FileSpreadsheet className="w-4 h-4" />
                      Xuất CSV
                    </button>
                  </li>
                  <li>
                    <button onClick={() => exportToJSON(members, orgData)}>
                      <FileJson className="w-4 h-4" />
                      Xuất JSON
                    </button>
                  </li>
                  <li>
                    <button onClick={() => exportToPDF(members, orgData)}>
                      <FileText className="w-4 h-4" />
                      Xuất PDF
                    </button>
                  </li>
                </ul>
              </div>
            )}

            <button className="btn btn-primary" onClick={handleAdd}>
              <Plus className="w-4 h-4" />
              Thêm Thành Viên
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Tổng Thành Viên</div>
          <div className="stat-value text-primary">{members.length}</div>
        </div>
        <div className="stat">
          <div className="stat-title">Đang Hiển Thị</div>
          <div className="stat-value">{filteredMembers.length}</div>
        </div>
      </div>

      {/* Table */}
      <p className="text-xs text-center opacity-50 md:hidden mb-1">← Vuốt để xem thêm →</p>
      <div className="overflow-x-auto bg-base-100 rounded-lg shadow">
        <table className="table table-zebra w-full" style={{ minWidth: '700px' }}>
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className="hover cursor-pointer"
                  onClick={() => setSelectedMember(row.original)}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm opacity-70">
          Trang {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </div>
        <div className="join">
          <button
            className="join-item btn btn-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="join-item btn btn-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Member Form Modal */}
      <MemberForm
        member={editingMember}
        isOpen={isFormOpen}
        onClose={handleFormClose}
      />

      {/* Member Detail Modal */}
      <MemberDetailModal
        member={selectedMember ? {
          name: selectedMember.hoTen,
          phapDanh: selectedMember.phapDanh,
          photoUrl: selectedMember.photoUrl,
          birthYear: selectedMember.birthYear,
          phone: selectedMember.phone,
          address: selectedMember.address,
          capBac: selectedMember.capBac,
          chucVu: selectedMember.chucVu,
          nganhChinh: selectedMember.nganhChinh,
          quaTrinhSinhHoat: selectedMember.quaTrinhSinhHoat,
          role: BRANCH_NAMES[selectedMember.nganh] || selectedMember.nganh,
        } : null}
        isOpen={!!selectedMember}
        onClose={() => setSelectedMember(null)}
        isAdmin={isAdmin}
        onEdit={() => {
          setSelectedMember(null);
          handleEdit(selectedMember);
        }}
      />
    </div>
  );
}
