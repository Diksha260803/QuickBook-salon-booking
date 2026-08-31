import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

export default function Login() {
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
      login(res.data.token, res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-porcelain font-sans">
      <Navbar />
      <div className="flex items-center justify-center py-24 px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl text-ink text-center">Welcome back</h1>
          <p className="text-ink/50 text-sm text-center mt-2 mb-8">Log in to book your next appointment</p>

          {error && <p className="text-rose text-sm mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-ink/60">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full mt-1.5 px-4 py-3 bg-white border border-sand rounded-2xl text-sm focus:outline-none focus:border-rose transition"
              />
            </div>
            <div>
              <label className="text-xs text-ink/60">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1.5 px-4 py-3 bg-white border border-sand rounded-2xl text-sm focus:outline-none focus:border-rose transition"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-plum text-porcelain rounded-full text-sm hover:bg-ink transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-ink/50">
            New here? <Link to="/signup" className="text-rose">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}