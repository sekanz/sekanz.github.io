# Budget App v1.0

A complete, functional vanilla JavaScript budget application with no external dependencies. Manage real bank accounts, virtual goal buckets, income sources, monthly payments, retirement accounts, and project your financial future.

## Features

### Core Components
- **Real Accounts**: Track actual bank account balances
- **Virtual Accounts**: Create goal buckets with automatic allocations per paycheck
- **Income Sources**: Schedule recurring income (weekly, biweekly, monthly)
- **Monthly Payments**: Track scheduled expenses that deduct from real accounts
- **Retirement Accounts**: Track retirement savings with contributions, employer matching, and annual growth
- **Transactions**: Complete transaction history with manual transaction support

### Projection Engine
- Run financial simulations for 3, 6, 12 months, or custom periods
- Deep clones financial data for safe simulation
- Generates complete timeline of future events
- Calculates snapshots at each event
- Shows cash flow warnings and projected totals
- Pure vanilla JavaScript (no external libraries)

### User Interface
- Minimal, clean design
- Dashboard with key totals (real, virtual, retirement, net worth)
- Section-based organization
- Edit/delete functionality for all account types
- Modal forms for adding and editing accounts
- Responsive design for mobile and desktop
- Export/import data as JSON

## Project Structure

```
Budget02/
├── index.html      # Main UI structure
├── style.css       # Minimal, responsive styling
├── app.js          # All business logic and UI updates
└── README.md       # This file
```

## How to Use

### Quick Start

1. Open `index.html` in a web browser
2. Create a Real Account (e.g., "Checking Account") with starting balance
3. Create Virtual Accounts for goals (e.g., "Car Fund", "Emergency Savings")
4. Set up Income Sources (e.g., paychecks)
5. Add Monthly Payments (e.g., rent, subscriptions)
6. Optional: Add Retirement Accounts
7. Click "Process Due Items" to apply pending income and payments
8. Use "Run Projection" to forecast your financial future

### Key Actions

**Dashboard**: Shows real-time totals and net worth

**Real Accounts**: 
- Click "Add Account" to create a new bank account
- Edit/delete existing accounts
- Balances update automatically with income and payments

**Virtual Accounts**:
- Create goal buckets (e.g., car fund, vacation fund)
- Set allocation per paycheck
- Balances increase automatically when income is processed

**Income Sources**:
- Add paychecks or other recurring income
- Set frequency (weekly, biweekly, monthly)
- Automatically deposits to real account and allocates to virtual accounts
- Automatically contributes to retirement accounts

**Monthly Payments**:
- Track scheduled expenses
- Automatically deducts from real account on due date

**Retirement Accounts**:
- Track retirement savings separately from real accounts
- Set contribution per paycheck
- Add employer matching percentage
- Add annual growth rate

**Transactions**:
- View history of all transactions
- Add manual deposits/withdrawals
- View last 20 transactions (most recent first)

**Projections**:
- Select projection window (3/6/12 months or custom)
- Click "Run Projection" to forecast
- See summary cards and detailed table
- Warnings display if real account drops below $0 or $500

## Data Storage

All data is stored in **LocalStorage** and persists across sessions.

- **Export Data**: Download your budget as a JSON file
- **Import Data**: Upload a previously exported JSON file

## Code Organization (app.js)

The application is organized into a single `BudgetApp` class with sections for:

1. **Data Storage & Initialization**: Loading/saving to LocalStorage
2. **Real Accounts**: CRUD operations for bank accounts
3. **Virtual Accounts**: Goal bucket management
4. **Income Sources**: Recurring income management
5. **Monthly Payments**: Expense tracking
6. **Retirement Accounts**: Retirement savings management
7. **Transactions**: Transaction history
8. **Projection Engine**: Financial simulation system
9. **Automatic Processing**: Due item processing
10. **UI Updates**: Dashboard and list rendering
11. **Form Management**: Modal forms for CRUD operations
12. **Utility Functions**: Formatting, date calculations, ID generation

## Technical Details

### Pure Vanilla JavaScript
- No external libraries or frameworks
- No jQuery, React, Vue, or other dependencies
- ~850 lines of well-commented code

### Browser Compatibility
- Works in all modern browsers (Chrome, Firefox, Safari, Edge)
- Requires ES6 support
- LocalStorage required for persistence

### Performance
- All calculations done locally (no server needed)
- Instant updates and projections
- Minimal memory footprint

## Future Enhancement Suggestions

### Phase 1 (Easy)
- [ ] Visual charts using Canvas API (income vs expenses over time)
- [ ] Alerts/notifications for bills coming due
- [ ] Multiple currencies support
- [ ] Budget categories for better organization
- [ ] Tax bracket calculations for retirement planning
- [ ] Goal target dates with completion forecasts

### Phase 2 (Medium)
- [ ] CSV import/export for spreadsheet integration
- [ ] Recurring transaction templates
- [ ] Budget vs actual comparison
- [ ] "What-if" scenario analysis (adjust salary, savings rates, etc.)
- [ ] Investment returns modeling
- [ ] Inflation adjustment for projections
- [ ] Savings rate tracking and recommendations

### Phase 3 (Advanced)
- [ ] Dark mode UI theme
- [ ] Account linking (read-only API integration)
- [ ] PDF report generation
- [ ] Cloud sync across devices
- [ ] Historical data and reporting
- [ ] Machine learning for expense categorization
- [ ] Debt payoff calculator and optimizer
- [ ] Net worth tracking over time with charts

### Performance Optimizations
- [ ] Pagination for transaction lists (100+ transactions)
- [ ] Batch processing for large projections
- [ ] Indexed data structures for faster searches

### Code Improvements
- [ ] Split app.js into separate modules (storage.js, accounts.js, projection.js, etc.)
- [ ] Add unit tests
- [ ] Add input validation and error handling
- [ ] TypeScript for type safety

## Example Workflow

1. **Initial Setup**:
   - Add Real Account: "Checking" ($5,000)
   - Add Real Account: "Savings" ($2,000)
   - Add Virtual Account: "Car Fund" ($200/paycheck)
   - Add Virtual Account: "Vacation" ($100/paycheck)
   - Add Retirement Account: "401k" ($500/paycheck, 50% match, 5% growth)

2. **Regular Income**:
   - Add Income Source: "Salary" ($3,000 biweekly, next date = 2026-05-15)
   - When date arrives, click "Process Due Items"
   - Income deposits to Checking
   - $200 → Car Fund, $100 → Vacation, $500 → 401k (+ $250 match)

3. **Track Expenses**:
   - Add Monthly Payment: "Rent" ($1,500, due 2026-05-01)
   - Add Monthly Payment: "Electric" ($120, due 2026-05-08)
   - Click "Process Due Items" to deduct automatically

4. **Plan Ahead**:
   - Click "Run Projection" for 12 months
   - See where you'll be financially
   - Adjust income/expenses as needed
   - Get warnings if accounts go negative

## Troubleshooting

**Data not saving?**
- Check if LocalStorage is enabled in browser settings
- Try exporting and reimporting data

**Projection looks wrong?**
- Verify all income sources have correct next pay dates
- Check that all accounts are linked properly
- Ensure frequencies are set correctly

**Form won't submit?**
- Check that all required fields are filled
- Dates must be in YYYY-MM-DD format
- Amounts must be valid numbers

## License

This is a personal finance tool. Use freely and modify as needed.

## Version History

**v1.0 (Current)**
- Initial release
- All core features implemented
- Projection engine functional
- Full CRUD for all account types
- Export/import support
