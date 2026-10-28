# WorkSync Client

React front end for WorkSync, a role-based employee management app. This repository is the client only. The Express/MongoDB API lives in [WorkSync-Server](https://github.com/RafatH0ssain/WorkSync-Server).

## Demo

https://worksync-2ca3b.web.app

Only Employee accounts can sign up on the public demo. Email me if you need HR or Admin access.

## Quickstart

Prerequisites: Node.js 18 or newer, npm, and a Firebase project with Email/Password and Google auth enabled.

```bash
git clone https://github.com/RafatH0ssain/WorkSync-Client.git
cd WorkSync-Client/WorkSync
cp .env.example .env
# fill in the six VITE_FIREBASE_* values from your Firebase project settings
# set VITE_ADMIN_TOKEN to the same value as the server's ADMIN_TOKEN
npm install
npm run dev
```

Vite serves the app at http://localhost:5173.

Other scripts: `npm run build`, `npm run lint`, `npm run preview`.

The client calls the deployed WorkSync-Server API by default. Firebase handles sign-in; the server stores users, work logs, and payroll records.

## Environment variables

All values live in `WorkSync/.env` (gitignored). `WorkSync/.env.example` lists every key.

| Variable | Required | What it does |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY` | yes | Firebase web config from your project settings. |
| `VITE_FIREBASE_AUTH_DOMAIN` | yes | Firebase web config. |
| `VITE_FIREBASE_PROJECT_ID` | yes | Firebase web config. |
| `VITE_FIREBASE_STORAGE_BUCKET` | yes | Firebase web config. |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | yes | Firebase web config. |
| `VITE_FIREBASE_APP_ID` | yes | Firebase web config. |
| `VITE_API_BASE_URL` | no | API origin. Empty uses the deployed `https://work-sync-server-eight.vercel.app`. If you change it, also allow the origin in the CSP inside `WorkSync/firebase.json`. |
| `VITE_ADMIN_TOKEN` | for any API write and for the admin and HR pages | Shared secret the server requires in the `x-admin-token` header. Must match the server's `ADMIN_TOKEN`. Generate one with `openssl rand -hex 32`. |

The Firebase web API key is public by design and is not a secret. `VITE_ADMIN_TOKEN` is different: treat it like a password for the server's protected routes and keep it out of commits.

## Security model

The server is the authorization boundary. Everything the client does with roles is presentation, and a hidden link is not access control.

- Role checks in `Navbar` and `RoleRoute` only decide what to draw. They are not access control: the server decides what every call is allowed to do.
- The role shown in the UI comes from the server's user record (`GET /users/:uid`) on every auth change. The client keeps no role claim in localStorage or sessionStorage and stores no tokens of its own. Firebase manages its own sign-in persistence.
- API calls go through one module, `src/api.js`. It single-sources the base URL and attaches `x-admin-token` only on the routes the server protects (registration, contact form, worksheet writes, and the admin and HR bulk reads and payroll actions). Open single-record reads never carry the header.
- `x-admin-token` is one shared secret for the whole protected surface. It is compiled into the public bundle, so it proves a call comes from the deployed client and nothing more. Who the caller is and what role they hold are still the server's job. Server-side checks against real user tokens (Firebase ID tokens) are the known upgrade path on the server.
- Per-user reads (worksheet, payment history) are keyed by the `:email` path parameter because that is what the API exposes today. The client sends no `?userEmail=` style query filters. Moving these to uid-keyed routes behind verified identity needs a server change.
- The legacy `GET /payment-historya/:email` route stays because the server keeps it as an alias.
- Security headers (CSP, frame-ancestors, nosniff, and friends) are set in `WorkSync/firebase.json` for Firebase Hosting.
- `npm run check:security` (inside `WorkSync/`) greps for the regressions this pass fixed: no `innerHTML` sinks, one source for the API base URL, the admin token only in `src/api.js`, and no hardcoded secrets.

## What each role can do

**Employee.** Log hours and tasks by date, submit payment requests, and review past payments and request status. New accounts start as Employee.

**HR.** Verify employees, review work logs and hours, process payment requests, and browse the employee list, details, and salary history.

**Admin.** Promote employees to HR, adjust salaries, ban users, and approve or decline payment requests before payout. Admin sees every employee and payroll record.

## Screenshots

### Employee

- Dashboard
  ![Employee Dashboard](./WorkSync/public/employee_dashboard.png)

- Past payments
  ![Employee Past Payments](./WorkSync/public/employee_past_payments.png)

- Add payment request
  ![Employee Add Payment](./WorkSync/public/employee_add_payment.png)

### HR

- Dashboard
  ![HR Dashboard](./WorkSync/public/hr_dashboard.png)

- Employee table
  ![HR Employee Table](./WorkSync/public/hr_employee_list.png)

- Payroll table
  ![HR Payroll Table](./WorkSync/public/hr_payroll_info.png)

- Employee details
  ![HR Employee Details](./WorkSync/public/hr_employee_details.png)

### Admin

- Dashboard
  ![Admin Dashboard](./WorkSync/public/admin_dashboard.png)

- All employees
  ![Admin All Employees](./WorkSync/public/admin_all_employees.png)

- Payroll
  ![Admin Payroll](./WorkSync/public/admin_employee_payroll.png)

## Tech

- React 18 and Vite
- Firebase Authentication (email/password and Google)
- React Router
- TanStack Table and React Query
- Tailwind CSS and DaisyUI
- Chart.js and Recharts
- Axios and fetch for API calls

## License

MIT. See [LICENSE](./LICENSE).

## Contact

Email: [rafat.click.hossain@gmail.com](mailto:rafat.click.hossain@gmail.com)

LinkedIn: [Muhammad Rafat Hossain](https://www.linkedin.com/in/muhammad-rafat-hossain/)
