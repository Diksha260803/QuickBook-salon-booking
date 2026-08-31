import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import Navbar from "../../components/Navbar";

export default function Home() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/services")
      .then((res) => {
        setServices(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("We couldn't load services right now. Try again shortly.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-porcelain font-sans">
      <Navbar />

      <section className="max-w-5xl mx-auto px-8 pt-16 pb-12">
        <p className="text-rose text-sm mb-3">Book in minutes</p>
        <h1 className="font-display text-5xl md:text-6xl text-ink leading-[1.05] max-w-2xl">
          Your next appointment, exactly when you want it.
        </h1>
        <p className="text-ink/60 mt-5 max-w-md">
          Pick a service, choose a time that suits you, and we'll hold your spot.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-8 pb-24">
        {loading && <p className="text-ink/50">Loading services...</p>}
        {error && <p className="text-rose">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service) => (
            <button
              key={service._id}
              onClick={() => navigate(`/services/${service._id}`)}
              className="text-left bg-white border border-sand rounded-3xl p-6 hover:border-rose transition group"
            >
              <div className="flex items-start justify-between">
                <h2 className="font-display text-xl text-ink">{service.name}</h2>
                <span className="text-gold font-medium">₹{service.price}</span>
              </div>
              <p className="text-ink/50 text-sm mt-2">{service.duration}</p>
              {service.description && (
                <p className="text-ink/60 text-sm mt-3 line-clamp-2">{service.description}</p>
              )}
              <div className="mt-6 pt-4 border-t border-sand flex items-center justify-between">
                <span className="text-xs text-ink/40 uppercase tracking-wide">{service.category || "Service"}</span>
                <span className="text-sm text-rose group-hover:translate-x-1 transition-transform">
                  Book this →
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}