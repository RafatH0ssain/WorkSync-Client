import React, { useContext } from 'react';
import { AuthContext } from '../components/Auth/AuthProvider';
import { UserCircle, Briefcase, Users, Shield } from 'lucide-react';

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
            <div className="mx-auto sm:block md:flex gap-8">
                {/* Profile Content (Left side) */}
                <div className="rounded-2xl shadow-2xl overflow-hidden group w-full md:w-1/2 flex flex-col">
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300 group-hover:scale-[1.02]" />

                    {/* Profile Content */}
                    <div className="relative px-6 pb-8 flex-1">
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

                {/* Conditional Sections Based on User Type (Right side) */}
                <div className="w-full md:w-1/2 flex flex-col shadow-xl border rounded-xl">
                    {/* Conditional Sections */}
                    {userDetails?.userType === 'employee' && <EmployeeVideoSection />}
                    {userDetails?.userType === 'hr' && <HRVideoSection />}
                    {userDetails?.userType === 'admin' && <AdminSection />}
                </div>
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
                <h3 className="text-sm text-gray-500 font-medium bg-gray-50">{title}</h3>
                <p className="text-gray-800 font-semibold bg-gray-50">{value}</p>
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
            value: 'April 31st 2018'
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
            value: 'Workforce Monitoring, Payroll Management, Reporting & Analytics'
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
        "https://www.youtube.com/embed/GFM9-Mq2Fuw",
        "https://www.youtube.com/embed/YLLK3Xq4trk",
        "https://www.youtube.com/embed/bI9RZjF-538",
        "https://www.youtube.com/embed/A2HFusWQIeE",
        "https://www.youtube.com/embed/3lRjzlnR1i0",
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
            <div className="relative aspect-w-16 h-[400px]">
                <iframe
                    className="w-full h-full rounded-lg"
                    src={hrVideos[currentVideo]}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="HR Video"
                />
            </div>
        </div>
    );
};

import { useState, useEffect, useRef } from 'react';

const EmployeeVideoSection = () => {
    const videos = [
        "https://www.youtube.com/embed/PYJ22-YYNW8",
        "https://www.youtube.com/embed/tKKPUYfOkvw",
        "https://www.youtube.com/embed/7iA62C-2mPI",
        "https://www.youtube.com/embed/0siE31sqz0Q",
        "https://www.youtube.com/embed/f3Fl2M-eCZc",
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
            <div className="relative aspect-w-16">
                <iframe
                    className="w-full rounded-lg h-[400px]"
                    src={videos[currentVideo]}
                    frameBorder="0"
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Employee Video"
                />
            </div>
        </div>
    );
};

export default Profile;