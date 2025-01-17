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
        // Add task to the list (simulate adding to the DB)
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
        <div className="worksheet-container">
            {/* Form for adding new tasks */}
            <div className="task-form">
                <select
                    value={taskData.task}
                    onChange={(e) => setTaskData({ ...taskData, task: e.target.value })}
                >
                    <option value="Sales">Sales</option>
                    <option value="Support">Support</option>
                    <option value="Content">Content</option>
                    <option value="Paper-work">Paper-work</option>
                    <option value="Development">Development</option>  {/* Additional option */}
                </select>
                <input
                    type="number"
                    placeholder="Hours Worked"
                    value={taskData.hoursWorked}
                    onChange={(e) => setTaskData({ ...taskData, hoursWorked: e.target.value })}
                />
                <DatePicker
                    selected={taskData.date}
                    onChange={(date) => setTaskData({ ...taskData, date })}
                    dateFormat="yyyy-MM-dd"
                />
                <button onClick={handleAddTask}>Add / Submit</button>
            </div>

            {/* Table for displaying tasks */}
            <div className="task-table">
                <table>
                    <thead>
                        <tr>
                            <th>Task</th>
                            <th>Hours Worked</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task, index) => (
                            <tr key={index}>
                                <td>{task.task}</td>
                                <td>{task.hoursWorked}</td>
                                <td>{task.date.toLocaleDateString()}</td>
                                <td>
                                    <button onClick={() => handleEditTask(index)}>🖊 Edit</button>
                                    <button onClick={() => handleDeleteTask(index)}>❌ Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for editing task */}
            {editTask && (
                <div className="modal">
                    <h3>Edit Task</h3>
                    <select
                        value={taskData.task}
                        onChange={(e) => setTaskData({ ...taskData, task: e.target.value })}
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
                    />
                    <DatePicker
                        selected={taskData.date}
                        onChange={(date) => setTaskData({ ...taskData, date })}
                        dateFormat="yyyy-MM-dd"
                    />
                    <button onClick={handleUpdateTask}>Update</button>
                    <button onClick={() => setEditTask(null)}>Close</button>
                </div>
            )}

            {/* Payment History Section */}
            <div className="payment-history">
                <h3>Latest Payments</h3>
                <ul>
                    {paymentHistory.slice(0, 3).map((payment, index) => (
                        <li key={index}>
                            {payment.month} {payment.year}: {payment.amount} - {payment.transactionId}
                        </li>
                    ))}
                </ul>
                <Link to="/payment-history">
                    <button>See All Payments</button>
                </Link>
            </div>
        </div>
    );
};

export default Worksheet;