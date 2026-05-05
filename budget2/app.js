/**
 * Budget App - Complete Vanilla JavaScript Budget Management System
 * Features: Real Accounts, Virtual Accounts, Income Sources, Monthly Payments,
 * Retirement Accounts, Transactions, and a Projection Engine
 */

// ============================================================================
// DATA STORAGE & INITIALIZATION
// ============================================================================

class BudgetApp {
    constructor() {
        this.data = {
            realAccounts: [],
            virtualAccounts: [],
            incomeSources: [],
            monthlyPayments: [],
            retirementAccounts: [],
            transactions: []
        };
        this.loadFromStorage();
        this.init();
    }

    // Storage Management
    loadFromStorage() {
        const stored = localStorage.getItem('budgetAppData');
        if (stored) {
            this.data = JSON.parse(stored);
        }
    }

    saveToStorage() {
        localStorage.setItem('budgetAppData', JSON.stringify(this.data));
    }

    exportData() {
        const dataStr = JSON.stringify(this.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `budget-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const imported = JSON.parse(e.target.result);
                this.data = imported;
                this.saveToStorage();
                this.updateAllUI();
                alert('Data imported successfully!');
            } catch (error) {
                alert('Error importing file: ' + error.message);
            }
        };
        reader.readAsText(file);
    }

    // Initialization
    init() {
        this.setupEventListeners();
        this.processAutomatic();
        this.updateAllUI();
    }

    setupEventListeners() {
        document.getElementById('processBtn').addEventListener('click', () => this.processAutomatic());
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });
        document.getElementById('importFile').addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.importData(e.target.files[0]);
            }
        });

        document.getElementById('projectionWindow').addEventListener('change', (e) => {
            const customInput = document.getElementById('customMonths');
            customInput.style.display = e.target.value === 'custom' ? 'block' : 'none';
        });
    }

    // ========================================================================
    // REAL ACCOUNTS
    // ========================================================================

    addRealAccount(name, balance) {
        const account = {
            id: this.generateId(),
            name,
            balance: parseFloat(balance)
        };
        this.data.realAccounts.push(account);
        this.saveToStorage();
        return account;
    }

    updateRealAccount(id, name, balance) {
        const account = this.data.realAccounts.find(a => a.id === id);
        if (account) {
            account.name = name;
            account.balance = parseFloat(balance);
            this.saveToStorage();
        }
    }

    deleteRealAccount(id) {
        this.data.realAccounts = this.data.realAccounts.filter(a => a.id !== id);
        this.saveToStorage();
    }

    getRealAccountBalance(accountId) {
        const account = this.data.realAccounts.find(a => a.id === accountId);
        return account ? account.balance : 0;
    }

    updateRealAccountBalance(accountId, amount) {
        const account = this.data.realAccounts.find(a => a.id === accountId);
        if (account) {
            account.balance += amount;
            this.saveToStorage();
        }
    }

    // ========================================================================
    // VIRTUAL ACCOUNTS
    // ========================================================================

    addVirtualAccount(name, allocationPerPaycheck) {
        const account = {
            id: this.generateId(),
            name,
            balance: 0,
            allocationPerPaycheck: parseFloat(allocationPerPaycheck)
        };
        this.data.virtualAccounts.push(account);
        this.saveToStorage();
        return account;
    }

    updateVirtualAccount(id, name, allocationPerPaycheck) {
        const account = this.data.virtualAccounts.find(a => a.id === id);
        if (account) {
            account.name = name;
            account.allocationPerPaycheck = parseFloat(allocationPerPaycheck);
            this.saveToStorage();
        }
    }

    deleteVirtualAccount(id) {
        this.data.virtualAccounts = this.data.virtualAccounts.filter(a => a.id !== id);
        this.saveToStorage();
    }

    getVirtualAccountBalance(accountId) {
        const account = this.data.virtualAccounts.find(a => a.id === accountId);
        return account ? account.balance : 0;
    }

    allocateToVirtualAccount(accountId, amount) {
        const account = this.data.virtualAccounts.find(a => a.id === accountId);
        if (account) {
            account.balance += amount;
            this.saveToStorage();
        }
    }

    withdrawFromVirtualAccount(accountId, amount) {
        const account = this.data.virtualAccounts.find(a => a.id === accountId);
        if (account) {
            account.balance = Math.max(0, account.balance - amount);
            this.saveToStorage();
        }
    }

    // ========================================================================
    // INCOME SOURCES
    // ========================================================================

    addIncomeSource(name, amount, frequency, nextPayDate, depositToAccountId) {
        const source = {
            id: this.generateId(),
            name,
            amount: parseFloat(amount),
            frequency, // "weekly" | "biweekly" | "monthly"
            nextPayDate,
            depositToAccountId
        };
        this.data.incomeSources.push(source);
        this.saveToStorage();
        return source;
    }

    updateIncomeSource(id, name, amount, frequency, nextPayDate, depositToAccountId) {
        const source = this.data.incomeSources.find(s => s.id === id);
        if (source) {
            source.name = name;
            source.amount = parseFloat(amount);
            source.frequency = frequency;
            source.nextPayDate = nextPayDate;
            source.depositToAccountId = depositToAccountId;
            this.saveToStorage();
        }
    }

    deleteIncomeSource(id) {
        this.data.incomeSources = this.data.incomeSources.filter(s => s.id !== id);
        this.saveToStorage();
    }

    getDueIncomes() {
        const today = new Date().toISOString().split('T')[0];
        return this.data.incomeSources.filter(source => source.nextPayDate <= today);
    }

    processIncome(sourceId) {
        const source = this.data.incomeSources.find(s => s.id === sourceId);
        if (!source) return;

        // Deposit to real account
        this.updateRealAccountBalance(source.depositToAccountId, source.amount);

        // Apply virtual account allocations
        this.data.virtualAccounts.forEach(vAccount => {
            if (vAccount.allocationPerPaycheck > 0) {
                this.allocateToVirtualAccount(vAccount.id, vAccount.allocationPerPaycheck);
            }
        });

        // Apply retirement contributions
        this.data.retirementAccounts.forEach(rAccount => {
            if (rAccount.contributionPerPaycheck > 0) {
                const contribution = rAccount.contributionPerPaycheck;
                let totalContribution = contribution;

                // Add employer match
                if (rAccount.employerMatchPercent > 0) {
                    const match = contribution * (rAccount.employerMatchPercent / 100);
                    totalContribution += match;
                }

                rAccount.balance += totalContribution;
            }
        });

        // Add transaction
        this.addTransaction('income', source.amount, source.depositToAccountId, null, new Date().toISOString().split('T')[0], `Income: ${source.name}`);

        // Update next pay date
        source.nextPayDate = this.getNextPayDate(source.nextPayDate, source.frequency);
        this.saveToStorage();
    }

    // ========================================================================
    // MONTHLY PAYMENTS
    // ========================================================================

    addMonthlyPayment(name, amount, frequency, nextDueDate, payFromRealAccountId) {
        const payment = {
            id: this.generateId(),
            name,
            amount: parseFloat(amount),
            frequency, // "monthly"
            nextDueDate,
            payFromRealAccountId
        };
        this.data.monthlyPayments.push(payment);
        this.saveToStorage();
        return payment;
    }

    updateMonthlyPayment(id, name, amount, frequency, nextDueDate, payFromRealAccountId) {
        const payment = this.data.monthlyPayments.find(p => p.id === id);
        if (payment) {
            payment.name = name;
            payment.amount = parseFloat(amount);
            payment.frequency = frequency;
            payment.nextDueDate = nextDueDate;
            payment.payFromRealAccountId = payFromRealAccountId;
            this.saveToStorage();
        }
    }

    deleteMonthlyPayment(id) {
        this.data.monthlyPayments = this.data.monthlyPayments.filter(p => p.id !== id);
        this.saveToStorage();
    }

    getDuePayments() {
        const today = new Date().toISOString().split('T')[0];
        return this.data.monthlyPayments.filter(payment => payment.nextDueDate <= today);
    }

    processPayment(paymentId) {
        const payment = this.data.monthlyPayments.find(p => p.id === paymentId);
        if (!payment) return;

        // Deduct from real account
        this.updateRealAccountBalance(payment.payFromRealAccountId, -payment.amount);

        // Add transaction
        this.addTransaction('realWithdrawal', payment.amount, payment.payFromRealAccountId, null, new Date().toISOString().split('T')[0], `Payment: ${payment.name}`);

        // Update next due date
        payment.nextDueDate = this.getNextMonthDate(payment.nextDueDate);
        this.saveToStorage();
    }

    // ========================================================================
    // RETIREMENT ACCOUNTS
    // ========================================================================

    addRetirementAccount(name, balance, contributionPerPaycheck, employerMatchPercent, growthRateAnnual) {
        const account = {
            id: this.generateId(),
            name,
            balance: parseFloat(balance),
            contributionPerPaycheck: parseFloat(contributionPerPaycheck),
            employerMatchPercent: parseFloat(employerMatchPercent) || 0,
            growthRateAnnual: parseFloat(growthRateAnnual) || 0
        };
        this.data.retirementAccounts.push(account);
        this.saveToStorage();
        return account;
    }

    updateRetirementAccount(id, name, balance, contributionPerPaycheck, employerMatchPercent, growthRateAnnual) {
        const account = this.data.retirementAccounts.find(a => a.id === id);
        if (account) {
            account.name = name;
            account.balance = parseFloat(balance);
            account.contributionPerPaycheck = parseFloat(contributionPerPaycheck);
            account.employerMatchPercent = parseFloat(employerMatchPercent) || 0;
            account.growthRateAnnual = parseFloat(growthRateAnnual) || 0;
            this.saveToStorage();
        }
    }

    deleteRetirementAccount(id) {
        this.data.retirementAccounts = this.data.retirementAccounts.filter(a => a.id !== id);
        this.saveToStorage();
    }

    getRetirementAccountBalance(accountId) {
        const account = this.data.retirementAccounts.find(a => a.id === accountId);
        return account ? account.balance : 0;
    }

    // ========================================================================
    // TRANSACTIONS
    // ========================================================================

    addTransaction(type, amount, realAccountId, virtualAccountId, date, note) {
        const transaction = {
            id: this.generateId(),
            type, // "income" | "realDeposit" | "realWithdrawal" | "virtualWithdrawal"
            amount: parseFloat(amount),
            realAccountId,
            virtualAccountId: virtualAccountId || null,
            date,
            note
        };
        this.data.transactions.push(transaction);
        this.saveToStorage();
        return transaction;
    }

    deleteTransaction(id) {
        this.data.transactions = this.data.transactions.filter(t => t.id !== id);
        this.saveToStorage();
    }

    // ========================================================================
    // PROJECTION ENGINE
    // ========================================================================

    runProjection() {
        const windowSelect = document.getElementById('projectionWindow').value;
        let months = parseInt(windowSelect);

        if (windowSelect === 'custom') {
            months = parseInt(document.getElementById('customMonths').value);
            if (!months || months < 1) {
                alert('Please enter a valid number of months');
                return;
            }
        }

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + months);

        // Deep clone all data
        const projectionData = {
            realAccounts: this.data.realAccounts.map(a => ({ ...a })),
            virtualAccounts: this.data.virtualAccounts.map(a => ({ ...a })),
            retirementAccounts: this.data.retirementAccounts.map(a => ({ ...a })),
            incomeSources: this.data.incomeSources.map(s => ({ ...s })),
            monthlyPayments: this.data.monthlyPayments.map(p => ({ ...p }))
        };

        // Build timeline of events
        const events = this.buildProjectionTimeline(projectionData, startDate, endDate);

        // Process events and create snapshots
        const snapshots = [];
        snapshots.push(this.createSnapshot(new Date(startDate), projectionData, 'Starting Balance'));

        events.forEach(event => {
            this.processProjectionEvent(event, projectionData);
            const eventName = this.getEventName(event, projectionData);
            snapshots.push(this.createSnapshot(new Date(event.date), projectionData, eventName));
        });

        // Display results
        this.displayProjectionResults(snapshots, startDate, endDate);
    }

    buildProjectionTimeline(projectionData, startDate, endDate) {
        const events = [];

        // Generate income events
        projectionData.incomeSources.forEach(source => {
            let currentDate = new Date(source.nextPayDate);
            while (currentDate <= endDate) {
                events.push({
                    date: new Date(currentDate),
                    type: 'income',
                    sourceId: source.id
                });
                currentDate = this.addFrequencyDays(new Date(currentDate), source.frequency);
            }
        });

        // Generate monthly payment events
        projectionData.monthlyPayments.forEach(payment => {
            let currentDate = new Date(payment.nextDueDate);
            while (currentDate <= endDate) {
                events.push({
                    date: new Date(currentDate),
                    type: 'monthlyPayment',
                    paymentId: payment.id
                });
                currentDate = new Date(currentDate);
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        });

        // Generate retirement growth events (monthly)
        let growthDate = new Date(startDate);
        while (growthDate <= endDate) {
            events.push({
                date: new Date(growthDate),
                type: 'retirementGrowth'
            });
            growthDate.setMonth(growthDate.getMonth() + 1);
        }

        // Sort by date
        events.sort((a, b) => a.date - b.date);
        return events;
    }

    processProjectionEvent(event, projectionData) {
        if (event.type === 'income') {
            const source = projectionData.incomeSources.find(s => s.id === event.sourceId);
            if (source) {
                const account = projectionData.realAccounts.find(a => a.id === source.depositToAccountId);
                if (account) {
                    account.balance += source.amount;
                }

                // Apply allocations
                projectionData.virtualAccounts.forEach(vAccount => {
                    vAccount.balance += vAccount.allocationPerPaycheck;
                });

                // Apply retirement contributions
                projectionData.retirementAccounts.forEach(rAccount => {
                    if (rAccount.contributionPerPaycheck > 0) {
                        const contribution = rAccount.contributionPerPaycheck;
                        const match = contribution * (rAccount.employerMatchPercent / 100);
                        rAccount.balance += contribution + match;
                    }
                });
            }
        } else if (event.type === 'monthlyPayment') {
            const payment = projectionData.monthlyPayments.find(p => p.id === event.paymentId);
            if (payment) {
                const account = projectionData.realAccounts.find(a => a.id === payment.payFromRealAccountId);
                if (account) {
                    account.balance -= payment.amount;
                }
            }
        } else if (event.type === 'retirementGrowth') {
            projectionData.retirementAccounts.forEach(rAccount => {
                if (rAccount.growthRateAnnual > 0) {
                    const monthlyGrowth = rAccount.balance * (rAccount.growthRateAnnual / 100) / 12;
                    rAccount.balance += monthlyGrowth;
                }
            });
        }
    }

    createSnapshot(date, projectionData, eventName = '') {
        const realTotal = projectionData.realAccounts.reduce((sum, a) => sum + a.balance, 0);
        const virtualTotal = projectionData.virtualAccounts.reduce((sum, a) => sum + a.balance, 0);
        const retirementTotal = projectionData.retirementAccounts.reduce((sum, a) => sum + a.balance, 0);

        return {
            date: date.toISOString().split('T')[0],
            eventName: eventName,
            realAccounts: projectionData.realAccounts.reduce((obj, a) => {
                obj[a.id] = a.balance;
                return obj;
            }, {}),
            virtualAccounts: projectionData.virtualAccounts.reduce((obj, a) => {
                obj[a.id] = a.balance;
                return obj;
            }, {}),
            retirementAccounts: projectionData.retirementAccounts.reduce((obj, a) => {
                obj[a.id] = a.balance;
                return obj;
            }, {}),
            totals: {
                real: realTotal,
                virtual: virtualTotal,
                retirement: retirementTotal,
                netWorth: realTotal + virtualTotal + retirementTotal
            }
        };
    }

    getEventName(event, projectionData) {
        if (event.type === 'income') {
            const source = projectionData.incomeSources.find(s => s.id === event.sourceId);
            return source ? `Income: ${source.name}` : 'Income';
        } else if (event.type === 'monthlyPayment') {
            const payment = projectionData.monthlyPayments.find(p => p.id === event.paymentId);
            return payment ? `Payment: ${payment.name}` : 'Payment';
        } else if (event.type === 'retirementGrowth') {
            return 'Retirement Growth';
        }
        return 'Event';
    }

    displayProjectionResults(snapshots, startDate, endDate) {
        // Display summary cards
        const lastSnapshot = snapshots[snapshots.length - 1];
        const summaryHtml = `
            <div class="projection-card">
                <h3>Projected Real Balance</h3>
                <p class="amount">${this.formatCurrency(lastSnapshot.totals.real)}</p>
            </div>
            <div class="projection-card">
                <h3>Projected Virtual Balance</h3>
                <p class="amount">${this.formatCurrency(lastSnapshot.totals.virtual)}</p>
            </div>
            <div class="projection-card">
                <h3>Projected Retirement Balance</h3>
                <p class="amount">${this.formatCurrency(lastSnapshot.totals.retirement)}</p>
            </div>
            <div class="projection-card">
                <h3>Projected Net Worth</h3>
                <p class="amount">${this.formatCurrency(lastSnapshot.totals.netWorth)}</p>
            </div>
        `;

        document.getElementById('projectionSummary').innerHTML = summaryHtml;

        // Display table
        let tableHtml = `
            <table>
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Name</th>
                        <th>Real Balance</th>
                        <th>Virtual Balance</th>
                        <th>Retirement Balance</th>
                        <th>Net Worth</th>
                    </tr>
                </thead>
                <tbody>
        `;

        snapshots.forEach(snapshot => {
            tableHtml += `
                <tr>
                    <td>${snapshot.date}</td>
                    <td>${snapshot.eventName}</td>
                    <td>${this.formatCurrency(snapshot.totals.real)}</td>
                    <td>${this.formatCurrency(snapshot.totals.virtual)}</td>
                    <td>${this.formatCurrency(snapshot.totals.retirement)}</td>
                    <td><strong>${this.formatCurrency(snapshot.totals.netWorth)}</strong></td>
                </tr>
            `;
        });

        tableHtml += `
                </tbody>
            </table>
        `;

        // Add warnings
        let warnings = '';
        const lowestRealBalance = Math.min(...snapshots.map(s => s.totals.real));
        if (lowestRealBalance < 0) {
            warnings += `<div class="warning"><strong>⚠️ Warning:</strong> Real account balance projected to drop below $0</div>`;
        } else if (lowestRealBalance < 500) {
            warnings += `<div class="warning"><strong>⚠️ Warning:</strong> Real account balance projected to drop below $500</div>`;
        }

        document.getElementById('projectionTable').innerHTML = warnings + tableHtml;
    }

    // ========================================================================
    // AUTOMATIC PROCESSING
    // ========================================================================

    processAutomatic() {
        // Process due incomes
        const dueIncomes = this.getDueIncomes();
        dueIncomes.forEach(income => this.processIncome(income.id));

        // Process due payments
        const duePayments = this.getDuePayments();
        duePayments.forEach(payment => this.processPayment(payment.id));

        this.updateAllUI();
    }

    // ========================================================================
    // UI UPDATES
    // ========================================================================

    updateAllUI() {
        this.updateDashboard();
        this.updateRealAccountsList();
        this.updateVirtualAccountsList();
        this.updateIncomeSourcesList();
        this.updateMonthlyPaymentsList();
        this.updateRetirementAccountsList();
        this.updateTransactionsList();
    }

    updateDashboard() {
        const realTotal = this.data.realAccounts.reduce((sum, a) => sum + a.balance, 0);
        const virtualTotal = this.data.virtualAccounts.reduce((sum, a) => sum + a.balance, 0);
        const retirementTotal = this.data.retirementAccounts.reduce((sum, a) => sum + a.balance, 0);
        const netWorth = realTotal + virtualTotal + retirementTotal;

        document.getElementById('realTotal').textContent = this.formatCurrency(realTotal);
        document.getElementById('virtualTotal').textContent = this.formatCurrency(virtualTotal);
        document.getElementById('retirementTotal').textContent = this.formatCurrency(retirementTotal);
        document.getElementById('netWorth').textContent = this.formatCurrency(netWorth);
    }

    updateRealAccountsList() {
        const container = document.getElementById('realAccountsList');
        if (this.data.realAccounts.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No real accounts yet. Add one to get started!</p></div>';
            return;
        }

        container.innerHTML = this.data.realAccounts.map(account => `
            <div class="list-item">
                <div class="item-info">
                    <h3>${account.name}</h3>
                    <p>Account ID: ${account.id}</p>
                </div>
                <div class="item-amount">${this.formatCurrency(account.balance)}</div>
                <div class="item-actions">
                    <button class="btn btn-edit" onclick="app.openEditRealAccountForm('${account.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="app.deleteRealAccount('${account.id}'); app.updateAllUI();">Delete</button>
                </div>
            </div>
        `).join('');
    }

    updateVirtualAccountsList() {
        const container = document.getElementById('virtualAccountsList');
        if (this.data.virtualAccounts.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No virtual accounts yet. Create a goal bucket!</p></div>';
            return;
        }

        container.innerHTML = this.data.virtualAccounts.map(account => `
            <div class="list-item">
                <div class="item-info">
                    <h3>${account.name}</h3>
                    <p>Allocation per paycheck: ${this.formatCurrency(account.allocationPerPaycheck)}</p>
                </div>
                <div class="item-amount">${this.formatCurrency(account.balance)}</div>
                <div class="item-actions">
                    <button class="btn btn-edit" onclick="app.openEditVirtualAccountForm('${account.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="app.deleteVirtualAccount('${account.id}'); app.updateAllUI();">Delete</button>
                </div>
            </div>
        `).join('');
    }

    updateIncomeSourcesList() {
        const container = document.getElementById('incomeSourcesList');
        if (this.data.incomeSources.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No income sources yet. Add your first paycheck!</p></div>';
            return;
        }

        container.innerHTML = this.data.incomeSources.map(source => {
            const depositAccount = this.data.realAccounts.find(a => a.id === source.depositToAccountId);
            return `
                <div class="list-item">
                    <div class="item-info">
                        <h3>${source.name}</h3>
                        <p>Frequency: ${source.frequency} | Next date: ${source.nextPayDate}</p>
                        <p>Deposits to: ${depositAccount ? depositAccount.name : 'Unknown'}</p>
                    </div>
                    <div class="item-amount">${this.formatCurrency(source.amount)}</div>
                    <div class="item-actions">
                        <button class="btn btn-edit" onclick="app.openEditIncomeSourceForm('${source.id}')">Edit</button>
                        <button class="btn btn-danger" onclick="app.deleteIncomeSource('${source.id}'); app.updateAllUI();">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateMonthlyPaymentsList() {
        const container = document.getElementById('monthlyPaymentsList');
        if (this.data.monthlyPayments.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No monthly payments yet.</p></div>';
            return;
        }

        container.innerHTML = this.data.monthlyPayments.map(payment => {
            const payFromAccount = this.data.realAccounts.find(a => a.id === payment.payFromRealAccountId);
            return `
                <div class="list-item">
                    <div class="item-info">
                        <h3>${payment.name}</h3>
                        <p>Next due: ${payment.nextDueDate} | Pays from: ${payFromAccount ? payFromAccount.name : 'Unknown'}</p>
                    </div>
                    <div class="item-amount">${this.formatCurrency(payment.amount)}</div>
                    <div class="item-actions">
                        <button class="btn btn-edit" onclick="app.openEditMonthlyPaymentForm('${payment.id}')">Edit</button>
                        <button class="btn btn-danger" onclick="app.deleteMonthlyPayment('${payment.id}'); app.updateAllUI();">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateRetirementAccountsList() {
        const container = document.getElementById('retirementAccountsList');
        if (this.data.retirementAccounts.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No retirement accounts yet.</p></div>';
            return;
        }

        container.innerHTML = this.data.retirementAccounts.map(account => `
            <div class="list-item">
                <div class="item-info">
                    <h3>${account.name}</h3>
                    <p>Contribution/paycheck: ${this.formatCurrency(account.contributionPerPaycheck)} | Employer match: ${account.employerMatchPercent}% | Growth: ${account.growthRateAnnual}%/yr</p>
                </div>
                <div class="item-amount">${this.formatCurrency(account.balance)}</div>
                <div class="item-actions">
                    <button class="btn btn-edit" onclick="app.openEditRetirementAccountForm('${account.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="app.deleteRetirementAccount('${account.id}'); app.updateAllUI();">Delete</button>
                </div>
            </div>
        `).join('');
    }

    updateTransactionsList() {
        const container = document.getElementById('transactionsList');
        if (this.data.transactions.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No transactions yet.</p></div>';
            return;
        }

        // Show last 20 transactions
        const recentTransactions = this.data.transactions.slice(-20).reverse();

        container.innerHTML = recentTransactions.map(transaction => {
            const realAccount = this.data.realAccounts.find(a => a.id === transaction.realAccountId);
            const virtualAccount = this.data.virtualAccounts.find(a => a.id === transaction.virtualAccountId);
            return `
                <div class="list-item">
                    <div class="item-info">
                        <h3>${transaction.note || 'Transaction'}</h3>
                        <p>${transaction.date} | Type: ${transaction.type} | Account: ${realAccount ? realAccount.name : 'Unknown'}</p>
                    </div>
                    <div class="item-amount">${transaction.type.includes('Withdrawal') ? '-' : '+'}${this.formatCurrency(transaction.amount)}</div>
                    <div class="item-actions">
                        <button class="btn btn-danger" onclick="app.deleteTransaction('${transaction.id}'); app.updateAllUI();">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    // ========================================================================
    // FORM MANAGEMENT
    // ========================================================================

    openForm(formType) {
        const formContainer = document.getElementById('formContainer');
        let formHtml = '';

        switch(formType) {
            case 'realAccountForm':
                formHtml = `
                    <form onsubmit="app.handleRealAccountForm(event)">
                        <h2>Add Real Account</h2>
                        <div class="form-group">
                            <label>Account Name</label>
                            <input type="text" id="realAccountName" required>
                        </div>
                        <div class="form-group">
                            <label>Starting Balance</label>
                            <input type="number" id="realAccountBalance" step="0.01" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Add Account</button>
                            <button type="button" class="btn btn-secondary" onclick="closeForm()">Cancel</button>
                        </div>
                    </form>
                `;
                break;

            case 'virtualAccountForm':
                formHtml = `
                    <form onsubmit="app.handleVirtualAccountForm(event)">
                        <h2>Add Virtual Account</h2>
                        <div class="form-group">
                            <label>Account Name</label>
                            <input type="text" id="virtualAccountName" required>
                        </div>
                        <div class="form-group">
                            <label>Allocation Per Paycheck</label>
                            <input type="number" id="virtualAccountAllocation" step="0.01" value="0" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Add Account</button>
                            <button type="button" class="btn btn-secondary" onclick="closeForm()">Cancel</button>
                        </div>
                    </form>
                `;
                break;

            case 'incomeSourceForm':
                formHtml = `
                    <form onsubmit="app.handleIncomeSourceForm(event)">
                        <h2>Add Income Source</h2>
                        <div class="form-group">
                            <label>Income Name</label>
                            <input type="text" id="incomeName" required>
                        </div>
                        <div class="form-group">
                            <label>Amount</label>
                            <input type="number" id="incomeAmount" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Frequency</label>
                            <select id="incomeFrequency" required>
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Biweekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Next Pay Date</label>
                            <input type="date" id="incomeNextPayDate" required>
                        </div>
                        <div class="form-group">
                            <label>Deposit To Account</label>
                            <select id="incomeDepositAccount" required>
                                ${this.data.realAccounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Add Income</button>
                            <button type="button" class="btn btn-secondary" onclick="closeForm()">Cancel</button>
                        </div>
                    </form>
                `;
                break;

            case 'monthlyPaymentForm':
                formHtml = `
                    <form onsubmit="app.handleMonthlyPaymentForm(event)">
                        <h2>Add Monthly Payment</h2>
                        <div class="form-group">
                            <label>Payment Name</label>
                            <input type="text" id="paymentName" required>
                        </div>
                        <div class="form-group">
                            <label>Amount</label>
                            <input type="number" id="paymentAmount" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Next Due Date</label>
                            <input type="date" id="paymentNextDueDate" required>
                        </div>
                        <div class="form-group">
                            <label>Pay From Account</label>
                            <select id="paymentFromAccount" required>
                                ${this.data.realAccounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Add Payment</button>
                            <button type="button" class="btn btn-secondary" onclick="closeForm()">Cancel</button>
                        </div>
                    </form>
                `;
                break;

            case 'retirementAccountForm':
                formHtml = `
                    <form onsubmit="app.handleRetirementAccountForm(event)">
                        <h2>Add Retirement Account</h2>
                        <div class="form-group">
                            <label>Account Name</label>
                            <input type="text" id="retirementName" required>
                        </div>
                        <div class="form-group">
                            <label>Starting Balance</label>
                            <input type="number" id="retirementBalance" step="0.01" value="0" required>
                        </div>
                        <div class="form-group">
                            <label>Contribution Per Paycheck</label>
                            <input type="number" id="retirementContribution" step="0.01" value="0" required>
                        </div>
                        <div class="form-group">
                            <label>Employer Match Percent (%)</label>
                            <input type="number" id="retirementMatch" step="0.01" value="0" required>
                        </div>
                        <div class="form-group">
                            <label>Annual Growth Rate (%)</label>
                            <input type="number" id="retirementGrowth" step="0.01" value="0" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Add Account</button>
                            <button type="button" class="btn btn-secondary" onclick="closeForm()">Cancel</button>
                        </div>
                    </form>
                `;
                break;

            case 'transactionForm':
                formHtml = `
                    <form onsubmit="app.handleTransactionForm(event)">
                        <h2>Add Transaction</h2>
                        <div class="form-group">
                            <label>Type</label>
                            <select id="transactionType" required>
                                <option value="income">Income</option>
                                <option value="realDeposit">Real Deposit</option>
                                <option value="realWithdrawal">Real Withdrawal</option>
                                <option value="virtualWithdrawal">Virtual Withdrawal</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Amount</label>
                            <input type="number" id="transactionAmount" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Real Account</label>
                            <select id="transactionRealAccount" required>
                                ${this.data.realAccounts.map(a => `<option value="${a.id}">${a.name}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Date</label>
                            <input type="date" id="transactionDate" required>
                        </div>
                        <div class="form-group">
                            <label>Note</label>
                            <input type="text" id="transactionNote">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="btn btn-primary">Add Transaction</button>
                            <button type="button" class="btn btn-secondary" onclick="closeForm()">Cancel</button>
                        </div>
                    </form>
                `;
                break;
        }

        formContainer.innerHTML = formHtml;
        document.getElementById('formModal').classList.add('show');
    }

    openEditRealAccountForm(id) {
        const account = this.data.realAccounts.find(a => a.id === id);
        if (!account) return;

        const formContainer = document.getElementById('formContainer');
        formContainer.innerHTML = `
            <form onsubmit="app.handleEditRealAccountForm(event, '${id}')">
                <h2>Edit Real Account</h2>
                <div class="form-group">
                    <label>Account Name</label>
                    <input type="text" id="realAccountName" value="${account.name}" required>
                </div>
                <div class="form-group">
                    <label>Balance</label>
                    <input type="number" id="realAccountBalance" step="0.01" value="${account.balance}" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                    <button type="button" class="btn btn-secondary" onclick="closeForm()">Cancel</button>
                </div>
            </form>
        `;
        document.getElementById('formModal').classList.add('show');
    }

    openEditVirtualAccountForm(id) {
        const account = this.data.virtualAccounts.find(a => a.id === id);
        if (!account) return;

        const formContainer = document.getElementById('formContainer');
        formContainer.innerHTML = `
            <form onsubmit="app.handleEditVirtualAccountForm(event, '${id}')">
                <h2>Edit Virtual Account</h2>
                <div class="form-group">
                    <label>Account Name</label>
                    <input type="text" id="virtualAccountName" value="${account.name}" required>
                </div>
                <div class="form-group">
                    <label>Allocation Per Paycheck</label>
                    <input type="number" id="virtualAccountAllocation" step="0.01" value="${account.allocationPerPaycheck}" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                    <button type="button" class="btn btn-secondary" onclick="closeForm()">Cancel</button>
                </div>
            </form>
        `;
        document.getElementById('formModal').classList.add('show');
    }

    openEditIncomeSourceForm(id) {
        const source = this.data.incomeSources.find(s => s.id === id);
        if (!source) return;

        const formContainer = document.getElementById('formContainer');
        formContainer.innerHTML = `
            <form onsubmit="app.handleEditIncomeSourceForm(event, '${id}')">
                <h2>Edit Income Source</h2>
                <div class="form-group">
                    <label>Income Name</label>
                    <input type="text" id="incomeName" value="${source.name}" required>
                </div>
                <div class="form-group">
                    <label>Amount</label>
                    <input type="number" id="incomeAmount" step="0.01" value="${source.amount}" required>
                </div>
                <div class="form-group">
                    <label>Frequency</label>
                    <select id="incomeFrequency" required>
                        <option value="weekly" ${source.frequency === 'weekly' ? 'selected' : ''}>Weekly</option>
                        <option value="biweekly" ${source.frequency === 'biweekly' ? 'selected' : ''}>Biweekly</option>
                        <option value="monthly" ${source.frequency === 'monthly' ? 'selected' : ''}>Monthly</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Next Pay Date</label>
                    <input type="date" id="incomeNextPayDate" value="${source.nextPayDate}" required>
                </div>
                <div class="form-group">
                    <label>Deposit To Account</label>
                    <select id="incomeDepositAccount" required>
                        ${this.data.realAccounts.map(a => `<option value="${a.id}" ${a.id === source.depositToAccountId ? 'selected' : ''}>${a.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                    <button type="button" class="btn btn-secondary" onclick="closeForm()">Cancel</button>
                </div>
            </form>
        `;
        document.getElementById('formModal').classList.add('show');
    }

    openEditMonthlyPaymentForm(id) {
        const payment = this.data.monthlyPayments.find(p => p.id === id);
        if (!payment) return;

        const formContainer = document.getElementById('formContainer');
        formContainer.innerHTML = `
            <form onsubmit="app.handleEditMonthlyPaymentForm(event, '${id}')">
                <h2>Edit Monthly Payment</h2>
                <div class="form-group">
                    <label>Payment Name</label>
                    <input type="text" id="paymentName" value="${payment.name}" required>
                </div>
                <div class="form-group">
                    <label>Amount</label>
                    <input type="number" id="paymentAmount" step="0.01" value="${payment.amount}" required>
                </div>
                <div class="form-group">
                    <label>Next Due Date</label>
                    <input type="date" id="paymentNextDueDate" value="${payment.nextDueDate}" required>
                </div>
                <div class="form-group">
                    <label>Pay From Account</label>
                    <select id="paymentFromAccount" required>
                        ${this.data.realAccounts.map(a => `<option value="${a.id}" ${a.id === payment.payFromRealAccountId ? 'selected' : ''}>${a.name}</option>`).join('')}
                    </select>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                    <button type="button" class="btn btn-secondary" onclick="closeForm()">Cancel</button>
                </div>
            </form>
        `;
        document.getElementById('formModal').classList.add('show');
    }

    openEditRetirementAccountForm(id) {
        const account = this.data.retirementAccounts.find(a => a.id === id);
        if (!account) return;

        const formContainer = document.getElementById('formContainer');
        formContainer.innerHTML = `
            <form onsubmit="app.handleEditRetirementAccountForm(event, '${id}')">
                <h2>Edit Retirement Account</h2>
                <div class="form-group">
                    <label>Account Name</label>
                    <input type="text" id="retirementName" value="${account.name}" required>
                </div>
                <div class="form-group">
                    <label>Balance</label>
                    <input type="number" id="retirementBalance" step="0.01" value="${account.balance}" required>
                </div>
                <div class="form-group">
                    <label>Contribution Per Paycheck</label>
                    <input type="number" id="retirementContribution" step="0.01" value="${account.contributionPerPaycheck}" required>
                </div>
                <div class="form-group">
                    <label>Employer Match Percent (%)</label>
                    <input type="number" id="retirementMatch" step="0.01" value="${account.employerMatchPercent}" required>
                </div>
                <div class="form-group">
                    <label>Annual Growth Rate (%)</label>
                    <input type="number" id="retirementGrowth" step="0.01" value="${account.growthRateAnnual}" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                    <button type="button" class="btn btn-secondary" onclick="closeForm()">Cancel</button>
                </div>
            </form>
        `;
        document.getElementById('formModal').classList.add('show');
    }

    // Form Handlers
    handleRealAccountForm(event) {
        event.preventDefault();
        const name = document.getElementById('realAccountName').value;
        const balance = document.getElementById('realAccountBalance').value;
        this.addRealAccount(name, balance);
        closeForm();
        this.updateAllUI();
    }

    handleEditRealAccountForm(event, id) {
        event.preventDefault();
        const name = document.getElementById('realAccountName').value;
        const balance = document.getElementById('realAccountBalance').value;
        this.updateRealAccount(id, name, balance);
        closeForm();
        this.updateAllUI();
    }

    handleVirtualAccountForm(event) {
        event.preventDefault();
        const name = document.getElementById('virtualAccountName').value;
        const allocation = document.getElementById('virtualAccountAllocation').value;
        this.addVirtualAccount(name, allocation);
        closeForm();
        this.updateAllUI();
    }

    handleEditVirtualAccountForm(event, id) {
        event.preventDefault();
        const name = document.getElementById('virtualAccountName').value;
        const allocation = document.getElementById('virtualAccountAllocation').value;
        this.updateVirtualAccount(id, name, allocation);
        closeForm();
        this.updateAllUI();
    }

    handleIncomeSourceForm(event) {
        event.preventDefault();
        const name = document.getElementById('incomeName').value;
        const amount = document.getElementById('incomeAmount').value;
        const frequency = document.getElementById('incomeFrequency').value;
        const nextPayDate = document.getElementById('incomeNextPayDate').value;
        const depositToAccountId = document.getElementById('incomeDepositAccount').value;
        this.addIncomeSource(name, amount, frequency, nextPayDate, depositToAccountId);
        closeForm();
        this.updateAllUI();
    }

    handleEditIncomeSourceForm(event, id) {
        event.preventDefault();
        const name = document.getElementById('incomeName').value;
        const amount = document.getElementById('incomeAmount').value;
        const frequency = document.getElementById('incomeFrequency').value;
        const nextPayDate = document.getElementById('incomeNextPayDate').value;
        const depositToAccountId = document.getElementById('incomeDepositAccount').value;
        this.updateIncomeSource(id, name, amount, frequency, nextPayDate, depositToAccountId);
        closeForm();
        this.updateAllUI();
    }

    handleMonthlyPaymentForm(event) {
        event.preventDefault();
        const name = document.getElementById('paymentName').value;
        const amount = document.getElementById('paymentAmount').value;
        const nextDueDate = document.getElementById('paymentNextDueDate').value;
        const payFromRealAccountId = document.getElementById('paymentFromAccount').value;
        this.addMonthlyPayment(name, amount, 'monthly', nextDueDate, payFromRealAccountId);
        closeForm();
        this.updateAllUI();
    }

    handleEditMonthlyPaymentForm(event, id) {
        event.preventDefault();
        const name = document.getElementById('paymentName').value;
        const amount = document.getElementById('paymentAmount').value;
        const nextDueDate = document.getElementById('paymentNextDueDate').value;
        const payFromRealAccountId = document.getElementById('paymentFromAccount').value;
        this.updateMonthlyPayment(id, name, amount, 'monthly', nextDueDate, payFromRealAccountId);
        closeForm();
        this.updateAllUI();
    }

    handleRetirementAccountForm(event) {
        event.preventDefault();
        const name = document.getElementById('retirementName').value;
        const balance = document.getElementById('retirementBalance').value;
        const contribution = document.getElementById('retirementContribution').value;
        const match = document.getElementById('retirementMatch').value;
        const growth = document.getElementById('retirementGrowth').value;
        this.addRetirementAccount(name, balance, contribution, match, growth);
        closeForm();
        this.updateAllUI();
    }

    handleEditRetirementAccountForm(event, id) {
        event.preventDefault();
        const name = document.getElementById('retirementName').value;
        const balance = document.getElementById('retirementBalance').value;
        const contribution = document.getElementById('retirementContribution').value;
        const match = document.getElementById('retirementMatch').value;
        const growth = document.getElementById('retirementGrowth').value;
        this.updateRetirementAccount(id, name, balance, contribution, match, growth);
        closeForm();
        this.updateAllUI();
    }

    handleTransactionForm(event) {
        event.preventDefault();
        const type = document.getElementById('transactionType').value;
        const amount = document.getElementById('transactionAmount').value;
        const realAccountId = document.getElementById('transactionRealAccount').value;
        const date = document.getElementById('transactionDate').value;
        const note = document.getElementById('transactionNote').value;

        // Apply transaction to real account balance
        if (type === 'realDeposit') {
            this.updateRealAccountBalance(realAccountId, parseFloat(amount));
        } else if (type === 'realWithdrawal') {
            this.updateRealAccountBalance(realAccountId, -parseFloat(amount));
        }

        this.addTransaction(type, amount, realAccountId, null, date, note);
        closeForm();
        this.updateAllUI();
    }

    // ========================================================================
    // UTILITY FUNCTIONS
    // ========================================================================

    generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    getNextPayDate(currentDate, frequency) {
        const date = new Date(currentDate);
        if (frequency === 'weekly') {
            date.setDate(date.getDate() + 7);
        } else if (frequency === 'biweekly') {
            date.setDate(date.getDate() + 14);
        } else if (frequency === 'monthly') {
            date.setMonth(date.getMonth() + 1);
        }
        return date.toISOString().split('T')[0];
    }

    getNextMonthDate(currentDate) {
        const date = new Date(currentDate);
        date.setMonth(date.getMonth() + 1);
        return date.toISOString().split('T')[0];
    }

    addFrequencyDays(date, frequency) {
        const newDate = new Date(date);
        if (frequency === 'weekly') {
            newDate.setDate(newDate.getDate() + 7);
        } else if (frequency === 'biweekly') {
            newDate.setDate(newDate.getDate() + 14);
        } else if (frequency === 'monthly') {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        return newDate;
    }
}

// ============================================================================
// GLOBAL APP INSTANCE & HELPERS
// ============================================================================

let app;

function initApp() {
    app = new BudgetApp();
}

function openForm(formType) {
    app.openForm(formType);
}

function closeForm() {
    document.getElementById('formModal').classList.remove('show');
}

function runProjection() {
    app.runProjection();
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
