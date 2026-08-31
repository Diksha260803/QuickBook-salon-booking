import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin-login");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-ink border-b border-white/10">
      <Link to="/admin" className="font-display text-xl text-porcelain">
        QuickBook <span className="text-rose text-sm">Admin</span>
      </Link>
      <div className="flex items-center gap-6">
        <Link to="/admin/services" className="text-sm text-porcelain/60 hover:text-porcelain transition">
          Services
        </Link>
        <Link to="/admin/bookings" className="text-sm text-porcelain/60 hover:text-porcelain transition">
          Bookings
        </Link>
        <span className="text-sm text-porcelain/40">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="text-sm text-porcelain/60 hover:text-rose border border-white/10 hover:border-rose px-4 py-2 rounded-full transition"
        >
          Log out
        </button>
      </div>
    </nav>
  );
}