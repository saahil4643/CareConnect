# CareConnect — Community Volunteer & Elderly Assistance Coordination System

**Tagline:** *"A little help. A stronger community."*

CareConnect is a modern, responsive web application connecting elderly residents who need assistance with trusted community volunteers for everyday, non-emergency tasks (grocery delivery, prescription collection, clinic appointment escort, and transportation).

---

## 🌟 Key Features

1. **Four Dedicated Role Portals:**
   - 👵 **Elderly Person:** High-contrast buttons, large readable typography, 1-click errand requests, milestone progress tracking, and volunteer contact.
   - 👨‍👩‍👧 **Family Member:** Request assistance on behalf of elderly relatives, manage relative's profile separately, and track status.
   - 🤝 **Community Volunteer:** Browse nearby open requests with senior privacy protection (general locality shown before claiming), accept tasks, start assistance, and mark tasks completed.
   - 🛡️ **Administrator:** Recharts analytics (category distribution, request statuses, activity over time), volunteer assignment modal, user management, feedback & cancellation audit logs.

2. **Accessibility-First Design:**
   - Toggleable **Normal / Large Font Mode** (`Aa`) specifically designed for senior visual accessibility.
   - High color contrast compliant with WCAG guidelines.
   - Visible focus indicators and accessible form controls.

3. **1-Click Demo Mode Bar:**
   - Sticky top bar with instant 1-click role switcher between all 4 personas without entering credentials:
     - **Eleanor Vance** (Elderly Person)
     - **David Vance** (Family Member)
     - **Sarah Jenkins** (Volunteer)
     - **Arthur Pendelton** (Administrator)
   - "Reset Demo Data" button to restore pre-seeded records at any time during project evaluations.

4. **Interactive Milestone Tracking & Feedback:**
   - 5-step live milestone stepper: *Request Submitted* → *Request Reviewed* → *Volunteer Assigned* → *In Progress* → *Completed*.
   - 5-star rating system with quality tags and duplicate submission prevention.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Running

From the root directory or inside `Frontend/`:

```bash
# Navigate into Frontend directory (if not already there)
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be live at: **`http://localhost:5173/`**

*(Note: You can also run `npm run dev` directly from the root workspace directory).*

---

## 👥 Pre-Configured Demo Accounts

You can click any of the 1-Click buttons on the `/login` page or in the top **Demo Mode** banner:

| Role | Name | Email | Default Status |
| :--- | :--- | :--- | :--- |
| **Elderly Person** | Eleanor Vance | `eleanor@careconnect.demo` | Active senior resident |
| **Family Member** | David Vance | `david@careconnect.demo` | Son coordinating for Eleanor |
| **Volunteer** | Sarah Jenkins | `sarah@careconnect.demo` | 28 tasks completed, 4.9 rating |
| **Administrator** | Arthur Pendelton | `admin@careconnect.demo` | Coordinator oversight |

---

## 💾 LocalStorage Demo State

All demo state is managed in the browser via `src/services/storageService.ts` using the following LocalStorage keys:
- `careconnect_users_v1`: List of senior members, volunteers, family, and admin.
- `careconnect_current_user_v1`: Currently active authenticated session.
- `careconnect_requests_v1`: Assistance requests with chronological timelines and reviews.
- `careconnect_notifications_v1`: In-app notification records.
- `careconnect_text_size`: Accessibility font size mode (`normal` or `large`).

To wipe changes made during testing and restore fresh mock data, click the **Reset** button in the top demo banner or inside **Admin > System Settings**.

---

## 🔌 Django REST Framework Backend Integration Guide

CareConnect's frontend is architected with a decoupled service layer ready for direct backend integration. All operations in [`src/services/storageService.ts`](file:///d:/LOGIC/CareConnect/Frontend/src/services/storageService.ts) return typed Promises.

### Proposed Django REST Framework API Endpoints:

| Endpoint | Method | Frontend Service Equivalent |
| :--- | :--- | :--- |
| `/api/auth/login/` | `POST` | `login()` |
| `/api/auth/register/` | `POST` | `registerUser()` |
| `/api/users/me/` | `GET`, `PATCH` | `getCurrentUser()`, `updateUser()` |
| `/api/requests/` | `GET`, `POST` | `getAssistanceRequests()`, `createAssistanceRequest()` |
| `/api/requests/<id>/` | `GET`, `PATCH` | `getRequestById()`, `updateRequestStatus()` |
| `/api/requests/<id>/accept/` | `POST` | `acceptRequest()` |
| `/api/requests/<id>/assign/` | `POST` | `assignVolunteer()` |
| `/api/requests/<id>/feedback/` | `POST` | `submitFeedback()` |
| `/api/notifications/` | `GET`, `PATCH` | `getNotifications()`, `markNotificationRead()` |

To switch from LocalStorage to your live Django backend:
1. Replace `localStorage` reads/writes in [`src/services/storageService.ts`](file:///d:/LOGIC/CareConnect/Frontend/src/services/storageService.ts) with `fetch()` or `axios.create({ baseURL: 'http://localhost:8000/api' })`.
2. Attach the JWT token in `Authorization: Bearer <token>` headers.
3. UI components will not require any architectural changes because they consume the centralized [`useData()`](file:///d:/LOGIC/CareConnect/Frontend/src/context/DataContext.tsx) and [`useAuth()`](file:///d:/LOGIC/CareConnect/Frontend/src/context/AuthContext.tsx) hooks!

---

## ⚠️ Non-Emergency Disclaimer
CareConnect is intended solely for everyday, non-emergency assistance (groceries, medicine collection, companion appointments). It is **not** an emergency medical dispatch service. For urgent medical emergencies, users are instructed to dial **911** or local emergency authorities immediately.
