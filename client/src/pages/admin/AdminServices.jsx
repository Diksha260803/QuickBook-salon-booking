import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", duration: "", category: "" });
  const [error, setError] = useState("");

  const fetchServices = () => {
    axiosInstance.get("/services").then((res) => setServices(res.data));
  };

  useEffect(() => { fetchServices(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axiosInstance.post("/services", { ...form, price: Number(form.price) });
      setForm({ name: "", description: "", price: "", duration: "", category: "" });
      fetchServices();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add service");
    }
  };

  const handleDelete = async (id) => {
    await axiosInstance.delete(`/services/${id}`);
    fetchServices();
  };

  return (
    <div className="min-h-screen bg-porcelain font-sans">
      <AdminNavbar />
      <div className="max-w-3xl mx-auto px-8 py-16">
        <h1 className="font-display text-3xl text-ink mb-8">Manage Services</h1>

        <form onSubmit={handleAdd} className="bg-white border border-sand rounded-3xl p-6 mb-8 grid grid-cols-2 gap-3">
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required
            className="px-4 py-2.5 border border-sand rounded-xl text-sm col-span-2 focus:outline-none focus:border-rose" />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange}
            className="px-4 py-2.5 border border-sand rounded-xl text-sm col-span-2 focus:outline-none focus:border-rose" />
          <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} required
            className="px-4 py-2.5 border border-sand rounded-xl text-sm focus:outline-none focus:border-rose" />
          <input name="duration" placeholder="Duration (e.g. 30 mins)" value={form.duration} onChange={handleChange}
            className="px-4 py-2.5 border border-sand rounded-xl text-sm focus:outline-none focus:border-rose" />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange}
            className="px-4 py-2.5 border border-sand rounded-xl text-sm col-span-2 focus:outline-none focus:border-rose" />
          {error && <p className="text-rose text-sm col-span-2">{error}</p>}
          <button type="submit" className="col-span-2 py-2.5 bg-plum text-porcelain rounded-full text-sm hover:bg-ink transition">
            + Add Service
          </button>
        </form>

        <div className="space-y-3">
          {services.map((s) => (
            <div key={s._id} className="bg-white border border-sand rounded-2xl p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-ink">{s.name}</p>
                <p className="text-sm text-ink/50">{s.duration} · ₹{s.price}</p>
              </div>
              <button onClick={() => handleDelete(s._id)}
                className="text-xs px-4 py-1.5 border border-sand rounded-full text-ink/60 hover:border-rose hover:text-rose transition">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}