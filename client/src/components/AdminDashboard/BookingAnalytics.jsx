import React from 'react';

const BookingAnalytics = () => {
    // Mock data
    const servicesData = [
        {
            id: 's1', name: 'Quantum Physics Inquiry', faculty: 'Dr. Evelyn Reed',
            bookings: [
                { student: 'Alex Johnson', date: '2025-08-20' },
                { student: 'Bob Williams', date: '2025-08-21' },
            ]
        },
        {
            id: 's2', name: 'LMS Project Proposal', faculty: 'Mr. Samuel Chen',
            bookings: [
                { student: 'Charlie Brown', date: '2025-08-22' }
            ]
        }
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Booking Analytics</h1>
                <p className="text-slate-500 mt-1">View live chat sessions booked by students for each service.</p>
            </header>
            <div className="space-y-6">
                {servicesData.map(service => (
                    <div key={service.id} className="bg-white p-6 rounded-xl shadow-md">
                        <div className="border-b border-slate-200 pb-4 mb-4">
                            <h2 className="text-xl font-bold text-slate-800">{service.name}</h2>
                            <p className="text-sm text-slate-500">Managed by: <span className="font-medium text-indigo-600">{service.faculty}</span></p>
                            <p className="text-sm font-semibold text-slate-600 mt-2">Total Bookings: {service.bookings.length}</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100">
                                        <th className="p-2 font-semibold text-slate-500">Student Name</th>
                                        <th className="p-2 font-semibold text-slate-500">Booking Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {service.bookings.map((booking, index) => (
                                        <tr key={index}>
                                            <td className="p-2 text-slate-700">{booking.student}</td>
                                            <td className="p-2 text-slate-600">{booking.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookingAnalytics;