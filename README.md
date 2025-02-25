# WorkSync
## Full-Stack Employee Management System
**Tech Stack:** React.js | Node.js | MongoDB | Firebase | JWT | TanStack Table


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
🔗 [Live Demo](https://worksync-2ca3b.web.app)

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

## **Roles and Permissions**

- **Admin:**
  - Can manage employee data, salaries, and approve payments.
  - Can create or remove HR users.
  - Can see a list of all employees and their respective roles.
  - Can promote regular employees to HR status.
  - Can ban or remove any employee or HR from the platform.
  - Can accept or decline the payment requests forwarded by the HR.
  - Can confirm payments after HR approval and process payouts.
  - Has access to search and filter employees by name or role.

- **HR:**
  - Can see the entire list of employees, including their details and roles.
  - Can process payment requests submitted by employees.
  - Can accept or decline payment requests from employees, forwarding the accepted requests to the Admin for final approval.
  - Can view the work progress of all employees, including details about the different types of tasks, the times worked, and their completion dates.
  - Can see the salary history of each employee by clicking on their details.
  
- **Employee:**
  - Can log their work hours along with the type of tasks they performed and the date on which the tasks were completed.
  - Can submit payment requests for their work hours, which will then be reviewed by the HR.
  - Can view their payment history, including the latest payments and all past payments.
  - When logging in with an email account (e.g., Google authentication), the user is assigned the Employee role by default.
  - Can see the status of their payment requests as they are reviewed by HR and approved by Admin.