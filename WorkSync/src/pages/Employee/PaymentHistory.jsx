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

    const fetchPayments = async () => {
        if (!user?.uid) return;

        try {
            const response = await fetch(`http://localhost:5000/payment-historya/${user.email}`);
            const data = await response.json();

            // Validate response structure
            if (!data.payments || !Array.isArray(data.payments)) {
                throw new Error("Invalid data format from backend");
            }

            // Set full payment data and calculate total pages based on the desired limit
            setPayments(data.payments);
            setTotalPages(Math.ceil(data.payments.length / 5));
            setLoading(false);
            console.log(data);
        } catch (error) {
            console.error("Error fetching payments:", error);
            setLoading(false);
        }
    };

    const displayedPayments = payments.slice((currentPage - 1) * 5, currentPage * 5);

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
                            <th className="px-6 py-3 text-left text-gray-800">Payment Date</th>
                            <th className="px-6 py-3 text-left text-gray-800">Amount</th>
                            <th className="px-6 py-3 text-left text-gray-800">Transaction ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment._id}>
                                {/* Paid Date */}
                                <td className="px-6 py-4">
                                    {payment.paidDate
                                        ? new Date(payment.paidDate).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long", // Month in full (e.g., January)
                                        })
                                        : "N/A"}
                                </td>
                                {/* Amount */}
                                <td className="px-6 py-4">${payment.amount || "N/A"}</td>
                                {/* Paid By */}
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {payment.paidBy || "N/A"}
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
                        className={`px-4 py-2 rounded ${currentPage === page
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