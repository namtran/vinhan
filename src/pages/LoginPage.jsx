import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      let message = 'Đăng nhập thất bại';
      if (error.code === 'auth/user-not-found') {
        message = 'Không tìm thấy tài khoản';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Sai mật khẩu';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Email không hợp lệ';
      } else if (error.code === 'auth/invalid-credential') {
        message = 'Email hoặc mật khẩu không đúng';
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="card w-full max-w-md bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl mb-4">
            <Lock className="w-6 h-6" />
            Đăng Nhập Quản Trị
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <Mail className="w-4 h-4 opacity-70" />
                <input
                  type="email"
                  className="grow"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Mật Khẩu</span>
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <Lock className="w-4 h-4 opacity-70" />
                <input
                  type="password"
                  className="grow"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Đăng Nhập
                </>
              )}
            </button>
          </form>

          <div className="divider">Lưu Ý</div>

          <p className="text-sm opacity-70 text-center">
            Chỉ quản trị viên mới có quyền đăng nhập.
            <br />
            Liên hệ ban quản trị để được cấp tài khoản.
          </p>
        </div>
      </div>
    </div>
  );
}
