# Product Requirements Document (PRD)
## Little Steps – Trusted 24×7 Childcare Platform

**Document Version:** 1.0.0  
**Status:** Approved & Production-Ready  
**Domain:** Childcare Technology & Urban Family Infrastructure  
**Author:** Little Steps Product Engineering Team  

---

## 1. Executive Summary & Context

Modern urban economies operate around the clock. Healthcare personnel, emergency first responders, software engineers on night-on-call rotations, hospitality staff, single-parent households, and nuclear families frequently face work shifts outside standard 9:00 AM – 5:00 PM business hours. 

Despite this shift-work reality, conventional childcare options remain inflexible:
* Daycare facilities enforce rigid 9-to-5 hours with zero nighttime or weekend coverage.
* Reservations and capacity queries depend on phone calls and word-of-mouth references.
* Caregiver background verification is opaque, creating high anxiety for parents.
* Pricing structures are inflexible (forcing parents into rigid annual fees even if they only need drop-in or night-shift hours).

**Little Steps** bridges this societal gap with a digital platform providing **24×7 round-the-clock childcare, crèche, and emergency babysitting services**. It connects parents with accredited, background-verified childcare centers and certified night caregivers through real-time availability tracking, dynamic capacity controls, and flexible subscription plans.

---

## 2. Problem Statement & Market Opportunity

| Legacy Childcare Friction | Little Steps Digital Solution |
| :--- | :--- |
| **Phone-based booking & opaque availability** | Real-time digital room capacity tracking with instant slot reservation. |
| **Zero night-shift or emergency support** | 24×7 accredited network featuring specialized infant snooze pods and night nannies. |
| **Trust deficit regarding caregivers** | 100% verified staff profiles with police clearance, pediatric CPR, and licensing documents. |
| **Rigid annual/monthly full-time fees** | Granular pricing: Hourly drop-ins, day passes, and flexible monthly shift subscriptions. |
| **Manual paper attendance & check-ins** | Digital attendance rosters with biometric check-in and checkout audit logs. |

---

## 3. Product Vision & Objectives

### 3.1 Primary Objectives
1. **24×7 Access**: Establish a continuous, on-demand digital childcare network available 365 days a year.
2. **Uncompromised Safety & Trust**: Implement a mandatory multi-stage compliance verification process for all facilities and caregivers before onboarding.
3. **Real-Time Capacity Management**: Prevent facility overbooking via automated room-level capacity locks adhering to statutory caregiver-to-child ratios.
4. **Operational Digitization**: Provide daycare centers with modern scheduling, booking approvals, and revenue analytics tools.

### 3.2 Secondary Objectives
1. **Flexible Subscription Models**: Deliver monthly banked care packages (e.g. *Night Shift Guardian*, *Flexi-Drop-In 25*).
2. **Multi-Region Scalability**: Support geographic scaling across metropolitan tech hubs, hospital districts, and suburban zones.
3. **Data-Driven Insights**: Provide platform administrators and operators with live utilization and safety compliance metrics.

---

## 4. User Personas & Journey Maps

### Persona 1: Sarah Jenkins (Working Mother & Shift Worker)
* **Demographics**: 32-year-old Senior Systems Analyst; mother of Leo (18 months) and Maya (6 months).
* **Pain Points**: Works rotating night shifts (7:00 PM to 7:00 AM) and urgent on-call weekends. Standard daycares are closed when she leaves for work.
* **Needs**: A trusted center near the tech corridor offering soundproof infant snooze pods, verified night caregivers, and instant slot booking.

### Persona 2: Elena Vance (Childcare Center Director)
* **Demographics**: Director of Starlight 24×7 Childcare & Night Sanctuary.
* **Pain Points**: Empty beds during weekend and night hours; high administrative burden fielding phone inquiries while caring for children.
* **Needs**: A clean digital dashboard to manage room capacities, accept booking requests, view caregiver schedules, and track monthly earnings.

### Persona 3: Marcus Chen (Trust, Safety & Regulatory Admin)
* **Demographics**: Compliance Lead for Little Steps.
* **Pain Points**: Ensuring daycare operators adhere to fire safety standards, background checks, and state childcare licensing.
* **Needs**: A verification queue to audit uploaded licenses and caregiver certifications with one-click approval workflows.

---

## 5. Scope of Work

### 5.1 In-Scope (Phase 1 Deliverables)
* **Parent Experience**:
  * Center discovery engine with multi-faceted search (24×7 toggle, age groups, timings, max hourly rate).
  * Center details with facility images, safety features, amenities, and caregiver rosters.
  * Interactive booking wizard (hourly drop-in, full day, night shift, emergency) with price calculations.
  * Subscription management with hour usage tracking.
  * Parent dashboard with live booking status (`pending`, `confirmed`, `checked_in`, `completed`).
  * Verified stay reviews and ratings submission.
* **Childcare Provider Experience**:
  * Facility profile & operating hours configuration.
  * Live room capacity manager (Infant, Toddler, Preschool) with anti-overbooking controls.
  * Booking request approval queue (Accept / Decline with feedback).
  * Digital attendance check-in and checkout system.
  * Caregiver staff roster management with credential attachment.
  * Center analytics: monthly revenue, occupancy %, today's active children.
* **Platform Admin Experience**:
  * Regulatory document inspection modal for state licenses and police checks.
  * One-click approval / rejection workflow updating center verification status.
  * Platform-wide KPI analytics (gross volume, total users, average utilization).
  * Full partner directory management.

### 5.2 Out-of-Scope (Future Enhancements / Phase 2)
* Native iOS / Android mobile applications (Phase 1 is mobile-responsive web).
* Live continuous CCTV camera streaming into parent devices (Phase 2 compliance).
* Direct pediatric tele-health integrations and hospital emergency dispatch.
* Automated payment processing gateways (Stripe/Razorpay escrow integration).

---

## 6. Functional Requirements Matrix

### 6.1 Parent Module (FR-P)
* **FR-P01 (Authentication)**: Register and log in with email; manage profiles and children records (allergies, emergency contacts).
* **FR-P02 (Discovery & Filters)**: Filter centers by 24×7 operating mode, child age group (`infant`, `toddler`, `preschool`), timing shift (`day`, `night`, `emergency`), and maximum hourly price.
* **FR-P03 (Facility Profile)**: View infrastructure images, license number, safety badges, and caregiver profiles with experience and certifications.
* **FR-P04 (Slot Booking)**: Select child, date, start/end time, care type, and submit special instructions. Live cost estimate displayed prior to checkout.
* **FR-P05 (Subscription Application)**: If enrolled in a 24×7 subscription, apply banked hours to book slots with zero additional charge.
* **FR-P06 (Dashboard & Status)**: Real-time tracking of active stays (`Checked-In`, `Confirmed`, `Awaiting Approval`). Ability to cancel bookings prior to check-in.
* **FR-P07 (Reviews)**: Submit verified ratings and written feedback after session completion.

### 6.2 Provider Module (FR-PR)
* **FR-PR01 (Center Management)**: Maintain facility details, operating hours, and room capacities.
* **FR-PR02 (Capacity Controls)**: Enforce capacity thresholds (e.g. 10 infants maximum). System automatically prevents overbooking.
* **FR-PR03 (Request Workflow)**: Review incoming requests with child details and special instructions; Accept or Decline with stated reason.
* **FR-PR04 (Digital Attendance)**: Mark confirmed reservations as `Checked-In` upon child arrival and `Completed` upon parent pickup.
* **FR-PR05 (Staff Management)**: Add caregivers, assign shift windows (Day / Night), and attach CPR/background certifications.

### 6.3 Admin Module (FR-A)
* **FR-A01 (KYC & Verification)**: Review submitted facility licenses, fire safety audits, and caregiver background checks via document inspection.
* **FR-A02 (Accreditation Actions)**: Approve or reject verification requests, updating platform badges immediately.
* **FR-A03 (KPI Analytics)**: Monitor platform health: registered users, verified facilities, active bookings, gross revenue, and network capacity utilization.

---

## 7. Non-Functional Requirements (NFR)

* **NFR-01 (Performance)**: Page load time under 3.0 seconds on 4G mobile networks; API response times under 200ms.
* **NFR-02 (Security & Privacy)**: Child personal information and medical/allergy records protected by role-based access control (RBAC). Data sanitized across all endpoints.
* **NFR-03 (Reliability & Concurrency)**: Zero overbooking guarantee. Capacity counters are updated atomically to prevent race conditions during concurrent bookings.
* **NFR-04 (Usability & Accessibility)**: Intuitive parent-first UI with WCAG AA compliant contrast, clear typography, and touch targets >= 44x44px.
* **NFR-05 (Cross-Device Support)**: Responsive across mobile screens (375px+), tablets, and desktop workstations.

---

## 8. Key Performance Indicators (KPIs)

| Metric | Phase 1 Target | Description |
| :--- | :--- | :--- |
| **Verified Facility Onboarding** | >= 90% | Percentage of network centers with approved state licenses and fire safety clearance. |
| **Booking Fulfillment Rate** | >= 92% | Ratio of booking requests accepted and fulfilled without cancellation. |
| **Capacity Utilization Rate** | 60% – 75% | Average facility occupancy, maximizing provider revenues during night shifts. |
| **Parent Trust & Rating** | >= 4.7 / 5.0 | Aggregate parent satisfaction score from verified stays. |
| **Night Shift Adoption** | >= 30% | Percentage of total care hours booked between 7:00 PM and 7:00 AM. |
