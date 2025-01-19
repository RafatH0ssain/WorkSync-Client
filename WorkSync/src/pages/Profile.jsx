import React, { useContext } from 'react';
import { AuthContext } from '../components/Auth/AuthProvider';
import { UserCircle, Briefcase, Users, Shield } from 'lucide-react';
import { Chart } from 'chart.js'; // Add this import

const Profile = () => {
    const { userDetails } = useContext(AuthContext);

    const UserIcon = ({ userType }) => {
        const baseClasses = "w-24 h-24 transition-all duration-300 group-hover:scale-110";
        switch (userType) {
            case 'hr':
                return <Users className={baseClasses} />;
            case 'admin':
                return <Shield className={baseClasses} />;
            default:
                return <Briefcase className={baseClasses} />;
        }
    };

    return (
        <div className="py-12">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden group">
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 group-hover:scale-[1.02]" />

                    {/* Profile Content */}
                    <div className="relative px-6 pb-8">
                        {/* Profile Picture Circle */}
                        <div className="absolute -top-16 left-6">
                            <div className="w-32 h-32 rounded-full bg-white p-2 shadow-lg transition-transform duration-300 group-hover:-translate-y-2">
                                <div className="w-full h-full rounded-full bg-orange-100 flex items-center justify-center text-orange-600 group">
                                    <UserIcon userType={userDetails?.userType} />
                                </div>
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="pt-20">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {userDetails?.name || 'Anonymous'}
                            </h1>
                            <div className="inline-block px-4 py-2 bg-orange-100 rounded-full text-orange-600 font-semibold mb-4 capitalize">
                                {userDetails?.userType || 'Employee'}
                            </div>

                            {/* User Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                                <DetailCard
                                    title="Email"
                                    value={userDetails?.email || 'N/A'}
                                    icon={<UserCircle className="w-6 h-6" />}
                                />

                                {/* Role-specific information */}
                                {userDetails?.userType === 'admin' && (
                                    <DetailCard
                                        title="Access Level"
                                        value="Full System Access"
                                        icon={<Shield className="w-6 h-6" />}
                                    />
                                )}
                                {userDetails?.userType === 'hr' && (
                                    <DetailCard
                                        title="Department"
                                        value="Human Resources"
                                        icon={<Users className="w-6 h-6" />}
                                    />
                                )}
                                {userDetails?.userType === 'employee' && (
                                    <DetailCard
                                        title="Position"
                                        value="Team Member"
                                        icon={<Briefcase className="w-6 h-6" />}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Conditional Sections Based on User Type */}
                {userDetails?.userType === 'employee' && <EmployeeVideoSection />}
                {userDetails?.userType === 'hr' && <HRVideoSection />}
                {userDetails?.userType === 'admin' && <AdminSection />}
            </div>
        </div>
    );
};

const DetailCard = ({ title, value, icon }) => (
    <div className="bg-gray-50 rounded-xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
        <div className="flex items-center space-x-4">
            <div className="text-orange-600">
                {icon}
            </div>
            <div>
                <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
                <p className="text-gray-800 font-semibold">{value}</p>
            </div>
        </div>
    </div>
);

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const AdminSection = () => {
    const financeData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Company Revenue',
                data: [50000, 52000, 54000, 56000, 58000, 60000],
                borderColor: 'rgba(255, 159, 64, 1)',
                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const companyInfo = [
        {
            label: 'Founded',
            value: '2010'
        },
        {
            label: 'Employees',
            value: '500+'
        },
        {
            label: 'Headquarters',
            value: '123 Tech Avenue, Suite 400, Toronto, Ontario, Canada'
        },
        {
            label: 'Industry',
            value: 'Human Resource Management & Workforce Optimization'
        },
        {
            label: 'Core Services',
            value: 'Workforce Monitoring, Payroll Management, Employee Records Management, HR Tools, Reporting & Analytics'
        },
        {
            label: 'Core Values',
            value: 'Innovation, Efficiency, Collaboration, Customer-Centricity'
        }
    ];

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Company Finances & Info</h2>

            {/* Finances Graph */}
            <div className="mb-6 h-64">
                <Line data={financeData} options={options} />
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {companyInfo.map((info, index) => (
                    <div key={index} className="bg-orange-50 p-4 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold text-orange-600 bg-orange-50">{info.label}</h3>
                        <p className="text-gray-800 bg-orange-50">{info.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HRVideoSection = () => {
    const hrVideos = [
        "https://www.example.com/hr_video1.mp4",
        "https://www.example.com/hr_video2.mp4",
        "https://www.example.com/hr_video3.mp4",
        "https://www.example.com/hr_video4.mp4",
        "https://www.example.com/hr_video5.mp4",
    ];

    const [currentVideo, setCurrentVideo] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentVideo((prevVideo) => (prevVideo + 1) % hrVideos.length);
        }, 5000); // Change video every 5 seconds

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tips Of The Month: Human Resources</h2>
            <div className="relative aspect-w-16 aspect-h-9">
                <video
                    className="w-full h-full object-cover rounded-lg"
                    src={hrVideos[currentVideo]}
                    autoPlay
                    muted
                    loop
                />
            </div>
        </div>
    );
};

import { useState, useEffect, useRef } from 'react';

const EmployeeVideoSection = () => {
    const videos = [
        "https://www.example.com/video1.mp4",
        "https://www.example.com/video2.mp4",
        "https://www.example.com/video3.mp4",
        "https://www.example.com/video4.mp4",
        "https://www.example.com/video5.mp4",
    ];

    const [currentVideo, setCurrentVideo] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentVideo((prevVideo) => (prevVideo + 1) % videos.length);
        }, 5000); // Change video every 5 seconds

        return () => clearInterval(intervalId); // Cleanup interval on unmount
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tips of the month: Employees</h2>
            <div className="relative aspect-w-16 aspect-h-9">
                <video
                    className="w-full h-full object-cover rounded-lg"
                    src={videos[currentVideo]}
                    autoPlay
                    muted
                    loop
                />
            </div>
        </div>
    );
};

export default Profile;