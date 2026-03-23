import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logocar.png'
import { CalendarCheck, Car, Menu, PlusCircle, X } from 'lucide-react'

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const onDocClick = (e) => {
            if (
                isOpen &&
                menuRef.current &&
                buttonRef.current &&
                !menuRef.current.contains(e.target) &&
                !buttonRef.current.contains(e.target)
            ) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", onDocClick);
        return () => document.removeEventListener("mousedown", onDocClick);
    }, [isOpen]);

    return (
        <div className={style.navbar(scrolled)}>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-center'>
                    <div className={style.navbarBackground(scrolled)}>
                        <div className='flex justify-between items-center h-full'>
                            <Link to='/' className='flex items-center'>
                                <div className='flex flex-col items-center text-xl md:text-2xl lg:text-2xl leading-none'>
                                    <img src={logo} alt="Logo"
                                        className='h-[1em] w-auto block'
                                        style={{ objectFit: 'contain' }}
                                    />
                                    <span className='font-bold tracking-wider font-[pacifico] text-gray-900 mt-1'>ADMIN</span>
                                </div>
                            </Link>

                            <div className='hidden lg:flex items-center'>
                                <div className='flex space-x-1 mx-6'>
                                    {navLinks.map((link, i) => {
                                        const Icon = link.icon;

                                        return (
                                            <React.Fragment key={link.path}>
                                                <Link
                                                    to={link.path}
                                                    className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors duration-300'
                                                >
                                                    <Icon className='w-4 h-4' />
                                                    <span>{link.label}</span>
                                                </Link>

                                                {i < navLinks.length - 1 && (
                                                    <div className='h-5 w-px bg-gray-300 my-auto' />
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className='lg:hidden flex items-center'>
                                <button
                                    ref={buttonRef}
                                    onClick={() => setIsOpen((v) => !v)}
                                    className='text-gray-700 hover:text-blue-600 focus:outline-none cursor-pointer'
                                    aria-label='Toggle Meny'
                                    aria-expanded={isOpen}
                                >
                                    {isOpen ? (
                                        <X className='w-5 h-5' />
                                    ) : (
                                        <Menu className='w-5 h-5' />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            {isOpen && (
                <div ref={menuRef} className='lg:hidden bg-white border-t border-gray-200 shadow-lg mt-1'>
                    <div className='px-4 pt-2 pb-8 space-y-1'>
                        {navLinks.map((link) => {
                            const Icon = link.icon;

                            return (
                                <Link
                                    key={link}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className='block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-3'
                                >
                                    <Icon className='w-5 h-5' />
                                    <span>{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}

const style = {
    navbar: (scrolled) => `fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? "py-3" : "py-5"}`,
    navbarBackground: (scrolled) => `bg-white backdrop-blur-lg w-full rounded-full shadow-lg border border-gray-200 transition-all duration-300 ${scrolled ? "py-2 px-6" : "py-3 px-8"}`,
}

const navLinks = [
    { path: "/", icon: PlusCircle, label: "Add Car" },
    { path: "/manage-cars", icon: Car, label: "Manage Cars" },
    { path: "/bookings", icon: CalendarCheck, label: "Bookings" },
];


export default Navbar