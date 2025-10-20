# EduConsult Admin Panel

A comprehensive admin panel for managing the EduConsult educational consultation platform. Built with React.js and Tailwind CSS, this admin panel provides tools for monitoring platform metrics, managing faculty members, and handling financial transactions.

## Features

### 📊 Dashboard Overview
- **Real-time Statistics**: Monitor total students, faculty, bookings, and revenue
- **Interactive Charts**: Weekly bookings and monthly signups visualization
- **Platform Fee Tracking**: Multi-currency revenue monitoring (USD, INR)
- **Quick Actions**: Easy access to key management functions

### 👥 Faculty Management
- **Faculty Directory**: View and manage all faculty members
- **Detailed Profiles**: Complete faculty information with expertise and services
- **Service Management**: Monitor faculty services and pricing
- **Performance Metrics**: Track bookings, ratings, and earnings per faculty
- **Status Management**: Active, inactive, and suspended faculty states

### 💰 Withdrawal Requests
- **Request Processing**: Approve or reject faculty withdrawal requests
- **Payment Methods**: Support for bank transfers, PayPal, and Stripe
- **Financial Tracking**: Complete earnings and withdrawal history
- **Account Verification**: Secure payment account management
- **Audit Trail**: Full transaction history and approval tracking

## Technology Stack

- **Frontend**: React 19.1.1
- **Styling**: Tailwind CSS 3.4.17
- **Charts**: Chart.js with react-chartjs-2
- **Icons**: Heroicons
- **Routing**: React Router DOM 7.8.0
- **HTTP Client**: Axios 1.11.0
- **Real-time**: Socket.io Client 4.8.1

## Project Structure

```
admin/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Sidebar.js          # Navigation sidebar
│   │   ├── Header.js           # Top header with search and profile
│   │   ├── MainContentA.js     # Dashboard overview
│   │   ├── FacultyManagement.js # Faculty management interface
│   │   └── WithdrawalRequests.js # Withdrawal management
│   ├── App.js                  # Main app component with routing
│   ├── index.js               # App entry point
│   └── index.css              # Global styles and Tailwind imports
├── package.json
├── tailwind.config.js
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the admin directory:
```bash
cd admin
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The admin panel will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Serving Production Build

```bash
npm run serve
```

This serves the production build on port 3001.

## API Integration

The admin panel is designed to work with the EduConsult backend API. Key endpoints include:

### Admin Endpoints
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/faculty-list` - Faculty management
- `GET /api/admin/faculty/:id/details` - Faculty details
- `GET /api/admin/withdrawals` - Withdrawal requests
- `POST /api/admin/withdrawals/:id/approve` - Approve withdrawal
- `POST /api/admin/withdrawals/:id/reject` - Reject withdrawal

## Key Components

### MainContentA.js
The main dashboard component featuring:
- Statistics cards with trend indicators
- Interactive charts for bookings and signups
- Platform fee tracking with multi-currency support
- Quick action buttons for common tasks

### FacultyManagement.js
Comprehensive faculty management including:
- Faculty grid view with search and filtering
- Detailed faculty profiles with services and earnings
- Status management and bulk actions
- Service management per faculty member

### WithdrawalRequests.js
Financial transaction management with:
- Withdrawal request listing and filtering
- Detailed request review with account information
- Approval/rejection workflow
- Financial audit trail and history

## Styling and Design

The admin panel uses a custom Tailwind CSS configuration with:
- **Color Scheme**: Professional admin-focused color palette
- **Components**: Reusable admin-specific component classes
- **Responsive Design**: Mobile-first approach with tablet and desktop optimization
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: WCAG compliant design patterns

## Security Features

- **Role-based Access**: Admin-only access controls
- **Secure API Calls**: Protected endpoints with authentication
- **Input Validation**: Client-side validation for all forms
- **XSS Protection**: Sanitized data rendering
- **CSRF Protection**: Secure form submissions

## Development Guidelines

### Code Structure
- **Components**: Functional components with hooks
- **State Management**: Local state with useState and useEffect
- **Styling**: Tailwind utility classes with custom components
- **API Calls**: Axios for HTTP requests with error handling

### Best Practices
- Use semantic HTML elements
- Implement proper loading states
- Handle errors gracefully
- Maintain consistent naming conventions
- Write clean, readable code

## Contributing

1. Follow the existing code style and patterns
2. Test all new features thoroughly
3. Update documentation as needed
4. Ensure responsive design compatibility
5. Maintain accessibility standards

## License

This project is part of the EduConsult platform and follows the same licensing terms.

## Support

For technical support or questions about the admin panel, please contact the development team or refer to the main EduConsult documentation.
