import React, { useState, useEffect, useContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../components/Auth/AuthProvider";

const Worksheet = () => {
    const [tasks, setTasks] = useState([]);
    const [paymentHistory, setPaymentHistory] = useState([]); // Add payment history state
    const [taskData, setTaskData] = useState({
        task: "Sales",
        hoursWorked: "",
        date: new Date(),
    });
    const [editTask, setEditTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, userDetails } = useContext(AuthContext);

    useEffect(() => {
        if (user?.uid) {
            Promise.all([fetchTasks(), fetchPaymentHistory()]);
        }
    }, [user?.uid]);

    // Add fetchPaymentHistory function
    const fetchPaymentHistory = async () => {
        try {
            const response = await fetch(`http://localhost:5000/payments/${user.uid}`);
            const data = await response.json();
            setPaymentHistory(data);
        } catch (error) {
            console.error("Error fetching payment history:", error);
            setPaymentHistory([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const fetchTasks = async () => {
        try {
            const response = await fetch(`http://localhost:5000/worksheet/${user.email}`);
            const data = await response.json();
            console.log(response);
            // Convert date strings to Date objects
            const tasksWithDates = data.map(task => ({
                ...task,
                date: new Date(task.date)
            }));
            setTasks(tasksWithDates);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async () => {
        try {
            // Send task creation request
            const response = await fetch('http://localhost:5000/worksheet', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...taskData,
                    userId: userDetails.uid,
                    email: user.email,
                }),
            });

            if (!response.ok) throw new Error('Failed to add task');
            const data = await response.json();

            // Ensure the new task has a proper Date object
            const newTask = {
                ...data.entry,
                date: new Date(data.entry.date),
            };
            setTasks([newTask, ...tasks]);
            setTaskData({ task: "Sales", hoursWorked: "", date: new Date()});

        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleEditTask = (index) => {
        const taskToEdit = tasks[index];
        setTaskData({
            ...taskToEdit,
            date: new Date(taskToEdit.date)
        });
        setEditTask(taskToEdit);
    };

    const handleUpdateTask = async () => {
        try {
            const response = await fetch(`http://localhost:5000/worksheet/${editTask._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...taskData, _id: editTask._id}),
            });
            if (!response.ok) throw new Error('Failed to update task');
            const updatedTasks = tasks.map(task =>
                task._id === editTask._id ? { ...taskData} : task
            );
            setTasks(updatedTasks);
            setEditTask(null);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/worksheet/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete task');
            const updatedTasks = tasks.filter(task => task._id !== id);
            setTasks(updatedTasks);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    if (!user) {
        return (
            <div className="max-w-6xl mx-auto mt-20 text-center">
                <p className="text-gray-600">Please log in to view your worksheet.</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto mt-20">
            {/* Welcome Message */}
            <div className="block mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">
                    Welcome, {userDetails?.name || "Anonymous"}
                </h2>
                <p className="text-gray-600">
                    Role: {userDetails?.userType || "Employee"}
                </p>
            </div>

            {/* Form for adding new tasks */}
            <div className="sm:flex block mb-6 bg-orange-50 p-4 rounded-lg w-full shadow-md">
                <div className="flex justify-around bg-orange-50 gap-5 w-full">
                    <select
                        value={taskData.task}
                        onChange={(e) => setTaskData({ ...taskData, task: e.target.value })}
                        className="flex-1 p-2 border rounded-md shadow-md"
                    >
                        <option value="Sales">Sales</option>
                        <option value="Support">Support</option>
                        <option value="Content">Content</option>
                        <option value="Paper-work">Paper-work</option>
                        <option value="Development">Development</option>
                    </select>
                    <input
                        type="number"
                        placeholder="Hours Worked"
                        value={taskData.hoursWorked}
                        onChange={(e) => setTaskData({ ...taskData, hoursWorked: e.target.value })}
                        className="flex-1 p-2 border rounded-md shadow-md"
                    />
                </div>
                <div className="flex justify-between mx-auto bg-orange-50 gap-5 w-full sm:py-0 sm:pl-5 py-10">
                    <DatePicker
                        selected={taskData.date}
                        onChange={(date) => setTaskData({ ...taskData, date })}
                        dateFormat="yyyy-MM"
                        showMonthYearPicker
                        className="flex-1 p-2 border rounded-md shadow-md"
                    />
                    <button
                        onClick={handleAddTask}
                        className="bg-orange-600 text-white px-5 rounded-md shadow-md hover:bg-orange-700 transition duration-300"
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Task Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
                {tasks.length === 0 ? (
                    <div className="text-center py-6 text-gray-600 font-semibold">
                        No tasks added yet.
                    </div>
                ) : (
                    <table className="min-w-full table-auto border-collapse">
                        <thead className="bg-orange-100 text-gray-800">
                            <tr>
                                <th className="py-3 px-6 text-left">Task</th>
                                <th className="py-3 px-6 text-left">Hours Worked</th>
                                <th className="py-3 px-6 text-left">Date</th>
                                <th className="py-3 px-6 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-6">{task.task}</td>
                                    <td className="py-3 px-6">{task.hoursWorked}</td>
                                    <td className="py-3 px-6">
                                        {task.date instanceof Date && !isNaN(task.date)
                                            ? task.date.toLocaleDateString()
                                            : 'Invalid Date'}
                                    </td>
                                    <td className="py-3 px-6">
                                        <button
                                            onClick={() => handleEditTask(index)}
                                            className="text-blue-500 hover:text-blue-700 transition duration-200"
                                        >
                                            🖊 Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task._id)}
                                            className="text-red-500 hover:text-red-700 transition duration-200 ml-4"
                                        >
                                            ❌ Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Edit Task Modal */}
            {editTask && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center shadow-lg">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Task</h3>
                        <select
                            value={taskData.task}
                            onChange={(e) => setTaskData({ ...taskData, task: e.target.value })}
                            className="w-full p-2 mb-4 border rounded-md shadow-md"
                        >
                            <option value="Sales">Sales</option>
                            <option value="Support">Support</option>
                            <option value="Content">Content</option>
                            <option value="Paper-work">Paper-work</option>
                            <option value="Development">Development</option>
                        </select>
                        <input
                            type="number"
                            value={taskData.hoursWorked}
                            onChange={(e) => setTaskData({ ...taskData, hoursWorked: e.target.value })}
                            className="w-full p-2 mb-4 border rounded-md shadow-md"
                        />
                        <DatePicker
                            selected={taskData.date}
                            onChange={(date) => setTaskData({ ...taskData, date })}
                            dateFormat="yyyy-MM"
                            className="w-full p-2 mb-4 border rounded-md shadow-md"
                        />
                        <div className="flex space-x-4">
                            <button
                                onClick={handleUpdateTask}
                                className="bg-green-500 text-white p-2 rounded-md shadow-md hover:bg-green-600 transition duration-300"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => setEditTask(null)}
                                className="bg-gray-500 text-white p-2 rounded-md shadow-md hover:bg-gray-600 transition duration-300"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment History Section */}
            <div className="mt-8 p-4 bg-orange-50 rounded-lg shadow-lg">
                <h3 className="text-lg font-semibold bg-orange-50 text-gray-800 mb-4">Latest Payments</h3>
                {loading ? (
                    <div className="text-center py-6 text-gray-600">
                        Loading payment history...
                    </div>
                ) : paymentHistory.length === 0 ? (
                    <div className="text-center py-6 text-gray-600">
                        No payment history available.
                    </div>
                ) : (
                    <ul className="space-y-5 bg-orange-50">
                        {paymentHistory.slice(0, 3).map((payment, index) => (
                            <li key={index} className="px-10 flex justify-between items-center bg-white p-3 rounded-md shadow-md">
                                <div>
                                    <p>{payment.month} {payment.year}</p>
                                    <p className="text-sm text-gray-500">{payment.transactionId}</p>
                                </div>
                                <span className="font-semibold">${payment.amount?.toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                )}
                <Link to="/payment-history">
                    <button className="mt-4 w-full bg-orange-600 text-white p-2 rounded-md shadow-md hover:bg-orange-700 transition duration-300">
                        See All Payments
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Worksheet;