import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/Navbar";

const statusStyles = {
  pending: "bg-gold/15 text-gold",
  confirmed: "bg-green-100 text-green-700",
  cancelled: "bg-rose-light/60 text-rose",
  completed: "bg-sand text-ink/50",
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    axiosInstance.get("/bookings/my").then((res) => {
      setBookings(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    await axiosInstance.delete(`/bookings/${id}`);
    fetchBookings();
  };

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = bookings.filter((b) => b.date?.slice(0, 10) >= today && b.status !== "cancelled");
  const past = bookings.filter((b) => b.date?.slice(0, 10) < today || b.status === "cancelled");

  const BookingCard = ({ b, allowCancel }) => (
    <div className="bg-white border border-sand rounded-3xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-lg text-ink">{b.service?.name}</p>
          <p className="text-sm text-ink/50 mt-1">{b.date?.slice(0, 10)} · {b.timeSlot}</p>
        </div>
        <span className={`text-xs px-3 py-1 rounded-full capitalize ${statusStyles[b.status]}`}>
          {b.status}
        </span>
      </div>
      <div className="flex items-center justify-between border-t border-sand mt-4 pt-4">
        <span className="text-sm text-ink/50">₹{b.service?.price}</span>
        {allowCancel && b.status !== "cancelled" && (
          <button
            onClick={() => handleCancel(b._id)}
            className="text-xs px-4 py-1.5 border border-sand rounded-full text-ink/60 hover:border-rose hover:text-rose transition"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-porcelain font-sans">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-display text-3xl text-ink mb-8">My Bookings</h1>

        {loading && <p className="text-ink/50">Loading...</p>}

        {!loading && (
          <>
            <h2 className="text-xs uppercase tracking-wide text-ink/40 mb-3">Upcoming</h2>
            <div className="space-y-4 mb-10">
              {upcoming.length === 0 && <p className="text-sm text-ink/40">No upcoming bookings yet.</p>}
              {upcoming.map((b) => <BookingCard key={b._id} b={b} allowCancel />)}
            </div>

            <h2 className="text-xs uppercase tracking-wide text-ink/40 mb-3">Past</h2>
            <div className="space-y-4">
              {past.length === 0 && <p className="text-sm text-ink/40">No past bookings.</p>}
              {past.map((b) => <BookingCard key={b._id} b={b} allowCancel={false} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}