import React, { useState } from 'react'
import { contactPageStyles as styles } from '../assets/dummyStyles'
import { FaCalendarAlt, FaCar, FaClock, FaComment, FaEnvelope, FaMapMarkedAlt, FaPhone, FaUser, FaWhatsapp } from 'react-icons/fa';
import { IoIosSend } from 'react-icons/io'

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "", email: "", phone: "", carType: "", message: ""
    });
    const [activeField, setActiveField] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    };

    const handleFocus = (field) => {
        setActiveField(field)
    };

    const handleBlur = () => {
        setActiveField(null)
    };

    // WHATSAPP API
    const handleSubmit = (e) => {
        e.preventDefault();
        const whatsappMessage =
            `Name: ${formData.name}%0A` +
            `Email: ${formData.email}%0A` +
            `Phone: ${formData.phone}%0A` +
            `Car Type: ${formData.carType}%0A` +
            `Message: ${formData.message}`;
        window.open(`https://wa.me/+918972874942?text=${whatsappMessage}`, '_blank');

        setFormData({ name: '', email: '', phone: '', carType: '', message: '' });
    };

    return (
        <div className='relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-gray-950 to-black'>
            <div className='absolute inset-0 opacity-9 pointer-events-none'>
                <div className="w-full h-full" style={{
                    backgroundImage: `
                        linear-gradient(30deg, rgba(249,115,22,0.08) 12%, transparent 12.5%, transparent 87%, rgba(249,115,22,0.08) 87.5%, rgba(249,115,22,0.08)),
                        linear-gradient(150deg, rgba(249,115,22,0.08) 12%, transparent 12.5%, transparent 87%, rgba(249,115,22,0.08) 87.5%, rgba(249,115,22,0.08)),
                        linear-gradient(30deg, rgba(249,115,22,0.08) 12%, transparent 12.5%, transparent 87%, rgba(249,115,22,0.08) 87.5%, rgba(249,115,22,0.08)),
                        linear-gradient(150deg, rgba(249,115,22,0.08) 12%, transparent 12.5%, transparent 87%, rgba(249,115,22,0.08) 87.5%, rgba(249,115,22,0.08)),
                        linear-gradient(60deg, rgba(234,88,12,0.08) 25%, transparent 25.5%, transparent 75%, rgba(234,88,12,0.08) 75%, rgba(234,88,12,0.08)),
                        linear-gradient(60deg, rgba(234,88,12,0.08) 25%, transparent 25.5%, transparent 75%, rgba(234,88,12,0.08) 75%, rgba(234,88,12,0.08))`,
                    backgroundSize: '80px 140px',
                    backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px'
                }}></div>
            </div>

            {/* FLOATING PARTICLES */}
            <div className='absolute inset-0 pointer-events-none'>
                {[...Array(15)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-6 h-6 opacity-10"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                            background: i % 3 === 0 ? '#f97316' : i % 3 === 1 ? '#fb923c' : '#fdba74',
                            transform: `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5})`
                        }}
                    ></div>
                ))}
            </div>

            {/* TITLE */}
            <div className='relative z-10 pt-20 max-w-4xl mx-auto'>
                <div className='text-center mb-8 sm:mb-10 md:mb-12'>
                    <h1 className="text-3xl font-['Pacifico'] sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-500 mb-2 flex items-center justify-center">
                        Contact Our Team
                    </h1>
                    <div className='w-16 sm:w-20 md:w-24 h-0.5 bg-gradient-to-r from-orange-500 to-orange-400 mx-auto mb-3' />
                    <p className='text-base sm:text-lg md:text-xl text-gray-300 max-w-xl mx-auto'>
                        Have questions about our premium fleet? Our team is ready to assest with your car rental needs.
                    </p>
                </div>

                <div className='flex flex-col md:flex-row gap-6'>
                    <div className='md:w-2/5 bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg p-5 sm:p-6 relative overflow-hidden border border-gray-700'>
                        <div className='absolute -top-4 -right-4 w-16 h-16 bg-orange-500/10 rounded-full' />
                        <div className='absolute -bottom-4 -left-4 w-14 h-14 bg-orange-400/10 rounded-full' />

                        <div className='relative z-10 space-y-5'>
                            <h2 className='text-xl sm:text-xl font-semibold text-white flex items-center'>
                                <FaMapMarkedAlt className='mr-3 text-orange-400 text-lg' />
                            </h2>

                            <div className='space-y-3'>
                                {icons.map((info, i) => (
                                    <div className='flex items-start bg-gray-700/40 p-3 rounded-lg hover:bg-gray-700/60 transition-all'>
                                        <div className={styles.iconContainer(info.color)}>
                                            <info.icon className={i === 0 ? 'text-green-400 text-lg' : 'text-orange-400 text-lg'}
                                            />
                                        </div>

                                        <div>
                                            <h3 className='font-medium text-gray-300 text-sm sm:text-base'>
                                                {info.label}
                                            </h3>
                                            <p className='text-gray-400 text-xs sm:text-sm'>
                                                {info.value}
                                                {i === 0 && <span className='block text-gray-500'>Sunday: 10AM-6PM</span>}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='mt-4 bg-gradient-to-r from-orange-900/30 to-orange-800/30 p-3 rounded-lg border border-orange-500/20'>
                                <div className='flex items-center'>
                                    <FaCalendarAlt className='text-orange-400 mr-2' />
                                    <span className='text-gray-300 font-medium text-sm sm:text-base'>
                                        Special Offer!
                                    </span>
                                </div>
                                <p className='text-gray-400 text-xs sm:text-sm mt-1'>
                                    Book for 3+ days and get 10% discount
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='md:w-3/5 bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg p-5 sm:p-6 relative overflow-hidden border border-gray-700'>
                        <div className='absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-bl-full' />
                        <div className='absolute bottom-0 left-0 w-14 h-14 bg-orange-500/10 rounded-tr-full' />

                        <div className='mb-4'>
                            <h2 className='text-lg sm:text-xl font-semibold text-white mb-1 flex items-center'>
                                <IoIosSend className='mr-3 text-orange-400 text-lg' />
                                Send Your Inquiry
                            </h2>
                            <p className='text-gray-400 text-sm'>
                                Fill out the form and we'll get back to you promptly
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-3'>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                {['name', 'email', 'phone', 'carType'].map((field) => {
                                    const icons = {
                                        name: FaUser,
                                        email: FaEnvelope,
                                        phone: FaPhone,
                                        carType: FaCar
                                    };

                                    const placeholders = {
                                        name: 'Full Name',
                                        email: 'Email Address',
                                        phone: 'Phone Number',
                                        carType: 'Select Car Type'
                                    };

                                    return (
                                        <div key={field} className='relative'>
                                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center text-orange-400'>
                                                {React.createElement(icons[field])}
                                            </div>

                                            {field !== 'carType' ? (
                                                <input type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
                                                    name={field}
                                                    value={formData[field]}
                                                    onChange={handleChange}
                                                    onFocus={() => handleFocus(field)}
                                                    onBlur={handleBlur}
                                                    placeholder={placeholders[field]}
                                                    className={styles.input(activeField === field)}
                                                    required
                                                />
                                            ) : (
                                                <select name="carType"
                                                    value={formData.carType}
                                                    onChange={handleChange}
                                                    onFocus={() => handleFocus(field)}
                                                    onBlur={handleBlur}
                                                    className={styles.select(activeField === field)}
                                                    required
                                                >
                                                    <option value="">Select Car Type</option>
                                                    {['Economy', 'SUV', 'Luxury', 'Van', 'Sports Car', 'Convertible'].map((opt) => (
                                                        <option
                                                            value={opt}
                                                            key={opt}
                                                            className='bg-gray-800 cursor-pointer'
                                                        >
                                                            {opt}
                                                        </option>
                                                    ))}
                                                </select>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>

                            <div className='relative'>
                                <div className='absolute top-2.5 left-3 text-orange-400'>
                                    <FaComment />
                                </div>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    onFocus={() => handleFocus("message")}
                                    onBlur={handleBlur}
                                    placeholder='Tell us about your rental needs...'
                                    rows="3"
                                    className={styles.textarea(activeField === "message")}
                                    required></textarea>
                            </div>

                            <button type='submit' className='w-full cursor-pointer flex items-center justify-center py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 rounded-lg text-white font-medium text-sm shadow-md transition-all transform hover:-translate-y-0.5 group mt-2'>
                                Send Message
                                <FaWhatsapp className='ml-2 text-lg transform group-hover:scale-110 transition-transform' />
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* Fade-in Animation */}
            <style>{`
                @keyframes fadeIn { 
                from { opacity:0; transform:translateY(10px);} 
                to { opacity:1; transform:translateY(0);} 
                }
                .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
            `}</style>
        </div>
    )
}

const icons = [
    { icon: FaWhatsapp, label: 'WhatsApp', value: '+91 8972874942', color: 'bg-green-900/30' },
    { icon: FaEnvelope, label: 'Email', value: 'contact@karzoneservices.com', color: 'bg-orange-900/30' },
    { icon: FaClock, label: 'Hours', value: 'Mon-Sat: 8AM-8PM', color: 'bg-orange-900/30' },
]


export default Contact