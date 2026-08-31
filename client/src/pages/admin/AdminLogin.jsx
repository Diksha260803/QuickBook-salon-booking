import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      if (res.data.user.role !== "admin") {
        setError("This account does not have admin access.");
        setLoading(false);
        return;
      }
      login(res.data.token, res.data.user);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink font-sans">
      <div className="w-full max-w-sm px-6">
        <h1 className="font-display text-3xl text-porcelain text-center">QuickBook Admin</h1>
        <p className="text-porcelain/40 text-sm text-center mt-2 mb-8">Staff access only</p>

        {error && <p className="text-rose text-sm mb-4 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-porcelain/60">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1.5 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-porcelain focus:outline-none focus:border-rose transition"
            />
          </div>
          <div>
            <label className="text-xs text-porcelain/60">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-1.5 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-porcelain focus:outline-none focus:border-rose transition"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-rose text-ink rounded-full text-sm font-medium hover:bg-porcelain transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}