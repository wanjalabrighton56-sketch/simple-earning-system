# Quick Setup Guide

Follow these steps to get your earning system up and running.

## Step 1: Database Setup ✓

Your database schema is already created! You have these tables:
- ✓ user_profiles
- ✓ activation_payments
- ✓ daily_tasks
- ✓ withdrawals
- ✓ transactions
- ✓ referral_tree
- ✓ payment_callbacks
- ✓ admin_actions

## Step 2: Get PayHero Credentials

1. Visit https://payhero.co.ke
2. Sign up for an account
3. Complete verification
4. Go to Settings → API
5. Get these credentials:
   - Username
   - API Password
   - Channel ID

## Step 3: Configure Environment Variables

### Frontend (.env in root directory)
Already configured with your Supabase credentials!

```env
VITE_SUPABASE_URL=your_url_here
VITE_SUPABASE_ANON_KEY=your_key_here
```

### Backend (create server/.env)

```env
PORT=3000
PAYHERO_USERNAME=your_payhero_username_here
PAYHERO_API_PASSWORD=your_payhero_password_here
PAYHERO_CHANNEL_ID=your_channel_id_here
CALLBACK_URL=http://localhost:3000/api/callback
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_KEY=your_service_role_key_here
```

**Important:** Use your Supabase SERVICE ROLE key (not anon key) for the backend!

## Step 4: Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

## Step 5: Run the Application

Open TWO terminal windows:

### Terminal 1 - Frontend
```bash
npm run dev
```
Opens at: http://localhost:5173

### Terminal 2 - Backend
```bash
cd server
npm run dev
```
Runs on: http://localhost:3000

## Step 6: Test Registration Flow

1. Visit http://localhost:5173
2. Click "Create Account"
3. Fill in registration details
4. You'll be redirected to payment page
5. **For testing without real payment:**
   - You can manually update the database:
   ```sql
   UPDATE user_profiles
   SET is_activated = true,
       activation_date = now()
   WHERE email = 'your_test_email@example.com';
   ```

## Step 7: PayHero Setup for Production

### Local Testing with ngrok

1. Install ngrok: https://ngrok.com/download
2. Run your backend: `cd server && npm run dev`
3. In another terminal: `ngrok http 3000`
4. Copy the ngrok URL (e.g., https://abc123.ngrok.io)
5. Update server/.env:
   ```env
   CALLBACK_URL=https://abc123.ngrok.io/api/callback
   ```
6. Restart your backend server
7. Now PayHero can send callbacks to your local machine!

### Production Deployment

1. Deploy backend to Railway/Render/Heroku
2. Get your production URL
3. Update CALLBACK_URL to: `https://yourapp.com/api/callback`
4. Configure PayHero callback URL in their dashboard

## Common Issues & Solutions

### "Payment stuck in QUEUED"
- Ensure callback URL is publicly accessible
- Check PayHero credentials are correct
- Verify phone number format (254XXXXXXXXX)

### "Cannot connect to database"
- Check Supabase URL and keys are correct
- Verify service role key is used in backend (not anon key)
- Ensure database migrations were applied

### "Build errors"
```bash
rm -rf node_modules
npm install
npm run build
```

### "Port already in use"
- Change PORT in server/.env to a different port
- Or kill the process using the port:
```bash
# Find process
lsof -i :3000
# Kill it
kill -9 <PID>
```

## Feature Checklist

After setup, test these features:

- [ ] User registration with referral link
- [ ] Account activation payment
- [ ] Dashboard displays correctly
- [ ] Task submission works
- [ ] Team page shows referral link
- [ ] Referral link tracking works
- [ ] Wallet balances update in real-time
- [ ] Cash out request submission
- [ ] Commission distribution on activation

## Admin Tasks

### Approve Daily Tasks
1. Go to Supabase Dashboard
2. Navigate to: Table Editor → daily_tasks
3. Find pending tasks
4. Change `status` to "Approved"
5. System auto-credits KES 100 to Task Wallet

### Process Withdrawals
1. Go to Supabase Dashboard
2. Navigate to: Table Editor → withdrawals
3. Filter: `status = 'Pending'`
4. Process M-PESA payment manually
5. Update `status` to "Approved"
6. Set `processed_at` to current timestamp
7. System auto-deducts from wallet

## Production Checklist

Before going live:

- [ ] Replace ngrok URL with production domain
- [ ] Use production Supabase project
- [ ] Secure all environment variables
- [ ] Enable Supabase email confirmations (optional)
- [ ] Set up proper error logging
- [ ] Test payment flow end-to-end
- [ ] Test referral commission distribution
- [ ] Verify admin approval workflows
- [ ] Test on mobile devices
- [ ] Set up backup strategy

## Need Help?

Check these resources:
- Supabase Docs: https://supabase.com/docs
- PayHero Docs: https://payhero.co.ke/docs
- React Docs: https://react.dev

## Quick Command Reference

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
cd server
npm run dev          # Start server
npm start            # Production mode

# Database
# Access at: https://supabase.com/dashboard
```

## Success! 🎉

Your earning system is now ready. Users can:
- Register and activate accounts
- Complete daily tasks
- Build referral teams
- Earn commissions
- Request cash outs

Remember to keep your PayHero and Supabase credentials secure!
