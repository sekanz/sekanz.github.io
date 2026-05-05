/**
 * Budget App - Virtual Savings Accounts
 * 
 * This app helps two predictable-income earners:
 * 1. Track real bank accounts (Checking, Savings, etc.)
 * 2. Create virtual savings accounts for goals (Car, Furniture, Emergency Fund, etc.)
 * 3. Automatically allocate each paycheck across virtual accounts
 * 4. Track all transactions (deposits, withdrawals)
 * 5. Persist all data to LocalStorage
 */

// ===== DATA STORAGE CLASS =====
class BudgetApp {
    constructor() {
        this.realAccounts = [];
        this.virtualAccounts = [];
        this.incomeSources = [];
        this.transactions = [];
        
        // Initialize app
        this.loadFromStorage();
        this.processDueIncomes();
        this.render();
        this.setupEventListeners();
    }

    // ===== LOCALSTORAGE METHODS =====
    /**
     * Save all data to LocalStorage
     */
    saveToStorage() {
        localStorage.setItem('budgetApp_realAccounts', JSON.stringify(this.realAccounts));
        localStorage.setItem('budgetApp_virtualAccounts', JSON.stringify(this.virtualAccounts));
        localStorage.setItem('budgetApp_incomeSources', JSON.stringify(this.incomeSources));
        localStorage.setItem('budgetApp_transactions', JSON.stringify(this.transactions));
    }

    /**
     * Load all data from LocalStorage
     */
    loadFromStorage() {
        const realAccounts = localStorage.getItem('budgetApp_realAccounts');
        const virtualAccounts = localStorage.getItem('budgetApp_virtualAccounts');
        const incomeSources = localStorage.getItem('budgetApp_incomeSources');
        const transactions = localStorage.getItem('budgetApp_transactions');

        this.realAccounts = realAccounts ? JSON.parse(realAccounts) : [];
        this.virtualAccounts = virtualAccounts ? JSON.parse(virtualAccounts) : [];
        this.incomeSources = incomeSources ? JSON.parse(incomeSources) : [];
        this.transactions = transactions ? JSON.parse(transactions) : [];
    }

    // ===== REAL ACCOUNT METHODS =====
    /**
     * Add a new real bank account
     */
    addRealAccount(name, balance) {
        const account = {
            id: this.generateId(),
            name,
            balance: parseFloat(balance) || 0
        };
        this.realAccounts.push(account);
        this.saveToStorage();
        return account;
    }

    /**
     * Get a real account by ID
     */
    getRealAccount(id) {
        return this.realAccounts.find(a => a.id === id);
    }

    /**
     * Update a real account balance
     */
    updateRealAccountBalance(id, newBalance) {
        const account = this.getRealAccount(id);
        if (account) {
            account.balance = parseFloat(newBalance) || 0;
            this.saveToStorage();
        }
    }

    /**
     * Delete a real account
     */
    deleteRealAccount(id) {
        this.realAccounts = this.realAccounts.filter(a => a.id !== id);
        this.saveToStorage();
    }

    /**
     * Get total of all real account balances
     */
    getTotalRealMoney() {
        return this.realAccounts.reduce((sum, a) => sum + a.balance, 0);
    }

    // ===== VIRTUAL ACCOUNT METHODS =====
    /**
     * Add a new virtual savings account (goal)
     */
    addVirtualAccount(name, allocationPerPaycheck, balance = 0) {
        const account = {
            id: this.generateId(),
            name,
            balance: parseFloat(balance) || 0,
            allocationPerPaycheck: parseFloat(allocationPerPaycheck) || 0
        };
        this.virtualAccounts.push(account);
        this.saveToStorage();
        return account;
    }

    /**
     * Get a virtual account by ID
     */
    getVirtualAccount(id) {
        return this.virtualAccounts.find(a => a.id === id);
    }

    /**
     * Update a virtual account
     */
    updateVirtualAccount(id, name, allocationPerPaycheck) {
        const account = this.getVirtualAccount(id);
        if (account) {
            account.name = name;
            account.allocationPerPaycheck = parseFloat(allocationPerPaycheck) || 0;
            this.saveToStorage();
        }
    }

    /**
     * Update a virtual account balance
     */
    updateVirtualAccountBalance(id, newBalance) {
        const account = this.getVirtualAccount(id);
        if (account) {
            account.balance = parseFloat(newBalance) || 0;
            this.saveToStorage();
        }
    }

    /**
     * Delete a virtual account
     */
    deleteVirtualAccount(id) {
        this.virtualAccounts = this.virtualAccounts.filter(a => a.id !== id);
        this.saveToStorage();
    }

    /**
     * Get total of all virtual account balances
     */
    getTotalVirtualMoney() {
        return this.virtualAccounts.reduce((sum, a) => sum + a.balance, 0);
    }

    /**
     * Get unallocated money (real money not in virtual accounts)
     */
    getUnallocatedMoney() {
        const totalReal = this.getTotalRealMoney();
        const totalVirtual = this.getTotalVirtualMoney();
        return Math.max(0, totalReal - totalVirtual);
    }

    // ===== INCOME SOURCE METHODS =====
    /**
     * Add a new income source (salary, side gig, etc.)
     */
    addIncomeSource(name, amount, frequency, nextPayDate, depositToAccountId, allocationRules = null) {
        const source = {
            id: this.generateId(),
            name,
            amount: parseFloat(amount) || 0,
            frequency, // "weekly", "biweekly", "monthly"
            nextPayDate, // ISO date string
            depositToAccountId,
            customAllocationRules: allocationRules // Optional custom rules
        };
        this.incomeSources.push(source);
        this.saveToStorage();
        return source;
    }

    /**
     * Get an income source by ID
     */
    getIncomeSource(id) {
        return this.incomeSources.find(s => s.id === id);
    }

    /**
     * Delete an income source
     */
    deleteIncomeSource(id) {
        this.incomeSources = this.incomeSources.filter(s => s.id !== id);
        this.saveToStorage();
    }

    /**
     * Process income: Add to real account and allocate to virtual accounts
     */
    processIncome(incomeSourceId) {
        const income = this.getIncomeSource(incomeSourceId);
        if (!income) return;

        const realAccount = this.getRealAccount(income.depositToAccountId);
        if (!realAccount) return;

        // Add income to real account
        realAccount.balance += income.amount;

        // Create transaction record
        const transaction = {
            id: this.generateId(),
            type: 'income',
            amount: income.amount,
            realAccountId: income.depositToAccountId,
            virtualAccountId: null,
            date: new Date().toISOString().split('T')[0],
            note: `Income: ${income.name}`
        };
        this.transactions.push(transaction);

        // Allocate to virtual accounts based on rules
        this.allocateIncomeToVirtualAccounts(income);

        // Update next pay date
        this.scheduleNextPayDate(income);

        this.saveToStorage();
    }

    /**
     * Allocate income to virtual accounts using rules
     */
    allocateIncomeToVirtualAccounts(income) {
        // If custom rules exist, use them
        if (income.customAllocationRules && Array.isArray(income.customAllocationRules)) {
            income.customAllocationRules.forEach(rule => {
                const virtualAccount = this.getVirtualAccount(rule.virtualAccountId);
                if (virtualAccount) {
                    virtualAccount.balance += rule.amount;
                }
            });
        } else {
            // Otherwise, allocate to virtual accounts by their default allocation per paycheck
            this.virtualAccounts.forEach(vAccount => {
                if (vAccount.allocationPerPaycheck > 0) {
                    vAccount.balance += vAccount.allocationPerPaycheck;
                }
            });
        }
    }

    /**
     * Calculate next pay date based on frequency
     */
    scheduleNextPayDate(income) {
        const currentDate = new Date(income.nextPayDate);

        switch (income.frequency) {
            case 'weekly':
                currentDate.setDate(currentDate.getDate() + 7);
                break;
            case 'biweekly':
                currentDate.setDate(currentDate.getDate() + 14);
                break;
            case 'monthly':
                currentDate.setMonth(currentDate.getMonth() + 1);
                break;
        }

        income.nextPayDate = currentDate.toISOString().split('T')[0];
    }

    /**
     * Check for and process any due incomes
     * Called on app load to auto-process paychecks
     */
    processDueIncomes() {
        const today = new Date().toISOString().split('T')[0];

        this.incomeSources.forEach(income => {
            // If next pay date is today or earlier, process it
            if (income.nextPayDate <= today) {
                this.processIncome(income.id);
            }
        });

        this.saveToStorage();
    }

    // ===== TRANSACTION METHODS =====
    /**
     * Add a manual transaction
     * Type: "realDeposit", "realWithdrawal", "virtualWithdrawal"
     */
    addTransaction(type, amount, realAccountId, virtualAccountId, date, note) {
        amount = parseFloat(amount) || 0;

        // Process the transaction based on type
        if (type === 'realDeposit') {
            const account = this.getRealAccount(realAccountId);
            if (account) account.balance += amount;
        } else if (type === 'realWithdrawal') {
            const account = this.getRealAccount(realAccountId);
            if (account) account.balance -= amount;
        } else if (type === 'virtualWithdrawal') {
            const account = this.getVirtualAccount(virtualAccountId);
            if (account) account.balance -= amount;

            // Also deduct from real account (assuming money comes from real account)
            // Typically, we'd need to specify which real account, but for now
            // we'll deduct from the first/primary account
            if (realAccountId) {
                const realAccount = this.getRealAccount(realAccountId);
                if (realAccount) realAccount.balance -= amount;
            }
        }

        // Create transaction record
        const transaction = {
            id: this.generateId(),
            type,
            amount,
            realAccountId: realAccountId || null,
            virtualAccountId: virtualAccountId || null,
            date,
            note
        };

        this.transactions.push(transaction);
        this.saveToStorage();
        return transaction;
    }

    /**
     * Get all transactions, optionally filtered
     */
    getTransactions(filter = null) {
        if (!filter) return this.transactions;

        if (filter.accountId) {
            return this.transactions.filter(t =>
                t.realAccountId === filter.accountId || t.virtualAccountId === filter.accountId
            );
        }

        return this.transactions;
    }

    /**
     * Clear all transactions
     */
    clearTransactions() {
        this.transactions = [];
        this.saveToStorage();
    }

    /**
     * Delete a single transaction
     */
    deleteTransaction(id) {
        this.transactions = this.transactions.filter(t => t.id !== id);
        this.saveToStorage();
    }

    // ===== UTILITY METHODS =====
    /**
     * Generate a unique ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * Format a number as currency
     */
    formatCurrency(num) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(num);
    }

    /**
     * Format a date string
     */
    formatDate(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }

    // ===== UI RENDERING METHODS =====
    /**
     * Main render function - updates all UI
     */
    render() {
        this.renderDashboard();
        this.renderRealAccounts();
        this.renderVirtualAccounts();
        this.renderIncomeSourcesList();
        this.renderTransactionsList();
        this.updateIncomeSourceDropdowns();
        this.updateAccountSelects();
    }

    /**
     * Render dashboard stats
     */
    renderDashboard() {
        const totalReal = this.getTotalRealMoney();
        const totalVirtual = this.getTotalVirtualMoney();
        const unallocated = this.getUnallocatedMoney();

        document.getElementById('totalRealMoney').textContent = this.formatCurrency(totalReal);
        document.getElementById('totalAllocated').textContent = this.formatCurrency(totalVirtual);
        document.getElementById('unallocatedMoney').textContent = this.formatCurrency(unallocated);
    }

    /**
     * Render real accounts list
     */
    renderRealAccounts() {
        const container = document.getElementById('realAccountsList');

        if (this.realAccounts.length === 0) {
            container.innerHTML = '<p class="empty-state">No real accounts yet</p>';
            return;
        }

        container.innerHTML = this.realAccounts.map(account => `
            <div class="account-item">
                <div class="account-info">
                    <div class="account-name">${account.name}</div>
                    <div class="account-balance">Balance: ${this.formatCurrency(account.balance)}</div>
                </div>
                <div class="account-actions">
                    <button class="btn btn-danger btn-small" data-action="delete-real-account" data-id="${account.id}">Delete</button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Render virtual accounts list
     */
    renderVirtualAccounts() {
        const container = document.getElementById('virtualAccountsList');

        if (this.virtualAccounts.length === 0) {
            container.innerHTML = '<p class="empty-state">No virtual accounts yet</p>';
            return;
        }

        container.innerHTML = this.virtualAccounts.map(account => `
            <div class="account-item virtual">
                <div class="account-info">
                    <div class="account-name">${account.name}</div>
                    <div class="account-balance">Balance: ${this.formatCurrency(account.balance)}</div>
                    <div class="account-details">Allocation/Paycheck: ${this.formatCurrency(account.allocationPerPaycheck)}</div>
                </div>
                <div class="account-actions">
                    <button class="btn btn-danger btn-small" data-action="delete-virtual-account" data-id="${account.id}">Delete</button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Render income sources list
     */
    renderIncomeSourcesList() {
        const container = document.getElementById('incomeSourcesList');

        if (this.incomeSources.length === 0) {
            container.innerHTML = '<p class="empty-state">No income sources yet</p>';
            return;
        }

        container.innerHTML = this.incomeSources.map(income => {
            const account = this.getRealAccount(income.depositToAccountId);
            return `
                <div class="income-item">
                    <div class="income-info">
                        <div class="income-name">${income.name}</div>
                        <div class="income-details">
                            Amount: ${this.formatCurrency(income.amount)} | 
                            Frequency: ${income.frequency}
                        </div>
                        <div class="income-next-pay">
                            Next Pay: ${this.formatDate(income.nextPayDate)}
                        </div>
                        <div class="income-details">
                            Deposits to: ${account ? account.name : 'Unknown Account'}
                        </div>
                    </div>
                    <div class="account-actions">
                        <button class="btn btn-success btn-small" data-action="process-income" data-id="${income.id}">Process Now</button>
                        <button class="btn btn-danger btn-small" data-action="delete-income" data-id="${income.id}">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Render transactions list
     */
    renderTransactionsList() {
        const container = document.getElementById('transactionsList');

        if (this.transactions.length === 0) {
            container.innerHTML = '<p class="empty-state">No transactions yet</p>';
            return;
        }

        // Sort transactions by date (newest first)
        const sortedTransactions = [...this.transactions].sort((a, b) =>
            new Date(b.date) - new Date(a.date)
        );

        container.innerHTML = sortedTransactions.map(transaction => {
            const isDeposit = transaction.type === 'income' || transaction.type === 'realDeposit';
            const amountClass = isDeposit ? '' : 'withdrawal';
            const amountPrefix = isDeposit ? '+' : '-';

            let typeLabel = transaction.type;
            if (transaction.type === 'realDeposit') typeLabel = 'Deposit';
            else if (transaction.type === 'realWithdrawal') typeLabel = 'Withdrawal';
            else if (transaction.type === 'virtualWithdrawal') typeLabel = 'Virtual Withdrawal';
            else if (transaction.type === 'income') typeLabel = 'Income';

            return `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <div class="transaction-date">${this.formatDate(transaction.date)}</div>
                        <span class="transaction-type ${amountClass}">${typeLabel}</span>
                        <div class="transaction-details">${transaction.note}</div>
                    </div>
                    <div style="text-align: right;">
                        <div class="transaction-amount ${amountClass}">
                            ${amountPrefix}${this.formatCurrency(transaction.amount)}
                        </div>
                    </div>
                    <div class="account-actions">
                        <button class="btn btn-danger btn-small" data-action="delete-transaction" data-id="${transaction.id}">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    /**
     * Update real account dropdowns in forms
     */
    updateAccountSelects() {
        const selects = [
            'transactionRealAccount',
            'incomeDepositAccount'
        ];

        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (!select) return;

            const currentValue = select.value;
            select.innerHTML = '<option value="">-- Select Account --</option>' +
                this.realAccounts.map(account =>
                    `<option value="${account.id}">${account.name}</option>`
                ).join('');
            select.value = currentValue;
        });
    }

    /**
     * Update virtual account dropdowns in forms
     */
    updateIncomeSourceDropdowns() {
        const select = document.getElementById('transactionVirtualAccount');
        if (!select) return;

        const currentValue = select.value;
        select.innerHTML = '<option value="">-- Select Account --</option>' +
            this.virtualAccounts.map(account =>
                `<option value="${account.id}">${account.name}</option>`
            ).join('');
        select.value = currentValue;
    }

    // ===== EVENT LISTENER SETUP =====
    setupEventListeners() {
        // Modal controls
        document.addEventListener('click', (e) => {
            if (e.target.dataset.action === 'show-add-real-account') {
                this.showModal('addRealAccountModal');
            } else if (e.target.dataset.action === 'show-add-virtual-account') {
                this.showModal('addVirtualAccountModal');
            } else if (e.target.dataset.action === 'show-add-income') {
                this.showModal('addIncomeModal');
            } else if (e.target.dataset.action === 'show-add-transaction') {
                this.showModal('addTransactionModal');
                // Set today's date as default
                document.getElementById('transactionDate').valueAsDate = new Date();
            } else if (e.target.dataset.action === 'close-modal') {
                this.hideModal(e.target.closest('.modal'));
            }

            // Delete actions
            if (e.target.dataset.action === 'delete-real-account') {
                if (confirm('Delete this account?')) {
                    this.deleteRealAccount(e.target.dataset.id);
                    this.render();
                }
            } else if (e.target.dataset.action === 'delete-virtual-account') {
                if (confirm('Delete this account?')) {
                    this.deleteVirtualAccount(e.target.dataset.id);
                    this.render();
                }
            } else if (e.target.dataset.action === 'delete-income') {
                if (confirm('Delete this income source?')) {
                    this.deleteIncomeSource(e.target.dataset.id);
                    this.render();
                }
            } else if (e.target.dataset.action === 'delete-transaction') {
                if (confirm('Delete this transaction?')) {
                    this.deleteTransaction(e.target.dataset.id);
                    this.render();
                }
            } else if (e.target.dataset.action === 'process-income') {
                this.processIncome(e.target.dataset.id);
                this.render();
                alert('Income processed and allocated!');
            } else if (e.target.dataset.action === 'clear-history') {
                if (confirm('Clear all transaction history? This cannot be undone.')) {
                    this.clearTransactions();
                    this.render();
                }
            }
        });

        // Close modals by clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal);
                }
            });
        });

        // Form submissions
        document.getElementById('addRealAccountForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('realAccountName').value;
            const balance = document.getElementById('realAccountBalance').value;
            this.addRealAccount(name, balance);
            e.target.reset();
            this.hideModal(document.getElementById('addRealAccountModal'));
            this.render();
        });

        document.getElementById('addVirtualAccountForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('virtualAccountName').value;
            const allocation = document.getElementById('virtualAccountAllocation').value;
            const balance = document.getElementById('virtualAccountBalance').value;
            this.addVirtualAccount(name, allocation, balance);
            e.target.reset();
            this.hideModal(document.getElementById('addVirtualAccountModal'));
            this.render();
        });

        document.getElementById('addIncomeForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('incomeName').value;
            const amount = document.getElementById('incomeAmount').value;
            const frequency = document.getElementById('incomeFrequency').value;
            const nextPayDate = document.getElementById('incomeNextPayDate').value;
            const depositToAccountId = document.getElementById('incomeDepositAccount').value;
            const rulesText = document.getElementById('incomeAllocationRules').value.trim();

            let customRules = null;
            if (rulesText) {
                try {
                    customRules = JSON.parse(rulesText);
                } catch (err) {
                    alert('Invalid JSON in allocation rules. Using default rules instead.');
                }
            }

            this.addIncomeSource(name, amount, frequency, nextPayDate, depositToAccountId, customRules);
            e.target.reset();
            this.hideModal(document.getElementById('addIncomeModal'));
            this.render();
        });

        document.getElementById('addTransactionForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const type = document.getElementById('transactionType').value;
            const amount = document.getElementById('transactionAmount').value;
            const realAccountId = document.getElementById('transactionRealAccount').value;
            const virtualAccountId = document.getElementById('transactionVirtualAccount').value;
            const date = document.getElementById('transactionDate').value;
            const note = document.getElementById('transactionNote').value || 'Manual transaction';

            if (!type) {
                alert('Please select a transaction type');
                return;
            }

            if ((type === 'realDeposit' || type === 'realWithdrawal') && !realAccountId) {
                alert('Please select a real account');
                return;
            }

            if (type === 'virtualWithdrawal' && !virtualAccountId) {
                alert('Please select a virtual account');
                return;
            }

            this.addTransaction(type, amount, realAccountId, virtualAccountId, date, note);
            e.target.reset();
            this.hideModal(document.getElementById('addTransactionModal'));
            this.render();
        });

        // Show/hide account selects based on transaction type
        document.getElementById('transactionType').addEventListener('change', (e) => {
            const type = e.target.value;
            const realGroup = document.getElementById('realAccountGroup');
            const virtualGroup = document.getElementById('virtualAccountGroup');

            realGroup.style.display = (type === 'realDeposit' || type === 'realWithdrawal') ? 'block' : 'none';
            virtualGroup.style.display = (type === 'virtualWithdrawal') ? 'block' : 'none';
        });
    }

    /**
     * Show a modal dialog
     */
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            // Set income next pay date to today by default
            if (modalId === 'addIncomeModal') {
                document.getElementById('incomeNextPayDate').valueAsDate = new Date();
            }
        }
    }

    /**
     * Hide a modal dialog
     */
    hideModal(modal) {
        if (modal) {
            modal.classList.remove('active');
        }
    }
}

// ===== INITIALIZE APP =====
let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new BudgetApp();
});
