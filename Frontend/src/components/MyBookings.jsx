import React, { useState, useEffect, useCallback, useMemo, useRef, } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  FaCar, FaCalendarAlt, FaMapMarkerAlt, FaFilter, FaTimes, FaCheckCircle, FaClock, FaTimesCircle, FaUser,
  FaCreditCard, FaReceipt, FaArrowRight,
} from "react-icons/fa";
import { myBookingsStyles as s } from "../assets/dummyStyles";

const API_BASE = "https://luxeride-rantals.onrender.com"; // Change this to your backend URL
const TIMEOUT = 15000;

// ---------- Helpers ----------
const safeAccess = (fn, fallback = "") => {
  try {
    const v = fn();
    return v === undefined || v === null ? fallback : v;
  } catch {
    return fallback;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const d = new Date(dateString);
  return Number.isNaN(d.getTime())
    ? String(dateString)
    : d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
};

const formatPrice = (price) => {
  const num = typeof price === "number" ? price : Number(price) || 0;
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
};

const daysBetween = (start, end) => {
  try {
    const a = new Date(start);
    const b = new Date(end);
    if (Number.isNaN(a) || Number.isNaN(b)) return 0;
    return Math.ceil((b - a) / (1000 * 60 * 60 * 24));
  } catch {
    return 0;
  }
};

const normalizeBooking = (booking) => {
  const getCarData = () => {
    if (!booking) return {};
    if (typeof booking.car === "string") return { name: booking.car };
    if (booking.car && typeof booking.car === "object") {
      const snapshot = { ...booking.car };
      if (snapshot.id && typeof snapshot.id === "object") {
        const populated = { ...snapshot.id };
        delete snapshot.id;
        return { ...snapshot, ...populated };
      }
      return snapshot;
    }
    return {};
  };

  const carObj = getCarData();
  const details = booking.details || {};
  const address = booking.address || {};

  const image =
    safeAccess(() => booking.carImage) ||
    safeAccess(() => carObj.image) ||
    "https://via.placeholder.com/800x450.png?text=No+Image";

  const pickupDate =
    safeAccess(() => booking.pickupDate) ||
    safeAccess(() => booking.dates?.pickup) ||
    booking.pickup ||
    null;

  const returnDate =
    safeAccess(() => booking.returnDate) ||
    safeAccess(() => booking.dates?.return) ||
    booking.return ||
    null;

  const normalized = {
    id: booking._id || booking.id || String(Math.random()).slice(2, 8),
    car: {
      make: carObj.make || carObj.name || "Unnamed Car",
      image,
      year: carObj.year || carObj.modelYear || "",
      category: carObj.category,
      seats: details.seats || carObj.seats || 4,
      transmission:
        details.transmission || carObj.transmission || carObj.gearbox || "",
      fuelType:
        details.fuelType ||
        details.fuel ||
        carObj.fuelType ||
        carObj.fuel ||
        carObj.fuel_type ||
        "",
      mileage:
        details.mileage || carObj.mileage || carObj.kmpl || carObj.mpg || "",
    },
    user: {
      name: booking.customer || safeAccess(() => booking.user?.name) || "Guest",
      email: booking.email || safeAccess(() => booking.user?.email) || "",
      phone: booking.phone || safeAccess(() => booking.user?.phone) || "",
      address:
        address.street || address.city || address.state
          ? `${address.street || ""}${address.city ? ", " + address.city : ""}${address.state ? ", " + address.state : ""
          }`
          : safeAccess(() => booking.user?.address) || "",
    },
    dates: { pickup: pickupDate, return: returnDate },
    location:
      address.city || booking.location || carObj.location || "Pickup location",
    price: Number(booking.amount || booking.price || booking.total || 0),
    status:
      booking.status ||
      (booking.paymentStatus === "paid" ? "active" : "") ||
      (booking.paymentStatus === "pending" ? "pending" : "") ||
      "pending",
    bookingDate:
      booking.bookingDate ||
      booking.createdAt ||
      booking.updatedAt ||
      Date.now(),
    paymentMethod: booking.paymentMethod || booking.payment?.method || "",
    paymentId:
      booking.paymentIntentId || booking.paymentId || booking.sessionId || "",
    raw: booking,
  };

  // derive completed/upcoming from return date
  try {
    const now = new Date();
    const _return = new Date(normalized.dates.return);
    if (normalized.status === "active" || normalized.status === "pending") {
      normalized.status = _return > now ? "upcoming" : "completed";
    }
  } catch {
    normalized.status = normalized.status || "upcoming";
  }
  // setBookings(normalized)

  return normalized;
};

// ---------- Small presentational components ----------
const FilterButton = ({ filterKey, currentFilter, icon, label, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(filterKey)}
    className={s.filterButton(currentFilter === filterKey, filterKey)}
  >
    {icon} {label}
  </button>
);

const StatusBadge = ({ status }) => {
  const map = {
    completed: {
      text: "Completed",
      color: "bg-green-500",
      icon: <FaCheckCircle />,
    },
    upcoming: { text: "Upcoming", color: "bg-blue-500", icon: <FaClock /> },
    cancelled: {
      text: "Cancelled",
      color: "bg-red-500",
      icon: <FaTimesCircle />,
    },
    default: { text: "Unknown", color: "bg-gray-500", icon: null },
  };
  const { text, color, icon } = map[status] || map.default;
  return (
    <div
      className={`${color} text-white px-3 py-1 rounded-full inline-flex items-center gap-2 text-sm`}
    >
      {icon}
      <span>{text}</span>
    </div>
  );
};

const BookingCard = ({ booking, onViewDetails }) => {
  const days = daysBetween(booking.dates.pickup, booking.dates.return);
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl overflow-hidden border border-gray-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-transform">
      <div className="relative h-48 overflow-hidden">
        <img
          src={booking.car.image}
          alt={booking.car.make}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold">{booking.car.make}</h3>
            <p className="text-gray-400">
              {booking.car.category} â€¢ {booking.car.year}
            </p>
          </div>
          <div className="text-right">
            <p className="text-purple-400 font-bold text-xl">{formatPrice(booking.price)}</p>
            <p className="text-gray-500 text-sm">
              for {days} {days > 1 ? "days" : "day"}
            </p>
          </div>
        </div>

        <StatusBadge status={booking.status} />

        <div className="space-y-4 mt-2 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-purple-400">
              <FaCalendarAlt />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Dates</p>
              <p className="font-medium">
                {formatDate(booking.dates.pickup)} -{" "}
                {formatDate(booking.dates.return)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center text-purple-400">
              <FaMapMarkerAlt />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Pickup Location</p>
              <p className="font-medium">{booking.location}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-700 flex gap-3">
          <button
            type="button"
            onClick={() => onViewDetails(booking)}
            className="flex-1 py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center gap-2"
          >
            <FaReceipt /> View Details
          </button>
          <Link to="/cars" className="flex-1 py-2 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg flex items-center justify-center gap-2">
            <FaCar />
            {booking.status === "upcoming" ? "Modify" : "Book Again"}
          </Link>
        </div>
      </div>
    </div>
  );
};

const BookingModal = ({ booking, onClose, onCancel }) => {
  const days = daysBetween(booking.dates.pickup, booking.dates.return);
  const pricePerDay = days > 0 ? booking.price / days : booking.price;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaReceipt className="text-purple-400" /> Booking Details
            </h2>
            <div className="flex items-center gap-2">
              {booking.status === "upcoming" && (
                <button
                  type="button"
                  onClick={() => onCancel(booking.id)}
                  className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white mr-2"
                >
                  Cancel Booking
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <img
                src={booking.car.image}
                alt={booking.car.make}
                className="w-full h-48 object-cover rounded-xl"
              />
            </div>

            <div>
              <h3 className="text-xl font-bold">{booking.car.make}</h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 bg-gray-700 rounded text-sm">{booking.car.category}</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-sm">{booking.car.year}</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-sm">{booking.car.seats} seats</span>
                <span className="px-2 py-1 bg-gray-700 rounded text-sm">{booking.car.transmission}</span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-gray-400 text-sm">Fuel Type</p>
                  <p className="font-medium">{booking.car.fuelType}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Mileage</p>
                  <p className="font-medium">{booking.car.mileage}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Price per day</p>
                  <p className="font-medium">{formatPrice(pricePerDay)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Price</p>
                  <p className="font-medium">{formatPrice(booking.price)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <FaCalendarAlt className="text-purple-400" /> Booking Dates
              </h3>
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <div className="flex justify-between mb-2">
                  <p className="text-gray-400 text-sm">Pickup Date:</p>
                  <p className="font-medium">
                    {formatDate(booking.dates.pickup)}
                  </p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-400 text-sm">Return Date:</p>
                  <p className="font-medium">
                    {formatDate(booking.dates.return)}
                  </p>
                </div>
                <div className={`flex justify-between mb-2 mt-3 pt-3 border-t border-gray-700`}>
                  <p className="text-gray-400 text-sm">Duration:</p>
                  <p className="font-medium">{days} days</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold flex items-center gap-2 mt-6">
                <FaMapMarkerAlt className="text-purple-400" /> Location Details
              </h3>
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <p className="text-gray-400 text-sm">Pickup Location:</p>
                <p className="font-medium">{booking.location}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 mt-6">
                <FaUser className="text-purple-400" /> User Information
              </h3>
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <div className="mb-3">
                  <p className="text-gray-400 text-sm">Full Name:</p>
                  <p className="font-medium">{booking.user.name}</p>
                </div>
                <div className="mb-3">
                  <p className="text-gray-400 text-sm">Email:</p>
                  <p className="font-medium">{booking.user.email}</p>
                </div>
                <div className="mb-3">
                  <p className="text-gray-400 text-sm">Phone:</p>
                  <p className="font-medium">{booking.user.phone}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Address:</p>
                  <p className="font-medium">{booking.user.address}</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold flex items-center gap-2 mt-6">
                <FaCreditCard className="text-purple-400" /> Payment Details
              </h3>
              <div className="bg-gray-800/50 p-4 rounded-xl">
                <div className="mb-3">
                  <p className="text-gray-400 text-sm">Payment Method:</p>
                  <p className="font-medium">
                    {booking.paymentMethod || "â€”"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Transaction ID:</p>
                  <p className="font-medium">
                    {booking.paymentId || booking.raw?.sessionId || "â€”"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-xl mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Booking Status:</p>
                <StatusBadge status={booking.status} />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Booking Date:</p>
                <p className="font-medium">{formatDate(booking.bookingDate)}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg">
              Close
            </button>
            <Link to="/cars" onClick={onClose} className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-lg flex items-center justify-center gap-2">
              Book Again <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------- Main page ----------
const StatsCard = ({ value, label, color }) => (
  <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700">
    <div className={s.statsValue(color)}>{value}</div>
    <p className="text-gray-400">{label}</p>
  </div>
);

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);

  const isMounted = useRef(true);
  useEffect(() => () => (isMounted.current = false), []);

  // FETCH BOOKINGS FROM THE BACKEND
  const fetchBookings = useCallback(async () => {
    setError(null);
    setLoading(true);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const token = localStorage.getItem("token");
      // console.log("Using token:", token)

      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await axios.get(`${API_BASE}/api/bookings/mybooking`, {
        headers,
        signal: controller.signal,
      });

      const rawData = Array.isArray(response.data)
        ? response.data
        : response.data?.data ||
        response.data?.bookings ||
        response.data?.rows ||
        response.data ||
        [];

      const normalized = (Array.isArray(rawData) ? rawData : []).map(
        normalizeBooking
      );

      if (!isMounted.current) return;
      setBookings(normalized);
      setLoading(false);
    } catch (err) {
      if (!isMounted.current) return;
      if (err?.name === "CanceledError" || err?.message === "canceled") {
        setError("Request cancelled / timed out");
      } else {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Failed to load bookings"
        );
      }
      setLoading(false);
    } finally {
      clearTimeout(timeoutId);
      if (isMounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const cancelBooking = useCallback(
    async (bookingId) => {
      if (!window.confirm("Are you sure you want to cancel this booking?"))
        return;
      try {
        const token = localStorage.getItem("token");
        const headers = {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        };
        const response = await axios.patch(
          `${API_BASE}/api/bookings/${bookingId}/status`,
          { status: "cancelled" },
          { headers }
        );

        const updated = normalizeBooking(
          response.data ||
          response.data?.data || { _id: bookingId, status: "cancelled" }
        );
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? updated : b))
        );
        if (selectedBooking?.id === bookingId) setSelectedBooking(updated);
      } catch (err) {
        alert(
          err.response?.data?.message ||
          err.message ||
          "Failed to cancel booking"
        );
      }
    },
    [selectedBooking]
  );

  const filteredBookings = useMemo(
    () =>
      filter === "all" ? bookings : bookings.filter((b) => b.status === filter),
    [bookings, filter]
  );

  const filterButtons = [
    { key: "all", label: "All Bookings", icon: <FaFilter /> },
    { key: "upcoming", label: "Upcoming", icon: <FaClock /> },
    { key: "completed", label: "Completed", icon: <FaCheckCircle /> },
    { key: "cancelled", label: "Cancelled", icon: <FaTimes /> },
  ];

  const openDetails = (b) => {
    setSelectedBooking(b);
    setShowModal(true);
  };
  const closeModal = () => {
    setSelectedBooking(null);
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b pt-40 from-gray-900 to-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl pb-3 md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-600">My Bookings</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            View and manage all your current and past car rental bookings
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {filterButtons.map((btn) => (
            <FilterButton
              key={btn.key}
              filterKey={btn.key}
              currentFilter={filter}
              icon={btn.icon}
              label={btn.label}
              onClick={setFilter}
            />
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500" />
          </div>
        )}

        {!loading && error && (
          <div className="text-center py-8 bg-gray-800/50 rounded-2xl border border-gray-700">
            <p className="text-red-400">{error}</p>
            <button
              type="button"
              onClick={fetchBookings}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && filteredBookings.length === 0 && (
          <div className="text-center py-16 bg-gray-800/50 rounded-2xl border border-gray-700">
            <div className="mx-auto w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-6">
              <FaCar className="text-4xl text-purple-500" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No bookings found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {filter === "all"
                ? "You haven't made any bookings yet. Browse our collection to get started!"
                : `You don't have any ${filter} bookings.`}
            </p>
            <Link to="/cars" className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 bg-purple-600 hover:bg-purple-500 text-white rounded-lg flex items-center justify-center gap-2">
              <FaCar /> Browse Cars
            </Link>
          </div>
        )}

        {!loading && !error && filteredBookings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onViewDetails={openDetails}
              />
            ))}
          </div>
        )}

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            value={bookings.length}
            label="Total Bookings"
            color="text-orange-400"
          />
          <StatsCard
            value={bookings.filter((b) => b.status === "completed").length}
            label="Completed Trips"
            color="text-green-400"
          />
          <StatsCard
            value={bookings.filter((b) => b.status === "upcoming").length}
            label="Upcoming Trips"
            color="text-blue-400"
          />
        </div>
      </div>

      {showModal && selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={closeModal}
          onCancel={cancelBooking}
        />
      )}
    </div>
  );
};

export default MyBookings;
