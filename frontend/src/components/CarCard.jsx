const CarCard = ({ car, onView, onEdit, onDelete, showActions = false }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={car.image}
        alt={car.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{car.name}</h3>
        <p className="text-gray-600 mb-2">{car.brand}</p>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-500">{car.transmission}</span>
          <span className="text-sm text-gray-500">{car.fuelType}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">
            ₹{car.pricePerDay}/day
          </span>
          <span
            className={`px-2 py-1 rounded text-sm ${
              car.available
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {car.available ? 'Available' : 'Booked'}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onView(car)}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            View Details
          </button>
          {showActions && (
            <>
              <button
                onClick={() => onEdit(car)}
                className="flex-1 bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(car._id)}
                className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarCard;
