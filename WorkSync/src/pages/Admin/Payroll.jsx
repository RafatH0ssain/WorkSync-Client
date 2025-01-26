import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Payroll = () => {
    const [paymentRequests, setPaymentRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalEntries, setTotalEntries] = useState(0);

    // Function to fetch payment history with pagination
    const fetchPaymentRequests = async (page = 1) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/payment-history/${'admin'}?page=${page}&limit=5`); // admin view
            if (!response.ok) throw new Error('Failed to fetch payment history');
            const data = await response.json();

            setPaymentRequests(data.payments);
            setCurrentPage(data.currentPage);
            setTotalPages(data.totalPages);
            setTotalEntries(data.totalEntries);
        } catch (error) {
            toast.error('Failed to fetch payment requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentRequests(currentPage);
    }, [currentPage]);

    // Handle payment approval or rejection by the admin
    const handleApproval = async (requestId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/approve-payment/${requestId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) throw new Error('Failed to approve/reject payment');
            const updatedRequest = await response.json();

            // Update the state with the new payment status
            setPaymentRequests(prev => prev.map(request =>
                request._id === updatedRequest._id
                    ? { ...request, status: updatedRequest.status }
                    : request
            ));

            toast.success(`Payment status updated to ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update payment status');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    return (
        <div className="sm:pt-20 p-6">
            <h2 className="text-3xl font-bold underline text-center text-orange-600 mb-6">Payroll</h2>

            <div className="bg-white rounded-lg shadow-sm border">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Employee Name</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Salary</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Month/Year</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Payment Date</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Payment Status</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paymentRequests.map((request) => (
                                <tr key={request._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm">{request.email}</td>
                                    <td className="px-6 py-4 text-sm">${request.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm">{new Date(request.paidDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {request.status === 'paid' ? (
                                            <span className="text-green-600">Paid</span>
                                        ) : (
                                            <span className="text-red-600">Pending</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {request.status === 'pending' && (
                                            <div>
                                                <button
                                                    onClick={() => handleApproval(request._id, 'paid')}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mr-2"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleApproval(request._id, 'pending')}
                                                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex justify-between items-center mt-4">
                    <button
                        onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
                    >
                        Previous
                    </button>
                    <div>
                        <span className="text-sm font-semibold text-gray-600">
                            Page {currentPage} of {totalPages}
                        </span>
                    </div>
                    <button
                        onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Payroll;