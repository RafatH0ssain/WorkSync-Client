import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from "../../components/Auth/AuthProvider";

const PaymentHistory = () => {
    const [payments, setPayments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchPayments(currentPage);
    }, [currentPage, user?.uid]);

    const fetchPayments = async (page) => {
        if (!user?.uid) return;
        
        try {
            const response = await fetch(
                `http://localhost:5000/payment-history/${user.uid}?page=${page}&limit=5`
            );
            const data = await response.json();
            
            setPayments(data.payments);
            setTotalPages(data.totalPages);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching payments:", error);
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="text-center py-6">Loading...</div>;
    }

    return (
        <div className="max-w-6xl mx-auto mt-20 p-6">
            <h2 className="text-2xl font-semibold mb-6">Payment History</h2>
            
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-orange-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-gray-800">Month, Year</th>
                            <th className="px-6 py-3 text-left text-gray-800">Amount</th>
                            <th className="px-6 py-3 text-left text-gray-800">Transaction ID</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {payments.map((payment) => (
                            <tr key={payment._id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{`${payment.month} ${payment.year}`}</td>
                                <td className="px-6 py-4">${payment.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {payment._id}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded ${
                            currentPage === page
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PaymentHistory;