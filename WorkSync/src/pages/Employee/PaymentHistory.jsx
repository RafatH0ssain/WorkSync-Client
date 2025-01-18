import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PaymentHistory = () => {
    const [paymentHistory, setPaymentHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Function to fetch payment history for logged-in employee
    const fetchPaymentHistory = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/payments/history?page=${page}`);
            const data = response.data;

            if (data.length === 0) {
                setHasMore(false);  // No more data to load
            }

            setPaymentHistory((prevHistory) => [...prevHistory, ...data]);
        } catch (error) {
            setError('Failed to fetch payment history');
        } finally {
            setLoading(false);
        }
    };

    // Load the payment history when the component mounts or the page changes
    useEffect(() => {
        fetchPaymentHistory();
    }, [page]);

    return (
        <div className="payment-history-container p-6 bg-gray-50 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-center mb-4">Payment History</h2>

            {/* Display error message if there's an issue fetching data */}
            {error && <div className="text-red-500 text-center mb-4">{error}</div>}

            {/* Payment History Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
                {paymentHistory.length === 0 ? (
                    <div className="text-center py-6 text-gray-600 font-semibold">No payment history available.</div>
                ) : (
                    <table className="min-w-full table-auto border-collapse">
                        <thead className="bg-orange-100 text-gray-800">
                            <tr>
                                <th className="py-3 px-6 text-left">Month, Year</th>
                                <th className="py-3 px-6 text-left">Amount</th>
                                <th className="py-3 px-6 text-left">Transaction Id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentHistory.map((payment, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-6">{payment.month} {payment.year}</td>
                                    <td className="py-3 px-6">{payment.amount}</td>
                                    <td className="py-3 px-6">{payment.transactionId}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination Controls */}
            {hasMore && !loading && (
                <div className="text-center mt-4">
                    <button
                        onClick={() => setPage(page + 1)}
                        className="bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-500"
                    >
                        Load More
                    </button>
                </div>
            )}

            {loading && (
                <div className="text-center mt-4 text-gray-500">Loading...</div>
            )}

            {/* Link to navigate to the employee's worksheet */}
            <div className="mt-4 text-center">
                <Link to="/work-sheet">
                    <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-500">
                        Go to Worksheet
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default PaymentHistory;