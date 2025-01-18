import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";  // Import styles for DatePicker
import { Link } from "react-router-dom";  // For navigation to the payments page

const Worksheet = () => {
    const [tasks, setTasks] = useState([]);
    const [taskData, setTaskData] = useState({
        task: "Sales",
        hoursWorked: "",
        date: new Date(),
    });
    const [editTask, setEditTask] = useState(null);
    const [paymentHistory, setPaymentHistory] = useState([
        { month: "January", year: 2025, amount: "$1500", transactionId: "txn1234" },
        { month: "December", year: 2024, amount: "$1400", transactionId: "txn1233" },
        { month: "November", year: 2024, amount: "$1300", transactionId: "txn1232" },
    ]);  // Sample payment data

    const handleAddTask = () => {
        const newTask = {
            task: taskData.task,
            hoursWorked: taskData.hoursWorked,
            date: taskData.date,
        };
        setTasks([newTask, ...tasks]);  // Add at the start of the array
        setTaskData({ task: "Sales", hoursWorked: "", date: new Date() });  // Reset form
    };

    const handleEditTask = (index) => {
        setEditTask(tasks[index]);
    };

    const handleUpdateTask = () => {
        const updatedTasks = tasks.map(task =>
            task === editTask ? taskData : task
        );
        setTasks(updatedTasks);
        setEditTask(null);  // Close modal
    };

    const handleDeleteTask = (index) => {
        const updatedTasks = tasks.filter((_, i) => i !== index);
        setTasks(updatedTasks);
    };

    return (
        <div className="max-w-6xl mx-auto mt-20">
            {/* Form for adding new tasks */}
            <div className="flex space-x-6 mb-6 bg-orange-50 p-4 rounded-lg shadow-md">
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
                <DatePicker
                    selected={taskData.date}
                    onChange={(date) => setTaskData({ ...taskData, date })}
                    dateFormat="yyyy-MM-dd"
                    className="flex-1 p-2 border rounded-md shadow-md"
                />
                <button
                    onClick={handleAddTask}
                    className="bg-orange-600 text-white p-2 rounded-md shadow-md hover:bg-orange-700 transition duration-300"
                >
                    Add / Submit
                </button>
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
                                    <td className="py-3 px-6">{task.date.toLocaleDateString()}</td>
                                    <td className="py-3 px-6">
                                        <button
                                            onClick={() => handleEditTask(index)}
                                            className="text-blue-500 hover:text-blue-700 transition duration-200"
                                        >
                                            🖊 Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(index)}
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
                            dateFormat="yyyy-MM-dd"
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
                <ul className="space-y-5 bg-orange-50">
                    {paymentHistory.slice(0, 3).map((payment, index) => (
                        <li key={index} className="px-10 flex justify-between items-center bg-white p-3 rounded-md shadow-md">
                            <div>
                                <p>{payment.month} {payment.year}</p>
                                <p className="text-sm text-gray-500">{payment.transactionId}</p>
                            </div>
                            <span className="font-semibold">{payment.amount}</span>
                        </li>
                    ))}
                </ul>
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