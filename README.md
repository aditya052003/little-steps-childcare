# 🌟 Little Steps – Trusted 24×7 Childcare Platform

> **A modern, round-the-clock digital childcare network connecting working parents, shift workers, and healthcare professionals with accredited daycares, crèches, and verified night-shift caregivers.**

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green.svg)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38bdf8.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/Deployment-Ready-emerald.svg)]()

---

## 📌 Submission Links

* **GitHub Repository:** `https://github.com/aditya052003/little-steps-childcare`
* **Detailed Project Report:** [docs/PROJECT_REPORT.md](docs/PROJECT_REPORT.md) (or `https://github.com/aditya052003/little-steps-childcare/blob/main/docs/PROJECT_REPORT.md`)
* **Live Deployment Link:** `https://aditya052003.github.io/little-steps-childcare/`
* **Feedback Video Link:** `https://github.com/aditya052003/little-steps-childcare/raw/main/docs/videos/little_steps_feedback_video.mp4` (also live at `https://aditya052003.github.io/little-steps-childcare/videos/little_steps_feedback_video.mp4`)

---

## 📖 Executive Summary & Problem Context

With increasing numbers of working parents, shift-based professions (doctors, nurses, emergency personnel, software engineers on-call), single-parent households, and nuclear families, traditional 9-to-5 daycares fail to meet modern childcare requirements. 

Parents routinely encounter:
* **Zero nighttime or weekend availability**: Conventional crèches close at 6:00 PM.
* **Opacity in caregiver background checks**: Reluctance to trust unverified personnel.
* **No real-time availability**: Booking relies on obsolete phone calls and manual reservations.
* **Inflexible pricing**: Rigid monthly or annual fees with no options for drop-in or shift work.

**Little Steps** solves this crisis by providing a centralized platform with real-time room capacity tracking, verified caregiver credentials, multi-shift booking (Hourly, Day Care, Night Shift, Emergency), and flexible subscription packages.

---

## 🚀 Key Platform Features

### 👩‍👧 1. Parent & Family Features
* **Multi-Faceted Search & Filters**: Search daycares by keyword, city, **24×7 availability toggle**, child age group (`Infant`, `Toddler`, `Preschool`), timing shift (`Day`, `Night Shift`, `Emergency Drop-in`), and max hourly rate.
* **Rich Facility Profiles**: High-resolution facility photos, safety checklist (Pediatric CPR, CCTV, HEPA filtration), amenities (soundproof snooze pods, formula bar), and transparent pricing.
* **Verified Caregiver Rosters**: View staff credentials, state background checks, and child-to-caregiver ratios (e.g. 1:3 for infants).
* **Instant Slot Booking Wizard**: Select child, slot type, date, times, calculate instant price, or apply banked subscription hours for $0 checkout.
* **Parent Dashboard**: Real-time status tracking (`Awaiting Approval` ➔ `Confirmed` ➔ `Currently in Daycare` ➔ `Completed`), active subscriptions manager, and verified stay reviews.

### 🏫 2. Childcare Provider & Crèche Operations
* **Center Profile Management**: Configure facility amenities, licensed operating hours, and room capacities.
* **Live Capacity & Anti-Overbooking Engine**: Automatic slot guards prevent overbooking and maintain legal caregiver-to-child ratios across Infant, Toddler, and Preschool rooms.
* **Incoming Booking Requests Inbox**: Review parent reservation requests with child age and special instructions; one-click **Accept & Confirm** or **Decline**.
* **Active Attendance Desk**: Mark children as **Checked-In** on arrival and **Check-Out** on parent pickup.
* **Caregiver Roster Administration**: Add caregivers with certifications and assigned Day/Night shift rosters.

### 🛡️ 3. Platform Admin (Trust & Safety Compliance)
* **Document Verification Queue**: Audit uploaded state childcare licenses, fire department safety approvals, and police clearances.
* **One-Click Accreditation**: Approving an entity issues a verified badge platform-wide in real time.
* **System-Wide KPI Dashboard**: Monitor registered users, verified centers, active stays, platform gross revenue, and network capacity utilization %.

---

## 🛠️ Technology Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18 (Vite 6) Single Page Application |
| **Styling & Icons** | Tailwind CSS 3, Lucide React Icons |
| **Backend Framework** | Node.js (v20+) with Express.js |
| **Middleware** | CORS, Morgan HTTP logger, UUID |
| **Persistence** | Embedded in-memory & file-persisted JSON data store |
| **Architecture** | Decoupled REST API + SPA Client |

---

## 💻 Local Quick Start Guide

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/little-steps-childcare.git
cd little-steps-childcare
```

### 2. Run the Backend API Server
```bash
cd backend
npm install
npm start
```
* Backend runs on **`http://localhost:5001`**
* Health check: `http://localhost:5001/api/health`

### 3. Run the Frontend Web App
In a separate terminal:
```bash
cd frontend
npm install
npm run dev
```
* Open your browser at **`http://localhost:5173`**
* Test with the built-in **Prototype Persona Switcher** in the top navigation bar to test as:
  * **👩‍👧 Parent (Sarah Jenkins)**
  * **🏫 Provider (Elena Vance - Starlight 24/7)**
  * **🛡️ Admin (Marcus Chen - Compliance)**

---

## 🧪 Verification & Testing
* **Frontend Build**: Verified via `npm run build` (1,603 modules transformed cleanly).
* **Automated E2E Suite**: Tested booking creation, provider confirmation, check-in attendance, and admin license verification workflows.

---

## 📄 Documentation Deliverables
* [Detailed Project Report](docs/PROJECT_REPORT.md)
* [Product Requirements Document (PRD)](docs/PRD.md)
* [System Architecture & API Specs](docs/ARCHITECTURE.md)
* [Production Deployment Guide](docs/DEPLOYMENT.md)

---

## ⚖️ License
Distributed under the MIT License. See `LICENSE` for more information.
