import React from 'react'
import testimonial from '../assets/Testimonialdata'
import { CarFront, Star } from 'lucide-react'
import { GiSteeringWheel } from 'react-icons/gi'
import { FaCar, FaKey, FaMapMarkerAlt, FaQuoteLeft, FaRoad } from 'react-icons/fa'

const Testimonial = () => {
    return (
        <div className='relative bg-black py-16 px-4 sm:px-6 lg:px-8 overflow-hidden'>
            <div className='max-w-7xl mx-auto relative z-10'>
                {/* HEADER */}
                <div className='text-center mb-16'>
                    <div className='inline-flex items-center px-5 py-2 rounded-full bg-gray-800/50 backdrop-blur-sm border border-gray-700 mb-5'>
                        <CarFront className='text-purple-400 mr-2' />
                        <span className='text-sm font-medium text-purple-400'>
                            Customer Experiences
                        </span>
                    </div>

                    <h1 className='text-4xl sm:text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600 mb-4 font-[pacifico]'>
                        Premium <span className='text-purple-400'>Drive</span> Experiences
                    </h1>

                    <div className='flex justify-center items-center mb-5'>
                        <div className='h-0.5 w-16 sm:w-20 bg-purple-600 rounded-full' />
                        <GiSteeringWheel className='text-purple-400 mx-4' size={24} />
                        <div className='h-0.5 w-16 sm:w-20 bg-purple-600 rounded-full' />
                    </div>
                    <p className='text-lg text-gray-400 max-w-3xl mx-auto'>
                        Hear from our valued customers about journery with our premium fleet
                    </p>
                </div>

                {/* TESTIMONIAL CARD */}
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {testimonial.map((t, index) => {
                        const shape = stats.cardShapes[index % stats.cardShapes.length];
                        const IconComponent = stats.icons[index % stats.icons.length];

                        return (
                            <div
                                key={t.id}
                                className="relative rounded-2xl overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-t-4 border-purple-400"
                                style={{
                                    clipPath: "polygon(0% 10%, 10% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%)",
                                    background:
                                        "linear-gradient(145deg, rgba(30,30,40,0.8), rgba(20,20,30,0.8))",
                                    backdropFilter: "blur(10px)",
                                    border: "1px solid rgba(100,100,120,0.2)",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                                }}
                            >
                                <div className='p-6 sm:p-8 relative z-10'>
                                    <div className='flex justify-between items-start mb-6'>
                                        <FaQuoteLeft className='text-purple-400' size={28} />
                                        {/* RATING */}
                                        <div className='flex'>
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`
                                                    ${i < t.rating ? 'text-purple-400' : 'text-gary-700'} mr-1`} size={18}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className='text-gray-300 italic text-lg mb-8'>
                                        "{t.comment}"
                                    </p>

                                    <div className='flex items-center mb-6 bg-gray-800/50 px-4 py-3 rounded-xl'>
                                        <GiSteeringWheel className='text-purple-400 mr-3' size={20} />
                                        <span className='font-semibold text-purple-400 text-base'>
                                            {t.car}
                                        </span>
                                    </div>

                                    <div className='flex items-center'>
                                        <div className='bg-gradient-to-br from-purple-500 to-indigo-700 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl'>
                                            {t.name.charAt(0)}
                                        </div>

                                        <div className='ml-4'>
                                            <h3 className='font-bold text-white text-lg'>
                                                {t.name}
                                            </h3>
                                            <p className='text-purple-400 text-sm'>{t.role}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-700 to-indigo-800 transform translate-x-6 -translate-y-6 rotate-45 opacity-30' />

                                <div className='absolute bottom-4 right-4 text-gray-700 opacity-10'>
                                    <IconComponent size={36} />
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* STATS SECTION */}
                <div className='mt-20 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl border border-gray-700 overflow-hidden relative'>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-8 p-8'>
                        <div className='text-center'>
                            <div className={stats.statValue(stats.statColors.value[0])}>10k+</div>
                            <div className={stats.statLabel(stats.statColors.label[0])}>
                                Happy Customers
                            </div>
                        </div>

                        <div className='text-center'>
                            <div className={stats.statValue(stats.statColors.value[1])}>250+</div>
                            <div className={stats.statLabel(stats.statColors.label[1])}>
                                Luxury Vehicals
                            </div>
                        </div>

                        <div className='text-center'>
                            <div className={stats.statValue(stats.statColors.value[2])}>24/7</div>
                            <div className={stats.statLabel(stats.statColors.label[2])}>
                                Support
                            </div>
                        </div>

                        <div className='text-center'>
                            <div className={stats.statValue(stats.statColors.value[3])}>50+</div>
                            <div className={stats.statLabel(stats.statColors.label[3])}>
                                Locations
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className='mt-20 text-center'>
                    <h2 className='text-3xl font-bold text-white font-[pacifico] mb-4'>
                        Ready for Your Premium Experience?
                    </h2>
                    <p className='ext-gray-400 max-w-2xl mx-auto font-[pacifico] mb-8'>
                        Join thousands of satisfied customers who have experienced ouur premium fleet and exceptional services.
                    </p>
                    <a href="/cars" className='bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-bold py-3 font-[pacifico] px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/20'>
                        Book Your Luxury Ride
                    </a>
                </div>
            </div>

            <div className='absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-900 to-transparent z-0' />
        </div>
    )
}

const stats = {
    statValue: (color) => `text-4xl sm:text-5xl font-bold ${color} mb-2`,
    statLabel: (color) => `text-sm ${color} font-medium`,
    statColors: {
        value: ["text-cyan-400", "text-amber-400", "text-violet-400", "text-emerald-400"],
        label: ["text-cyan-200", "text-amber-200", "text-violet-200", "text-emerald-200"]
    },
    cardShapes: [
        "clip-path: polygon(0% 10%, 10% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%);",
        "clip-path: polygon(0% 0%, 90% 0%, 100% 10%, 100% 100%, 10% 100%, 0% 90%);",
        "clip-path: polygon(0% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%, 0% 10%);"
    ],
    icons: [FaCar, FaRoad, FaKey, FaMapMarkerAlt],
}

export default Testimonial