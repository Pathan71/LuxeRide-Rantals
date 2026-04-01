import React, { useEffect, useState } from 'react'
import logo from '../assets/logocar.png'
import { FaArrowLeft, FaCheck, FaEnvelope, FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "", email: "", password: ""
    });
    const [showPasword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setIsActive(true)
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!acceptedTerms) {
            toast.error("Please accept terms & conditions", { them: "dark" })
        }
        setLoading(true);

        try {
            const base = 'http://localhost:5000';
            const url = `${base}/api/auth/register`;

            const res = await axios.post(url, formData, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.status >= 200 && res.status < 300) {
                const { token, user } = res.data || {};

                if (token) localStorage.setItem('token', token);
                if (user) localStorage.setItem('user', JSON.stringify(user));

                toast.success('Account created successfully! Welcome to PremiumDrive', {
                    position: "top-right",
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'dark',
                    autoClose: 1200,
                    onClose: () => navigate('/login')
                });
                setLoading(false)
                return;
            }
            toast.error('Unexpected server response during resgiteration.', {
                dark: 'dark'
            })
        }
        catch (err) {
            // Detailed axios error handling
            console.error("Signup error (frontend):", err);

            if (err.response) {
                // Server responded with a status outside 2xx
                console.log(
                    "Server response (debug):",
                    err.response.status,
                    err.response.data
                );
                const serverMessage =
                    err.response.data?.message ||
                    err.response.data?.error ||
                    `Server error: ${err.response.status}`;
                toast.error(serverMessage, { theme: "dark" });
            } else if (err.request) {
                // Request made but no response
                console.log("No response received (debug):", err.request);
                toast.error(
                    "No response from server — ensure backend is running and CORS is configured.",
                    {
                        theme: "dark",
                    }
                );
            } else {
                // Something else happened
                toast.error(err.message || "Registration failed", { theme: "dark" });
            }
        }

        finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibilty = () => {
        setShowPassword(!showPasword);
    }

    return (
        <div className='min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white'>
            {/* Animated Background */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div
                    className={`absolute top-[10%] sm:top-1/4 left-[5%] sm:left-1/5 w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 rounded-full transition-all duration-1000 bg-gradient-to-r from-purple-400/10 to-indigo-500/10 blur-3xl ${isActive
                        ? "translate-x-10 sm:translate-x-20 translate-y-5 sm:translate-y-10"
                        : ""
                        }`}
                ></div>
                <div
                    className={`absolute top-[75%] sm:top-3/4 right-[5%] sm:right-1/4 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full transition-all duration-1000 bg-gradient-to-r from-purple-400/8 to-indigo-500/8 blur-3xl ${isActive
                        ? "-translate-x-10 sm:-translate-x-20 -translate-y-5 sm:-translate-y-10"
                        : ""
                        }`}
                ></div>
                <div
                    className={`absolute bottom-[15%] sm:bottom-1/3 left-[65%] sm:left-2/3 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full transition-all duration-1000 bg-gradient-to-r from-purple-300/8 to-indigo-500/10 blur-3xl ${isActive
                        ? "-translate-x-5 sm:-translate-x-10 translate-y-10 sm:translate-y-20"
                        : ""
                        }`}
                ></div>
            </div>

            <a href="/" className='absolute top-4 sm:top-6 left-4 sm:left-6 z-10 flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-full transition-all duration-300 group shadow-lg hover:shadow-xl bg-white/5 text-white hover:bg-white/10'>
                <FaArrowLeft className='text-xs sm:text-sm group-hover:-translate-x-1 transition-transform' />
                <span className='font-medium text-xs sm:text-sm'>Back to Home</span>
            </a>

            <div className={`w-full max-w-[90%] sm:max-w-md py-5 sm:py-7 mt-9 z-10 transform transition-all duration-500 hover:scale-[1.02] px-2 sm:px-4 
            ${isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                <div className='rounded-3xl shadow-2xl overflow-hidden p-4 sm:p-6 md:p-8 relative transition-all duration-500 bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl border border-gray-700'
                    style={{
                        boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                        borderRadius: "24px"
                    }}>
                    <div className='absolute -top-6 sm:-top-8 -right-6 sm:-right-8 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-r from-purple-400/10 to-indigo-500/10 blur-2xl z-0' />
                    <div className='absolute -bottom-4 sm:-bottom-6 -left-4 sm:-left-6 w-20 h-20 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-full bg-gradient-to-r from-purple-300/8 to-indigo-300/10 blur-2xl z-0' />

                    <div className='relative z-10 text-center mb-6 sm:mb-8'>
                        <div className='mx-auto mb-4 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center'>
                            <div className='flex flex-col items-center text-xl md:text-2xl lg:text-2xl leading-none'>
                                <img src={logo} alt="logo"
                                    className='h-[1.2em] w-auto block object-contain'
                                    style={{
                                        display: "block"
                                    }}
                                />
                                <span className='font-bold tracking-wider text-white mt-1'>
                                    LUXERIDE
                                </span>
                            </div>
                        </div>
                        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold mt-2 sm:mt-3 md:mt-4 tracking-tight bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent'>
                            Join PremiumDrive
                        </h1>
                        <p className='mt-1 sm:mt-2 text-xs sm:text-sm md:text-base font-light tracking-wider text-purple-300/60'>
                            Create your exclusive account
                        </p>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className='space-y-3 sm:space-y-4 md:space-y-5'>
                        <div className='relative z-10'>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-300/80'>
                                    <FaUser className='text-sm sm:text-base' />
                                </div>
                                <input type="text" name="name"
                                    value={formData.name}
                                    placeholder='Full Name'
                                    onChange={handleChange}
                                    className='w-full pl-10 pr-3 py-2 sm:py-3 md:py-4 rounded-xl text-xs sm:text-sm placeholder-opacity-70 border focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 bg-white/5 backdrop-blur-sm text-white/90 placeholder-purple-200/40 border-white/10 focus:ring-purple-500/70'
                                    style={{ borderRadius: "160px" }}
                                    required
                                />
                            </div>
                        </div>

                        <div className='relative z-10'>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-300/80'>
                                    <FaEnvelope className='text-sm sm:text-base' />
                                </div>
                                <input type="email" name="email"
                                    value={formData.email}
                                    placeholder='Email Address'
                                    onChange={handleChange}
                                    className='w-full pl-10 pr-3 py-2 sm:py-3 md:py-4 rounded-xl text-xs sm:text-sm placeholder-opacity-70 border focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 bg-white/5 backdrop-blur-sm text-white/90 placeholder-purple-200/40 border-white/10 focus:ring-purple-500/70'
                                    style={{ borderRadius: "160px" }}
                                    required
                                />
                            </div>
                        </div>

                        <div className='relative z-10'>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-purple-300/80'>
                                    <FaLock className='text-sm sm:text-base' />
                                </div>
                                <input type={showPasword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    placeholder='Create Password'
                                    onChange={handleChange}
                                    className='w-full pl-10 pr-3 py-2 sm:py-3 md:py-4 rounded-xl text-xs sm:text-sm placeholder-opacity-70 border focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 bg-white/5 backdrop-blur-sm text-white/90 placeholder-purple-200/40 border-white/10 focus:ring-purple-500/70'
                                    style={{ borderRadius: "160px" }}
                                    required
                                />
                                <div onClick={togglePasswordVisibilty}
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer transition-colors text-purple-300/80 hover:text-purple-200/90'>
                                    {showPasword ? <FaEyeSlash className='text-sm sm:text-base' /> : <FaEye className='text-sm sm:text-base' />}
                                </div>
                            </div>
                        </div>

                        {/* TNC */}
                        <div className='flex items-start mt-2 sm:mt-3 md:mt-4'>
                            <div className='flex items-center h-5 mt-0.5 sm:mt-1'>
                                <input type="checkbox" id="terms"
                                    name='terms'
                                    checked={acceptedTerms}
                                    onChange={() => setAcceptedTerms(!acceptedTerms)}
                                    className='h-4 w-4 sm:h-5 sm:w-5 rounded focus:ring-0 border text-purple-600 border-gray-500 bg-gray-700/30 checked:bg-purple-500/80'
                                    style={{ boxShadow: "none" }}
                                />
                            </div>

                            <div className='ml-2 sm:ml-3 text-xs sm:text-sm'>
                                <label htmlFor="terms"
                                    className='ml-2 sm:ml-3 text-xs sm:text-sm text-purple-200/80 cursor-pointer select-none'>
                                    I agree to the {" "}
                                    <span className='font-medium text-purple-300 hover:underline'>
                                        Terms & Conditions
                                    </span>
                                </label>
                            </div>
                        </div>

                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full py-2 sm:py-3 md:py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer focus:outline-none focus:ring-2 relative overflow-hidden group bg-gradient-to-r from-purple-600 to-indigo-600 text-white/95 hover:from-purple-500 hover:to-indigo-500 focus:ring-purple-500/70 shadow-purple-500/20'
                            style={{
                                borderRadius: "16px",
                                boxShadow: "0 5px 15px rgba(8, 90, 20, 0.6)"
                            }}
                        >
                            <span className='relative z-10 flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm md:text-base'>
                                <FaCheck className='text-white text-sm sm:text-base md:text-lg' />
                                {loading ? 'CREACTING...' : 'CREATE ACCOUNT'}
                            </span>
                            <div className='absolute inset-0 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 bg-gradient-to-r from-purple-400/50 to-indigo-500/50' />
                        </button>
                    </form>

                    <div
                        style={{ borderColor: 'rgba(255, 255, 255, 0.06)' }}
                        className='mt-2 pt-2 sm:pt-3 border-t text-center'
                    >
                        <p className='mb-2 sm:mb-3 md:mb-4 text-xs sm:text-sm md:text-base text-purple-200/70'>
                            Already have an account?
                        </p>
                        <a href="/login" className='inline-block w-full px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-xl font-medium transition-all duration-300 transform hover:-translate-y-0.5 text-xs sm:text-sm md:text-base bg-transparent border border-purple-500/50 text-purple-300/90 hover:bg-purple-500/10 hover:text-white/90'
                            style={{
                                borderRadius: "16px",
                                boxShadow: "0 2px 10px rgba(245, 124, 0, 0.08)"
                            }}
                        >
                            LOGIN TO YOUR ACCOUNT
                        </a>
                    </div>
                </div>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastStyle={{
                    backgroundColor: "#8b5cf6",
                    color: "#ffffff",
                    borderRadius: "16px",
                    boxShadow: "0 4px 20px rgba(139,92,246,0.25)",
                    fontFamily: "'Montserrat', sans-serif",
                }}
            />

            {/* Font Import */}
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
          body { font-family: 'Montserrat', sans-serif; }
        `}
            </style>
        </div>
    )
}

export default SignUp