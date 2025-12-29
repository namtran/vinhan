import { Link } from 'react-router-dom';
import { Network, Users, FileText, Bell } from 'lucide-react';
import { useCollection } from '../hooks/useFirestore';
import { getMembersNeedingTransition, BRANCH_NAMES } from '../utils/ageUtils';

export default function HomePage() {
  const { documents: members, loading, error } = useCollection('members');

  const membersNeedingTransition = getMembersNeedingTransition(members);

  // Count by ngành
  const nganhCounts = members.reduce((acc, m) => {
    acc[m.nganh] = (acc[m.nganh] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="hero bg-base-200 rounded-box py-12">
        <div className="hero-content text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="text-primary">Gia Đình Phật Tử</span> Vĩnh An
            </h1>
            <p className="py-4 text-lg opacity-80">
              Chùa Vĩnh An - Hệ thống quản lý đoàn sinh
            </p>
            <p className="opacity-60">Quản lý đoàn sinh và tài liệu sinh hoạt</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">Lỗi kết nối Firebase</h3>
            <p className="text-sm">{error}</p>
            <p className="text-sm mt-2">Vui lòng vào Firebase Console → Firestore Database → Rules và đặt rules cho phép đọc.</p>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="text-sm opacity-70">Đang kết nối Firebase...</p>
        </div>
      ) : !error && (
        <div className="stats stats-vertical md:stats-horizontal shadow w-full">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Users className="w-8 h-8" />
            </div>
            <div className="stat-title">Tổng Đoàn Sinh</div>
            <div className="stat-value text-primary">{members.length}</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-warning">
              <span className="text-2xl">Oanh</span>
            </div>
            <div className="stat-title">Ngành Oanh</div>
            <div className="stat-value">
              {(nganhCounts['oanh_nam'] || 0) + (nganhCounts['oanh_nu'] || 0)}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-info">
              <span className="text-2xl">Thiếu</span>
            </div>
            <div className="stat-title">Ngành Thiếu</div>
            <div className="stat-value">
              {(nganhCounts['thieu_nam'] || 0) + (nganhCounts['thieu_nu'] || 0)}
            </div>
          </div>

          <div className="stat">
            <div className="stat-figure text-success">
              <span className="text-2xl">Thanh</span>
            </div>
            <div className="stat-title">Ngành Thanh</div>
            <div className="stat-value">
              {(nganhCounts['thanh_nam'] || 0) + (nganhCounts['thanh_nu'] || 0)}
            </div>
          </div>
        </div>
      )}

      {/* Age Transition Alerts */}
      {membersNeedingTransition.length > 0 && (
        <div className="alert alert-warning">
          <Bell className="w-5 h-5" />
          <div>
            <h3 className="font-bold">Cảnh Báo Chuyển Ngành</h3>
            <p className="text-sm">
              Có {membersNeedingTransition.length} đoàn sinh cần chuyển ngành theo độ tuổi
            </p>
          </div>
          <Link to="/members?filter=alerts" className="btn btn-sm btn-warning">
            Xem Danh Sách
          </Link>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/org-chart" className="card bg-base-200 hover:bg-base-300 transition-colors">
          <div className="card-body items-center text-center">
            <Network className="w-12 h-12 text-primary" />
            <h2 className="card-title">Sơ Đồ Tổ Chức</h2>
            <p className="opacity-70">Xem cấu trúc tổ chức GĐPT</p>
          </div>
        </Link>

        <Link to="/members" className="card bg-base-200 hover:bg-base-300 transition-colors">
          <div className="card-body items-center text-center">
            <Users className="w-12 h-12 text-secondary" />
            <h2 className="card-title">Danh Sách Đoàn Sinh</h2>
            <p className="opacity-70">Quản lý thông tin đoàn sinh</p>
          </div>
        </Link>

        <Link to="/documents" className="card bg-base-200 hover:bg-base-300 transition-colors">
          <div className="card-body items-center text-center">
            <FileText className="w-12 h-12 text-accent" />
            <h2 className="card-title">Tài Liệu</h2>
            <p className="opacity-70">Phật pháp, bài hát, trò chơi</p>
          </div>
        </Link>
      </div>

      {/* Members needing transition list */}
      {membersNeedingTransition.length > 0 && (
        <div className="card bg-base-200">
          <div className="card-body">
            <h3 className="card-title text-warning">
              <Bell className="w-5 h-5" />
              Đoàn Sinh Cần Chuyển Ngành
            </h3>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Họ Tên</th>
                    <th>Tuổi</th>
                    <th>Ngành Hiện Tại</th>
                    <th>Nên Chuyển Sang</th>
                  </tr>
                </thead>
                <tbody>
                  {membersNeedingTransition.slice(0, 5).map(member => (
                    <tr key={member.id}>
                      <td>{member.hoTen}</td>
                      <td>{member.transition.age}</td>
                      <td>
                        <span className="badge badge-outline">
                          {BRANCH_NAMES[member.nganh]}
                        </span>
                      </td>
                      <td>
                        <span className="badge badge-warning">
                          {member.transition.toBranchName}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {membersNeedingTransition.length > 5 && (
              <div className="card-actions justify-end">
                <Link to="/members?filter=alerts" className="btn btn-sm btn-outline">
                  Xem tất cả ({membersNeedingTransition.length})
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
