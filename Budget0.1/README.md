# Budget Manager - Virtual Savings Accounts

A complete vanilla JavaScript budget app for managing real bank accounts and virtual savings goals with automatic income allocation.

## Features

✅ **Real Accounts** - Track multiple bank accounts (Checking, Savings, etc.)  
✅ **Virtual Accounts** - Create goal-based savings accounts (Car, Furniture, Emergency Fund, etc.)  
✅ **Two Income Streams** - Support for multiple predictable income sources  
✅ **Automatic Allocation** - Auto-distribute paychecks across virtual accounts  
✅ **Transaction Tracking** - Log all deposits, withdrawals, and virtual transfers  
✅ **LocalStorage Persistence** - All data saved locally on your device  
✅ **Dashboard Stats** - See at-a-glance totals of real, allocated, and unallocated money  
✅ **Responsive Design** - Works on desktop and mobile browsers

## Getting Started

### Running Locally

1. Open `Index.html` in any modern web browser
2. The app will load with no data (first time)
3. Start by adding:
   - Real accounts (e.g., "Checking", "Savings")
   - Virtual accounts (e.g., "Car Fund", "Furniture")
   - Income sources with pay frequency

### No Installation Required

This app is 100% vanilla JavaScript and runs entirely in your browser. No server, no build process, no dependencies.

## How to Use

### 1. Set Up Real Accounts

Click **"+ Add Real Account"** to create a bank account:
- Enter account name (e.g., "Checking")
- Enter current balance
- Account balance updates when you add transactions

### 2. Create Virtual Accounts

Click **"+ Add Virtual Account"** to create a savings goal:
- Enter goal name (e.g., "Car Fund")
- Set amount to allocate per paycheck
- Optional: Set starting balance

### 3. Add Income Sources

Click **"+ Add Income Source"** to set up automatic paycheck processing:
- Name (e.g., "Your Salary", "Spouse Salary")
- Pay amount
- Frequency (Weekly, Biweekly, Monthly)
- Next pay date
- Which real account to deposit into
- Optional custom allocation rules (advanced)

When a paycheck date arrives, the app automatically:
- Deposits income to the specified real account
- Allocates money to virtual accounts based on allocation rules
- Schedules the next paycheck

### 4. Track Transactions

Click **"+ Add Transaction"** to manually record:
- **Deposit to Real Account** - Add money (gift, bonus, etc.)
- **Withdrawal from Real Account** - Remove money (ATM withdrawal, bill paid)
- **Withdrawal from Virtual Account** - Spend from a savings goal

### 5. Monitor Progress

The dashboard shows:
- **Total Real Money** - Sum of all real account balances
- **Total Allocated** - Sum of all virtual account balances
- **Unallocated Money** - Real money not yet allocated to goals

## Data Model

All data is stored in your browser's LocalStorage using these JSON structures:

### Real Accounts
```json
{
  "id": "unique_id",
  "name": "Checking",
  "balance": 5000.50
}
```

### Virtual Accounts
```json
{
  "id": "unique_id",
  "name": "Car Fund",
  "balance": 1200.00,
  "allocationPerPaycheck": 200.00
}
```

### Income Sources
```json
{
  "id": "unique_id",
  "name": "Your Salary",
  "amount": 3000.00,
  "frequency": "biweekly",
  "nextPayDate": "2024-01-15",
  "depositToAccountId": "account_id",
  "customAllocationRules": null
}
```

### Transactions
```json
{
  "id": "unique_id",
  "type": "income|realDeposit|realWithdrawal|virtualWithdrawal",
  "amount": 100.00,
  "realAccountId": "account_id",
  "virtualAccountId": "account_id",
  "date": "2024-01-15",
  "note": "Grocery shopping"
}
```

## Advanced: Custom Allocation Rules

By default, virtual accounts receive their full "allocation per paycheck" amount. You can override this with custom rules.

When adding an income source, paste JSON in the "Allocation Rules" field:

```json
[
  {"virtualAccountId": "id1", "amount": 100},
  {"virtualAccountId": "id2", "amount": 250},
  {"virtualAccountId": "id3", "amount": 150}
]

```

Replace `id1`, `id2`, etc. with the actual virtual account IDs (shown in LocalStorage).

## File Structure

```
Budget/
├── Index.html        # Main HTML structure
├── style.css         # Clean, responsive styling
├── app.js            # Core app logic & data management
└── README.md         # This file
```

## Technical Details

### Key Classes & Methods

**BudgetApp** - Main application class
- `loadFromStorage()` - Load persisted data
- `saveToStorage()` - Persist all changes
- `processIncome()` - Handle paycheck arrival
- `addTransaction()` - Record financial activity
- `render()` - Update all UI elements

### LocalStorage Keys

```
budgetApp_realAccounts
budgetApp_virtualAccounts
budgetApp_incomeSources
budgetApp_transactions
```

### Data Flow

1. User fills form → `addRealAccount()` (or similar)
2. Method updates data in memory → `saveToStorage()`
3. `render()` reads from memory and updates DOM
4. User sees immediate UI updates

## Important Notes

- **Dates & Paychecks**: The app checks for due paychecks on load. If any income source has `nextPayDate <= today`, it processes automatically.
- **Virtual vs Real**: Virtual accounts don't hold real money—they're just allocations. Real account balance is where actual funds live.
- **Negative Balances**: The app allows negative balances (overdrafts/overspending). You can add logic to prevent this if desired.
- **Data Privacy**: Everything is stored locally. No data is sent to any server.
- **Browser Data Loss**: Clearing browser storage/cookies will erase all data. Consider periodic manual exports.

## Limitations & Future Improvements

### Current Limitations
- Single browser/device only (not synced across devices)
- No recurring bills/expenses beyond virtual withdrawals
- No budget caps or alerts
- Minimal validation (e.g., allowing negative balances)
- No import/export functionality

### Suggested Improvements

1. **Data Export/Import**
   - Add buttons to export all data as JSON
   - Add file upload to restore from backup
   - Allows backup and device transfers

2. **Budget Limits & Alerts**
   - Set max balance per virtual account
   - Alert when spending would exceed goal
   - Show progress bars toward goals

3. **Recurring Transactions**
   - Schedule recurring bills
   - Auto-deduct from real accounts on set dates
   - Useful for rent, subscriptions, etc.

4. **Advanced Reporting**
   - Monthly spending by category
   - Income vs. expenses charts
   - Year-to-date summaries
   - Net worth tracking over time

5. **Cloud Sync**
   - Add Firebase or similar backend
   - Sync across devices
   - Share budgets with spouse
   - Multi-user support

6. **Better Validation**
   - Prevent negative balances (optional toggle)
   - Warn when virtual allocation exceeds real balance
   - Validate income rules syntax

7. **UI Improvements**
   - Charts/graphs for visualization
   - Dark mode toggle
   - Drag-to-reorder accounts
   - Bulk transaction import (CSV)

8. **Mobile App**
   - Convert to React Native
   - Add push notifications for paychecks
   - Offline-first with sync capability

9. **Multi-Couple Features**
   - Separate budgets per person
   - Shared vs. individual accounts
   - Automatic percentage splits

10. **Smart Rules Engine**
    - "If real balance > X, move Y to virtual account Z"
    - Automatic emergency fund seeding
    - Goal-based auto-allocation logic

## Browser Support

Works on any modern browser:
- Chrome/Edge (v90+)
- Firefox (v88+)
- Safari (v14+)
- Mobile browsers (iOS Safari, Chrome Android)

## Troubleshooting

**Data disappeared**
- Check if browser storage was cleared
- Try opening in Incognito/Private mode (creates separate storage)
- Look for storage permission issues

**Income not processing**
- Verify `nextPayDate` is set correctly
- Check that real account still exists
- Try clicking "Process Now" manually

**Transactions not appearing**
- Ensure date is set correctly
- Check browser console for JavaScript errors
- Refresh page to trigger full re-render

**Performance issues**
- With thousands of transactions, filtering may slow down
- Consider archiving old transactions periodically

## License

This is a personal/educational project. Use freely.

## Questions or Suggestions?

The code is heavily commented. Review `app.js` for implementation details.

Happy budgeting! 💰
