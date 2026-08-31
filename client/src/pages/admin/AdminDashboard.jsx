import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-porcelain font-sans">
      <AdminNavbar />
      <div className="max-w-2xl mx-auto px-8 py-16">
        <h1 className="font-display text-3xl text-ink mb-8">Dashboard</h1>
        <div className="grid grid-cols-2 gap-5">
          <Link to="/admin/services" className="bg-white border border-sand rounded-3xl p-6 hover:border-rose transition">
            <p className="font-display text-xl text-ink">Manage Services</p>
            <p className="text-sm text-ink/50 mt-1">Add, edit, or remove services</p>
          </Link>
          <Link to="/admin/bookings" className="bg-white border border-sand rounded-3xl p-6 hover:border-rose transition">
            <p className="font-display text-xl text-ink">All Bookings</p>
            <p className="text-sm text-ink/50 mt-1">View and update statuses</p>
          </Link>
        </div>
      </div>
    </div>
  );
}