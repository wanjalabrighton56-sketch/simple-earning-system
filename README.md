# Simple Earning System

A production-ready task-based earning platform with multi-level referral system built with React, TypeScript, Supabase, and PayHero.

## Features

- **User Registration** with referral link detection
- **Account Activation** via M-PESA payment (KES 500) using PayHero
- **Dual Wallet System**: Task Wallet and Team Wallet
- **Daily Tasks**: Earn KES 100 per approved writing task
- **3-Level Referral System**:
  - Level 1 (Direct): KES 300 per activation
  - Level 2 (Indirect): KES 100 per activation
  - Level 3 (Network): KES 50 per activation
- **Cash Out System**: Request withdrawals with admin approval
- **Real-time Updates**: Live balance and transaction updates
- **Mobile Responsive**: Works on all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Payments**: PayHero M-PESA Integration
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- PayHero account with API credentials

## Installation

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 2. Database Setup

1. Create a Supabase project at https://supabase.com
2. The database schema is automatically created when you access the Supabase dashboard
3. All migrations are already applied via the MCP tool
4. Your database should have these tables:
   - user_profiles
   - activation_payments
   - payment_callbacks
   - daily_tasks
   - withdrawals
   - transactions
   - referral_tree
   - admin_actions

### 3. Environment Configuration

#### Frontend (.env in root)
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### Backend (server/.env)
```env
PORT=3000
PAYHERO_USERNAME=your_payhero_username
PAYHERO_API_PASSWORD=your_payhero_api_password
PAYHERO_CHANNEL_ID=your_channel_id
CALLBACK_URL=http://localhost:3000/api/callback
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

## Running the Application

### Development Mode

#### Terminal 1 - Frontend
```bash
npm run dev
```
Frontend will run on http://localhost:5173

#### Terminal 2 - Backend
```bash
cd server
npm run dev
```
Backend will run on http://localhost:3000

### Production Build

```bash
npm run build
npm run preview
```

## User Flow

### 1. Registration
- User visits the site or clicks a referral link
- Fills registration form (username, email, phone, password)
- If from referral link, upline info is displayed
- Account is created but not activated

### 2. Account Activation
- User is redirected to payment page
- Enters M-PESA phone number
- Receives STK push on phone
- Enters M-PESA PIN to confirm payment of KES 500
- Upon successful payment:
  - Account is activated
  - Referral commissions distributed to uplines
  - User redirected to dashboard

### 3. Dashboard
- View wallet balances (Task & Team)
- Quick action cards
- Team statistics
- Total earnings overview

### 4. Daily Tasks
- Submit 250+ word article daily
- Earn KES 100 per approved task
- Task submission window: Mon-Fri, 10 AM - 4 PM
- Payment added to Task Wallet after admin approval

### 5. Team Building
- Share unique referral link
- View team structure (3 levels)
- Track commissions earned
- Real-time team growth updates

### 6. Cash Out
- Select wallet source (Task or Team)
- Enter amount (minimum KES 500)
- Submit request
- Admin approves and processes payment

## Commission Structure

| Level | Relationship | Commission per Activation |
|-------|-------------|---------------------------|
| L1 | Direct referrals | KES 300 |
| L2 | Their referrals | KES 100 |
| L3 | Their referrals | KES 50 |

## Admin Operations

### Approving Daily Tasks
1. Access Supabase dashboard
2. Go to `daily_tasks` table
3. Review submissions
4. Update `status` to "Approved"
5. System automatically:
   - Credits KES 100 to user's Task Wallet
   - Creates transaction record

### Processing Withdrawals
1. Access Supabase dashboard
2. Go to `withdrawals` table
3. Filter by `status = 'Pending'`
4. Verify user has sufficient balance
5. Process M-PESA payment manually
6. Update `status` to "Approved"
7. Update `processed_at` timestamp
8. System automatically deducts from user's wallet

## Database Schema

### user_profiles
- Core user data and wallet balances
- Referral tracking
- Activation status

### activation_payments
- Tracks KES 500 activation fees
- PayHero transaction details
- Payment status

### daily_tasks
- User task submissions
- Word count tracking
- Admin review status

### withdrawals
- Cash out requests
- Wallet source tracking
- Admin approval workflow

### transactions
- Complete financial audit trail
- All balance changes logged

### referral_tree
- Multi-level relationship mapping
- Automatic commission distribution

## Security Features

- Row Level Security (RLS) on all tables
- Users can only access their own data
- Supabase Auth for authentication
- Service role for admin operations
- Audit trail for all admin actions
- Secure payment processing via PayHero

## API Documentation

### Payment Endpoints

#### POST /api/pay
Initiate activation payment
```json
{
  "phone": "0712345678",
  "amount": 500,
  "reference": "ACTIVATION_xxx"
}
```

#### POST /api/callback
Receive PayHero payment confirmation (automatic)

#### GET /api/status/:externalRef
Check payment status

## Deployment

### Frontend Deployment
Deploy to Vercel, Netlify, or any static hosting:
```bash
npm run build
# Upload dist/ folder
```

### Backend Deployment
Deploy to Railway, Render, or Heroku:
```bash
cd server
# Follow platform-specific deployment guide
```

### Environment Variables
Set all environment variables in your deployment platform.

### Important
- Ensure CALLBACK_URL is publicly accessible
- Use production Supabase credentials
- Secure all API keys and passwords

## Troubleshooting

### Payment Issues
- Verify PayHero credentials
- Check phone number format (254XXXXXXXXX)
- Ensure callback URL is accessible
- Review server logs

### Database Issues
- Verify Supabase credentials
- Check RLS policies are enabled
- Ensure service role key is used for admin operations
- Review migration status

### Build Errors
```bash
npm install
npm run build
```

## Support

For issues or questions:
1. Check server logs
2. Review Supabase logs
3. Verify environment variables
4. Check PayHero transaction status

## License

Proprietary - All rights reserved

## Credits

Built with modern web technologies for a seamless earning experience.
