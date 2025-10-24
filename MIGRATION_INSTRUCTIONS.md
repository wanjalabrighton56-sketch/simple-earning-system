# Database Migration Instructions

## Step 1: Apply Base Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `ujvtfrdkyflptxknmpma`
3. Navigate to: **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy the entire contents of: `supabase/migrations/20251023083441_initial_complete_schema.sql`
6. Paste into the SQL Editor
7. Click **Run** (or press Ctrl+Enter)
8. Wait for success message: "Success. No rows returned"

## Step 2: Apply Withdrawal Automation

1. Still in **SQL Editor**, click **New Query**
2. Copy the entire contents of: `supabase/migrations/20251023120000_withdrawal_automation.sql`
3. Paste into the SQL Editor
4. Click **Run**
5. Wait for success message

## Step 3: Verify Tables Created

1. Navigate to: **Table Editor** (left sidebar)
2. Verify these tables exist:
   - ✓ user_profiles
   - ✓ activation_payments
   - ✓ payment_callbacks
   - ✓ daily_tasks
   - ✓ withdrawals
   - ✓ transactions
   - ✓ referral_tree
   - ✓ admin_actions

## Step 4: Test Withdrawal Automation

### Test Scenario:
1. Create a test user with balance
2. Request a withdrawal
3. Check that balance is deducted immediately
4. Go to `withdrawals` table in Supabase
5. Change `status` from 'Pending' to 'Approved'
6. Verify transaction record is created automatically

## What the Automation Does

### On Withdrawal Request (User Action):
- ✓ Validates sufficient balance
- ✓ Deducts amount from appropriate wallet (Task or Referral)
- ✓ Creates transaction record with status "Pending"
- ✓ Sets withdrawal status to "Pending"

### On Admin Approval (Supabase Dashboard):
- ✓ Updates `status` to "Approved"
- ✓ Sets `approved_at` and `processed_at` timestamps
- ✓ Creates transaction record: "Withdrawal Approved"
- ✓ Logs admin action
- ✓ Balance already deducted (no change)

### On Admin Rejection (Supabase Dashboard):
- ✓ Updates `status` to "Rejected"
- ✓ Sets `rejected_at` and `processed_at` timestamps
- ✓ Creates transaction record: "Withdrawal Rejected"
- ✓ Logs admin action
- ⚠️ Balance stays deducted (NOT returned)

## Admin Workflow

### To Approve a Withdrawal:
1. Go to: **Table Editor** → `withdrawals`
2. Filter: `status = 'Pending'`
3. Find the withdrawal request
4. Process M-PESA payment manually (outside system)
5. Update the record:
   - `status` → `'Approved'`
   - `admin_id` → Your user ID (optional)
   - `processor_notes` → Any notes (optional)
6. Save
7. ✓ System automatically creates transaction record

### To Reject a Withdrawal:
1. Go to: **Table Editor** → `withdrawals`
2. Filter: `status = 'Pending'`
3. Find the withdrawal request
4. Update the record:
   - `status` → `'Rejected'`
   - `rejection_reason` → Reason for rejection
   - `admin_id` → Your user ID (optional)
5. Save
6. ✓ System automatically creates transaction record
7. ⚠️ User's balance remains deducted

## Troubleshooting

### Error: "Insufficient balance"
- User doesn't have enough in the selected wallet
- Check `user_profiles` table for current balances

### Error: "Function does not exist"
- Run the base schema migration first
- Ensure both migrations completed successfully

### Withdrawal not deducting balance
- Check trigger is created: Run `\df` in SQL Editor
- Verify trigger is enabled on `withdrawals` table

### Transaction not created on approval
- Verify `status` changed from 'Pending' to 'Approved'
- Check `transactions` table for new records
- Review Supabase logs for errors

## Important Notes

- ✓ **No UI changes** - Dashboard layout unchanged
- ✓ **Automatic balance deduction** - Happens on withdrawal request
- ✓ **Transaction logging** - All actions recorded
- ⚠️ **Balance not returned** - Even if admin rejects
- ✓ **Admin actions logged** - Full audit trail in `admin_actions` table

## Support

If you encounter issues:
1. Check Supabase logs: **Logs** → **Postgres Logs**
2. Verify migrations ran successfully
3. Test with a small amount first
4. Review transaction history in `transactions` table
