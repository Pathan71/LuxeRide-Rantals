import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { BookingPageStyles, statusConfig } from '../assets/dummyStyles';
import axios from 'axios';
import { FaCalendarAlt, FaCheckCircle, FaChevronDown, FaCreditCard, FaEdit, FaEnvelope, FaFilter, FaGasPump, FaGlobeAsia, FaMapMarkerAlt, FaMapPin, FaPhone, FaSearch, FaSync, FaTachometerAlt, FaUser, FaUserFriends, FaCity, FaCar } from 'react-icons/fa';

const BASE = 'https://luxeride-rantals.onrender.com';
const api = axios.create({
  baseURL: BASE,
  headers: { Accept: 'application/json' },
  withCredentials: true,
})

// Utility functions
const formatDate = (s) => {
  if (!s) return "";
  const d = new Date(s);
  return isNaN(d)
    ? ""
    : `${d.getDate()}`.padStart(2, "0") +
    "/" +
    `${d.getMonth() + 1}`.padStart(2, "0") +
    "/" +
    d.getFullYear();
};

const makeImageUrl = (filename) =>
  filename ? `${BASE}/uploads/${filename}` : "";

const normalizeDetails = (d = {}, car = {}) => ({
  seats: d.seats ?? d.numSeats ?? car.seats ?? "",
  fuel: String(d.fuelType ?? d.fuel ?? car.fuelType ?? car.fuel ?? ""),
  mileage: d.mileage ?? d.miles ?? car.mileage ?? car.miles ?? "",
  transmission: String(d.transmission ?? car.transmission ?? d.trans ?? ""),
});

// Extract car information from booking object
const extractCarInfo = (b) => {
  const snap =
    b.carSnapshot &&
      typeof b.carSnapshot === "object" &&
      Object.keys(b.carSnapshot).length
      ? b.carSnapshot
      : null;
  const car = snap || (b.car && typeof b.car === "object" ? b.car : null);

  if (car)
    return {
      title:
        `${car.make || ""} ${car.model || ""}`.trim() ||
        car.make ||
        car.model ||
        "",
      make: car.make || "",
      model: car.model || "",
      year: car.year ?? "",
      dailyRate: car.dailyRate ?? 0,
      seats: car.seats ?? "",
      transmission: car.transmission ?? "",
      fuel: car.fuelType ?? car.fuel ?? "",
      mileage: car.mileage ?? "",
      image: car.image || b.carImage || b.image || "",
    };

  return typeof b.car === "string"
    ? { title: b.car, image: b.carImage || b.image || "" }
    : {
      title: b.carName || b.vehicle || "",
      image: b.carImage || b.image || "",
    };
};

// Panel 
const Panel = ({ title, icon, children }) => (
  <div className='bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800'>
    <h3 className='text-md font-bold text-white mb-4 flex items-center'>
      {icon}
      <span className='mr-2 text-purple-400'>{title}</span>
    </h3>
    <div className='space-y-3'>{children}</div>
  </div>
);

const Detail = ({ icon, label, value }) => (
  <div className='flex items-start'>
    <div className='text-purple-400 mt-1 mr-3'>{icon}</div>
    <div className='flex-1'>
      <div className='text-xs text-gray-400'>{label}</div>
      <div className='text-sm font-medium text-white'>{value ?? ""}</div>
    </div>
  </div>
);

const Spec = ({ icon, label, value }) => (
  <div className='flex flex-col items-center bg-gradient-to-br from-gray-900/30 to-gray-900/10 p-3 rounded-xl border border-gray-800 hover:border-purple-500/50 transition-all'>
    <div className='text-xl mb-2 text-purple-400'>{icon}</div>
    <p className='text-xs text-gray-400'>{label}</p>
    <p className='font-semibold text-sm text-white'>{value ?? ""}</p>
  </div>
);

// Status Indicator with Edit Option
const StatusIndicator = ({ status, isEditing, newStatus, onStatusChange }) => {
  return isEditing ? (
    <select
      value={newStatus}
      onChange={onStatusChange}
      className='bg-gray-800/50 text-sm px-2 py-1 rounded focus:outline-none foucs:ring-1 foucs:ring-purple-500'>
      {Object.keys(statusConfig).filter((k) => k !== 'default').map((opt) => (
        <option value={opt} key={opt}>
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </option>
      ))}
    </select>
  ) : (
    <span className={BookingPageStyles.statusIndicator(status)}>
      <div className={BookingPageStyles.statusIcon(status)} />
      {String(status || "unknown")
        .charAt(0)
        .toUpperCase() + String(status || "unknown").slice(1)}
    </span>
  )
}

// Booking Card Header
const BookingCardHeader = ({ booking, onToggleDetails, isExpanded }) => {
  <div className='flex items-center mb-4 md:mb-0'>
    <div className='bg-gradient-to-br from-purple-800/50 to-indigo-800/50 p-3 rounded-xl mr-4'>
      <FaCalendarAlt className='text-purple-400 text-xl' />
    </div>
    <div>
      <div className='text-lg font-bold text-white'>
        {booking.customer || ''}
      </div>
      <div className='text-sm text-gray-400'>
        {booking.email || ''}
      </div>
    </div>

    <div className='flex items-center text-purple-400 ml-auto md:hidden'>
      <FaChevronDown className={`transition-transform durarion-300 ${isExpanded ? 'rotate-180' : ''}`}
      />
      <span className='ml-2 text-sm'>
        {isExpanded ? 'Hide Details' : 'Show Details'}
      </span>
    </div>
  </div>
}

// Booking Card Info
const BookingCardInfo = ({ booking, isEditing, newStatus, onStatusChange }) => (
  <div className='grid grid-cols-2 sm:grid-cols-4 gap-4'>
    <div className="text-center">
      <div className="text-xs text-gray-400">Car</div>
      <div className="text-sm font-medium text-white">
        {booking.car || ""}
      </div>
    </div>
    <div className="text-center">
      <div className='text-xs text-gray-400'>Pickup</div>
      <div className='text-sm font-medium text-white'>
        {formatDate(booking.pickupDate)}
      </div>
    </div>
    <div className="text-center">
      <div className='text-xs text-gray-400'>Amount</div>
      <div className='text-sm font-semibold text-purple-400'>${booking.amount}</div>
    </div>
    <div className="text-center">
      <div className='text-xs text-gray-400'>Status</div>
      <StatusIndicator
        status={booking.status}
        isEditing={isEditing}
        newStatus={newStatus}
        onStatusChange={onStatusChange}
      />
    </div>
  </div>
);

// Booking Card Actions
const BookingCardActions = ({
  isEditing,
  onEditStatus,
  onSaveStatus,
  onCancelEdit,
  onToggleDetails,
  isExpanded
}) => (
  <div className='flex justify-between items-center mt-4'>
    <div className='items-center text-purple-400 hidden md:flex'>
      <FaChevronDown className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
      <span className='ml-2 text-sm'>
        {isExpanded ? 'Hide Details' : 'Show Details'}
      </span>
    </div>

    <div className='flex space-x-3 ml-auto'>
      {isEditing ? (
        <>
          <button
            className={BookingPageStyles.bookingActionButton('green')}
            onClick={onSaveStatus}
          >
            Save
          </button>

          <button
            className={BookingPageStyles.bookingActionButton('green')}
            onClick={onCancelEdit}
          >
            Cancel
          </button>
        </>
      ) : (
        <button
          onClick={onEditStatus}
          className='bg-gradient-to-r from-purple-700/50 to-indigo-700/50 text-purple-300 hover:text-white text-sm px-3 py-1 rounded-lg flex items-center'
          title='Edit Status'
        >
          <FaEdit className='inline mr-1' /> Edit
        </button>
      )}
    </div>
  </div>
)

// Booking Card Details 
const BookingCardDetails = ({ booking }) => (
  <div className='border-t border-gray-800 p-5 bg-gradient-to-br from-gray-900/30 to-gray-900/10'>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
      <Panel
        title="Customer Details"
        icon={<FaUser className='mr-2 text-purple-400' />}
      >
        <Detail icon={<FaUser />} label="Full Name" value={booking.customer} />
        <Detail icon={<FaEnvelope />} label="Email" value={booking.email} />
        <Detail icon={<FaPhone />} label="Phone" value={booking.phone} />
      </Panel>

      <Panel
        title="Booking Details"
        icon={<FaCalendarAlt className='mr-2 text-purple-400' />}
      >
        <Detail
          icon={<FaCalendarAlt />}
          label="Pickup Date"
          value={formatDate(booking.pickupDate)}
        />
        <Detail
          icon={<FaCalendarAlt />}
          label="Return Date"
          value={formatDate(booking.returnDate)}
        />
        <Detail
          icon={<FaCalendarAlt />}
          label="Booking Date"
          value={formatDate(booking.bookingDate)}
        />
        <Detail
          icon={<FaCreditCard />}
          label="Total Amount"
          value={`₹${booking.amount}`}
        />
      </Panel>

      <Panel
        title="Address Details"
        icon={<FaMapMarkerAlt className='mr-2 text-purple-400' />}
      >
        <Detail
          icon={<FaMapMarkerAlt />}
          label="Street"
          value={booking.address.street}
        />
        <Detail icon={<FaCity />} label="City" value={booking.address.city} />
        <Detail
          icon={<FaGlobeAsia />}
          label="State"
          value={booking.address.state}
        />
        <Detail
          icon={<FaMapPin />}
          label="ZIP Code"
          value={booking.address.zipCode}
        />
      </Panel>

      <Panel
        title="Car Details"
        icon={<FaCar className='mr-2 text-purple-400' />}
      >
        <div className="flex items-center mb-4">
          <div className='bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl w-20 h-12 flex items-center justify-center'>
            <img
              src={makeImageUrl(booking.carImage)}
              alt={booking.car || "car image"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4">
            <div className='text-lg font-bold text-white'>
              {booking.car || ""}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Spec
            icon={<FaUserFriends />}
            label="Seats"
            value={booking.details.seats}
          />
          <Spec
            icon={<FaGasPump />}
            label="Fuel"
            value={booking.details.fuel}
          />
          <Spec
            icon={<FaTachometerAlt />}
            label="Mileage"
            value={booking.details.mileage}
          />
          <Spec
            icon={<FaCheckCircle />}
            label="Transmission"
            value={booking.details.transmission}
          />
        </div>
      </Panel>
    </div>
  </div>
);

// Booking Card
const BookingCard = ({
  booking, isExpanded, isEditing, newStatus, onToggleDetails, onEditStatus, onStatusChange, onSaveStatus, onCancelEdit
}) => (
  <div className='bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300'>
    <div className='p-5 cursor-pointer' onClick={onToggleDetails}>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
        <BookingCardHeader
          booking={booking}
          onToggleDetails={onToggleDetails}
          isExpanded={isExpanded}
        />

        <BookingCardInfo
          booking={booking}
          isEditing={isEditing}
          newStatus={newStatus}
          onStatusChange={onStatusChange}
        />
      </div>

      <BookingCardActions
        isEditing={isEditing}
        onEditStatus={onEditStatus}
        onSaveStatus={onSaveStatus}
        onCancelEdit={onCancelEdit}
        onToggleDetails={onToggleDetails}
        isExpanded={isExpanded}
      />
    </div>
    {isExpanded && <BookingCardDetails booking={booking} />}
  </div>
);

// Search and Filter Bar
const SearchFilterBar = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  totalBookings,
}) => (
  <div className='bg-gray-900/50 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-gray-800'>
    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
      <div>
        <label className='block text-sm font-medium text-gray-400 mb-2'>Search Bookings</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by customer, car, or email..."
            value={searchTerm}
            onChange={onSearchChange}
            className='bg-gray-800/50 border border-gray-700 w-full px-4 py-2.5 pl-10 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
          />
          <div className='absolute left-3 top-3 text-purple-500'>
            <FaSearch />
          </div>
        </div>
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-400 mb-2'>
          Filter by Status
        </label>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={onStatusChange}
            className='bg-gray-800/50 border border-gray-700 w-full px-4 py-2.5 pl-10 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500'
          >
            <option value="all">All Statuses</option>
            {Object.keys(statusConfig)
              .filter((k) => k !== "default")
              .map((opt) => (
                <option key={opt} value={opt}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </option>
              ))}
          </select>
          <div className='absolute left-3 top-3 text-purple-500'>
            <FaFilter />
          </div>
        </div>
      </div>

      <div className='bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg p-4 border border-purple-800/30 flex items-center justify-center'>
        <div className="text-center">
          <div className='text-gray-400 text-sm mb-1'>
            Total Bookings
          </div>
          <div className='text-2xl font-bold text-purple-400'>
            {totalBookings}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// No Bookings Views
const NoBookingsView = ({ onResetFilters }) => (
  <div className='bg-gradient-to-br from-gray-900/50 to-gray-900/30 backdrop-blur-sm text-center py-16 rounded-2xl border border-gray-800'>
    <div className='mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-purple-900/30 to-indigo-900/30 flex items-center justify-center mb-6'>
      <div className='bg-gradient-to-br from-purple-700 to-indigo-700 w-16 h-16 rounded-full flex items-center justify-center'>
        <FaSearch className='h-8 w-8 text-purple-300' />
      </div>
    </div>
    <h3 className='mt-4 text-xl font-medium text-white'>No Bookings Found</h3>
    <p className='mt-2 text-gray-400'>
      Try adjusting your search or filter criteria.
    </p>

    <button
      onClick={onResetFilters}
      className='mt-4 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white flex items-center mx-auto'>
      <FaSync className='mr-2' /> Reset Filter
    </button>
  </div>
)

// Backgroud Gradient 
const BackgroudGradient = () => (
  <div className='fixed inset-0 overflow-hidden pointer-events-none'>
    <div className='absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 blur-3xl opacity-10' />
    <div className='absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 blur-3xl opacity-10' />
    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rotate-45 bg-gradient-to-r from-purple-500 to-indigo-500 blur-xl opacity-10' />
  </div>
)

// Page Header
const PageHeader = () => (
  <div className='relative mb-8 pt-16 text-center'>
    <div className='absolute inset-x-0 top-0 flex justify-center'>
      <div className='h-1 w-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full' />
    </div>
    <h1 className='text-4xl font-extrabold py-4 text-white sm:text-5xl mb-3 tracking-wide'>
      <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-600'>
        Booking Dashboard
      </span>
    </h1>
    <p className='text-gray-400 max-w-2xl mx-auto'>
      Manage all bookings with detailed information and status updates.
    </p>
  </div>
)

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedBooking, setExpandedBooking] = useState(null);
  const [editingStatus, setEditingStatus] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  // FETCHING BOOKING FROM SERVER SIDE
  const fetchBookings = useCallback(async () => {
    try {
      const res = await api.get("/api/bookings?limit=200");
      const raw = Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.bookings || [];
      const mapped = raw.map((b, i) => {
        const id = b._id || b.id || `local-${i + 1}`;
        const carInfo = extractCarInfo(b);
        const details = normalizeDetails(b.details || {}, carInfo);
        return {
          id,
          _id: b._id || b.id || null,
          customer: b.customer || b.customerName || "",
          email: b.email || "",
          phone: b.phone || "",
          car: carInfo.title || "",
          carImage: carInfo.image || "",
          pickupDate: b.pickupDate || b.pickup || b.startDate || "",
          returnDate: b.returnDate || b.return || b.endDate || "",
          bookingDate: b.bookingDate || b.createdAt || "",
          status: (b.status || "pending").toString(),
          amount: b.amount ?? b.total ?? 0,
          details,
          address: {
            street:
              (b.address && (b.address.street || b.address.addressLine)) || "",
            city: (b.address && (b.address.city || "")) || "",
            state: (b.address && (b.address.state || "")) || "",
            zipCode:
              (b.address && (b.address.zipCode || b.address.postalCode)) || "",
          },
        };
      });
      setBookings(mapped);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      window.alert("Failed to load bookings from server.");
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings])

  const filteredBookings = useMemo(() => {
    const q = (searchTerm || '').toLowerCase().trim();
    const stringForSearch = (b) =>
      v === null || v === undefined ? '' : String(v).toLowerCase();

    return bookings.filter((b) => {
      const matchesSearch = !q ||
        stringForSearch(b.customer).includes(q) ||
        stringForSearch(b.car).includes(q) ||
        stringForSearch(b.email).includes(q);
      const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
  }, [bookings, searchTerm, statusFilter]);

  // UPDATE STATUS
  const updateStatus = async (id) => {
    try {
      const booking = bookings.find((b) => b.id === id || b._id === id);
      if (!booking || !booking._id) {
        setEditingStatus(null);
        setNewStatus("");
        return;
      }

      if (newStatus) {
        window.alert('Please select a status before saving.')
        return;
      }
      await api.patch(`/api/bookings/${booking._id}/status`, {
        status: newStatus,
      });

      setBookings((prev) =>
        prev.map((b) => b.id === id ? { ...b, status: newStatus } : b));
      setEditingStatus(null);
      setNewStatus("");
    }
    catch (err) {
      console.error('Failed to update status:', err)
      window.alert(err.response?.data?.message || 'Failed to update booking status.')
    }
  };

  // HANDLE TOGGLE DETAILS & EDITING  STATUS
  const handleToggleDetails = (id) =>
    setExpandedBooking(expandedBooking === id ? null : id);
  const handleEditStatus = (id, currentStatus) => {
    setEditingStatus(id);
    setNewStatus(currentStatus);
  };
  const handleCancelEdit = () => {
    setEditingStatus(null);
    setNewStatus("");
  };
  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  return (
    <div className='min-h-screen bg-gray-950 p-4 sm:p-6'>
      <BackgroudGradient />
      <PageHeader />

      <SearchFilterBar
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        statusFilter={statusFilter}
        onStatusChange={(e) => setStatusFilter(e.target.value)}
        totalBookings={bookings.length}
      />

      <div className='space-y-4'>
        {filteredBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            isExpanded={expandedBooking === booking.id}
            isEditing={editingStatus === booking.id}
            newStatus={newStatus}
            onToggleDetails={() => handleToggleDetails(booking.id)}
            onEditStatus={(e) => {
              e.stopPropagation();
              handleEditStatus(booking.id, booking.status)
            }}
            onStatusChange={(e) => setNewStatus(e.target.value)}
            onSaveStatus={(e) => {
              e.stopPropagation();
              updateStatus(booking.id);
            }}
            onCancelEdit={(e) => {
              e.stopPropagation();
              handleCancelEdit();
            }}
          />
        ))}

        {filteredBookings.length === 0 && (
          <NoBookingsView onResetFilters={handleResetFilters} />
        )}
      </div>
    </div>
  )
}

export default Booking
