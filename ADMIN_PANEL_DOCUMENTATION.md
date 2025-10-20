# Admin Panel Documentation

## Overview

The EduConsult Admin Panel is a comprehensive management system designed to oversee and manage the educational consultation platform. It provides administrators with tools to monitor platform activity, manage faculty members, handle financial transactions, and maintain system integrity.

## Table of Contents

1. [Admin Dashboard Overview](#admin-dashboard-overview)
2. [Student Dashboard Features](#student-dashboard-features)
3. [Faculty Dashboard Features](#faculty-dashboard-features)
4. [Navigation Structure](#navigation-structure)
5. [Key Functionalities](#key-functionalities)
6. [API Endpoints](#api-endpoints)
7. [Data Management](#data-management)
8. [Security Features](#security-features)

---

## Admin Dashboard Overview

### Main Dashboard Features

The admin dashboard provides a comprehensive overview of platform metrics and activities:

#### 1. **Statistics Overview**
- **Total Students**: Real-time count of registered students
- **Registered Faculty**: Number of active faculty members
- **Total Bookings**: Complete booking count across the platform
- **Revenue Tracking**: Multi-currency revenue display (USD, INR, etc.)

#### 2. **Analytics & Charts**
- **Weekly Bookings Chart**: Line chart showing booking trends over the week
- **Monthly Signups Chart**: Bar chart displaying new student registrations over the last 6 months
- **Platform Fee Tracking**: Real-time platform fee collection monitoring

#### 3. **Navigation Structure**
```
Admin Panel
├── Overview (Dashboard)
├── Faculty Management
└── Withdrawal Requests
```

### Admin Panel Components

#### MainContentA.jsx
- **Purpose**: Primary dashboard view with statistics and analytics
- **Features**:
  - Real-time statistics display
  - Interactive charts using Chart.js
  - Multi-currency revenue tracking
  - Platform fee monitoring

#### FacultyManagement.jsx
- **Purpose**: Complete faculty member management system
- **Features**:
  - Faculty listing with profile cards
  - Detailed faculty information view
  - Service management per faculty
  - Booking statistics per faculty member

#### WithdrawalRequests.jsx
- **Purpose**: Financial transaction management
- **Features**:
  - Pending withdrawal requests
  - Approval/rejection workflow
  - Financial transaction history

---

## Student Dashboard Features

### Dashboard Overview

The student dashboard provides a personalized learning environment with booking management, communication tools, and profile management.

#### 1. **My Bookings Section**
- **Upcoming Sessions**: List of scheduled consultation sessions
- **Session Details**: Service title, faculty name, and timing
- **Join Chat**: Direct access to live chat sessions
- **Booking Statistics**: Active booking count display

#### 2. **My Chats Section**
- **Live Chat Interface**: Real-time communication with faculty
- **Session Management**: Active and past chat sessions
- **Chat History**: Previous conversation records

#### 3. **Find Tutors Section**
- **Browse Faculty**: Search and filter available faculty members
- **Service Discovery**: View available consultation services
- **Booking Interface**: Schedule new consultation sessions

#### 4. **Profile Management**
- **Personal Information**: Update student profile details
- **Profile Image**: Upload and manage profile pictures
- **Account Settings**: Manage account preferences

### Student Dashboard Components

#### Booking.jsx
- **Purpose**: Primary booking management interface
- **Features**:
  - Upcoming sessions display
  - Past sessions history
  - Quick booking access
  - Session statistics

#### MyChat.jsx
- **Purpose**: Real-time communication system
- **Features**:
  - Live chat interface
  - Session selection
  - Message history
  - Faculty communication

#### EditProfile.jsx
- **Purpose**: Student profile management
- **Features**:
  - Personal information updates
  - Profile image management
  - Account settings

---

## Faculty Dashboard Features

### Dashboard Overview

The faculty dashboard provides tools for managing consultation services, tracking earnings, and communicating with students.

#### 1. **My Earnings Section**
- **Revenue Tracking**: Real-time earnings display
- **Payment History**: Complete transaction records
- **Earnings Analytics**: Charts and trends
- **Withdrawal Management**: Request and track withdrawals

#### 2. **View Bookings Section**
- **Scheduled Sessions**: Upcoming consultation appointments
- **Student Information**: Client details and requirements
- **Session Management**: Accept, reschedule, or cancel sessions
- **Booking Analytics**: Performance metrics

#### 3. **Manage Services Section**
- **Service Creation**: Add new consultation services
- **Service Editing**: Modify existing services
- **Pricing Management**: Set and update service rates
- **Availability Settings**: Manage time slots and availability

#### 4. **Live Chat Section**
- **Student Communication**: Real-time chat with students
- **Session Management**: Handle active consultation sessions
- **Chat History**: Previous conversation records
- **File Sharing**: Share resources and materials

#### 5. **Profile Management**
- **Professional Profile**: Update faculty information
- **Expertise Tags**: Manage areas of specialization
- **Profile Image**: Professional photo management
- **Service Portfolio**: Showcase offered services

### Faculty Dashboard Components

#### MainContentF.jsx
- **Purpose**: Faculty earnings and analytics dashboard
- **Features**:
  - Revenue tracking
  - Earnings charts
  - Performance metrics
  - Quick action buttons

#### ShowBookings.jsx
- **Purpose**: Booking management interface
- **Features**:
  - Upcoming sessions list
  - Student information display
  - Session management tools
  - Booking statistics

#### ServicesManagerF.jsx
- **Purpose**: Service management system
- **Features**:
  - Service creation and editing
  - Pricing management
  - Availability settings
  - Service analytics

#### MyChatF.jsx
- **Purpose**: Faculty communication interface
- **Features**:
  - Live chat with students
  - Session management
  - Message history
  - File sharing capabilities

---

## Navigation Structure

### Admin Panel Navigation
```
Admin Panel
├── Overview
│   ├── Statistics Cards
│   ├── Weekly Bookings Chart
│   ├── Monthly Signups Chart
│   └── Platform Fee Tracking
├── Faculty Management
│   ├── Faculty List View
│   ├── Faculty Detail View
│   ├── Service Management
│   └── Booking Analytics
└── Withdrawal Requests
    ├── Pending Requests
    ├── Approval Workflow
    └── Transaction History
```

### Student Dashboard Navigation
```
Student Portal
├── My Bookings
│   ├── Upcoming Sessions
│   ├── Past Sessions
│   └── Booking Statistics
├── My Chats
│   ├── Live Chat Interface
│   ├── Session Selection
│   └── Chat History
├── Find Tutors
│   ├── Faculty Browse
│   ├── Service Discovery
│   └── Booking Interface
└── My Profile
    ├── Personal Information
    ├── Profile Image
    └── Account Settings
```

### Faculty Dashboard Navigation
```
Faculty Panel
├── My Earnings
│   ├── Revenue Tracking
│   ├── Payment History
│   └── Earnings Analytics
├── View Bookings
│   ├── Scheduled Sessions
│   ├── Student Information
│   └── Session Management
├── Manage Services
│   ├── Service Creation
│   ├── Pricing Management
│   └── Availability Settings
├── My Chats
│   ├── Student Communication
│   ├── Session Management
│   └── Chat History
└── Edit Profile
    ├── Professional Profile
    ├── Expertise Tags
    └── Service Portfolio
```

---

## Key Functionalities

### 1. **Real-time Data Management**
- Live statistics updates
- Real-time chat functionality
- Dynamic booking management
- Instant notification system

### 2. **Multi-currency Support**
- USD and INR currency support
- Automatic currency conversion
- Localized pricing display
- Multi-currency revenue tracking

### 3. **Responsive Design**
- Mobile-first approach
- Tablet and desktop optimization
- Touch-friendly interface
- Adaptive layouts

### 4. **Security Features**
- JWT token authentication
- Role-based access control
- Secure API endpoints
- Data encryption

### 5. **Analytics & Reporting**
- Interactive charts and graphs
- Performance metrics
- User behavior tracking
- Financial reporting

---

## API Endpoints

### Admin Endpoints
```
GET /api/admin/stats - Platform statistics
GET /api/admin/faculty-list - Faculty management
GET /api/admin/faculty/:id/details - Faculty details
GET /api/admin/withdrawals - Withdrawal requests
POST /api/admin/withdrawals/:id/approve - Approve withdrawal
POST /api/admin/withdrawals/:id/reject - Reject withdrawal
```

### Student Endpoints
```
GET /api/students/me/details - Student profile
PUT /api/students/me/details - Update profile
GET /api/bookings/my-bookings - Student bookings
POST /api/chat/session - Create chat session
GET /api/chat/session/:id - Get chat session
```

### Faculty Endpoints
```
GET /api/faculty/me/details - Faculty profile
PUT /api/faculty/me/details - Update profile
GET /api/bookings/my-faculty-bookings - Faculty bookings
GET /api/faculty/services - Faculty services
POST /api/faculty/services - Create service
PUT /api/faculty/services/:id - Update service
```

---

## Data Management

### Student Data Structure
```javascript
{
  _id: "student_id",
  fullName: "Student Name",
  email: "student@email.com",
  profileImage: "image_url",
  bookings: [booking_objects],
  profileData: {
    // Additional profile information
  }
}
```

### Faculty Data Structure
```javascript
{
  _id: "faculty_id",
  fullName: "Faculty Name",
  email: "faculty@email.com",
  profileImage: "image_url",
  expertiseTags: ["tag1", "tag2"],
  services: [service_objects],
  bookings: [booking_objects]
}
```

### Booking Data Structure
```javascript
{
  _id: "booking_id",
  student: student_object,
  faculty: faculty_object,
  service: service_object,
  status: "active|completed|cancelled",
  scheduledTime: "datetime",
  duration: "minutes",
  price: "amount",
  currency: "USD|INR"
}
```

---

## Security Features

### 1. **Authentication & Authorization**
- JWT token-based authentication
- Role-based access control (Admin, Faculty, Student)
- Secure token storage
- Automatic token refresh

### 2. **Data Protection**
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### 3. **API Security**
- Rate limiting
- Request validation
- Error handling
- Secure headers

### 4. **User Privacy**
- Data encryption in transit
- Secure file uploads
- Privacy controls
- GDPR compliance

---

## Technical Implementation

### Frontend Technologies
- **React.js**: Component-based UI framework
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Data visualization library
- **GSAP**: Animation library
- **Axios**: HTTP client

### Backend Technologies
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **MongoDB**: Database
- **JWT**: Authentication
- **Socket.io**: Real-time communication

### Key Features
- **Responsive Design**: Mobile-first approach
- **Real-time Updates**: Live data synchronization
- **Progressive Web App**: Offline capabilities
- **Accessibility**: WCAG compliance
- **Performance**: Optimized loading and rendering

---

## Usage Guidelines

### For Administrators
1. **Monitor Platform Health**: Use the overview dashboard to track key metrics
2. **Manage Faculty**: Review and manage faculty members through the faculty management section
3. **Handle Financials**: Process withdrawal requests and monitor platform fees
4. **Maintain Quality**: Review faculty services and student feedback

### For Students
1. **Book Sessions**: Use the booking interface to schedule consultations
2. **Communicate**: Engage with faculty through the live chat system
3. **Manage Profile**: Keep profile information up to date
4. **Track Progress**: Monitor booking history and session outcomes

### For Faculty
1. **Manage Services**: Create and update consultation services
2. **Handle Bookings**: Accept and manage student appointments
3. **Communicate**: Use live chat to interact with students
4. **Track Earnings**: Monitor revenue and request withdrawals

---

This documentation provides a comprehensive overview of the admin panel system, covering all major functionalities, user interfaces, and technical implementations. The system is designed to be intuitive, secure, and scalable, supporting the educational consultation platform's core operations.
