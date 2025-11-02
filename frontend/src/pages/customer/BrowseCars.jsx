import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { carService } from '../../services';
import CarCard from '../../components/CarCard';

const BrowseCars = () => {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    transmission: '',
    available: 'true',
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchBrands();
    fetchCars();
  }, []);

  const fetchBrands = async () => {
    try {
      const data = await carService.getBrands();
      setBrands(data);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchCars = async () => {
    try {
      const data = await carService.getCars(filters);
      setCars(data);
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    setLoading(true);
    fetchCars();
  };

  const resetFilters = () => {
    setFilters({
      brand: '',
      minPrice: '',
      maxPrice: '',
      transmission: '',
      available: 'true',
    });
    setLoading(true);
    fetchCars();
  };

  const handleViewCar = (car) => {
    navigate(`/customer/car/${car._id}`);
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Cars</h1>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Filters</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Brand</label>
            <select
              name="brand"
              value={filters.brand}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Min Price</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              placeholder="₹ Min"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Price</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              placeholder="₹ Max"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Transmission</label>
            <select
              name="transmission"
              value={filters.transmission}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">All</option>
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4 mt-4">
          <button
            onClick={applyFilters}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Apply Filters
          </button>
          <button
            onClick={resetFilters}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {cars.map((car) => (
          <CarCard key={car._id} car={car} onView={handleViewCar} />
        ))}
      </div>

      {cars.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No cars found with the selected filters.
        </div>
      )}
    </div>
  );
};

export default BrowseCars;
