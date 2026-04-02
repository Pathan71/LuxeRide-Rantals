import React, { useCallback, useRef, useState } from 'react'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'

const baseUrl = 'http://localhost:5000'
const api = axios.create({ baseURL: baseUrl })

const AddCar = () => {

    const initialFormData = {
        carName: "",
        dailyPrice: "",
        seats: "",
        fuelType: "Petrol",
        mileage: "",
        transmission: "Automatic",
        year: "",
        model: "",
        description: "",
        category: "Sedan",
        image: null,
        imagePreview: null,
    };

    const [data, setData] = useState(initialFormData);
    const fileRef = useRef(null);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        setData((prev) => ({ ...prev, [name]: value }));
    }, []);

    // FOR IMAGE HANDLING
    const handleImageChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) =>
            setData((prev) => ({
                ...prev,
                image: file,
                imagePreview: evt.target.result,
            }));
        reader.readAsDataURL(file);
    }, []);

    const resetForm = useCallback(() => {
        setData(initialFormData);
        if (fileRef.current) fileRef.current.value = '';
    }, [initialFormData]);

    //  SHOW TOAST 
    const showToast = useCallback((type, title, message, icon) => {
        const toastConfig = {
            position: "top-right",
            className: toastStyles[type].container,
            bodyClassName: toastStyles[type].body,
        };

        if (type === "success") {
            toastConfig.autoClose = 3000;
        } else {
            toastConfig.autoClose = 4000;
        }

        toast[type](
            <div className="flex items-center">
                {icon}
                <div>
                    <p
                        className={
                            type === "success" ? "font-bold text-lg" : "font-semibold"
                        }
                    >
                        {title}
                    </p>
                    <p>{message}</p>
                </div>
            </div>,
            toastConfig
        );
    }, []);

    // HANDLE SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();
        const carNameForToast = data.carName || "";

        try {
            const formData = new FormData();
            const fieldMappings = {
                make: data.carName,
                dailyRate: data.dailyPrice,
                seats: data.seats,
                fuelType: data.fuelType,
                mileage: data.mileage,
                transmission: data.transmission,
                year: data.year,
                model: data.model,
                description: data.description || "",
                color: "",
                category: data.category,
            };

            Object.entries(fieldMappings).forEach(([key, value]) => {
                formData.append(key, value);
            });

            if (data.image) formData.append("image", data.image);

            await api.post("/api/cars", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            showToast(
                "success",
                "Congratulations!",
                `Your ${carNameForToast} has been listed successfully`,
                <svg
                    className='w-8 h-8 mr-3 text-purple -400'
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                    ></path>
                </svg>
            );

            resetForm();
        } catch (err) {
            console.error("Failed to submit car:", err);
            const msg =
                err.response?.data?.message || err.message || "Failed to list car";

            showToast(
                "error",
                "Error",
                msg,
                <svg
                    className='w-6 h-6 mr-2 text-red-400'
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                    ></path>
                </svg>
            );
        }
    };

    const renderInputField = (field) => {
        return (
            <div key={field.name}>
                <label className={field.icon ? 'block text-sm font-medium text-gray-300 mb-2 flex items-center' : 'block text-sm font-medium text-gray-300 mb-2'}>
                    {field.icon}
                    {field.name}
                </label>

                <input
                    type={field.type || 'text'}
                    required={field.required}
                    name={field.name}
                    value={data[field.name]}
                    onChange={handleChange}
                    className={field.prefix ? 'glass-input w-full pl-8 pr-4 py-3 rounded-xl text-gray-200 shadow-sm focus:ring-2 focus:ring-purple-500 transition-all' : 'bg-gray-800/50 border border-gray-700 w-full px-4 py-3 rounded-xl text-gray-200 focus:ring-2 focus:ring-purple-500'}
                    placeholder={field.placeholder} min={field.min} max={field.max} {...field.props}
                />
            </div>
        )
    };

    const renderSelectField = (field) => {
        return (
            <div key={field.name}>
                <label className='block text-sm font-medium text-gray-300 mb-2'>{field.label}</label>
                <select
                    required={field.required}
                    name={field.name}
                    value={data[field.name]}
                    onChange={handleChange}
                    className='bg-gray-800/50 border border-gray-700 w-full px-4 py-3 rounded-xl text-gray-200 focus:ring-2 focus:ring-purple-500'
                >
                    {field.options.map((option) =>
                        typeof option === 'object' ? (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ) : (
                            <option value={option} key={option}>
                                {option}
                            </option>
                        ))}
                </select>
            </div>
        );
    };

    const leftColumnFields = [
        {
            type: "input",
            config: {
                name: "carName",
                label: "Car Name",
                required: true,
                placeholder: "e.g., Toyota Camry",
                icon: (
                    <svg
                        className='w-5 h-5 mr-2 text-purple-500'
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                        ></path>
                    </svg>
                ),
            },
        },
        {
            type: "input",
            config: {
                name: "dailyPrice",
                label: "Daily Price ($)",
                type: "number",
                required: true,
                min: "1",
                placeholder: "45",
                props: { className: "pl-8" },
                prefix: <span className="absolute left-3 top-3 text-gray-400">$</span>,
            },
        },
        {
            type: "select",
            config: {
                name: "seats",
                label: "Seats",
                required: true,
                options: [1,2, 4, 5, 6, 7, 8].map((n) => ({
                    value: n,
                    label: `${n} seats`,
                })),
            },
        },
        {
            type: "select",
            config: {
                name: "fuelType",
                label: "Fuel Type",
                required: true,
                options: ["Petrol", "Diesel", "Electric", "Hybrid", "CNG"],
            },
        },
        {
            type: "input",
            config: {
                name: "mileage",
                label: "Mileage (MPG)",
                type: "number",
                required: true,
                min: "1",
                placeholder: "28",
            },
        },
        {
            type: "select",
            config: {
                name: "category",
                label: "Category",
                required: true,
                options: ["Sedan", "SUV", "Sports", "Coupe", "Hatchback", "Luxury"],
            },
        },
    ];

    const rightColumnFields = [
        {
            type: "input",
            config: {
                name: "year",
                label: "Year",
                type: "number",
                required: true,
                min: "1990",
                max: new Date().getFullYear(),
                placeholder: "2020",
            },
        },
        {
            type: "input",
            config: {
                name: "model",
                label: "Model",
                required: true,
                placeholder: "e.g., XLE",
            },
        },
    ];

    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4 sm:p-6'>
            <div className='fixed inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-purple-600 to-indigo-800 blur-3xl opacity-10' />
                <div className='absolute bottom-1/3 right-1/4 w-56 h-56 rounded-full bg-gradient-to-r from-purple-600 to-indigo-800 blur-3xl opacity-10' />
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rotate-45 bg-gradient-to-r from-purple-500 to-indigo-500 blur-xl opacity-10' />
            </div>

            {/* HEADER */}
            <div className='relative mb-8 pt-20 text-center'>
                <div className='absolute inset-x-0 top-0 flex justify-center'>
                    <div className='h-1 w-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full' />
                </div>
                <h1 className='text-4xl font-extrabold py-4 text-white sm:text-5xl mb-3 tracking-wide'>
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-purple-600'>
                        Add Your Car
                    </span>
                </h1>
                <p className='text-lg text-gray-400 max-w-2xl mx-auto'>
                    Share your vehicle with the world and start earning today.
                </p>
            </div>

            <div className='max-w-4xl mx-auto'>
                <form onSubmit={handleSubmit} className='glass-card rounded-2xl shadow-xl p-6 sm:p-10 relative overflow-hidden border border-gray-700'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                        <div className='space-y-6'>
                            {leftColumnFields.map((field) => {
                                if (field.type === 'input') {
                                    return (
                                        <div key={field.config.name}>
                                            <label className='block text-sm font-medium text-gray-300 mb-2'>
                                                {field.config.label}
                                            </label>
                                            <div className='relative'>
                                                {field.config.prefix}

                                                <input
                                                    required={field.config.required}
                                                    type={field.config.type || 'text'}
                                                    name={field.config.name}
                                                    value={data[field.config.name]}
                                                    onChange={handleChange}
                                                    className={`${toastStyles.input} ${field.config.props?.className || ""
                                                        }`}
                                                    placeholder={field.config.placeholder}
                                                    min={field.config.min}
                                                    max={field.config.max}
                                                />
                                            </div>
                                        </div>
                                    );
                                }
                                else if (field.type === 'select') {
                                    return renderSelectField(field.config)
                                }
                                return null;
                            })}

                            <div>
                                <label className='block text-sm font-medium text-gray-300 mb-2'>
                                    Transmission
                                </label>
                                <div className='flex space-x-4'>
                                    {['Autometic', 'Manual'].map((t) => (
                                        <label key={t} className={toastStyles.radioLabel(
                                            data.transmission === t
                                        )}>
                                            <input
                                                type="radio"
                                                name='transmission'
                                                value={t}
                                                checked={data.transmission === t}
                                                onChange={handleChange}
                                                className='h-4 w-4 text-purple-500 focus:ring-purple-500'
                                            />
                                            <span className='ml-2 text-gray-300'>{t}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='space-y-6'>
                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                {rightColumnFields.map((field) => {
                                    if (field.type === 'input') {
                                        return renderInputField(field.config)
                                    }
                                    return null;
                                })}
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-300 mb-2'>
                                    Car Image
                                </label>
                                <div className='flex items-center justify-center w-full'>
                                    <label className='flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-2xl cursor-pointer glass-input shadow-sm hover:bg-gray-900/30 transition-all'>
                                        {data.imagePreview ? (
                                            <div className='w-full h-full rounded-xl overflow-hidden'>
                                                <img src={data.imagePreview} alt="Preview"
                                                    className='w-full h-full object-cover' />
                                            </div>
                                        ) : (
                                            <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                                                <svg
                                                    className="w-10 h-10 mb-3 text-gray-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    ></path>
                                                </svg>
                                                <p className='text-sm text-gray-400 text-center'>
                                                    <span className='font-semibold'>
                                                        Click to upload
                                                    </span>
                                                    <br />
                                                    or drag and drop
                                                </p>

                                                <p className='text-xs text-gray-500 mt-1'>
                                                    PNG, JPG upto 10mb
                                                </p>
                                            </div>
                                        )}
                                        <input type="file"
                                            ref={fileRef}
                                            name='image'
                                            onChange={handleImageChange}
                                            className='hidden'
                                            accept='image/*'
                                        />
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-300 mb-2'>
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={data.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className='glass-input w-full px-4 py-3 rounded-xl text-gray-200 shadow-sm focus:ring-2 focus:ring-purple-500 transition-all'
                                    placeholder='Describe feature, condition, special details...' />
                            </div>
                        </div>
                    </div>

                    <div className='mt-12 flex justify-center'>
                        <button
                            type='submit'
                            className='px-10 py-4 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500 focus:ring-opacity-50 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-purple-500/20'
                        >
                            <span className='drop-shadow-md'>List Your Car</span>
                            <svg
                                className="w-5 h-5 ml-2 inline"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </form>
            </div>

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                pauseOnHover
                draggable
                pauseOnFocusLoss
                theme="dark"
            />
        </div>
    )
}

export const toastStyles = {
    success: {
        container: "bg-gradient-to-r from-gray-800 to-gray-900 border-l-4 border-purple-500",
        body: "font-sans text-gray-100",
    },
    error: {
        container: "bg-gradient-to-r from-gray-800 to-gray-900",
        body: "font-sans text-gray-100",
    },
    radioLabel: (isSelected) =>
        `flex-1 flex items-center justify-center p-3 rounded-xl cursor-pointer transition-all hover:shadow-md ${isSelected
            ? "bg-gradient-to-r from-purple-700/30 to-indigo-700/30 border border-purple-500/50"
            : "glass-input"
        }`,
    input: "glass-input w-full px-4 py-3 rounded-xl text-gray-200 shadow-sm focus:ring-2 focus:ring-purple-500 transition-all",
};

export default AddCar
