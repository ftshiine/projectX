# Sigma Lending — UK Commercial Finance Platform

A full-stack, production-grade implementation of the **Sigma Lending ("Burgundy Edition")** platform inspected from Figma.

Built using **Node.js, Express, MongoDB (Mongoose)** with a strict **MVC + Service Layer** architecture on the backend, and **React, Vite, Tailwind CSS** on the frontend.

---

## 🏛️ Architecture Overview

```
projectX/
├── server/                                # Backend: Node.js + Express + MongoDB
│   ├── src/
│   │   ├── config/                        # Database configuration
│   │   │   └── db.js                      # Mongoose connection to mongodb://127.0.0.1:27017/sigma_lending
│   │   ├── models/                        # Mongoose Schema Definitions
│   │   │   ├── Application.js             # Loan Application Schema & 4-step state machine
│   │   │   ├── Company.js                 # Companies House registry schema
│   │   │   └── Partner.js                 # Introducer & Commercial Broker schema
│   │   ├── services/                      # Business Logic Layer
│   │   │   ├── applicationService.js      # Underwriting estimate algorithms & multi-step flow
│   │   │   ├── companyService.js          # Companies House search & registry lookup
│   │   │   └── partnerService.js          # Tiered commission calculations & broker management
│   │   ├── controllers/                   # HTTP Request Handlers
│   │   │   ├── applicationController.js   # Application endpoints
│   │   │   ├── companyController.js       # Company search endpoints
│   │   │   └── partnerController.js       # Broker & commission endpoints
│   │   ├── routes/                        # Modular Express Routers
│   │   │   ├── applicationRoutes.js       # /api/applications/*
│   │   │   ├── companyRoutes.js           # /api/companies/*
│   │   │   ├── partnerRoutes.js           # /api/partners/*
│   │   │   └── index.js                   # Unified /api router
│   │   ├── middleware/
│   │   │   └── errorHandler.js            # Central error handler
│   │   └── server.js                      # Express App bootstrap & listen
│   ├── .env                               # Port & MongoDB URI
│   └── package.json
│
├── client/                                # Frontend: React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx                 # Top Navigation, Logo, and CTA
│   │   │   └── Footer.jsx                 # Global Burgundy Footer with FCA/ICO notices
│   │   ├── views/
│   │   │   ├── HomeView.jsx               # Figma Screen: Hero, SLAs, Pillars, FAQs, CTA
│   │   │   ├── ApplyView.jsx              # Figma Screen: 4-Step Stepper & Dynamic Form + Sidebar
│   │   │   └── PartnersView.jsx           # Figma Screen: Broker Portal & Commission Calculator
│   │   ├── App.jsx                        # View state router
│   │   ├── main.jsx                       # React entry point
│   │   └── index.css                      # Tailwind base & custom Figma range sliders
│   ├── tailwind.config.js                 # Burgundy theme palette & Plus Jakarta Sans typography
│   ├── vite.config.js                     # Proxy configured to http://localhost:5000
│   └── package.json
│
└── package.json                           # Unified project commands
```

---

## 🚀 Running the Project

### 1. Start the Backend Server (Express + MongoDB)
```bash
npm run server
```
* Runs on: `http://localhost:5000`
* Connects to: `mongodb://127.0.0.1:27017/sigma_lending`

### 2. Start the Frontend (React + Vite)
```bash
npm run client
```
* Runs on: `http://localhost:3015`
* Proxies `/api` calls directly to the backend.

---

## 📡 Backend API Endpoints

### Applications (`/api/applications`)
* `GET /api/applications/estimate?fundingAmount=50000&monthlyTurnover=38500&tradingHistory=3%2B%20Years%20Established`  
  Calculates instant loan terms, approval score (88%+), indicative term (12–36 mo), and approval band.
* `POST /api/applications`  
  Creates a new loan application in MongoDB and generates a reference code (e.g., `SIG-2026-XXXX`).
* `GET /api/applications/:id`  
  Retrieves application by MongoDB ObjectId or reference code.
* `PATCH /api/applications/:id/step`  
  Advances application through the 4 steps (Open Banking link, Director eKYC verification, contract payout).

### Companies House (`/api/companies`)
* `GET /api/companies/search?q=Apex`  
  Live search across UK registered companies with CRN, address, and directors.
* `GET /api/companies/:crn`  
  Lookup by exact 8-digit CRN.

### Brokers & Partners (`/api/partners`)
* `GET /api/partners/calculator?dealAmount=50000&monthlyDeals=4`  
  Calculates tiered introducer commission (Associate 2.5%, Principal 3.5%, Strategic 4.5%).
* `POST /api/partners`  
  Registers a new broker in the Sigma introducer network.

---

## 🎨 Visual System & Themes (Matching Figma)
* **Font**: Plus Jakarta Sans
* **Colors**:
  * Deep Burgundy: `#5A1020`
  * Dark Footers: `#430B17` / `#161616`
  * Rose/Crimson: `#B44357`, `#BE123C`
  * Soft Blush Backgrounds: `#FFF8F7`, `#F9ECEF`, `#FFF0F0`
  * Success Green: `#15803D`

