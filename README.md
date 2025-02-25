# WorkSync
## Full-Stack Employee Management System
**Tech Stack:** React.js | Node.js | MongoDB | Firebase | JWT | TanStack Table

*(Replace with a real image or project screenshot)*

## About WorkSync
**WorkSync** is a full-stack web application designed to streamline employee management. With a focus on enhancing HR operations, this platform allows employees to log work hours, track salary history, and manage payroll, while HR and Admin users can oversee employee performance, salary payments, and other critical workflows.

The platform supports role-based access for different user types, including Employees, HR Executives, and Admins, ensuring that each user has access to the appropriate resources and features based on their role.

## Features
### For Employees
- **Work Logs:** Employees can track and submit work hours, tasks, and dates.
- **Salary History:** Employees can view their monthly salary payment history.
- **Notifications:** Toast notifications for successful CRUD operations and login activities.

### For HR Executives
- **Employee Management:** HR can verify employees, pay salaries, and track performance.
- **Payroll:** HR can manage the payroll system and monitor payment statuses for employees.

### For Admins
- **Employee Overview:** Admins can see all employees, including HRs, and make them HRs or fire them from the company.
- **Salary Adjustments:** Admins have the ability to adjust the salary of employees (salary increase only).
- **Payment Approval:** Admins can approve and execute employee salary payments.

## Demo
🔗 [Live Demo](https://your-live-link.com) *(Replace with your actual live link)*

## Screenshots
Here are some key screenshots of the application:

![Dashboard for Employees](path/to/dashboard-screenshot.png)  
*Dashboard for Employees*

![HR View of Employee Data](path/to/hr-view-screenshot.png)  
*HR View of Employee Data*

![Admin Employee Management](path/to/admin-management-screenshot.png)  
*Admin Employee Management*

## Technologies Used
- **Frontend:** React.js, TanStack Table, React Query
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** Firebase Authentication (Email/Password & Social Login)
- **State Management:** React Context API
- **Security:** JWT (JSON Web Token) for role-based authentication
- **Notifications:** SweetAlert & Toast for user-friendly notifications

## Roles and Permissions
- **Admin:**
  - Can manage employee data, salaries, and approve payments.
  - Can create or remove HR users.
- **HR:**
  - Can verify employees, manage payroll, and track employee performance.
- **Employee:**
  - Can log work hours, view their salary history, and submit updates.