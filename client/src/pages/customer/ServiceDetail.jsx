import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";
import Navbar from "../../components/Navbar";

const TIME_SLOTS = [
  "9:00 AM - 9:30 AM", "9:30 AM - 10:00 AM", "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM", "11:00 AM - 11:30 AM", "11:30 AM - 12:00 PM",
  "2:00 PM - 2:30 PM", "2:30 PM - 3:00 PM", "3:00 PM - 3:30 PM",
  "3:30 PM - 4:00 PM", "4:00 PM - 4:30 PM", "4:30 PM - 5:00 PM",
];

function getTodayDate() {
  const t = new Date();
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
}

export default function ServiceDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const today = getTodayDate();

  useEffect(() => {
    axiosInstance.get(`/services/${id}`).then((res) => setService(res.data));
  }, [id]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (date < today) {
      setError("Please choose a valid upcoming date.");
      return;
    }
    setError("");
    setSuccess("");
    setSubmitting(true);
    try {
      await axiosInstance.post("/bookings", { service: id, date, timeSlot });
      setSuccess("Booking confirmed!");
      setTimeout(() => navigate("/my-bookings"), 1200);
    } catch (err) {
      setError(err.response?.data?.error || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!service)
    return (
      <div className="min-h-screen bg-porcelain">
        <Navbar />
        <p className="text-center mt-10 text-ink/50">Loading...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-porcelain font-sans">
      <Navbar />
      <div className="max-w-md mx-auto px-6 py-16">
        <div className="mb-8">
          <p className="text-rose text-sm mb-1">{service.category || "Service"}</p>
          <h1 className="font-display text-3xl text-ink">{service.name}</h1>
          <p className="text-ink/50 text-sm mt-2">{service.duration} · ₹{service.price}</p>
          {service.description && <p className="text-ink/60 text-sm mt-4">{service.description}</p>}
        </div>

        {error && <p className="text-rose text-sm mb-3">{error}</p>}
        {success && <p className="text-green-700 text-sm mb-3">{success}</p>}

        <form onSubmit={handleBook} className="bg-white border border-sand rounded-3xl p-6 space-y-5">
          <div>
            <label className="text-xs text-ink/60">Choose a date</label>
            <input
              type="date"
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full mt-1.5 px-4 py-3 border border-sand rounded-2xl text-sm focus:outline-none focus:border-rose transition"
            />
          </div>
          <div>
            <label className="text-xs text-ink/60">Choose a time</label>
            <select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              required
              className="w-full mt-1.5 px-4 py-3 border border-sand rounded-2xl text-sm bg-white focus:outline-none focus:border-rose transition"
            >
              <option value="" disabled>Select a slot</option>
              {TIME_SLOTS.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-plum text-porcelain rounded-full text-sm hover:bg-ink transition disabled:opacity-50"
          >
            {submitting ? "Booking..." : "Confirm booking"}
          </button>
        </form>
      </div>
    </div>
  );
}