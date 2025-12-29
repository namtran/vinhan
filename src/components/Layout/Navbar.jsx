import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Home,
  Users,
  Network,
  FileText,
  LogIn,
  LogOut,
  Bell
} from 'lucide-react';

export default function Navbar({ alertCount = 0 }) {
  const { currentUser, logout, isAdmin } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Trang Chủ', icon: Home },
    { path: '/org-chart', label: 'Sơ Đồ Tổ Chức', icon: Network },
    { path: '/members', label: 'Danh Sách', icon: Users },
    { path: '/documents', label: 'Tài Liệu', icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="navbar bg-base-200 shadow-lg sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className={isActive(item.path) ? 'active' : ''}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">
          <span className="text-primary">GĐPT</span> Vĩnh An
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={isActive(item.path) ? 'active bg-primary text-primary-content' : ''}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="navbar-end gap-2">
        {alertCount > 0 && (
          <Link to="/members?filter=alerts" className="btn btn-ghost btn-circle">
            <div className="indicator">
              <Bell className="w-5 h-5" />
              <span className="badge badge-sm badge-warning indicator-item">{alertCount}</span>
            </div>
          </Link>
        )}

        {isAdmin ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span className="text-sm">QT</span>
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li className="menu-title">
                <span>{currentUser?.email}</span>
              </li>
              <li>
                <button onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                  Đăng Xuất
                </button>
              </li>
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm">
            <LogIn className="w-4 h-4" />
            Quản Trị
          </Link>
        )}
      </div>
    </div>
  );
}
