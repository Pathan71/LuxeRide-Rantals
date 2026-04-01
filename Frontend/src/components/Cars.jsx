import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCar,
  FaGasPump,
  FaArrowRight,
  FaTachometerAlt,
  FaUserFriends,
  FaShieldAlt,
} from "react-icons/fa";
import axios from "axios";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const startOfDay = (d) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
// ceil so partial days count as next day
const daysBetween = (from, to) =>
  Math.ceil((startOfDay(to) - startOfDay(from)) / MS_PER_DAY);

const Cars = () => {
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const abortControllerRef = useRef(null);
  const base = "http://localhost:5000";
  const limit = 12;
  const fallbackImage = `${base}/uploads/default-car.png`;

  useEffect(() => {
    fetchCars();
    return () => {
      if (abortControllerRef.current) {
        try {
          abortControllerRef.current.abort();
        } catch (e) {
        }
      }
    };
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    setError("");
    if (abortControllerRef.current) {
      try {
        abortControllerRef.current.abort();
      } catch (e) { }
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await axios.get(`${base}/api/cars`, {
        params: { limit },
        signal: controller.signal,
        headers: { Accept: "application/json" },
      });

      const json = res.data;
      setCars(Array.isArray(json.data) ? json.data : json.data ?? json);
    } catch (err) {
      const isCanceled =
        err?.code === "ERR_CANCELED" ||
        (axios.isCancel && axios.isCancel(err)) ||
        err?.name === "CanceledError";
      if (isCanceled) return;

      console.error("Failed to fetch cars:", err);
      setError(
        err?.response?.data?.message || err.message || "Failed to load cars"
      );
    } finally {
      setLoading(false);
    }
  };

  const buildImageSrc = (image) => {
    if (!image) return "";
    if (Array.isArray(image)) image = image[0];
    if (typeof image !== "string") return "";

    const trimmed = image.trim();
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      return trimmed;
    }
    if (trimmed.startsWith("/")) {
      return `${base}${trimmed}`;
    }
    return `${base}/uploads/${trimmed}`;
  };

  const handleImageError = (e) => {
    const img = e?.target;
    if (!img) return;
    // prevent infinite loop if fallback also fails
    img.onerror = null;
    img.src = fallbackImage;
    img.alt = img.alt || "Image not available";
    img.style.objectFit = img.style.objectFit || "cover";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const opts =
        d.getFullYear() === now.getFullYear()
          ? { day: "numeric", month: "short" }
          : { day: "numeric", month: "short", year: "numeric" };
      return new Intl.DateTimeFormat("en-IN", opts).format(d);
    } catch {
      return dateStr;
    }
  };

  // SIMILAR TO HOMECARS.JSX

  const plural = (n, singular, pluralForm) => {
    if (n === 1) return `1 ${singular}`;
    return `${n} ${pluralForm ?? singular + "s"}`;
  };

  // Compute canonical availability:
  // - prefer car.bookings (if present): find any booking that covers today -> booked until booking.return
  // - otherwise fallback to car.availability provided by backend
  const computeEffectiveAvailability = (car) => {
    const today = new Date();

    if (Array.isArray(car.bookings) && car.bookings.length) {
      const overlapping = car.bookings
        .map((b) => {
          const pickup = b.pickupDate ?? b.startDate ?? b.start ?? b.from;
          const ret = b.returnDate ?? b.endDate ?? b.end ?? b.to;
          if (!pickup || !ret) return null;
          return { pickup: new Date(pickup), return: new Date(ret), raw: b };
        })
        .filter(Boolean)
        .filter(
          (b) =>
            startOfDay(b.pickup) <= startOfDay(today) &&
            startOfDay(today) <= startOfDay(b.return)
        );

      if (overlapping.length > 0) {
        overlapping.sort((a, b) => b.return - a.return);
        return {
          state: "booked",
          until: overlapping[0].return.toISOString(),
          source: "bookings",
        };
      }
    }

    if (car.availability) {
      if (car.availability.state === "booked" && car.availability.until) {
        return {
          state: "booked",
          until: car.availability.until,
          source: "availability",
        };
      }

      if (
        car.availability.state === "available_until_reservation" &&
        Number(car.availability.daysAvailable ?? -1) === 0
      ) {
        // reservation starts today -> treat as booked
        return {
          state: "booked",
          until: car.availability.until ?? null,
          source: "availability-res-starts-today",
          nextBookingStarts: car.availability.nextBookingStarts,
        };
      }

      return { ...car.availability, source: "availability" };
    }

    return { state: "fully_available", source: "none" };
  };

  // Given an 'until' ISO date, compute day-after available date + daysUntilAvailable
  const computeAvailableMeta = (untilIso) => {
    if (!untilIso) return null;
    try {
      const until = new Date(untilIso);
      const available = new Date(until);
      available.setDate(available.getDate() + 1);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const daysUntilAvailable = daysBetween(today, available);
      return { availableIso: available.toISOString(), daysUntilAvailable };
    } catch {
      return null;
    }
  };

  // Render availability badge — prefer showing concrete available date when booked
  const renderAvailabilityBadge = (rawAvailability, car) => {
    const effective = computeEffectiveAvailability(car);

    if (!effective) {
      return (
        <span className="px-2 py-1 text-xs rounded-md bg-green-50 text-green-700">
          Available
        </span>
      );
    }

    if (effective.state === "booked") {
      if (effective.until) {
        const meta = computeAvailableMeta(effective.until);
        if (meta && meta.availableIso) {
          return (
            <div className="flex flex-col items-end">
              <span className="px-2 py-1 text-xs rounded-md bg-red-50 text-red-700 font-semibold">
                Booked — available on {formatDate(meta.availableIso)}
              </span>
              <small className="text-xs text-gray-400 mt-1">
                until {formatDate(effective.until)}
              </small>
            </div>
          );
        }
        return (
          <div className="flex flex-col items-end">
            <span className="px-2 py-1 text-xs rounded-md bg-red-50 text-red-700 font-semibold">
              Booked
            </span>
            <small className="text-xs text-gray-400 mt-1">
              until {formatDate(effective.until)}
            </small>
          </div>
        );
      }
      // booked but no until info
      return (
        <div className="flex flex-col items-end">
          <span className="px-2 py-1 text-xs rounded-md bg-red-50 text-red-700 font-semibold">
            Booked
          </span>
        </div>
      );
    }

    if (effective.state === "available_until_reservation") {
      const days = Number(effective.daysAvailable ?? -1);
      if (!Number.isFinite(days) || days < 0) {
        return (
          <div className="flex flex-col items-end">
            <span className="px-2 py-1 text-xs rounded-md bg-amber-50 text-amber-800 font-semibold">
              Available
            </span>
            {effective.nextBookingStarts && (
              <small className="text-xs text-gray-400 mt-1">
                from {formatDate(effective.nextBookingStarts)}
              </small>
            )}
          </div>
        );
      }
      if (days === 0) {
        return (
          <div className="flex flex-col items-end">
            <span className="px-2 py-1 text-xs rounded-md bg-red-50 text-red-700 font-semibold">
              Booked — starts today
            </span>
            {effective.nextBookingStarts && (
              <small className="text-xs text-gray-400 mt-1">
                from {formatDate(effective.nextBookingStarts)}
              </small>
            )}
          </div>
        );
      }
      return (
        <div className="flex flex-col items-end">
          <span className="px-2 py-1 text-xs rounded-md bg-amber-50 text-amber-800 font-semibold">
            Available — reserved in {plural(days, "day")}
          </span>
          {effective.nextBookingStarts && (
            <small className="text-xs text-gray-400 mt-1">
              from {formatDate(effective.nextBookingStarts)}
            </small>
          )}
        </div>
      );
    }

    // fully_available or fallback
    return (
      <span className="px-2 py-1 text-xs rounded-md bg-green-50 text-green-700">
        Available
      </span>
    );
  };

  const isBookDisabled = (car) => {
    const effective = computeEffectiveAvailability(car);
    if (car?.status && car.status !== "available") return true;
    if (!effective) return false;
    return effective.state === "booked";
  };

  // ALL FUNCTIONALITY SEMILAR TO HOMECARS
  const handleBook = (car, id) => {
    const disabled = isBookDisabled(car);
    if (disabled) return;
    navigate(`/cars/${id}`, { state: { car } });
  };

  // IT IS PART OF UI
  return (
    <div className="relative min-h-screen py-8 pt-12 sm:py-12 md:py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-gray-950 to-black">
      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 pt-13 md:mb-16">
          <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600"></div>
          <h1 className="relative text-3xl sm:text-4xl md:text-5xl font-bold mb-2 z-10 font-['Pacifico'] bg-gradient-to-r from-purple-400 via-indigo-500  to-purple-600 bg-clip-text text-transparent">
            Premium Car Collection
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            Discover our exclusive fleet of luxury vehicles. Each car is
            meticulously maintained and ready for your journey.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          {loading &&
            // show skeleton placeholders when loading
            Array.from({ length: limit }).map((_, i) => (
              <div key={`skeleton-${i}`} className="group relative rounded-2xl overflow-hidden border border-slate-700 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                  <div className="w-full h-full bg-gray-200 animate-pulse" />
                </div>
                <div className="p-4 sm:p-5 md:p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="h-10 bg-gray-200 rounded mt-4 animate-pulse" />
                </div>
              </div>
            ))}

          {!loading && error && (
            <div className="col-span-full text-center text-red-600">
              {error}
            </div>
          )}

          {!loading && !error && cars.length === 0 && (
            <div className="col-span-full text-center">No cars available.</div>
          )}

          {!loading &&
            cars.map((car, idx) => {
              const id = car._id ?? car.id ?? idx;
              const carName =
                `${car.make || car.name || ""} ${car.model || ""}`.trim() ||
                car.name ||
                "Unnamed";
              const imageSrc = buildImageSrc(car.image) || fallbackImage;
              const disabled = isBookDisabled(car);

              return (
                <div key={id} className="group relative rounded-2xl overflow-hidden border border-slate-700 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                  <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden">
                    <div className="absolute inset-0 z-10" />
                    <img
                      src={imageSrc}
                      alt={carName}
                      onError={handleImageError}
                      className="w-full h-full object-cover transition-transform duration-500"
                    />

                    {/* availability badge at top-right of card */}
                    <div className="absolute right-4 top-4 z-20">
                      {renderAvailabilityBadge(car.availability, car)}
                    </div>

                    <div className="absolute bottom-3 left-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium shadow-lg">
                      ₹{car.dailyRate ?? car.price ?? car.pricePerDay ?? "—"}
                      /day
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 md:p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">{carName}</h3>
                        <p className="text-sm text-purple-400">
                          {car.category ?? car.type ?? "Sedan"}
                        </p>
                      </div>
                    </div>
                    {/* IMAGE HERE */}

                    {/* CARS DETAILS */}
                    <div className="grid grid-cols-2 gap-3 mb-5 text-sm text-slate-300">
                      <div className="flex items-center space-x-2">
                        <div className="bg-slate-700 p-1.5 rounded-lg">
                          <FaUserFriends className="text-sky-400" />
                        </div>
                        <span>{car.seats ?? "4"} Seats</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="bg-slate-700 p-1.5 rounded-lg">
                          <FaGasPump className="text-amber-400" />
                        </div>
                        <span>{car.fuelType ?? car.fuel ?? "Gasoline"}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="bg-slate-700 p-1.5 rounded-lg">
                          <FaTachometerAlt className="text-emerald-400" />
                        </div>
                        <span>{car.mileage ? `${car.mileage} kmpl` : "—"}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="bg-slate-700 p-1.5 rounded-lg">
                          <FaShieldAlt className="text-purple-400" />
                        </div>
                        <span>Premium</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleBook(car, id)}
                      className={`bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/20 inline-flex items-center gap-3 px-5 py-3 rounded-lg font-medium transform-gpu hover:scale-[1.03] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-purple-300 cursor-pointer ${disabled ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      aria-label={`Book ${carName}`}
                      title={
                        disabled
                          ? "This car is currently booked or unavailable"
                          : `Book ${carName}`
                      }
                      disabled={disabled}
                    >
                      <span className="group-hover:tracking-wider transition-all">
                        {disabled ? "Unavailable" : "Book Now"}
                      </span>
                      <FaArrowRight className="ml-3 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Floating decorative elements */}
        <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-gradient-to-r from-sky-500/10 to-teal-500/10 blur-3xl z-0"></div>
        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-r from-amber-500/10 to-rose-500/10 blur-3xl z-0"></div>
      </div>
    </div>
  );
};

export default Cars;