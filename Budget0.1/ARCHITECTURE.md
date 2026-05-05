<!-- ARCHITECTURE & IMPLEMENTATION GUIDE -->

# Budget Manager - Technical Architecture

## System Overview

This budget app manages two layers of financial data:

```
REAL LAYER (Actual Money)
┌─────────────────────────────┐
│ Real Bank Accounts          │
│ ├─ Checking: $5,000         │
│ ├─ Savings: $10,000         │
│ └─ Emergency: $2,000        │
│ TOTAL: $17,000              │
└─────────────────────────────┘
        ↓ (allocate)
        
VIRTUAL LAYER (Goal Allocations)
┌─────────────────────────────┐
│ Virtual Savings Accounts    │
│ ├─ Car Fund: $2,000         │
│ ├─ Furniture: $1,500        │
│ ├─ Vacation: $3,000         │
│ └─ Emergency Fund: $8,000   │
│ TOTAL: $14,500              │
└─────────────────────────────┘

Unallocated: $17,000 - $14,500 = $2,500
```

### Key Concept: Allocation vs. Movement

- **Virtual accounts don't hold real money**—they represent budgeted amounts
- When you allocate $100 to "Car Fund", you're setting aside $100 from checking
- When you "withdraw" from Car Fund, money comes from the real account
- This allows flexible goal-based budgeting without moving actual money between banks

## Data Flow

### Initialization (On Load)

```
app.js loads
    ↓
BudgetApp constructor
    ↓
loadFromStorage() - read from browser LocalStorage
    ↓
processDueIncomes() - auto-process paychecks if date arrived
    ↓
render() - update all UI elements
    ↓
setupEventListeners() - attach click/submit handlers
    ↓
App ready for user interaction
```

### Adding Income (Example Flow)

```
User clicks "Add Income Source" button
    ↓
Modal dialog appears with form
    ↓
User fills:
  - Name: "Your Salary"
  - Amount: $3,000
  - Frequency: "biweekly"
  - Next Pay Date: "2024-01-15"
  - Deposit to Account: "Checking"
    ↓
User clicks "Add Income Source"
    ↓
Form submitted
    ↓
addIncomeSource() called
  - Creates income object with unique ID
  - Adds to this.incomeSources array
  - Saves to LocalStorage
    ↓
render() called
  - UI updates to show new income source
  - Date field shows "Next Pay: Jan 15, 2024"
```

### Processing a Paycheck (Daily Check)

```
User opens app on Jan 15, 2024
    ↓
processDueIncomes() runs (in constructor)
    ↓
Checks: for each income where nextPayDate <= today
    ↓
Found: "Your Salary" (Jan 15 <= Jan 15)
    ↓
processIncome() called:
    1. Adds $3,000 to "Checking" account
    2. Creates income transaction record
    3. allocateIncomeToVirtualAccounts():
       - If custom rules exist: use them
       - Else: allocate per account's allocationPerPaycheck
    4. scheduleNextPayDate():
       - Adds 14 days (biweekly)
       - Sets nextPayDate to Jan 29, 2024
    ↓
saveToStorage() - persist changes
    ↓
render() - update UI
    ↓
User sees "Checking: $8,000" and transaction recorded
    ↓
Virtual accounts updated with allocated amounts
```

### Adding a Transaction (Example: Virtual Withdrawal)

```
User clicks "Add Transaction"
    ↓
Modal appears
    ↓
User selects:
  - Type: "Withdrawal from Virtual Account"
  - Amount: $500
  - Virtual Account: "Car Fund"
  - Date: Today
  - Note: "Car repair"
    ↓
addTransaction() called:
    1. Gets virtual account ("Car Fund")
    2. Deducts: account.balance -= $500
    3. Gets real account (if linked)
    4. Deducts: realAccount.balance -= $500
    5. Creates transaction record:
       {
         id: "abc123",
         type: "virtualWithdrawal",
         amount: 500,
         virtualAccountId: "carfund_id",
         date: "2024-01-15",
         note: "Car repair"
       }
    ↓
saveToStorage() - persist changes
    ↓
render() - update UI
    ↓
User sees:
  - Car Fund balance reduced by $500
  - Real account balance reduced by $500
  - Transaction appears in history
```

## Core Classes & Methods

### BudgetApp Class

**Storage Methods:**
- `loadFromStorage()` - Populate arrays from LocalStorage
- `saveToStorage()` - Write arrays to LocalStorage

**Real Account Methods:**
- `addRealAccount(name, balance)` - Create new real account
- `getRealAccount(id)` - Fetch account by ID
- `updateRealAccountBalance(id, balance)` - Change balance
- `deleteRealAccount(id)` - Remove account
- `getTotalRealMoney()` - Sum all real balances

**Virtual Account Methods:**
- `addVirtualAccount(name, allocation, balance)` - Create goal
- `getVirtualAccount(id)` - Fetch account by ID
- `updateVirtualAccount(id, name, allocation)` - Modify account
- `updateVirtualAccountBalance(id, balance)` - Change balance
- `deleteVirtualAccount(id)` - Remove account
- `getTotalVirtualMoney()` - Sum all virtual balances
- `getUnallocatedMoney()` - Real total minus virtual total

**Income Methods:**
- `addIncomeSource(...)` - Create income stream
- `getIncomeSource(id)` - Fetch by ID
- `deleteIncomeSource(id)` - Remove source
- `processIncome(id)` - Execute paycheck
- `allocateIncomeToVirtualAccounts(income)` - Distribute money
- `scheduleNextPayDate(income)` - Calculate next date
- `processDueIncomes()` - Auto-run on load

**Transaction Methods:**
- `addTransaction(type, amount, ...)` - Record activity
- `getTransactions(filter)` - Fetch transactions
- `deleteTransaction(id)` - Remove transaction
- `clearTransactions()` - Erase all history

**UI Rendering:**
- `render()` - Update all UI (dashboard, lists, forms)
- `renderDashboard()` - Stats cards
- `renderRealAccounts()` - Account list
- `renderVirtualAccounts()` - Goals list
- `renderIncomeSourcesList()` - Income list
- `renderTransactionsList()` - History
- `updateAccountSelects()` - Populate dropdowns
- `updateIncomeSourceDropdowns()` - Populate goal dropdowns

**Event Handling:**
- `setupEventListeners()` - Attach all event handlers
- `showModal(modalId)` - Display dialog
- `hideModal(modal)` - Hide dialog

**Utility:**
- `generateId()` - Create unique IDs
- `formatCurrency(num)` - Format money
- `formatDate(dateStr)` - Format dates

## LocalStorage Structure

The app uses 4 LocalStorage keys:

```javascript
localStorage.getItem('budgetApp_realAccounts')
→ Array of real account objects
→ Example: [
     {id: "123", name: "Checking", balance: 5000},
     {id: "456", name: "Savings", balance: 10000}
   ]

localStorage.getItem('budgetApp_virtualAccounts')
→ Array of virtual account objects
→ Example: [
     {id: "789", name: "Car Fund", balance: 1000, allocationPerPaycheck: 200},
     {id: "012", name: "Vacation", balance: 500, allocationPerPaycheck: 100}
   ]

localStorage.getItem('budgetApp_incomeSources')
→ Array of income objects
→ Example: [
     {
       id: "income1",
       name: "Your Salary",
       amount: 3000,
       frequency: "biweekly",
       nextPayDate: "2024-01-15",
       depositToAccountId: "123",
       customAllocationRules: null
     }
   ]

localStorage.getItem('budgetApp_transactions')
→ Array of transaction objects
→ Example: [
     {
       id: "tx001",
       type: "income",
       amount: 3000,
       realAccountId: "123",
       virtualAccountId: null,
       date: "2024-01-15",
       note: "Income: Your Salary"
     }
   ]
```

## Event Flow: User Clicks Button

```
User clicks "Delete Real Account"
    ↓
document listener catches click event
    ↓
Checks e.target.dataset.action === "delete-real-account"
    ↓
Confirms "Delete this account?"
    ↓
deleteRealAccount(accountId) called
    ↓
Filters out account from this.realAccounts array
    ↓
saveToStorage() writes updated array to LocalStorage
    ↓
render() reads from memory (realAccounts array)
    ↓
renderRealAccounts() rebuilds HTML
    ↓
Sets container.innerHTML to new HTML
    ↓
Browser repaints DOM
    ↓
User sees account removed from UI
```

## Allocation Algorithm

### Default Allocation (No Custom Rules)

```
PaycheckAmount = $3,000
virtualAccounts = [
  { name: "Car", allocationPerPaycheck: $500 },
  { name: "Furniture", allocationPerPaycheck: $300 },
  { name: "Vacation", allocationPerPaycheck: $200 }
]

When paycheck arrives:
  Car balance += $500
  Furniture balance += $300
  Vacation balance += $200
  
(Unallocated = $3,000 - $500 - $300 - $200 = $1,500)
```

### Custom Allocation (JSON Rules)

```
customAllocationRules = [
  { virtualAccountId: "car123", amount: $1,000 },
  { virtualAccountId: "furn456", amount: $1,500 },
  { virtualAccountId: "vaca789", amount: $500 }
]

When paycheck arrives:
  Car balance += $1,000 (overrides default)
  Furniture balance += $1,500 (overrides default)
  Vacation balance += $500 (overrides default)
  
(Unallocated = $3,000 - $1,000 - $1,500 - $500 = $0)
```

## Transaction Types & Logic

### realDeposit
- **Effect**: Increases real account balance
- **Use Case**: Bonus, gift, refund
- **Action**: `realAccount.balance += amount`

### realWithdrawal
- **Effect**: Decreases real account balance
- **Use Case**: ATM withdrawal, check cashed, bill paid
- **Action**: `realAccount.balance -= amount`

### virtualWithdrawal
- **Effect**: Decreases both virtual AND real account balance
- **Use Case**: Spending from a goal (buy car part, furniture, etc.)
- **Action**: 
  - `virtualAccount.balance -= amount`
  - `realAccount.balance -= amount` (if linked)

### income
- **Effect**: Increases real account + virtual accounts
- **Use Case**: Automatic paycheck processing
- **Action**:
  - `realAccount.balance += amount`
  - `virtualAccounts[*].balance += allocationAmount` (per allocation rules)

## Date Handling

The app uses ISO date strings (YYYY-MM-DD) throughout:

```javascript
// Get today
const today = new Date().toISOString().split('T')[0]
// Result: "2024-01-15"

// Compare dates
if (income.nextPayDate <= today) {
  // Paycheck is due
}

// Calculate next biweekly date
const currentDate = new Date(income.nextPayDate)
currentDate.setDate(currentDate.getDate() + 14)
income.nextPayDate = currentDate.toISOString().split('T')[0]
```

This allows safe date comparisons and ensures dates persist correctly in JSON.

## Error Handling

The app implements minimal error handling:

```javascript
// Example: Processing non-existent income
const income = this.getIncomeSource(incomeSourceId)
if (!income) return; // Early exit if not found

// Example: Invalid JSON in allocation rules
try {
  customRules = JSON.parse(rulesText)
} catch (err) {
  alert('Invalid JSON in allocation rules.')
}
```

For production, consider adding:
- Try/catch blocks around LocalStorage operations
- Validation before DB operations
- User-friendly error messages
- Logging for debugging

## Performance Considerations

**Current:**
- All data in memory (small dataset)
- Full re-render on every change
- No filtering/pagination on transactions

**Optimizations for scaling:**
- Pagination for large transaction lists
- Selective re-renders (update only changed elements)
- Indexed searches by account/date
- Archive old transactions to separate storage
- Virtual scrolling for very long lists

## Security Notes

**Important:** This app runs entirely in the browser with LocalStorage:

✓ **Safe:**
- No network requests
- No server to compromise
- Data never leaves your device
- No credentials stored

⚠️ **Risks:**
- Anyone with device access can see data
- Clearing browser cache erases all data
- No password protection
- Not synced (device-only)

**Recommendations:**
- Use browser password manager for backup codes
- Export data regularly as JSON backup
- Store backup in secure location
- Never share device with untrusted users
- Consider browser private mode for privacy

## Testing Scenarios

### Scenario 1: Full Paycheck Cycle

1. Add real account: "Checking" ($0)
2. Add virtual account: "Car" ($200/paycheck)
3. Add income: "Salary" ($3000, biweekly, Jan 15)
4. Refresh page (simulate next day opening app on Jan 15)
5. Verify:
   - Checking: $3000
   - Car: $200
   - Unallocated: $2800
   - Transaction recorded

### Scenario 2: Virtual Withdrawal

1. Add real account: "Checking" ($5000)
2. Add virtual account: "Car" ($1000 balance)
3. Add transaction: Withdraw $300 from Car
4. Verify:
   - Checking: $4700
   - Car: $700
   - Transaction recorded

### Scenario 3: Multiple Income Sources

1. Add income 1: "Your Salary" ($3000, biweekly)
2. Add income 2: "Spouse Salary" ($2500, weekly)
3. Set allocation per account
4. Simulate multiple paydays
5. Verify correct allocation and scheduling

### Scenario 4: Data Persistence

1. Create accounts and income
2. Close browser completely
3. Reopen app
4. Verify all data intact
5. Clear LocalStorage
6. Reopen app
7. Verify app starts fresh

## Code Quality Notes

**Strengths:**
- Clear method names
- Consistent data structure
- Well-commented sections
- Separation of concerns (storage, logic, UI)
- No external dependencies

**Areas for improvement:**
- Add JSDoc comments to all methods
- Add input validation
- Extract modal logic into separate class
- Add unit tests
- Consider TypeScript for type safety
- Add error logging

---

This architecture provides a solid foundation for a personal budget tool. The separation of real and virtual accounts enables flexible goal-based budgeting without the complexity of multi-account transfers.
