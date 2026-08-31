import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/Navbar";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await axiosInstance.post("/auth/signup", form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-porcelain font-sans">
      <Navbar />
      <div className="flex items-center justify-center py-20 px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl text-ink text-center">Join QuickBook</h1>
          <p className="text-ink/50 text-sm text-center mt-2 mb-8">Create an account to start booking</p>

          {error && <p className="text-rose text-sm mb-4 text-center">{error}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "name", label: "Name", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "password", label: "Password", type: "password" },
              { name: "phone", label: "Phone", type: "tel" },
            ].map((field) => (
              <div key={field.name}>
                <label className="text-xs text-ink/60">{field.label}</label>
                <input
                  type={field.type}
                  name={field.name}
                  value={form[field.name]}
                  onChange={handleChange}
                  required={field.name !== "phone"}
                  className="w-full mt-1.5 px-4 py-3 bg-white border border-sand rounded-2xl text-sm focus:outline-none focus:border-rose transition"
                />
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-plum text-porcelain rounded-full text-sm hover:bg-ink transition disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-ink/50">
            Already have an account? <Link to="/login" className="text-rose">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}