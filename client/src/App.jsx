import { useEffect, useState } from 'react';
import axiosInstance from './api/axiosInstance';

function App() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance.get('/services')
      .then((res) => {
        setServices(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load services');
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Loading services...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">QuickBook Services</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service._id} className="border rounded-xl p-4 shadow-sm">
            <h2 className="font-medium text-lg">{service.name}</h2>
            <p className="text-gray-500 text-sm">{service.duration}</p>
            <p className="mt-2 font-semibold">₹{service.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;