import React, { useEffect, useState } from 'react'
import { loginStyles } from '../assets/dummyStyles'
import logo from '../assets/logocar.png'
import { useLocation, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaEye, FaEyeSlash, FaLock, FaUser } from 'react-icons/fa'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [credentials, setCredentials] = useState({ email: '', password: '' })
    const [showPassword, setShowPassword] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsActive(true)
    }, [])

    const handleChange = (e) => {
        setCredentials((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        try {
            const base = 'http://localhost:5000';
            const url = `${base}/api/auth/login`;

            const res = await axios.post(url, credentials, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (res.status >= 200 && res.status < 300) {
                const { token, user, message } = res.data || {};

                if (token) localStorage.setItem('token', token);
                if (user) localStorage.setItem('user', JSON.stringify(user));

                toast.success(message || 'Login Successful! Welcome back', {
                    position: 'top-right',
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    theme: 'colored',
                    onClose: () => {
                        const redirectPath = '/';
                        navigate(redirectPath, { replace: true });
                    },
                    autoClose: 1000
                });
            } else {
                toast.error("Unexpected response from server", {
                    theme: "colored"
                })
            }
        }
        catch (err) {
            console.error("Login error (frontend):", err);
            if (err.response) {
                const serverMessage =
                    err.response.data?.message ||
                    err.response.data?.error ||
                    `Server error: ${err.response.status}`;
                toast.error(serverMessage, { theme: "colored" });
            } else if (err.request) {
                toast.error("No response from server — is backend running?", {
                    theme: "colored",
                });
            } else {
                toast.error(err.message || "Login failed", { theme: "colored" });
            }
        }
        finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    return (
        <div className='min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 sm:px-6 md:px-8 text-white'>
            {/* Animated Dark Background */}
            <div className={loginStyles.animatedBackground.base}>
                <div className={`${loginStyles.animatedBackground.orb1} ${isActive ? 'translate-x-20 translate-y-10' : ''}`} />
                <div className={`${loginStyles.animatedBackground.orb2} ${isActive ? '-translate-x-20 -translate-y-10' : ''}`} />
                <div className={`${loginStyles.animatedBackground.orb3} ${isActive ? '-translate-x-10 translate-y-20' : ''}`} />
            </div>

            <a href="/" className='absolute top-3 left-6 z-10 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-full transition-shadow duration-300 shadow-lg hover:shadow-xl bg-white/5 text-white hover:bg-white/10'>
                <FaArrowLeft className='text-sm sm:text-base' />
                <span className='font-medium text-xs sm:text-sm'>Back to Home</span>
            </a>

            <div className={`w-full max-w-md mb-14 sm:mt-14 z-10 transform transition-all duration-500 hover:scale-[1.02] ${isActive ? 'scale-100 opactiy-100' : 'scale-90 opacity-0'}`}>
                <div className='relative overflow-hidden p-6 sm:p-8 rounded-3xl shadow-2xl transition-colors duration-500 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900'>
                    <div className='absolute -top-8 -right-8 w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-r from-orange-400/10 to-orange-500/10 blur-2xl z-0' />
                    <div className='absolute -bottom-6 -left-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-orange-300/10 to-orange-400/10 blur-2xl z-0' />

                    {/* HEADER */}
                    <div className='relative z-10 text-center mb-6 sm:mb-8'>
                        <div className='mx-auto mb-2 w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center'>
                            <div className='flex flex-col items-center text-xl md:text-2xl lg:text-2xl leading-none font-bold tracking-wider text-white'>
                                <img src={logo} alt="logo"
                                    className='h-[1em] w-auto block'
                                    style={{
                                        display: "block",
                                        objectFit: "contain"
                                    }}
                                />
                                <span className='font-bold tracking-wider'>KARZONE</span>
                            </div>
                        </div>

                        <h1 className='text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-300 to-white bg-clip-text text-transparent'>
                            PremiumDrive
                        </h1>
                        <p className='mt-1 sm:mt-2 font-light tracking-wider text-xs sm:text-sm text-orange-300/60'>
                            LUXURY MOBILITY EXPERIENCE
                        </p>
                    </div>

                    {/* FORM */}
                    <form onSubmit={handleSubmit} className='space-y-4 sm:space-y-6'>
                        <div className='relative z-10'>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-orange-300/80'>
                                    <FaUser />
                                </div>
                                <input type="email" name='email'
                                    value={credentials.email}
                                    onChange={handleChange}
                                    placeholder='Enter your email'
                                    className='w-full pl-10 pr-3 py-3 sm:py-4 rounded-xl text-sm sm:text-base placeholder-opacity-70 border transition duration-300 focus:outline-none focus:ring-2 focus:border-transparent bg-white/5 backdrop-blur-sm text-white/90 placeholder-orange-200/40 border-white/10 focus:ring-orange-500/70'
                                    required
                                />
                            </div>
                        </div>

                        <div className='relative z-10'>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-orange-300/80'>
                                    <FaLock />
                                </div>
                                <input type="password" name='password'
                                    value={credentials.password}
                                    onChange={handleChange}
                                    placeholder='Enter your password'
                                    className='w-full pl-10 pr-3 py-3 sm:py-4 rounded-xl text-sm sm:text-base placeholder-opacity-70 border transition duration-300 focus:outline-none focus:ring-2 focus:border-transparent bg-white/5 backdrop-blur-sm text-white/90 placeholder-orange-200/40 border-white/10 focus:ring-orange-500/70'
                                    required
                                />
                                <div
                                    onClick={togglePasswordVisibility}
                                    className='absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer transition-colors text-orange-300/80 hover:text-orange-200/90'>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                        </div>

                        <button
                            type='submit'
                            disabled={loading}
                            className='w-full py-3 sm:py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 relative overflow-hidden group bg-gradient-to-r from-orange-500/90 to-orange-600/90 text-white/95 hover:from-orange-600/90 hover:to-orange-700/90 focus:ring-orange-500/70'>
                            <span className='relative cursor-pointer z-10 text-sm sm:text-base'>
                                {loading ? 'Sigining in...' : 'ACCESS PREMIUM GARAGE'}
                            </span>
                            <div className='absolute inset-0 transition-opacity duration-300 z-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-orange-400/50 to-orange-500/50' />
                        </button>
                    </form>

                    <div className='mt-6 pt-6 border-t border-white/10 text-center text-xs sm:text-sm'>
                        <p className='text-orange-200/70'>
                            Don't have an account?
                        </p>
                        <a href="/signup"
                            className='inline-block mt-2 w-full cursor-pointer px-4 py-2 rounded-xl font-medium transition-transform duration-300 transform hover:-translate-y-0.5 bg-transparent border border-orange-500/50 text-orange-300/90 hover:bg-orange-500/10 hover:text-white/90'>
                            CREATE ACCOUNT
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
                theme="colored"
                toastStyle={{
                    backgroundColor: '#fb923c',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(249, 115, 22, 0.25)'
                }}
            />
        </div>
    )
}

export default Login;