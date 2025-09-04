# Personal Finance Tracker

A minimal personal finance tracker with goals, transactions, reports, and saving logs. Built with Node.js, Express, EJS, and PostgreSQL.

## Features

- User auth (middleware-protected API routes)
- Transactions: create, update, soft-delete
- Transactions listing with sorting and pagination (page/limit)
- Goals: create, update, soft-delete
- Goal saving logs: view history and add new savings
- Reports: monthly spending summary per user
- EJS views, modular front-end scripts, and shared styles

## Tech Stack

- Backend: Node.js (ESM), Express
- DB: PostgreSQL (pg)
- Views: EJS
- Front-end: vanilla JS modules, CSS

## Project Structure

```
.
├─ controllers/           # Route handlers (business logic)
│  ├─ goalLogController.js
│  ├─ reportsController.js
│  └─ transactionController.js
├─ middleware/
│  ├─ authMiddleware.js   # AuthN/AuthZ, sets req.user
│  └─ validateInput.js    # (optional) validation helpers
├─ models/                # DB access
│  ├─ db.js               # pg Pool
│  ├─ goalLogModel.js
│  ├─ goalModel.js
│  ├─ reportsModel.js
│  └─ transactionModel.js
├─ public/                # Static assets
│  ├─ js/
│  │  ├─ auth.js
│  │  ├─ goal.js
│  │  ├─ home.js
│  │  ├─ homeEl.js
│  │  ├─ reports.js
│  │  └─ transaction.js
│  └─ styles/
│     ├─ base.css
│     └─ home.css
├─ routes/
│  ├─ goalLogRoutes.js
│  ├─ reportsRoutes.js
│  └─ transactionRoutes.js
├─ views/
│  ├─ home.ejs
│  └─ validation.ejs
├─ schema.sql             # DB schema & view
├─ server.js              # App entrypoint
├─ package.json
├─ package-lock.json
├─ .gitIgnore
└─ .env
```

## Prerequisites

- Node.js 18+
- PostgreSQL 13+
- A `.env` file with DB and JWT configuration

Create `.env` in project root:
```
PORT=3000
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker
JWT_SECRET=replace-with-strong-secret
```

## Database Setup

1. Create database:
   ```bash
   createdb expense_tracker
   ```
2. Apply schema:
   ```bash
   psql -U postgres -d expense_tracker -f schema.sql
   ```

This creates:
- `users`, `transactions`, `goals`, `goal_saving_log` tables
- `monthly_summary` view for reports

## Install & Run

Install dependencies:
```bash
npm install
```

To Start run :
```bash
npm start
```

Open in browser:
```
http://localhost:PORT (Insert the port number here)
```

## API Overview

- Transactions:
  - `GET /api/transactions?sortBy=created_at|transaction_name|transaction_amount&sortOrder=ASC|DESC&page=1&limit=10&filterByName=`
    - Response: `{ data: [...], page, limit, hasMore }`
  - `POST /api/transactions` body: `{ name, amount, detail? }`
  - `PUT /api/transactions/:id` body: `{ name, amount, detail? }`
  - `DELETE /api/transactions/:id`

- Goals:
  - `GET /api/goals` 
  - `POST /api/goals` body: `{ name, totalAmount, freq, goalDeadline }`
  - `PUT /api/goals/:id`
  - `DELETE /api/goals/:id`

  - Goal Logs:
    - `GET /api/goals/goalLog/:goalId`
    - `POST /api/goals/goalLog` body: `{ goalId,amount, note? }`

  - Reports:
    - `GET /api/goals/reports/monthly-summary`
      - Response: `{ data: [{ year, month, total_spent }, ...] }`

All `/api/*` routes are protected by `authMiddleware`, which should set `req.user = { id, ... }`.

## Front-end Entry

- `views/home.ejs` loads `/js/home.js` as module.
- `public/js/home.js` generates/retrieves an access token and calls:
  - `allEvents()` from `homeEl.js`
- `homeEl.js` wires tab switching and calls:
  - `goalEvents()`
  - `transactionEvents()`
  - `reportsEvents()`

## License

MIT