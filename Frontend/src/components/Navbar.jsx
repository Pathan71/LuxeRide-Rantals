// src/components/Navbar.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/logocar.png";
import axios from "axios";

const LOGOUT_ENDPOINT = "/api/auth/logout";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(
        () => !!localStorage.getItem("token")
    );
    const [user, setUser] = useState(() => {
        try {
            const raw = localStorage.getItem("user");
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const abortRef = useRef(null);

    const base = "https://luxeride-rantals.onrender.com";
    const api = axios.create({
        baseURL: base,
        headers: { Accept: "application/json" },
    });

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/cars", label: "Cars" },
        { to: "/contact", label: "Contact" },
        { to: "/bookings", label: "My Bookings" },
    ];

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const validateToken = useCallback(
        async (signal) => {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoggedIn(false);
                setUser(null);
                return;
            }

            try {
                const res = await api.get(ME_ENDPOINT, {
                    signal,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const profile = res?.data?.user ?? res?.data ?? null;
                if (profile) {
                    setIsLoggedIn(true);
                    setUser(profile);
                    try {
                        localStorage.setItem("user", JSON.stringify(profile));
                    } catch { }
                } else {
                    setIsLoggedIn(true);
                    setUser(null);
                }
            } catch (err) {
                if (
                    axios.isAxiosError(err) &&
                    err.response &&
                    err.response.status === 401
                ) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    setIsLoggedIn(false);
                    setUser(null);
                } else {
                    setUser(null);
                }
            }
        },
        [api]
    );

    useEffect(() => {
        if (abortRef.current) {
            try {
                abortRef.current.abort();
            } catch { }
        }
        const controller = new AbortController();
        abortRef.current = controller;
        validateToken(controller.signal);

        return () => {
            try {
                controller.abort();
            } catch { }
            abortRef.current = null;
        };
    }, [validateToken]);

    useEffect(() => {
        const handleStorageChange = (ev) => {
            if (ev.key === "token" || ev.key === "user") {
                if (abortRef.current) {
                    try {
                        abortRef.current.abort();
                    } catch { }
                }
                const controller = new AbortController();
                abortRef.current = controller;
                validateToken(controller.signal);
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [validateToken]);

    const handleLogout = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                await api.post(
                    LOGOUT_ENDPOINT,
                    {},
                    {
                        headers: { Authorization: `Bearer ${token}` },
                        timeout: 2000,
                    }
                );
            } catch { }
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        setUser(null);
        setIsOpen(false);

        navigate("/", { replace: true });
    }, [api, navigate]);

    useEffect(() => {
        setIsOpen(false);
        setIsLoggedIn(!!localStorage.getItem("token"));
        try {
            const raw = localStorage.getItem("user");
            setUser(raw ? JSON.parse(raw) : null);
        } catch {
            setUser(null);
        }
    }, [location]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                isOpen &&
                menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(event.target) &&
                !buttonRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape" && isOpen) setIsOpen(false);
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [isOpen]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) setIsOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const isActive = (path) => {
        if (path === "/") return location.pathname === "/";
        return location.pathname.startsWith(path);
    };

    return (
        <nav
            className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"
                }`}
            aria-label="Main navigation"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center">
                    <div
                        className={`bg-white/95 backdrop-blur-md w-full rounded-full shadow-lg border border-gray-200 transition-all duration-300 ${scrolled
                                ? "py-2 px-4 md:px-6"
                                : "py-3 px-5 md:px-8"
                            }`}
                        role="region"
                        aria-roledescription="navigation"
                    >
                        <div className="flex items-center justify-between gap-4">
                            <Link to="/" className="flex items-center">
                                <div className="flex flex-col items-center text-xl md:text-2xl lg:text-2xl leading-none">
                                    <img
                                        src={logo}
                                        alt="Karzone logo"
                                        className="h-[1em] w-auto block"
                                        style={{ display: "block", objectFit: "contain" }}
                                    />
                                    <span className="font-bold tracking-wider text-gray-900">LUXERIDE</span>
                                </div>
                            </Link>

                            <div className="hidden md:flex md:items-center md:justify-center md:flex-1">
                                <div className="flex items-center space-x-2 md:space-x-4 lg:space-x-6">
                                    {navLinks.map((link, index) => (
                                        <React.Fragment key={link.to}>
                                            <Link
                                                to={link.to}
                                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.to)
                                                        ? "text-purple-600 underline underline-offset-4"
                                                        : "text-gray-700 hover:text-purple-500"
                                                    }`}
                                            >
                                                {link.label}
                                            </Link>

                                            {index < navLinks.length - 1 && (
                                                <div className="hidden md:block h-6 w-px bg-gray-300 mx-2" aria-hidden="true" />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            <div className="hidden md:flex md:items-center md:justify-end md:gap-4">
                                {isLoggedIn ? (
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 rounded-md px-3 py-2"
                                        aria-label="Logout"
                                        title={user?.name || "Logout"}
                                    >
                                        <FaSignOutAlt className="text-base" />
                                        <span className="text-sm font-medium">Logout</span>
                                    </button>
                                ) : (
                                    <Link
                                        to="/login"
                                        className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-purple-500 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-300 rounded-md px-3 py-2"
                                        aria-label="Login"
                                    >
                                        <FaUser className="text-base" />
                                        <span className="text-sm font-medium">Login</span>
                                    </Link>
                                )}
                            </div>

                            <div className="md:hidden flex items-center">
                                <button
                                    ref={buttonRef}
                                    onClick={() => setIsOpen((p) => !p)}
                                    className="p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    aria-expanded={isOpen}
                                    aria-controls="mobile-menu"
                                    aria-label={isOpen ? "Close menu" : "Open menu"}
                                >
                                    {isOpen ? (
                                        <FaTimes className="h-5 w-5" />
                                    ) : (
                                        <FaBars className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                id="mobile-menu"
                ref={menuRef}
                className={`md:hidden transition-all duration-200 overflow-hidden ${isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
                    }`}
                aria-hidden={!isOpen}
            >
                <div className="bg-white border-t border-gray-200 shadow-lg mt-2 rounded-b-lg mx-3">
                    <div className="px-4 pt-3 pb-4 space-y-2">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setIsOpen(false)}
                                    className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(link.to)
                                            ? "bg-gray-50 text-purple-600"
                                            : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 my-1" />

                        <div className="pt-1">
                            {isLoggedIn ? (
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <FaSignOutAlt className="mr-3 text-base" />
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full flex items-center px-4 py-3 text-left rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <FaUser className="mr-3 text-base" />
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;