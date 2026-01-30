# 📅 Subscription Tracker API

A robust and scalable RESTful API built with Node.js, Express, and MongoDB for tracking subscriptions and sending automated renewal reminders.

## 🚀 Overview

This API allows users to manage their subscriptions (Netflix, Spotify, etc.), track costs, and receive email reminders before renewals. It leverages **Upstash Workflow** for reliable background job processing (reminders) and **Arcjet** for security.

## ✨ Features

- **🔐 Authentication**: Secure Sign Up, Sign In, and Sign Out using JWT.
- **👤 User Management**: Profile management (CRUD operations).
- **💳 Subscription Tracking**: Create, read, update, delete, and cancel subscriptions.
- **⏰ Automated Reminders**: Smart email notifications sent 7, 5, 2, and 1 day(s) before subscription renewal.
- **🛡️ Security**: Rate limiting and bot protection via Arcjet.
- **🗄️ Database**: MongoDB for flexible data storage.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Background Jobs**: Upstash Workflow
- **Security**: Arcjet
- **Email**: Nodemailer (via utility helper)

## 📂 Project Structure

```
subscription-tracker/
├── config/             # Configuration files (DB, Env, Upstash)
├── controllers/        # Request handlers (Auth, User, Subscription, Workflow)
├── middlewares/        # Custom middlewares (Auth, Error, Arcjet)
├── models/             # Mongoose schemas (User, Subscription)
├── routes/             # API route definitions
├── utils/              # Utility functions (Email, etc.)
├── app.js              # Express app setup
└── package.json        # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (Local or Atlas)
- Upstash Account (for QStash/Workflow)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/scars-and-screws/subscription-tracker.git
    cd subscription-tracker
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env.development.local` file in the root directory and add:

    ```env
    PORT=5500
    NODE_ENV=development
    DB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<dbname>
    JWT_SECRET=your_super_secret_key
    JWT_EXPIRES_IN=1d
    SERVER_URL=http://localhost:5500

    # Upstash / Arcjet keys
    QSTASH_URL=...
    QSTASH_TOKEN=...
    ARCJET_KEY=...
    ```

4.  **Run the server:**
    ```bash
    npm run dev
    ```

## 📖 API Documentation

### 🔐 Authentication

| Method | Endpoint                | Description         | Request Body                                                         |
| :----- | :---------------------- | :------------------ | :------------------------------------------------------------------- |
| `POST` | `/api/v1/auth/sign-up`  | Register a new user | `{ "name": "John", "email": "john@example.com", "password": "123" }` |
| `POST` | `/api/v1/auth/sign-in`  | Login user          | `{ "email": "john@example.com", "password": "123" }`                 |
| `POST` | `/api/v1/auth/sign-out` | Logout user         | -                                                                    |

### 👤 Users

_Headers required: `Authorization: Bearer <token>`_

| Method   | Endpoint            | Description               |
| :------- | :------------------ | :------------------------ |
| `GET`    | `/api/v1/users`     | Get all users             |
| `GET`    | `/api/v1/users/:id` | Get specific user details |
| `PUT`    | `/api/v1/users/:id` | Update user profile       |
| `DELETE` | `/api/v1/users/:id` | Delete user account       |

### 💳 Subscriptions

_Headers required: `Authorization: Bearer <token>`_

| Method   | Endpoint                                  | Description           | Request Body (Example)                                                                                                                                                  |
| :------- | :---------------------------------------- | :-------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `POST`   | `/api/v1/subscriptions`                   | Create subscription   | `{ "name": "Netflix", "price": 15, "currency": "USD", "frequency": "monthly", "category": "entertainment", "startDate": "2023-10-01", "paymentMethod": "Credit Card" }` |
| `GET`    | `/api/v1/subscriptions`                   | Get all subscriptions | -                                                                                                                                                                       |
| `GET`    | `/api/v1/subscriptions/:id`               | Get details           | -                                                                                                                                                                       |
| `PUT`    | `/api/v1/subscriptions/:id`               | Update subscription   | `{ "price": 17 }`                                                                                                                                                       |
| `DELETE` | `/api/v1/subscriptions/:id`               | Delete subscription   | -                                                                                                                                                                       |
| `PUT`    | `/api/v1/subscriptions/:id/cancel`        | Cancel subscription   | -                                                                                                                                                                       |
| `GET`    | `/api/v1/subscriptions/upcoming-renewals` | Get upcoming renewals | -                                                                                                                                                                       |
| `GET`    | `/api/v1/subscriptions/user/:userId`      | Get user's subs       | -                                                                                                                                                                       |

## 🔄 Workflow & Reminders

The API uses **Upstash Workflow** to handle subscription reminders.

1.  **Trigger**: When a subscription is created (`POST /subscriptions`), a workflow is triggered.
2.  **Process**: The workflow calculates the renewal date.
3.  **Sleep & Remind**: It sleeps until 7 days, 5 days, 2 days, and 1 day before the renewal date.
4.  **Action**: On each wake-up, it checks if the subscription is still active and sends an email reminder.
