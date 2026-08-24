# Activ Academy — AI-Powered Sports Academy & Coaching Platform

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B%20%7C%20v20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.2-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-v14.2-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-v19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-v5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose%20v9-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v3.4-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose%20Ready-2496ED?logo=docker&logoColor=white)](https://www.docker.com/)

An enterprise-grade, bilingual (Arabic & English) sports academy management platform and AI-assisted coaching system. The platform streamlines athletic session booking, roster and hero management, proof-of-payment verification, and automated nutritional/medical analysis of athlete data sheets via Google Gemini AI.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Repository Structure](#-repository-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Configuration](#environment-configuration)
  - [Running with Docker Compose](#running-with-docker-compose-recommended)
  - [Running Locally (Manual Setup)](#running-locally-manual-setup)
- [API Reference](#-api-reference)
- [Authentication & Authorization](#-authentication--authorization)
- [Database Schema & Models](#-database-schema--models)
- [Manual Payment & Booking Workflow](#-manual-payment--booking-workflow)
- [AI Data Analysis Pipeline](#-ai-data-analysis-pipeline)
- [Internationalization (i18n)](#-internationalization-i18n)
- [Engineering Quality & Testing](#-engineering-quality--testing)
- [License](#-license)

---

## 📌 Overview

**Activ Academy** is designed for sports academies, coaching centers, trainers, and athletes. It solves the challenge of managing sports reservations, manual payment verifications (InstaPay, mobile wallets, receipts), and athletic performance reporting in a single unified system.

### Who is it for?
* **Athletes & Parents:** Discover sports activities, reserve workout sessions, submit payment receipts, track booking approval statuses, and receive comprehensive AI-generated health and nutrition assessments.
* **Coaches & Administrators:** Manage sports programs, view athlete rosters, approve/reject payment proofs with custom pricing, manage academy champions, and inspect aggregated revenue metrics.

---

## ✨ Key Features

### 🏋️ Sports & Workout Booking Engine
* **Dynamic Catalog:** Browse available workouts categorized by sport, level (`Beginner`, `Intermediate`, `Advanced`), date, time, coach, and price.
* **Real-Time Slot Management:** Prevents overbooking by decrementing available slots upon reservation and releasing slots if a booking is cancelled or rejected.
* **Guest & Trainee Support:** Capture guardian details, trainee names, phone numbers, and national IDs directly inside the booking flow.
* **Duplicate Protection:** Automatically blocks duplicate bookings for the same workout session by the same user on the same date.

### 💳 Proof-of-Payment Verification Pipeline
* **Multi-Method Support:** Users submit transaction receipts via **InstaPay**, **Receipt at Academy**, or **E-Wallets** (*Vodafone Cash, Orange Money, Etisalat Cash, WE Pay*).
* **Admin Verification Interface:** Admins inspect uploaded receipts, set approved prices, add notes, and approve or reject submissions.
* **Payment Retry Mechanism:** If rejected, users can re-upload payment proof and resubmit without starting from scratch.

### 🤖 AI Athlete Assessment & Reporting
* **DOCX Parsing:** Upload player assessment templates (`.docx`), parsed dynamically using `mammoth`.
* **Gemini LLM Processing:** Extracts structured insights covering:
  * Personal summary
  * Medical history
  * Nutritional habits
  * Psychological plan
  * Environmental factors
  * Recommended sports activities
* **Client-Side PDF Export:** Download customized athlete diagnostic reports as formatted PDFs powered by `html2canvas` and `jsPDF`.

### 🛡️ Secure User & Role Management
* **JWT Authentication:** Strict password security validation (min 8 characters, uppercase, lowercase, numbers, special characters).
* **Role-Based Access Control (RBAC):** Middleware-enforced permissions distinguishing regular `user` and `admin` roles.
* **Auto-Seeding:** Automatically seeds the default super-admin account on initial database connection.
* **Profile Management:** Profile updates, password modifications, and admin promotion capabilities.

### 📊 Admin Analytics Dashboard
* **Real-time KPI Metrics:** Total registered users, active workout sessions, pending bookings, and total completed revenue aggregations.
* **Content Management System:** Full CRUD operations for coaches roster and academy championship heroes.

### 🌐 Internationalization (i18n) & RTL Layout
* **Bilingual UI:** Native support for Arabic (`ar`) and English (`en`) using `next-intl`.
* **RTL/LTR Adaptive Design:** Full Right-To-Left layout and Cairo font styling tailored for Arabic users.

### 📬 Contact & Complaint System
* **Nodemailer SMTP Integration:** Delivers incoming feedback, inquiries, and complaints directly to academy administrative inboxes via transactional email.

---

## 🛠 Technology Stack

### Backend
| Technology | Description |
| :--- | :--- |
| **Node.js** | JavaScript runtime environment (v18+) |
| **Express.js (v5.2)** | RESTful API backend framework |
| **MongoDB & Mongoose (v9.3)** | NoSQL document database and Object Data Modeling (ODM) |
| **Google Generative AI SDK** | Gemini 2.5 Flash API for athletic document analysis |
| **Anthropic AI SDK** | Claude API client integration support |
| **JSON Web Tokens (JWT)** | Stateless authentication and token verification |
| **Bcrypt.js** | Cryptographic password hashing |
| **Multer & Mammoth** | In-memory multipart file handling and DOCX text extraction |
| **Nodemailer** | SMTP email delivery for customer inquiries and complaints |

### Frontend
| Technology | Description |
| :--- | :--- |
| **Next.js (v14.2)** | React framework utilizing App Router and Server/Client components |
| **React (v19)** | UI library for reactive and modular user interfaces |
| **TypeScript (v5)** | Static type safety and developer productivity |
| **Tailwind CSS (v3.4)** | Utility-first styling framework |
| **next-intl** | Locale routing and translation management (`ar`/`en`) |
| **Framer Motion** | Declarative animations and UI transitions |
| **Axios** | HTTP client with automatic JWT interceptors and error handling |
| **jsPDF & html2canvas** | Client-side DOM rendering and PDF document generation |
| **React Hot Toast & SweetAlert2** | Interactive toast alerts and confirmation dialogs |

### Infrastructure
| Technology | Description |
| :--- | :--- |
| **Docker & Dockerfile** | Alpine-based container packaging for the Node.js application |
| **Docker Compose** | Multi-container orchestration (Express API, Next.js Frontend, MongoDB 6) |

---

## 🏛 System Architecture

```
                                  +---------------------------------------+
                                  |            Client Browser             |
                                  |    (Next.js 14 App Router, React)     |
                                  +-------------------+-------------------+
                                                      |
                                       HTTP Requests  | (via Axios / Fetch)
                                                      v
                                  +---------------------------------------+
                                  |        Express.js REST API            |
                                  |  - Authentication & JWT Verification  |
                                  |  - Role Middlewares (User / Admin)   |
                                  |  - File Upload Handler (Multer)       |
                                  +---------+-------------------+---------+
                                            |                   |
                     Mongoose Models / ODM  |                   | API Calls
                                            v                   v
                    +-------------------------+      +---------------------------+
                    |    MongoDB Database     |      | External Services         |
                    |  - Users & Roles        |      | - Google Gemini AI API    |
                    |  - Workouts & Bookings  |      | - Yahoo SMTP (Nodemailer) |
                    |  - Payments & Receipts  |      | - Stripe / Paymob APIs    |
                    |  - Coaches & Heroes     |      +---------------------------+
                    |  - AI Analysis Records  |
                    +-------------------------+
```

---

## 📁 Repository Structure

```text
activ/
├── Dockerfile                        # Multi-stage container definition for backend service
├── docker-compose.yml                # Multi-service stack (Node API, Next.js UI, MongoDB)
├── package.json                      # Root backend dependencies and scripts
├── server.js                         # Express application entrypoint, middleware, and route mounting
│
├── controllers/                      # Backend request handlers
│   └── analysisController.js         # DOCX ingestion and AI report controller
│
├── middleware/                       # Route protection and validation middlewares
│   ├── authMiddleware.js             # JWT bearer verification and token expiry handling
│   └── adminMiddleware.js            # Privilege gatekeeper for administrative endpoints
│
├── models/                           # Mongoose data schemas
│   ├── AI-Report.js                  # Persisted AI user report schema
│   ├── Activity.js                   # Academy activity definition schema
│   ├── Analysis.js                   # Analysis audit and raw text extraction schema
│   ├── Booking.js                    # Workout booking, attendee, and payment status schema
│   ├── Coach.js                      # Coach roster, ratings, and certifications schema
│   ├── Hero.js                       # Championship athlete showcase schema
│   ├── Payment.js                    # Transaction ledger and receipt reference schema
│   ├── User.js                       # User credentials, profile, and role schema
│   └── Workout.js                    # Workout slots, scheduling, and metadata schema
│
├── routes/                           # Express REST route definitions
│   ├── auth.js                       # /api/auth — Register, login, profile, and password update
│   ├── booking.js                    # /api/booking — Slot reservations, status approvals, retry
│   ├── coaches.js                    # /api/coaches — Public catalog and admin CRUD
│   ├── complaints.js                 # /api/complaints — Feedback and Nodemailer contact dispatch
│   ├── heroes.js                     # /api/heroes — Public showcase and admin CRUD
│   ├── payment.js                    # /api/payment — Payment creation and personal history
│   ├── users.js                      # /api/users — Admin user management and analytics metrics
│   └── workout.js                    # /api/workout — Workout creation, update, and retrieval
│
├── services/                         # Business logic and external integrations
│   └── aiService.js                  # Google Gemini Generative AI prompt construction and JSON parser
│
├── utils/                            # Server utilities and initialization scripts
│   ├── fileParser.js                 # Mammoth raw text extraction from Word documents
│   └── seeder.js                     # Super Admin default user seeder on startup
│
└── activ/                            # Next.js Frontend Application
    ├── app/                          # Next.js App Router root
    │   ├── [locale]/                 # Localized dynamic route tree (/ar, /en)
    │   │   ├── admin/                # Admin portal (Bookings, Coaches, Heroes, Activities)
    │   │   ├── admin-login/          # Admin authentication page
    │   │   ├── ai-analyzer/          # Athlete Word template upload & AI analysis view
    │   │   ├── auth/                 # User login and registration views
    │   │   ├── coaches/              # Coach roster display
    │   │   ├── contact-us/           # Contact form page
    │   │   ├── dashboard/            # Trainee user dashboard
    │   │   ├── heroes/               # Champions showcase page
    │   │   ├── my-bookings/          # User booking status, price, and payment retry view
    │   │   ├── sports/               # Sports activity listing and booking modal
    │   │   └── page.tsx              # Landing homepage
    │   ├── api/                      # Next.js localized backend API routes
    │   │   ├── bookings/             # Local booking proxy handlers
    │   │   ├── create-checkout-session/ # Stripe checkout session initialization
    │   │   ├── paymob/               # Paymob payment iframe and callback handlers
    │   │   └── upload/               # Local file storage upload handler
    │   └── globals.css               # Global Tailwind CSS directives and RTL rules
    ├── components/                   # Reusable UI component library (Navbar, Footer, Modals, Tables)
    ├── hooks/                        # Custom React hooks (useRequireAuth, useTranslation)
    ├── i18n/                         # Next-intl routing and locale configuration
    ├── messages/                     # Translation dictionaries (ar.json, en.json)
    ├── package.json                  # Frontend dependencies and Next.js scripts
    └── tailwind.config.js            # Tailwind theme customization
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your local environment:
* **Node.js:** v18.x or v20.x
* **npm:** v9+
* **MongoDB:** v6.0+ (if running without Docker)
* **Docker & Docker Compose:** (optional, for containerized execution)

---

### Environment Configuration

#### 1. Backend Environment (`.env` in repository root)
Create a `.env` file in the root directory:

```env
# Server Port
PORT=3000

# MongoDB Connection String
MONGODB_URI=mongodb://127.0.0.1:27017/coaching_db

# Authentication
JWT_SECRET=your_jwt_super_secret_key_here

# AI Service Configuration
GEMINI_API_KEY=your_google_gemini_api_key_here

# Email / SMTP Configuration (Yahoo Mail)
MAIL_USER=your_yahoo_email@yahoo.com
MAIL_PASS=your_yahoo_app_generated_password
```

#### 2. Frontend Environment (`activ/.env.local` or Docker environment)
Create an `activ/.env.local` file for frontend customization:

```env
# API Gateway Endpoints
NEXT_PUBLIC_API_URL=http://localhost:3000
INTERNAL_API_URL=http://app:3000

# Optional Payment Gateway Keys
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
PAYMOB_API_KEY=your_paymob_api_key
PAYMOB_INTEGRATION_ID=your_integration_id
PAYMOB_IFRAME_ID=your_iframe_id
PAYMOB_HMAC_SECRET=your_hmac_secret
```

---

### Running with Docker Compose (Recommended)

The easiest way to boot the full stack (Express Backend, Next.js Frontend, and MongoDB) is with Docker Compose:

```bash
# 1. Clone the repository
git clone <repository-url>
cd activ

# 2. Start all services in the background
docker-compose up --build
```

#### Accessing Services:
* **Frontend Web Application:** [http://localhost:3001](http://localhost:3001)
* **Backend Express REST API:** [http://localhost:3000](http://localhost:3000)
* **MongoDB Database:** `mongodb://localhost:27017/coaching_db`

---

### Running Locally (Manual Setup)

#### Step 1: Start MongoDB
Ensure your local MongoDB daemon is active:
```bash
# Linux / macOS
mongod --dbpath /data/db

# Windows
net start MongoDB
```

#### Step 2: Start the Express Backend
```bash
# From the repository root
npm install
npm run dev
# Server will run at http://localhost:3000
```
> **Note:** Upon database connection, a default Super Admin account will be automatically seeded:
> * **Email:** `admin@activ.com`
> * **Password:** `Admin@123456`

#### Step 3: Start the Next.js Frontend
```bash
# In a separate terminal, navigate to the frontend folder
cd activ
npm install --legacy-peer-deps
npm run dev
# Frontend will run at http://localhost:3000 (or http://localhost:3001 if port 3000 is occupied)
```

---

## 📡 API Reference

All backend REST endpoints are prefixed with `/api`.

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register a new user account |
| `POST` | `/api/auth/login` | Public | Authenticate user and receive JWT token |
| `GET` | `/api/auth/me` | User / Admin | Retrieve current authenticated user profile |
| `PUT` | `/api/auth/update` | User / Admin | Update profile details (name, password, avatar) |

### 🏋️ Workouts & Activities (`/api/workout`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/workout` | Public | List all available workout sessions |
| `GET` | `/api/workout/:id` | Public | Retrieve detailed information for a single workout |
| `POST` | `/api/workout` | Admin | Create a new workout session |
| `PUT` | `/api/workout/:id` | Admin | Update workout details (slots, price, schedule) |
| `DELETE` | `/api/workout/:id` | Admin | Remove a workout session |

### 📅 Bookings (`/api/booking`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/booking` | Authenticated | Reserve a workout slot with attendee details |
| `GET` | `/api/booking/my` | Authenticated | Fetch reservations for the logged-in user |
| `GET` | `/api/booking` | Admin | List all academy reservations with user details |
| `PUT` | `/api/booking/:id/status` | Admin | Approve booking with price or reject with reason |
| `PUT` | `/api/booking/:id/retry-payment`| Authenticated | Resubmit proof of payment for rejected booking |
| `DELETE` | `/api/booking/:id` | User / Admin | Cancel a booking and release the reserved slot |

### 👨‍🏫 Coaches (`/api/coaches`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/coaches` | Public | List all coaches |
| `GET` | `/api/coaches/:id` | Public | Retrieve single coach profile |
| `POST` | `/api/coaches` | Admin | Create a coach profile |
| `PUT` | `/api/coaches/:id` | Admin | Update coach bio, rating, and certifications |
| `DELETE` | `/api/coaches/:id` | Admin | Delete a coach profile |

### 🏆 Championship Heroes (`/api/heroes`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/heroes` | Public | List all academy champion athletes |
| `GET` | `/api/heroes/:id` | Public | Retrieve single hero profile |
| `POST` | `/api/heroes` | Admin | Add a new champion profile with accolades |
| `PUT` | `/api/heroes/:id` | Admin | Update champion achievements and photos |
| `DELETE` | `/api/heroes/:id` | Admin | Remove champion profile |

### 🤖 AI Document Analysis (`/api/analyze`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/analyze` | Public / User | Upload player `.docx` file for Gemini AI analysis |
| `GET` | `/api/history` | Public / Admin | Fetch history of completed AI document analyses |

### 👥 Users & Admin Metrics (`/api/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/users` | Admin | List all registered users |
| `GET` | `/api/users/stats` | Admin | Platform stats: total users, workouts, bookings, revenue |
| `PUT` | `/api/users/update-name` | Authenticated | Update user display name |
| `PUT` | `/api/users/change-password` | Authenticated | Change user account password |
| `PUT` | `/api/users/update-profile-pic`| Authenticated | Update profile avatar URL |
| `PUT` | `/api/users/promote/:id` | Admin | Promote regular user to administrator |

### 📬 Complaints & Feedback (`/api/complaints`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/complaints` | Public | Submit inquiry/complaint and send email via SMTP |

---

## 🔒 Authentication & Authorization

Authentication is managed via JSON Web Tokens (JWT) using the Bearer token scheme:

1. **Client Request:** Client includes token in request header: `Authorization: Bearer <jwt_token>`.
2. **`authMiddleware` Validation:** Extracts and verifies the token using `JWT_SECRET`. Attaches `req.user = { id, role }` to the request.
3. **`adminMiddleware` Validation:** Follows `authMiddleware` on restricted routes to ensure `req.user.role === 'admin'`. Returns `403 Forbidden` for non-admin accounts.
4. **Client Interceptor:** Axios client (`activ/utils/api.js`) automatically reads the token from `localStorage` and handles automatic redirects on `401 Unauthorized` / `403 Forbidden` responses.

---

## 💾 Database Schema & Models

The MongoDB database contains 9 primary collections:

```text
+-------------------+       +-------------------+       +-------------------+
|       User        |       |      Workout      |       |      Booking      |
+-------------------+       +-------------------+       +-------------------+
| _id               |       | _id               |       | _id               |
| name              |       | name              |       | user (ref: User)  |
| email             |       | description       |       | workout (Workout) |
| phone             |       | duration          |       | status (pending/  |
| nationalId        |       | level             |       |   approved/rej.)  |
| password (hash)   |       | slots             |       | paymentStatus     |
| role (user/admin) |       | coach             |       | paymentMethod     |
| profilePic        |       | category          |       | walletType        |
| createdAt         |       | date / time       |       | proofUrl          |
+-------------------+       | price / ageRange  |       | approvedPrice     |
                            +-------------------+       | adminNote         |
                                                        +-------------------+
                                                                  |
                                                                  v
+-------------------+       +-------------------+       +-------------------+
|      Coach        |       |       Hero        |       |      Payment      |
+-------------------+       +-------------------+       +-------------------+
| _id               |       | _id               |       | _id               |
| name              |       | name              |       | user (ref: User)  |
| specialty         |       | sport             |       | booking (Booking) |
| title / bio       |       | image             |       | amount            |
| experience        |       | bio               |       | method            |
| students / rating |       | championships[]   |       | status            |
| certifications    |       +-------------------+       | receiptUrl        |
+-------------------+                                   +-------------------+
```

---

## 🔄 Manual Payment & Booking Workflow

```
[ User: Selects Workout ]
           |
           v
[ Submits Trainee Info + Selects Payment Method ]
(Receipt / InstaPay / Vodafone Cash / Orange / Etisalat / WE)
           |
           v
[ Uploads Transaction Proof (Image/PDF) ]
           |
           v
[ Booking Created (Status: "pending", Slot Decremented) ]
           |
           v
+-------------------------------------------------------------+
|                     Admin Review Portal                     |
|  - View Trainee Details & Inline Proof Image                |
|  - Specify Approved Price (EGP)                             |
|  - Action: Approve or Reject (with required explanation)    |
+-------------------------------------------------------------+
           |                                   |
     [ If Approved ]                     [ If Rejected ]
           |                                   |
           v                                   v
Status -> "approved"                  Status -> "rejected"
Payment -> "completed"                Slot Restored (+1)
User sees final price & note          User can retry payment with new proof
```

---

## 🧠 AI Data Analysis Pipeline

1. **Template Download:** User downloads standardized Arabic player evaluation template (`.docx`).
2. **Upload & Extraction:** Uploaded file is parsed in memory by `mammoth` (`utils/fileParser.js`), extracting all raw Arabic text without writing temporary files to disk.
3. **Prompt Engineering & Gemini Processing:** The extracted content is sent to Google Gemini (`gemini-2.5-flash`) via `services/aiService.js`, enforcing a strict JSON response schema.
4. **Persisted History:** Analysis payload is saved in MongoDB (`models/Analysis.js`).
5. **Interactive UI & PDF Export:** The trainee view renders dynamic cards for medical conditions, nutrition plans, and recommendations, and provides instant PDF report generation via `html2canvas` and `jsPDF`.

---

## 🌍 Internationalization (i18n)

The Next.js application provides full bilingual support using `next-intl`:

* **Supported Locales:** Arabic (`/ar` - Default) and English (`/en`).
* **Direction:** Arabic displays in **RTL** (`dir="rtl"`), English in **LTR** (`dir="ltr"`).
* **Typography:** Integrated with the **Cairo** Google font for crisp Arabic and Latin rendering.
* **Message Bundles:** Translation strings organized in `activ/messages/ar.json` and `activ/messages/en.json`.

---

## 🧪 Engineering Quality & Testing

* **Security Controls:**
  * Password hashing via `bcryptjs` (salt rounds: 10).
  * Strict regex enforcement for credential complexity.
  * Parameterized MongoDB queries via Mongoose to prevent NoSQL injection.
* **Error Handling:** Centralized async error catching across all Express route handlers and Axios interceptors for 401/403 session expiration.
* **Testing Status:** Automated unit and integration test suites are not currently included in the repository. Manual verification and API route testing can be conducted using Postman, Thunder Client, or the Next.js client interface.

---

## 📄 License

This project is private and proprietary to **Activ Academy**. All rights reserved.
