import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-5 bg-porcelain border-b border-sand">
      <Link to="/" className="font-display text-2xl text-ink tracking-tight">
        QuickBook
      </Link>

      <div className="flex items-center gap-8">
        <Link to="/" className="text-sm text-ink/70 hover:text-ink transition">
          Services
        </Link>

        {user && (
          <Link to="/my-bookings" className="text-sm text-ink/70 hover:text-ink transition">
            My Bookings
          </Link>
        )}

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-ink/60">{user.name.split(" ")[0]}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-ink/70 hover:text-ink border border-sand hover:border-rose px-4 py-2 rounded-full transition"
            >
              Log out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-plum text-porcelain text-sm px-5 py-2.5 rounded-full hover:bg-ink transition"
          >
            Log in
          </Link>
        )}
      </div>
    </nav>
  );
}