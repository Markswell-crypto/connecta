# Connecta ISP Client

Modern React frontend for the Connecta ISP captive portal system with frictionless user experience.

## Overview

The Connecta ISP client is a React/Vite application that provides:
- Instant package listing without authentication (captive portal landing page)
- Streamlined payment flow with "Pay & Connect" buttons
- Real-time payment status tracking
- Optional login/register for account management
- Responsive mobile-first design
- Seamless integration with backend payment and RADIUS systems

## Features

### Captive Portal Experience (No Authentication Required)
- **Landing Page**: Immediate visibility of available internet packages
- **Package Cards**: Clear display of price, speed, duration/data limits
- **Payment Flow**: One-click "Pay & Connect" per package
- **Status Indicators**: Real-time feedback (idle → processing → success/failed)
- **Success State**: "Connected to Internet" confirmation
- **Failure Handling**: Retry options without losing package selection

### Optional Authentication (For Account Tracking Only)
- **Login Page**: Email/password authentication
- **Registration Page**: Account creation
- **Profile Page**: View usage history, payment tracking, personal info
- **Logout**: Clear session and return to captive portal

### Admin Dashboard (Protected)
- System statistics and analytics
- User management
- Package management
- Payment history
- Session monitoring

## Technology Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS 3.x
- **Routing**: React Router v6
- **State Management**: React Hooks (useState, useEffect, useContext)
- **HTTP Client**: Axios
- **Icons**: Heroicons (via Tailwind)

## Components & Pages

### Public Pages (No Auth Required)
- **LandingPage** (`/`): Package listing with Pay & Connect buttons
- **NotFound** (`/*`): 404 page

### Auth Pages (Optional)
- **Login** (`/login`): Email/password sign-in
- **Register** (`/register`): Account creation
- **Profile** (`/profile`): User information and history

### Admin Pages (JWT + Admin Role Required)
- **AdminDashboard** (`/admin`): System overview and management
- **PackageManagement**: Create/edit/delete packages
- **UserManagement**: View/suspend/delete users
- **PaymentHistory**: Transaction tracking

## Setup & Installation

### Prerequisites
- Node.js 18+
- npm or yarn

### Client Setup
```bash
# Navigate to client directory
cd connecta-isp/client

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
# VITE_API_URL=http://localhost:5000 (backend URL)

# Start development server
npm run dev
```

### Environment Variables
```
VITE_API_URL=http://localhost:5000
```

## Architecture

### Core Layouts
- **Header**: Shows user-specific navigation (login/register when not authenticated, user info/logout when authenticated, plus admin link for admins)
- **Footer**: Simple copyright footer

### Service Layer
- **authService.js**: Handles registration, login, profile, token refresh
- **packageService.js**: Fetches packages from backend
- **paymentService.js**: Handles payment initiation and status tracking
- **voucherService.js**: Handles voucher redemption (optional feature)

### State Management
- React Context for user authentication state (optional)
- Local hooks for form states and UI interactions
- LocalStorage for persisting JWT tokens (when user chooses to authenticate)

## Payment Flow Implementation

1. **Package Selection**: User clicks on a package card
2. **Payment Initiation**: 
   - UI shows "Processing..." state
   - Frontend calls `paymentService.initiatePayment(packageId)`
   - Backend calls external payment API: `POST https://api.example.com/pay`
3. **Payment Processing**:
   - User completes payment on external gateway
   - Gateway redirects to success/failure page OR calls webhook
   - Backend receives callback at `/payments/callback`
4. **Payment Success Handling**:
   - Backend verifies payment with gateway
   - Creates subscription record
   - Starts RADIUS session (authenticate_user, authorize_user, start_session)
   - Returns success response to frontend
5. **Frontend Success State**:
   - Shows "Connected to Internet" message
   - User can now access the internet
   - Optional: Show connection details (session ID, expiry time)

## Error Handling & Resilience

- **Payment API Failures**: Show retry button without resetting package selection
- **Network Errors**: Display connection error with retry option
- **RADIUS Failures**: Log error but still grant internet access (graceful degradation)
- **Invalid Package IDs**: Show error but allow reselection
- **Expired Sessions**: Automatic redirection to captive portal when session ends

## Responsive Design

- Mobile-first approach with Tailwind CSS
- Package cards stack vertically on mobile, grid on desktop
- Buttons and form elements optimized for touch
- Readable typography at all screen sizes
- Optimized for captive portal display (small screens, potentially limited browsers)

## Deployment

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Static Hosting
The built client can be hosted on any static web server:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Traditional web servers (nginx, Apache)

### Docker (Optional)
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Integration with Backend

The client communicates with the Flask backend via RESTful APIs:

### Public API Calls
- `GET /packages` - Retrieve available packages
- `POST /payments/initiate` - Start payment process
- `POST /payments/callback` - Payment confirmation (called by payment gateway)

### Authenticated API Calls (Optional)
- `POST /auth/register` - Create account
- `POST /auth/login` - Authenticate user
- `GET /auth/profile` - Get user data
- `POST /auth/refresh` - Refresh token

### Admin API Calls (Protected)
- `GET /users` - List users (admin only)
- `GET /dashboard/stats` - System stats (admin only)
- Package management endpoints (admin only)

## Development Guidelines

### Component Structure
```
src/
├── components/          # Reusable UI components
├── pages/              # Page-level components
├── layouts/            # Header, footer, etc.
├── services/           # API service layers
├── hooks/              # Custom React hooks
└── App.jsx             # Main application component
```

### Styling Conventions
- Use Tailwind utility classes
- Follow mobile-first breakpoint approach
- Use semantic HTML where possible
- Maintain consistent spacing (4px base unit)
- Use responsive prefixes (sm:, md:, lg:, xl:) appropriately

### State Management Patterns
- Use useState for local component state
- Use useEffect for data fetching and subscriptions
- Use useContext sparingly for global state (auth)
- Consider custom hooks for complex logic

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## Accessibility

- Semantic HTML elements
- Proper ARIA labels where needed
- Sufficient color contrast (WCAG AA)
- Keyboard navigable interfaces
- Focus management for modals and dynamic content

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Create pull request

## License

MIT License