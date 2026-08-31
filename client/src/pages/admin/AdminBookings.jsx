import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import AdminNavbar from "../../components/AdminNavbar";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = () => {
    axiosInstance.get("/bookings").then((res) => setBookings(res.data));
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleStatusChange = async (id, status) => {
    await axiosInstance.put(`/bookings/${id}/status`, { status });
    fetchBookings();
  };

  return (
    <div className="min-h-screen bg-porcelain font-sans">
      <AdminNavbar />
      <div className="max-w-4xl mx-auto px-8 py-16">
        <h1 className="font-display text-3xl text-ink mb-8">All Bookings</h1>
        <div className="bg-white border border-sand rounded-3xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-sand/50 text-left text-ink/50">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Service</th>
                <th className="p-4">Date</th>
                <th className="p-4">Time</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-t border-sand">
                  <td className="p-4 text-ink">{b.user?.name}</td>
                  <td className="p-4 text-ink">{b.service?.name}</td>
                  <td className="p-4 text-ink/60">{b.date?.slice(0, 10)}</td>
                  <td className="p-4 text-ink/60">{b.timeSlot}</td>
                  <td className="p-4">
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b._id, e.target.value)}
                      className="border border-sand rounded-full px-3 py-1 text-xs capitalize focus:outline-none"
                    >
                      <option value="pending">pending</option>
                      <option value="confirmed">confirmed</option>
                      <option value="cancelled">cancelled</option>
                      <option value="completed">completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}