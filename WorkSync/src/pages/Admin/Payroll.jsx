import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const Payroll = () => {
    const [paymentRequests, setPaymentRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch payment history from the backend
    const fetchPaymentHistory = async () => {
        try {
            const response = await fetch(`http://localhost:5000/payment-history`);
            if (!response.ok) throw new Error('Failed to fetch payment history');
            const data = await response.json();
            console.log(data);
            if (Array.isArray(data.payments) && data.payments.length > 0) {
                setPaymentRequests(data.payments);
            } else {
                toast.error('No payment history found');
            }
        } catch (error) {
            toast.error('Failed to fetch payment history');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentHistory();
    }, []);

    // Handle payment approval/rejection
    const handlePaymentApproval = async (paymentId, request) => {
        try {
            const paymentDate = new Date().toISOString(); // Get current date in ISO format
            const response = await fetch(`http://localhost:5000/approve-payment/${paymentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: 'paid',
                    paidDate: paymentDate,
                }),
            });

            if (!response.ok) throw new Error('Failed to update payment status');
            const updatedRequest = await response.json();

            // Update the payment request status in state
            setPaymentRequests(prev =>
                prev.map(req =>
                    req._id === updatedRequest._id
                        ? { ...req, status: updatedRequest.status, paidDate: paymentDate }
                        : req
                )
            );

            toast.success(`Payment successfully executed for ${request.name}`);
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
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Payment Date</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600"></th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Approved By</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paymentRequests.map((request) => (
                                <tr key={request._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm">{request.email}</td>
                                    <td className="px-6 py-4 text-sm">${request.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-sm">
                                        {new Date(request.paidDate).toLocaleDateString() || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {request.status === 'paid' ? (
                                            <span className="text-green-600">Paid</span>
                                        ) : (
                                            <span className="text-red-600">Pending</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {request.status !== 'paid' && (
                                            <button
                                                onClick={() => handlePaymentApproval(request._id, request)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                Pay
                                            </button>
                                        )}
                                    </td>
                                    <td className='float-left'>{request.paidBy}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Payroll;