import React, { useState, useEffect, useContext } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import { ChevronUp, ChevronDown, Search, X, Check, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { AuthContext } from '../../components/Auth/AuthProvider';

const EmployeeList = () => {
    const { userDetails } = useContext(AuthContext);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPayModal, setShowPayModal] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [owedAmount, setOwedAmount] = useState(0);
    const [worksheetEntries, setWorksheetEntries] = useState([]);
    const [paymentDetails, setPaymentDetails] = useState({
        month: new Date().toLocaleString('default', { month: 'long' }),
        year: new Date().getFullYear().toString()
    });
    const navigate = useNavigate();
    const columnHelper = createColumnHelper();

    const fetchEmployeeData = async () => {
        try {
            const response = await fetch('http://localhost:5000/users');
            if (!response.ok) throw new Error('Failed to fetch employees');
            const data = await response.json();
            const employeeData = data.filter(user =>
                user.userType === 'employee' && user.status !== 'fired'
            );

            // Fetch owed amounts for each employee
            const employeesWithOwed = await Promise.all(employeeData.map(async (emp) => {
                const owedResponse = await fetch(`http://localhost:5000/employee-owed/${emp.email}`);
                const owedData = await owedResponse.json();
                return {
                    ...emp,
                    totalOwed: owedData.totalOwed,
                    totalHours: owedData.totalHours
                };
            }));

            setEmployees(employeesWithOwed);
        } catch (error) {
            toast.error('Failed to fetch employees');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployeeData();
    }, []);

    const processPayment = async () => {
        try {
            const response = await fetch('http://localhost:5000/process-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: selectedEmployee.email,
                    amount: owedAmount,
                    paidBy: userDetails.email,
                    entries: worksheetEntries
                })
            });

            if (!response.ok) {
                throw new Error('Failed to process payment');
            }

            const responseData = await response.json();
            console.log('Payment Response:', responseData); // Log the response data
            toast.success('Payment processed successfully');
            setShowPayModal(false);
            fetchEmployeeData(); // Refresh the list
        } catch (error) {
            console.error('Error:', error); // Log the error to see what's going wrong
            toast.error('Failed to process payment');
        }
    };

    const handleVerificationToggle = async (employeeId, currentStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/toggle-verification/${employeeId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isVerified: !currentStatus })
            });
            if (!response.ok) throw new Error('Failed to update verification');
            setEmployees(employees.map(emp =>
                emp._id === employeeId ? { ...emp, isVerified: !currentStatus } : emp
            ));
            toast.success('Verification status updated');
        } catch (error) {
            toast.error('Failed to update verification status');
        }
    };

    const ImageWithFallback = ({ src, alt }) => {
        const [error, setError] = useState(false);
        const handleError = () => {
            setError(true);
        };
        if (error || !src) {
            return (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User size={20} className="text-gray-500" />
                </div>
            );
        }
        return (
            <img
                src={src}
                alt={alt}
                onError={handleError}
                className="w-8 h-8 rounded-full object-cover"
            />
        );
    };

    const handleOpenPaymentModal = (employee) => {
        setSelectedEmployee(employee);
        setOwedAmount(employee.totalOwed); // Make sure owedAmount is set when opening the modal
        setShowPayModal(true);
    };

    const columns = [
        columnHelper.accessor('name', {
            header: 'Name',
            cell: info => (
                <div className="flex items-center gap-3">
                    <ImageWithFallback
                        src={info.row.original.photoURL}
                        alt={info.getValue()}
                    />
                    <span>{info.getValue()}</span>
                </div>
            )
        }),
        columnHelper.accessor('email', {
            header: 'Email'
        }),
        columnHelper.accessor('isVerified', {
            header: 'Verified',
            cell: info => (
                <button
                    onClick={() => handleVerificationToggle(info.row.original._id, info.getValue())}
                    className={`p-1 rounded ${info.getValue() ? 'text-green-600' : 'text-red-600'}`}
                >
                    {info.getValue() ? <Check size={20} /> : <X size={20} />}
                </button>
            )
        }),
        columnHelper.accessor('totalOwed', {
            header: 'Amount Owed',
            cell: info => `$${info.getValue()?.toLocaleString() || '0'}`
        }),
        columnHelper.accessor('totalHours', {
            header: 'Total Hours',
            cell: info => `${info.getValue() || '0'} hours`
        }),
        columnHelper.accessor('bankAccount', {
            header: 'Bank Account',
            // cell: INFO OF TOTAL PAID FROM ADMINS SIDE
        }),
        columnHelper.accessor('salary', {
            header: 'Salary',
            cell: info => `$${info.getValue()?.toLocaleString() || 0}`
        }),
        columnHelper.accessor('actions', {
            header: 'Actions',
            cell: info => (
                <div className="flex gap-2">
                    <button
                        onClick={() => handleOpenPaymentModal(info.row.original)}
                        disabled={!info.row.original.isVerified}
                        className={`px-3 py-1 rounded ${info.row.original.isVerified
                            ? 'bg-orange-600 text-white hover:bg-orange-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    >
                        Pay
                    </button>
                    <button
                        onClick={() => navigate(`/details/${info.row.original.uid}`)}
                        className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Details
                    </button>
                </div>
            )
        })
    ];

    const table = useReactTable({
        data: employees,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="sm:pt-20 p-6">
            <h2 className="text-3xl font-bold underline text-center text-orange-600 mb-6">Employee Table</h2>

            <div className="bg-white rounded-lg shadow-sm border">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                {table.getFlatHeaders().map(header => (
                                    <th
                                        key={header.id}
                                        className="px-6 py-3 text-left text-sm font-semibold text-gray-600"
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {table.getRowModel().rows.map(row => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-6 py-4 text-sm">
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Payment Modal */}
            {showPayModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-xl font-bold mb-4">Process Payment</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Employee</label>
                                <p className="mt-1">{selectedEmployee?.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Amount Owed</label>
                                <p className="mt-1">${owedAmount.toLocaleString()}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Month</label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                    value={paymentDetails.month}
                                    onChange={e => setPaymentDetails(prev => ({ ...prev, month: e.target.value }))}
                                >
                                    {[
                                        'January', 'February', 'March', 'April',
                                        'May', 'June', 'July', 'August',
                                        'September', 'October', 'November', 'December'
                                    ].map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Year</label>
                                <select
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                                    value={paymentDetails.year}
                                    onChange={e => setPaymentDetails(prev => ({ ...prev, year: e.target.value }))}
                                >
                                    {[...Array(5)].map((_, i) => {
                                        const year = new Date().getFullYear() - 2 + i;
                                        return (
                                            <option key={year} value={year}>{year}</option>
                                        );
                                    })}
                                </select>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowPayModal(false)}
                                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={processPayment}
                                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                                >
                                    Submit Payment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeList;