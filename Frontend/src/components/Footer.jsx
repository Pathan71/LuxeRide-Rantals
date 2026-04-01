import React from 'react'
import logo from '../assets/logocar.png'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaFacebookF, FaInstagram, FaLinkedinIn, FaMapMarkedAlt, FaPhone, FaTwitter, FaYoutube } from 'react-icons/fa'
import { GiCarKey } from 'react-icons/gi'

const Footer = () => {
    return (
        <footer className='relative bg-gradient-to-b from-gray-950 to-black text-white pt-16 sm:pt-20 md:pt-24 overflow-hidden'>
            <div className='absolute top-0 left-0 w-full h-32 sm:h-40 md:h-48'>
                <div className='absolute top-0 left-1/4 w-36 h-36 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full bg-blue-500/10 blur-3xl' />
                <div className='absolute top-0 right-1/3 w-48 h-48 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full bg-cyan-500/10 blur-3xl' />
                <div className='absolute top-12 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-600 to-transparent' />
            </div>

            <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 md:gap-12'>
                    <div className='space-y-4'>
                        <Link to="/" className="flex items-center" >
                            <div className='flex flex-col items-center text-xl md:text-2xl lg:text-2xl leading-none'>
                                <img src={logo} alt="logo" className='h-[1em] w-auto block'
                                    style={{
                                        display: "block",
                                        objectFit: "contain"
                                    }}
                                />
                                <span className='font-bold tracking-wider text-white'>
                                    LUXERIDE
                                </span>
                            </div>
                        </Link>

                        <p className='text-gray-400 text-sm sm:text-base'>
                            Premium car rental service with the latest models and exceptional customer services. Drive your dream car today!
                        </p>

                        <div className='flex space-x-3 sm:space-x-4'>
                            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube].map((Icon, i) => (
                                <a href="#" key={i} className='w-8 h-8 sm:w-10 sm:h-10 bg-gray-800 hover:bg-purple-400 transition-colors rounded-full flex items-center justify-center text-sm sm:text-base'>
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* QUCIK LINKS */}
                    <div>
                        <h3 className='text-lg font-[pacifico] sm:text-xl font-bold mb-4 relative pb-1'>
                            Quick Links
                            <span className='absolute left-0 bottom-0 block h-0.5 w-12 sm:w-16 bg-purple-400' />
                        </h3>
                        <ul className='space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base'>
                            {['Home', 'Cars', 'Contact Us'].map((link, i) => (
                                <li key={i}>
                                    <a href={link === "Home" ? "/" : link === "Contact Us" ? "/contact" : "/cars"}
                                        className='flex items-center hover:text-purple-500 transition-colors'>
                                        <span className='w-2 h-2 bg-purple-400 rounded-full mr-2'></span>
                                        {link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <h3 className='text-lg font-[pacifico] sm:text-xl font-bold mb-4 relative pb-1'>
                            Contact Us
                            <span className='absolute left-0 bottom-0 block h-0.5 w-12 sm:w-16 bg-purple-400' />
                        </h3>

                        <ul className='space-y-3 text-gray-400 text-sm sm:text-base'>
                            <li className='flex items-start'>
                                <FaMapMarkedAlt className='text-purple-400 mt-1 mr-2' />
                                <span>123 Drive Avenue, Sakinaka, Mumbai 400072</span>
                            </li>

                            <li className='flex items-start'>
                                <FaPhone className='text-purple-400 mt-1 mr-2' />
                                <span>+91 8239475849</span>
                            </li>

                            <li className='flex items-start'>
                                <FaEnvelope className='text-purple-400 mt-1 mr-2' />
                                <span>info@luxerideservices.com</span>
                            </li>
                        </ul>

                        <div className='mt-4 sm:mt-6'>
                            <h3 className='font-medium text-sm sm:text-base mb-2'>
                                Business Hours
                            </h3>
                            <div className="text-gray-400 text-xs sm:text-sm space-y-1">
                                <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                                <p>Saturday: 9:00 AM - 6:00 PM</p>
                                <p>Sunday: 10:00 AM - 4:00 PM</p>
                            </div>
                        </div>
                    </div>

                    {/* NEWLETTER */}
                    <div>
                        <h3 className='text-lg font-[pacifico] sm:text-xl font-bold mb-4 relative pb-1'>
                            Newsletter
                            <span className='absolute left-0 bottom-0 block h-0.5 w-12 sm:w-16 bg-purple-400' />
                        </h3>
                        <p className='text-gray-400 text-sm sm:text-base mb-3'>
                            Subscribe for special offers and updates
                        </p>

                        <form className='space-y-3'>
                            <input type="email" placeholder='Your Email Address'
                                className='w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-3 sm:py-3 sm:px-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white text-sm sm:text-base'
                            />

                            <button type='submit'
                                className='w-full flex items-center justify-center py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 shadow-purple-500/20 cursor-pointer text-white font-medium rounded-lg transition-transform duration-300 transform hover:-translate-y-1 text-sm sm:text-base'
                            >
                                <GiCarKey className="mr-2 text-lg sm:text-xl" />
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                {/* BOTTOM COPYWRIGHT */}
                <div className='border-t border-gray-800 mt-10 sm:mt-12 pb-4 flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm sm:text-base'>
                    <p>&copy; {new Date().getFullYear()} LUXERIDE. All right reserved.</p>
                    <p className='mt-3 md:mt-0'>
                        Designed by <a href="#" target='_blank' rel='noopener noreferrer'
                            className='underline text-gray-400 hover:text-purple-500'
                        >
                            SK Digital Services
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer