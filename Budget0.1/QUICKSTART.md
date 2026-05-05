# Quick Start Guide - Budget Manager

## 60-Second Setup

### 1. Open the App
- Open `Index.html` in your web browser (Chrome, Firefox, Safari, Edge)
- You'll see the Budget Manager dashboard

### 2. Add Your First Account (2 min)
- Click **"+ Add Real Account"**
- Name: "Checking" 
- Balance: Enter your checking account balance (e.g., 5000)
- Click "Add Account"

### 3. Create a Savings Goal (2 min)
- Click **"+ Add Virtual Account"**
- Name: "Car Fund" (or your goal)
- Allocation Per Paycheck: 500 (how much per paycheck)
- Starting Balance: 0 (or leave blank)
- Click "Add Account"

### 4. Set Up Your Paycheck (3 min)
- Click **"+ Add Income Source"**
- Name: "Your Salary" (or "Spouse Salary")
- Amount: 3000 (your net paycheck)
- Frequency: "Biweekly" (weekly/monthly if different)
- Next Pay Date: Click the date field and select next Friday (or whenever you get paid)
- Deposit to: "Checking" (the account from step 2)
- Allocation Rules: Leave blank (uses default allocation)
- Click "Add Income Source"

### 5. Process Your First Paycheck (1 min)
- In "Income Sources" section, click **"Process Now"** 
- Your checking account will jump to the new amount
- The Car Fund will show 500 allocated
- A transaction will appear in the history

**Total Time: ~10 minutes. You now have a working budget!**

---

## Common First Tasks

### Track a One-Time Expense

Example: "I just spent $200 on groceries from my checking account"

1. Click **"+ Add Transaction"**
2. Type: "Withdrawal from Real Account"
3. Amount: 200
4. Account: "Checking"
5. Date: Today
6. Note: "Groceries"
7. Click "Add Transaction"

**Result:** Checking balance drops by $200

### Spend from Your Car Fund Goal

Example: "I bought a car part for $150"

1. Click **"+ Add Transaction"**
2. Type: "Withdrawal from Virtual Account"
3. Amount: 150
4. Virtual Account: "Car Fund"
5. Date: Today
6. Note: "Car exhaust repair"
7. Click "Add Transaction"

**Result:** 
- Car Fund drops by $150
- Checking also drops by $150 (money flows from real account)

### Add a Bonus to Checking

Example: "Got a $500 bonus"

1. Click **"+ Add Transaction"**
2. Type: "Deposit to Real Account"
3. Amount: 500
4. Account: "Checking"
5. Date: Today
6. Note: "Work bonus"
7. Click "Add Transaction"

**Result:** Checking balance increases by $500

### Set Up Spouse's Salary

Add another income source:

1. Click **"+ Add Income Source"**
2. Name: "Spouse Salary"
3. Amount: 2500 (or spouse's paycheck amount)
4. Frequency: "Weekly" (if they get paid weekly)
5. Next Pay Date: Their next payday
6. Deposit to: "Checking" (same account or separate)
7. Allocation Rules: Leave blank
8. Click "Add Income Source"

**Result:** Two income sources that process independently

---

## Dashboard Explained

### Top Stats (Three Big Numbers)

**Total Real Money**
- Sum of all your actual bank accounts
- Example: Checking ($3500) + Savings ($10000) = $13,500
- This is the real money you have

**Total Allocated (Virtual)**
- Sum of all your savings goals
- Example: Car Fund ($500) + Furniture ($300) + Emergency ($2000) = $2,800
- This is money you've reserved for specific goals

**Unallocated Money**
- Real money minus allocated money
- Example: $13,500 - $2,800 = $10,700
- This is free money not yet assigned to a goal

---

## Understanding Virtual Accounts

### Key Insight

Virtual accounts are **not separate bank accounts**. They're budgeting categories.

```
Your Real Bank Account (Checking): $10,000

Your Budget Plan (Virtual):
  ├─ Car Fund: $2,000 (you've budgeted this much for a car)
  ├─ Furniture: $1,500 (you've budgeted this much for furniture)
  └─ Emergency: $3,500 (you've budgeted this for emergencies)

Unallocated: $3,000 (not yet budgeted)
```

When you **withdraw $300 from Car Fund**, you're removing money from the real checking account AND marking it against the Car goal.

---

## Troubleshooting

### "My data disappeared!"
**Solution:** Check you're in the same browser and not private/incognito mode
- Private browsing clears data when closed
- Different browsers have separate storage

### "Income didn't process automatically"
**Solution:** Check the next pay date
- Must be today or earlier to auto-process on app load
- Click "Process Now" to manually trigger
- After processing, next date is automatically calculated

### "I see old data but want to start fresh"
**Solution:** Clear LocalStorage
- Right-click page → Inspect
- Console tab → Type: `localStorage.clear()`
- Refresh page
- App starts with no data

### "How do I back up my data?"
**Solution:** Regular backups via export (feature to add)
- For now: Take screenshots or screenshot the modal
- Future: Export as JSON button (planned improvement)

---

## Real-World Example: Young Couple Budget

### Setup
- You: Get paid $3,500 biweekly (every other Friday)
- Spouse: Gets paid $2,200 weekly (every Friday)
- Checking Account: $15,000 starting balance
- Want to save for: Car ($300/paycheck), Vacation ($150/paycheck), Emergency Fund ($200/paycheck)

### Implementation

**Step 1: Add Real Account**
- Name: "Checking"
- Balance: 15000

**Step 2: Add Virtual Accounts**
- Car Fund (allocation: $300)
- Vacation Fund (allocation: $150)
- Emergency Fund (allocation: $200)

**Step 3: Add Income #1 (Your Salary)**
- Name: "Your Salary"
- Amount: $3,500
- Frequency: Biweekly
- Next Pay Date: This Friday
- Deposit to: Checking
- Allocation: Leave blank (uses default: $300+$150+$200=$650 per paycheck)

**Step 4: Add Income #2 (Spouse Salary)**
- Name: "Spouse Salary"
- Amount: $2,200
- Frequency: Weekly
- Next Pay Date: This Friday
- Deposit to: Checking
- Allocation: Leave blank

**Step 5: Let It Run**
- Every Friday: Spouse's $2,200 arrives
  - Checking: +$2,200
  - All goals: +$300, +$150, +$200 respectively
- Every other Friday (when you get paid): Your $3,500 arrives
  - Same allocation

After 4 weeks:
```
Checking: ~$20,000 (5 paychecks received minus anything you spent)
Car Fund: $1,300 (accumulating)
Vacation: $650 (accumulating)
Emergency: $866 (accumulating)
```

---

## Next Steps

### Short Term
1. Set up all your real accounts
2. Define your savings goals
3. Configure your income sources
4. Start tracking transactions
5. Watch goals grow automatically with each paycheck

### Medium Term
1. Review allocation percentages (adjust as needed)
2. Watch unallocated money
3. Spend from goals as needed (the app tracks it)
4. Refine your allocation rules after a few paychecks

### Long Term
1. Build emergency fund to 3-6 months expenses
2. Use Car/Furniture/etc funds to save for major purchases
3. Review historical spending via transactions
4. Consider exporting data for tax/financial planning

---

## Tips & Tricks

**Tip 1: Test the App**
- Don't worry about getting balances perfect initially
- You can edit everything or delete and restart
- Data only persists if you keep browser open and don't clear storage

**Tip 2: Use "Process Now" to Test**
- Don't wait for payday to test
- Click "Process Now" on income to simulate paycheck
- Next date will advance automatically

**Tip 3: Create Multiple Real Accounts**
- Checking (daily spending)
- Savings (goals)
- Separate accounts per person
- The app links virtual accounts to one of them per paycheck

**Tip 4: Overallocate Initially**
- Set allocation rules > actual paycheck
- Helps you see if goals are realistic
- Adjust down until unallocated money is reasonable

**Tip 5: Regular Reviews**
- Check unallocated money weekly
- Ensure you're not overspending goals
- Adjust allocation percentages each month

---

## Video Walkthrough (Step-by-Step)

1. **00:00 - 00:30**: Open app and see empty dashboard
2. **00:30 - 01:00**: Add real account "Checking" with $5,000
3. **01:00 - 01:30**: Add virtual account "Car Fund" with $200/paycheck
4. **01:30 - 02:30**: Add income source "Salary" ($3,000, biweekly, next Friday)
5. **02:30 - 03:00**: Click "Process Now" to simulate paycheck
6. **03:00 - 03:30**: Add transaction: withdrawal $150 from Car Fund
7. **03:30 - 04:00**: Review dashboard showing updated balances and transaction history

---

## Support & Help

**Where's the full documentation?**
- See README.md for detailed features
- See ARCHITECTURE.md for technical details
- Code comments in app.js explain the logic

**Something doesn't work?**
- Check browser console (F12 → Console)
- Look for red error messages
- Try clearing LocalStorage and starting fresh

**What if I have ideas for improvements?**
- See README.md → "Future Improvements" section
- Consider adding features yourself (code is simple vanilla JS)
- Fork/modify for your specific needs

---

## One Last Thing

**This app is yours to customize!** 

It's 100% vanilla JavaScript with no dependencies. Want to:
- Change colors? Edit style.css
- Add new features? Edit app.js
- Add new fields? Edit Index.html
- Add calculations? Modify the BudgetApp class

Good luck with your budget! 💰
