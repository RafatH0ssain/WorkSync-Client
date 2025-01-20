import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

const AllEmployeeList = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [error, setError] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null); // for firing
    const [showModal, setShowModal] = useState(false); // modal visibility

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await fetch('http://localhost:5000/users');
            if (!response.ok) throw new Error('Failed to fetch users');
            const data = await response.json();
            const filteredData = data.filter(user =>
                user.userType && (user.userType === 'hr' || user.userType === 'employee')
            );
            setEmployees(filteredData);
            setLoading(false);
        } catch (err) {
            setError('Failed to load users');
            setLoading(false);
        }
    };

    const handleFireEmployee = async (employeeId) => {
        try {
            await fetch(`http://localhost:5000/fire/${employeeId}`, {
                method: 'POST',
            });
            setEmployees(employees.map(emp =>
                emp._id === employeeId ? { ...emp, status: 'Fired' } : emp
            ));
        } catch (err) {
            console.error('Failed to fire employee', err);
        }
    };

    const handleMakeHR = async (employeeId) => {
        try {
            await fetch(`http://localhost:5000/make-hr/${employeeId}`, {
                method: 'POST',
            });
            setEmployees(employees.map(emp =>
                emp._id === employeeId ? { ...emp, userType: 'hr' } : emp
            ));
        } catch (err) {
            console.error('Failed to make employee HR', err);
        }
    };

    const handleSalaryAdjustment = async (employeeId, newSalary) => {
        try {
            await fetch(`http://localhost:5000/adjust-salary/${employeeId}`, {
                method: 'POST',
                body: JSON.stringify({ salary: newSalary }),
                headers: { 'Content-Type': 'application/json' },
            });
            // Update salary in the UI if needed
        } catch (err) {
            console.error('Failed to adjust salary', err);
        }
    };

    const getUserTypeBadgeClasses = (userType = 'employee') => {
        const baseClasses = "px-3 py-1 text-xs font-medium rounded-full";
        switch (userType?.toLowerCase()) {
            case 'hr':
                return `${baseClasses} bg-purple-100 text-purple-800`;
            case 'employee':
                return `${baseClasses} bg-blue-100 text-blue-800`;
            default:
                return `${baseClasses} bg-gray-100 text-gray-800`;
        }
    };

    const formatUserType = (userType) => {
        if (!userType) return 'Employee';
        return userType.charAt(0).toUpperCase() + userType.slice(1).toLowerCase();
    };

    const handleSort = (key) => {
        const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
        setSortConfig({ key, direction });
    };

    const sortedEmployees = [...employees].sort((a, b) => {
        if (!a[sortConfig.key]) return 1;
        if (!b[sortConfig.key]) return -1;

        if (sortConfig.direction === 'asc') {
            return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
        }
        return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

    const filteredEmployees = sortedEmployees.filter(employee =>
        employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return null;
        return sortConfig.direction === 'asc' ?
            <ChevronUp className="inline w-4 h-4" /> :
            <ChevronDown className="inline w-4 h-4" />;
    };

    if (loading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="text-center text-red-500 p-4">
            {error}
        </div>
    );

    return (
        <div className="mt-6 mb-8 bg-white rounded-lg border shadow-sm">
            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4">Employee Management</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-50">
                            <tr>
                                <th onClick={() => handleSort('name')}
                                    className="px-6 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100">
                                    Name <SortIcon column="name" />
                                </th>
                                <th onClick={() => handleSort('email')}
                                    className="px-6 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100">
                                    Email <SortIcon column="email" />
                                </th>
                                <th onClick={() => handleSort('createdAt')}
                                    className="px-6 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100">
                                    Join Date <SortIcon column="createdAt" />
                                </th>
                                <th onClick={() => handleSort('userType')}
                                    className="px-6 py-3 text-left text-sm font-semibold text-gray-600 cursor-pointer hover:bg-gray-100">
                                    Role <SortIcon column="userType" />
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredEmployees.map((employee, index) => (
                                <tr key={employee._id || index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <img
                                                src={employee.photoURL || "/api/placeholder/32/32"}
                                                alt={employee.name}
                                                className="h-8 w-8 rounded-full mr-3"
                                            />
                                            <span className="font-medium">{employee.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {employee.email}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={getUserTypeBadgeClasses(employee.userType)}>
                                            {formatUserType(employee.userType)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-800">
                                            Active
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {employee.userType !== 'hr' && (
                                            <button
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                onClick={() => handleMakeHR(employee._id)}
                                            >
                                                Make HR
                                            </button>
                                        )}
                                        <button
                                            className="text-red-600 hover:text-red-800 font-medium text-sm ml-3"
                                            onClick={() => {
                                                setSelectedEmployee(employee); // Set the selected employee
                                                setShowModal(true); // Show the modal
                                            }}
                                        >
                                            Fire
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredEmployees.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                            No users found matching your search.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showModal && selectedEmployee && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg">
                        <p className="text-lg">Are you sure you want to fire this employee?</p>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded-lg mt-4"
                            onClick={() => handleFireEmployee(selectedEmployee._id)}
                        >
                            Yes, Fire
                        </button>
                        <button
                            className="bg-gray-500 text-white py-2 px-4 rounded-lg mt-4 ml-2"
                            onClick={() => setShowModal(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllEmployeeList;