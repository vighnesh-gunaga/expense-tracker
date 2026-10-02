import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    LineChart,
    Line
} from "recharts";

import "./Dashboard.css";


function Dashboard() {

    const navigate = useNavigate();


    // =====================================================
    // USER PROFILE
    // =====================================================

    const [userProfile, setUserProfile] = useState(null);
    const [showProfile, setShowProfile] = useState(false);


    // =====================================================
    // DASHBOARD DATA
    // =====================================================

    const [dashboard, setDashboard] = useState(null);

    const [categoryExpenses, setCategoryExpenses] =
        useState([]);

    const [budgetSummary, setBudgetSummary] =
        useState([]);

    const [recentTransactions, setRecentTransactions] =
        useState([]);

    const [dailyTransactions, setDailyTransactions] =
        useState([]);


    // =====================================================
    // LOADING / ERROR
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // CALENDAR
    // =====================================================

    const [selectedDate, setSelectedDate] =
        useState(new Date());

    const [calendarDate, setCalendarDate] =
        useState(new Date());


    // =====================================================
    // COLORS
    // =====================================================

    const CHART_COLORS = [
        "#6366f1",
        "#22c55e",
        "#f97316",
        "#ec4899",
        "#06b6d4",
        "#eab308",
        "#8b5cf6",
        "#ef4444"
    ];


    // =====================================================
    // USER PROFILE
    // =====================================================

    const loadUserProfile = async () => {

        try {

            const response =
                await api.get("/api/auth/profile");

            setUserProfile(response.data);

        } catch (error) {

            console.error(
                "Unable to load user profile",
                error
            );

        }

    };


    // =====================================================
    // USER NAME
    // =====================================================

    const userName =
        userProfile?.name ||
        userProfile?.username ||
        "User";


    // =====================================================
    // USER EMAIL
    // =====================================================

    const userEmail =
        userProfile?.email ||
        "No email available";


    // =====================================================
    // USER CREATED DATE
    // =====================================================

    const userCreatedAt =
        userProfile?.createdAt ||
        userProfile?.createdDate ||
        null;


    // =====================================================
    // USER INITIAL
    // =====================================================

    const getUserInitial = () => {

        if (!userName) {
            return "U";
        }

        return userName
            .trim()
            .charAt(0)
            .toUpperCase();

    };


    // =====================================================
    // FORMAT CREATED DATE
    // =====================================================

    const formatCreatedDate = () => {

        if (!userCreatedAt) {
            return "Not available";
        }

        const date =
            new Date(userCreatedAt);

        if (Number.isNaN(date.getTime())) {
            return "Not available";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userCreatedAt");

        navigate("/login");

    };


    // =====================================================
    // GREETING
    // =====================================================

    const getGreeting = () => {

        const hour =
            new Date().getHours();

        if (hour < 12) {
            return "Good Morning";
        }

        if (hour < 17) {
            return "Good Afternoon";
        }

        return "Good Evening";

    };


    // =====================================================
    // FORMAT DATE FOR API
    // =====================================================

    const formatDateForApi = (date) => {

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;

    };


    // =====================================================
    // FORMAT SELECTED DATE
    // =====================================================

    const formatCalendarDate = (date) => {

        return date.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );

    };


    // =====================================================
    // FORMAT AMOUNT
    // =====================================================

    const formatAmount = (amount) => {

        return Number(
            amount || 0
        ).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

    };


    // =====================================================
    // FORMAT TRANSACTION DATE
    // =====================================================

    const formatTransactionDate = (date) => {

        if (!date) {
            return "";
        }

        return new Date(date)
            .toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

    };


    // =====================================================
    // CHANGE SELECTED DATE
    // =====================================================

    const changeDate = (days) => {

        const newDate =
            new Date(selectedDate);

        newDate.setDate(
            newDate.getDate() + days
        );

        setSelectedDate(newDate);

        setCalendarDate(
            new Date(
                newDate.getFullYear(),
                newDate.getMonth(),
                1
            )
        );

    };


    // =====================================================
    // GO TO TODAY
    // =====================================================

    const goToToday = () => {

        const today =
            new Date();

        setSelectedDate(today);

        setCalendarDate(
            new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            )
        );

    };


    // =====================================================
    // LOAD DASHBOARD
    // =====================================================

    const loadDashboard = async () => {

        try {

            setLoading(true);

            setError("");


            const [
                dashboardResponse,
                categoryResponse,
                budgetResponse,
                recentResponse
            ] = await Promise.all([

                api.get(
                    "/api/dashboard"
                ),

                api.get(
                    "/api/dashboard/category-wise"
                ),

                api.get(
                    "/api/dashboard/budget-summary"
                ),

                api.get(
                    "/api/dashboard/recent?limit=20"
                )

            ]);


            setDashboard(
                dashboardResponse.data
            );

            setCategoryExpenses(
                categoryResponse.data
            );

            setBudgetSummary(
                budgetResponse.data
            );

            setRecentTransactions(
                recentResponse.data
            );


        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Unable to load dashboard"
                );

            } else {

                setError(
                    "Unable to connect to server"
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD DAILY TRANSACTIONS
    // =====================================================

    const loadDailyTransactions = async (date) => {

        try {

            const response =
                await api.get(
                    `/api/dashboard/daily?date=${formatDateForApi(date)}`
                );

            setDailyTransactions(
                response.data
            );

        } catch (error) {

            console.error(
                "Unable to load daily transactions",
                error
            );

            setDailyTransactions([]);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadDashboard();

        loadUserProfile();

    }, []);


    // =====================================================
    // LOAD DAILY TRANSACTIONS
    // WHEN SELECTED DATE CHANGES
    // =====================================================

    useEffect(() => {

        loadDailyTransactions(
            selectedDate
        );

    }, [selectedDate]);


    // =====================================================
    // TOTAL BUDGET
    // =====================================================

    const totalBudget =
        budgetSummary.reduce(
            (total, budget) =>
                total +
                Number(
                    budget.budgetAmount || 0
                ),
            0
        );


    // =====================================================
    // INCOME VS EXPENSE DATA
    // =====================================================

    const incomeExpenseData = [

        {
            name: "Income",
            amount: Number(
                dashboard?.totalIncome || 0
            )
        },

        {
            name: "Expense",
            amount: Number(
                dashboard?.totalExpense || 0
            )
        }

    ];


    // =====================================================
    // SPENDING TREND DATA
    // =====================================================

    const monthlyTrendData =
        useMemo(() => {

            const grouped = {};


            recentTransactions.forEach(
                (transaction) => {

                    if (!transaction.date) {
                        return;
                    }


                    const date =
                        transaction.date.substring(
                            0,
                            10
                        );


                    if (!grouped[date]) {

                        grouped[date] = {

                            date,

                            income: 0,

                            expense: 0

                        };

                    }


                    if (
                        transaction.type ===
                        "INCOME"
                    ) {

                        grouped[date].income +=
                            Number(
                                transaction.amount || 0
                            );

                    } else {

                        grouped[date].expense +=
                            Number(
                                transaction.amount || 0
                            );

                    }

                }
            );


            return Object.values(grouped)
                .sort(
                    (a, b) =>
                        new Date(a.date) -
                        new Date(b.date)
                )
                .map(
                    (item) => ({

                        ...item,

                        displayDate:
                            new Date(
                                item.date
                            ).toLocaleDateString(
                                "en-IN",
                                {
                                    day: "2-digit",
                                    month: "short"
                                }
                            )

                    })
                );

        }, [recentTransactions]);


    // =====================================================
    // BUDGET PERCENTAGE
    // =====================================================

    const getBudgetPercentage = (
        budgetAmount,
        actualExpense
    ) => {

        if (
            !budgetAmount ||
            Number(budgetAmount) <= 0
        ) {
            return 0;
        }

        return Math.round(

            (
                Number(
                    actualExpense || 0
                ) /
                Number(
                    budgetAmount
                )
            ) * 100

        );

    };


    // =====================================================
    // BUDGET STATUS CLASS
    // =====================================================

    const getBudgetStatusClass = (
        status
    ) => {

        if (!status) {
            return "";
        }

        return status
            .toLowerCase()
            .replace(
                "_",
                "-"
            );

    };


    // =====================================================
    // CALENDAR
    // =====================================================

    const calendarYear =
        calendarDate.getFullYear();

    const calendarMonth =
        calendarDate.getMonth();


    const monthName =
        calendarDate.toLocaleString(
            "en-IN",
            {
                month: "long"
            }
        );


    const daysInMonth =
        new Date(
            calendarYear,
            calendarMonth + 1,
            0
        ).getDate();


    const firstDay =
        new Date(
            calendarYear,
            calendarMonth,
            1
        ).getDay();


    // =====================================================
    // PREVIOUS MONTH
    // =====================================================

    const previousMonth = () => {

        setCalendarDate(
            new Date(
                calendarYear,
                calendarMonth - 1,
                1
            )
        );

    };


    // =====================================================
    // NEXT MONTH
    // =====================================================

    const nextMonth = () => {

        setCalendarDate(
            new Date(
                calendarYear,
                calendarMonth + 1,
                1
            )
        );

    };


    // =====================================================
    // CALENDAR TRANSACTIONS
    // =====================================================

    const getTransactionsForDay = (
        day
    ) => {

        return recentTransactions.filter(
            (transaction) => {

                if (!transaction.date) {
                    return false;
                }

                /*
                 * Use YYYY-MM-DD directly.
                 * This avoids timezone problems.
                 */

                const transactionDate =
                    transaction.date.substring(
                        0,
                        10
                    );

                const selectedCalendarDate =
                    `${calendarYear}-${String(
                        calendarMonth + 1
                    ).padStart(2, "0")}-${String(
                        day
                    ).padStart(2, "0")}`;


                return (
                    transactionDate ===
                    selectedCalendarDate
                );

            }
        );

    };


    // =====================================================
    // CALENDAR CELLS
    // =====================================================

    const calendarCells = [];


    // Empty cells before first day

    for (
        let i = 0;
        i < firstDay;
        i++
    ) {

        calendarCells.push(

            <div
                className="calendar-day empty"
                key={`empty-${i}`}
            />

        );

    }


    // Actual days

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dayTransactions =
            getTransactionsForDay(
                day
            );


        const hasIncome =
            dayTransactions.some(
                (transaction) =>
                    transaction.type ===
                    "INCOME"
            );


        const hasExpense =
            dayTransactions.some(
                (transaction) =>
                    transaction.type ===
                    "EXPENSE"
            );


        const today =
            new Date();


        const isToday =
            day === today.getDate() &&
            calendarMonth === today.getMonth() &&
            calendarYear === today.getFullYear();


        const isSelected =
            day === selectedDate.getDate() &&
            calendarMonth === selectedDate.getMonth() &&
            calendarYear === selectedDate.getFullYear();


        calendarCells.push(

            <button
                type="button"
                className={
                    `calendar-day
                    ${isToday ? "today" : ""}
                    ${isSelected ? "selected" : ""}`
                }
                key={day}
                onClick={() => {

                    const clickedDate =
                        new Date(
                            calendarYear,
                            calendarMonth,
                            day
                        );

                    setSelectedDate(
                        clickedDate
                    );

                }}
            >

                <span className="calendar-number">
                    {day}
                </span>


                {dayTransactions.length > 0 && (

                    <div className="calendar-indicators">

                        {hasIncome && (

                            <span
                                className="calendar-income-dot"
                                title="Income"
                            />

                        )}


                        {hasExpense && (

                            <span
                                className="calendar-expense-dot"
                                title="Expense"
                            />

                        )}

                    </div>

                )}

            </button>

        );

    }


    // =====================================================
    // QUICK ACTIONS
    // =====================================================

    const handleAddTransaction = () => {

        navigate(
            "/transactions"
        );

    };


    const handleAddBudget = () => {

        navigate(
            "/budgets"
        );

    };


    const handleAddCategory = () => {

        navigate(
            "/categories"
        );

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <div className="dashboard-page">

                <div className="dashboard-loading">

                    <div className="dashboard-spinner" />

                    <h2>
                        Loading dashboard...
                    </h2>

                </div>

            </div>

        );

    }


    // =====================================================
    // ERROR
    // =====================================================

    if (error) {

        return (

            <div className="dashboard-page">

                <div className="dashboard-error">

                    {error}

                </div>


                <button
                    className="dashboard-retry-button"
                    onClick={loadDashboard}
                >
                    Retry
                </button>

            </div>

        );

    }


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="dashboard-page">


            {/* =================================================
                HEADER
            ================================================= */}

            <header className="dashboard-header">

                <div>

                    <h1>
                        {getGreeting()} 👋
                    </h1>

                    <p>
                        Here's your financial overview
                    </p>

                </div>


                {/* PROFILE BUTTON */}

                <button
                    type="button"
                    className="dashboard-profile-button"
                    onClick={() =>
                        setShowProfile(
                            true
                        )
                    }
                    title="Profile"
                >

                    {getUserInitial()}

                </button>

            </header>


            {/* =================================================
                PROFILE POPUP
            ================================================= */}

            {showProfile && (

                <div className="profile-overlay">

                    {/* Background */}

                    <div
                        className="profile-overlay-background"
                        onClick={() =>
                            setShowProfile(
                                false
                            )
                        }
                    />


                    {/* Profile Card */}

                    <div className="profile-card">


                        {/* Close */}

                        <button
                            type="button"
                            className="profile-close-button"
                            onClick={() =>
                                setShowProfile(
                                    false
                                )
                            }
                        >
                            ×
                        </button>


                        {/* Avatar */}

                        <div className="profile-avatar">

                            {getUserInitial()}

                        </div>


                        {/* Name */}

                        <h2>
                            {userName}
                        </h2>


                        <p className="profile-subtitle">
                            Account Information
                        </p>


                        {/* Information */}

                        <div className="profile-information">


                            {/* Username */}

                            <div className="profile-info-item">

                                <span className="profile-info-icon">
                                    👤
                                </span>

                                <div>

                                    <small>
                                        Username
                                    </small>

                                    <strong>
                                        {userName}
                                    </strong>

                                </div>

                            </div>


                            {/* Email */}

                            <div className="profile-info-item">

                                <span className="profile-info-icon">
                                    ✉
                                </span>

                                <div>

                                    <small>
                                        Email
                                    </small>

                                    <strong>
                                        {userEmail}
                                    </strong>

                                </div>

                            </div>


                            {/* Created */}

                            <div className="profile-info-item">

                                <span className="profile-info-icon">
                                    📅
                                </span>

                                <div>

                                    <small>
                                        Account Created
                                    </small>

                                    <strong>
                                        {formatCreatedDate()}
                                    </strong>

                                </div>

                            </div>


                        </div>


                        {/* Logout */}

                        <button
                            type="button"
                            className="profile-logout-button"
                            onClick={handleLogout}
                        >

                            <span>
                                ↪
                            </span>

                            Logout

                        </button>


                    </div>

                </div>

            )}


            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <section className="quick-actions">


                <button
                    className="quick-action-button transaction-action"
                    onClick={
                        handleAddTransaction
                    }
                >

                    <span className="quick-action-icon">
                        +
                    </span>

                    <span>
                        Add Transaction
                    </span>

                </button>


                <button
                    className="quick-action-button budget-action"
                    onClick={
                        handleAddBudget
                    }
                >

                    <span className="quick-action-icon">
                        ₹
                    </span>

                    <span>
                        Add Budget
                    </span>

                </button>


                <button
                    className="quick-action-button category-action"
                    onClick={
                        handleAddCategory
                    }
                >

                    <span className="quick-action-icon">
                        +
                    </span>

                    <span>
                        Add Category
                    </span>

                </button>


            </section>


            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <section className="dashboard-summary-grid">


                <div className="summary-card balance-card">

                    <span className="summary-label">
                        Available Balance
                    </span>

                    <h2>
                        ₹{" "}
                        {formatAmount(
                            dashboard?.balance
                        )}
                    </h2>

                    <p>
                        Income minus expenses
                    </p>

                </div>


                <div className="summary-card income-card">

                    <span className="summary-label">
                        Total Income
                    </span>

                    <h2>
                        ₹{" "}
                        {formatAmount(
                            dashboard?.totalIncome
                        )}
                    </h2>

                    <p>
                        Total income received
                    </p>

                </div>


                <div className="summary-card expense-card">

                    <span className="summary-label">
                        Total Expense
                    </span>

                    <h2>
                        ₹{" "}
                        {formatAmount(
                            dashboard?.totalExpense
                        )}
                    </h2>

                    <p>
                        Total spending
                    </p>

                </div>


                <div className="summary-card budget-card">

                    <span className="summary-label">
                        Total Budget
                    </span>

                    <h2>
                        ₹{" "}
                        {formatAmount(
                            totalBudget
                        )}
                    </h2>

                    <p>
                        All created budgets
                    </p>

                </div>


            </section>


            {/* =================================================
                INCOME VS EXPENSE
            ================================================= */}

            <section className="dashboard-panel income-expense-panel">

                <div className="panel-header">

                    <div>

                        <h2>
                            Income vs Expense
                        </h2>

                        <p>
                            Compare your total income and spending
                        </p>

                    </div>

                </div>


                <div className="income-expense-chart">

                    <ResponsiveContainer
                        width="100%"
                        height={320}
                    >

                        <BarChart
                            data={
                                incomeExpenseData
                            }
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />

                            <XAxis
                                dataKey="name"
                            />

                            <YAxis />

                            <Tooltip
                                formatter={(value) =>
                                    `₹ ${formatAmount(
                                        value
                                    )}`
                                }
                            />

                            <Bar
                                dataKey="amount"
                                name="Amount"
                                fill="#6366f1"
                                radius={[
                                    8,
                                    8,
                                    0,
                                    0
                                ]}
                                barSize={70}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

            </section>


            {/* =================================================
                CHART GRID
            ================================================= */}

            <section className="dashboard-chart-grid">


                {/* =================================================
                    EXPENSE PIE CHART
                ================================================= */}

                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                Expense Breakdown
                            </h2>

                            <p>
                                Spending by category
                            </p>

                        </div>

                    </div>


                    {categoryExpenses.length === 0 ? (

                        <div className="dashboard-empty">
                            No expense data available.
                        </div>

                    ) : (

                        <div className="expense-chart-container">

                            <ResponsiveContainer
                                width="100%"
                                height={320}
                            >

                                <PieChart>

                                    <Pie
                                        data={
                                            categoryExpenses
                                        }
                                        dataKey="totalExpense"
                                        nameKey="categoryName"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={105}
                                        paddingAngle={3}
                                    >

                                        {categoryExpenses.map(
                                            (
                                                category,
                                                index
                                            ) => (

                                                <Cell
                                                    key={
                                                        category.categoryId ||
                                                        index
                                                    }
                                                    fill={
                                                        CHART_COLORS[
                                                        index %
                                                        CHART_COLORS.length
                                                            ]
                                                    }
                                                />

                                            )
                                        )}

                                    </Pie>


                                    <Tooltip
                                        formatter={(value) =>
                                            `₹ ${formatAmount(
                                                value
                                            )}`
                                        }
                                    />


                                    <Legend />

                                </PieChart>

                            </ResponsiveContainer>

                        </div>

                    )}

                </div>


                {/* =================================================
                    TREND CHART
                ================================================= */}

                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                Spending Trend
                            </h2>

                            <p>
                                Recent income and expenses
                            </p>

                        </div>

                    </div>


                    {monthlyTrendData.length === 0 ? (

                        <div className="dashboard-empty">
                            No transaction data available.
                        </div>

                    ) : (

                        <div className="trend-chart-container">

                            <ResponsiveContainer
                                width="100%"
                                height={320}
                            >

                                <LineChart
                                    data={
                                        monthlyTrendData
                                    }
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="displayDate"
                                    />

                                    <YAxis />

                                    <Tooltip
                                        formatter={(value) =>
                                            `₹ ${formatAmount(
                                                value
                                            )}`
                                        }
                                    />

                                    <Legend />


                                    <Line
                                        type="monotone"
                                        dataKey="income"
                                        name="Income"
                                        stroke="#22c55e"
                                        strokeWidth={3}
                                        dot={{
                                            r: 4
                                        }}
                                    />


                                    <Line
                                        type="monotone"
                                        dataKey="expense"
                                        name="Expense"
                                        stroke="#ef4444"
                                        strokeWidth={3}
                                        dot={{
                                            r: 4
                                        }}
                                    />

                                </LineChart>

                            </ResponsiveContainer>

                        </div>

                    )}

                </div>


            </section>


            {/* =================================================
                CALENDAR + BUDGET
            ================================================= */}

            <section className="dashboard-lower-grid">


                {/* =================================================
                    CALENDAR
                ================================================= */}

                <div className="dashboard-panel calendar-panel">


                    <div className="panel-header">

                        <div>

                            <h2>
                                Transaction Calendar
                            </h2>

                            <p>
                                View transaction activity
                            </p>

                        </div>


                        <div className="calendar-controls">

                            <button
                                type="button"
                                onClick={
                                    previousMonth
                                }
                            >
                                ‹
                            </button>


                            <button
                                type="button"
                                className="calendar-today-button"
                                onClick={
                                    goToToday
                                }
                            >
                                Today
                            </button>


                            <button
                                type="button"
                                onClick={
                                    nextMonth
                                }
                            >
                                ›
                            </button>

                        </div>

                    </div>


                    {/* SELECTED DATE CONTROLS */}

                    <div className="selected-date-controls">


                        <button
                            type="button"
                            onClick={() =>
                                changeDate(-1)
                            }
                        >
                            ← Yesterday
                        </button>


                        <button
                            type="button"
                            className="selected-date-today"
                            onClick={
                                goToToday
                            }
                        >
                            Today
                        </button>


                        <button
                            type="button"
                            onClick={() =>
                                changeDate(1)
                            }
                        >
                            Tomorrow →
                        </button>


                    </div>


                    {/* SELECTED DATE */}

                    <div className="selected-date-heading">

                        <h3>
                            {
                                formatCalendarDate(
                                    selectedDate
                                )
                            }
                        </h3>

                        <p>

                            {
                                dailyTransactions.length
                            }

                            {" "}

                            transaction
                            {
                                dailyTransactions.length !== 1
                                    ? "s"
                                    : ""
                            }

                        </p>

                    </div>


                    {/* MONTH */}

                    <div className="calendar-title">

                        {monthName}{" "}
                        {calendarYear}

                    </div>


                    {/* WEEK DAYS */}

                    <div className="calendar-weekdays">

                        <span>Sun</span>
                        <span>Mon</span>
                        <span>Tue</span>
                        <span>Wed</span>
                        <span>Thu</span>
                        <span>Fri</span>
                        <span>Sat</span>

                    </div>


                    {/* CALENDAR */}

                    <div className="calendar-grid">

                        {calendarCells}

                    </div>


                    {/* LEGEND */}

                    <div className="calendar-legend">

                        <span>

                            <i className="calendar-income-dot" />

                            Income

                        </span>


                        <span>

                            <i className="calendar-expense-dot" />

                            Expense

                        </span>

                    </div>


                    {/* DAILY TRANSACTIONS */}

                    <div className="daily-transactions">

                        <h3>
                            Transactions for selected date
                        </h3>


                        {dailyTransactions.length === 0 ? (

                            <div className="daily-empty">

                                No transactions on this date.

                            </div>

                        ) : (

                            <div className="daily-transaction-list">

                                {dailyTransactions.map(
                                    (transaction) => (

                                        <div
                                            className="daily-transaction-item"
                                            key={
                                                transaction.id
                                            }
                                        >


                                            <div
                                                className={
                                                    `daily-transaction-icon ${
                                                        transaction.type ===
                                                        "INCOME"
                                                            ? "income-icon"
                                                            : "expense-icon"
                                                    }`
                                                }
                                            >

                                                {
                                                    transaction.type ===
                                                    "INCOME"
                                                        ? "↗"
                                                        : "↘"
                                                }

                                            </div>


                                            <div className="daily-transaction-details">

                                                <strong>
                                                    {
                                                        transaction.description
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        transaction.categoryName
                                                    }
                                                </span>

                                            </div>


                                            <strong
                                                className={
                                                    `daily-transaction-amount ${
                                                        transaction.type ===
                                                        "INCOME"
                                                            ? "income"
                                                            : "expense"
                                                    }`
                                                }
                                            >

                                                {
                                                    transaction.type ===
                                                    "INCOME"
                                                        ? "+"
                                                        : "-"
                                                }

                                                ₹{" "}

                                                {
                                                    formatAmount(
                                                        transaction.amount
                                                    )
                                                }

                                            </strong>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>


                {/* =================================================
                    BUDGET
                ================================================= */}

                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                Budget Overview
                            </h2>

                            <p>
                                Budget performance
                            </p>

                        </div>

                    </div>


                    {budgetSummary.length === 0 ? (

                        <div className="dashboard-empty">

                            No budgets available.

                        </div>

                    ) : (

                        <div className="budget-summary-list">

                            {budgetSummary.map(
                                (budget) => {

                                    const percentage =
                                        getBudgetPercentage(
                                            budget.budgetAmount,
                                            budget.actualExpense
                                        );


                                    return (

                                        <div
                                            className="dashboard-budget-item"
                                            key={
                                                budget.budgetId
                                            }
                                        >


                                            <div className="dashboard-budget-top">

                                                <div>

                                                    <strong>
                                                        {
                                                            budget.categoryName
                                                        }
                                                    </strong>

                                                    <span>

                                                        ₹{" "}
                                                        {
                                                            formatAmount(
                                                                budget.actualExpense
                                                            )
                                                        }

                                                        {" / "}

                                                        ₹{" "}
                                                        {
                                                            formatAmount(
                                                                budget.budgetAmount
                                                            )
                                                        }

                                                    </span>

                                                </div>


                                                <span
                                                    className={
                                                        `budget-status ${
                                                            getBudgetStatusClass(
                                                                budget.status
                                                            )
                                                        }`
                                                    }
                                                >

                                                    {
                                                        budget.status ===
                                                        "WITHIN_BUDGET"
                                                            ? "Within Budget"
                                                            : "Exceeded"
                                                    }

                                                </span>

                                            </div>


                                            <div className="budget-progress">

                                                <div
                                                    className="budget-progress-fill"
                                                    style={{
                                                        width:
                                                            `${Math.min(
                                                                percentage,
                                                                100
                                                            )}%`
                                                    }}
                                                />

                                            </div>


                                            <div className="budget-progress-info">

                                                <span>

                                                    {percentage}%
                                                    used

                                                </span>


                                                <span>

                                                    Remaining:
                                                    {" "}
                                                    ₹{" "}
                                                    {
                                                        formatAmount(
                                                            budget.remainingAmount
                                                        )
                                                    }

                                                </span>

                                            </div>


                                        </div>

                                    );

                                }
                            )}

                        </div>

                    )}

                </div>


            </section>


            {/* =================================================
                RECENT TRANSACTIONS
            ================================================= */}

            <section className="dashboard-panel recent-transactions-panel">


                <div className="panel-header">

                    <div>

                        <h2>
                            Recent Transactions
                        </h2>

                        <p>
                            Your latest transactions
                        </p>

                    </div>


                    <button
                        className="view-all-button"
                        onClick={
                            handleAddTransaction
                        }
                    >
                        View All
                    </button>

                </div>


                {recentTransactions.length === 0 ? (

                    <div className="dashboard-empty">

                        No recent transactions.

                    </div>

                ) : (

                    <div className="recent-transactions-list">

                        {recentTransactions.map(
                            (transaction) => (

                                <div
                                    className="recent-transaction-item"
                                    key={
                                        transaction.id
                                    }
                                >


                                    <div
                                        className={
                                            `transaction-icon ${
                                                transaction.type ===
                                                "INCOME"
                                                    ? "income-icon"
                                                    : "expense-icon"
                                            }`
                                        }
                                    >

                                        {
                                            transaction.type ===
                                            "INCOME"
                                                ? "↗"
                                                : "↘"
                                        }

                                    </div>


                                    <div className="transaction-details">

                                        <strong>
                                            {
                                                transaction.description
                                            }
                                        </strong>

                                        <span>

                                            {
                                                transaction.categoryName
                                            }

                                            {" • "}

                                            {
                                                formatTransactionDate(
                                                    transaction.date
                                                )
                                            }

                                        </span>

                                    </div>


                                    <div
                                        className={
                                            `transaction-amount ${
                                                transaction.type ===
                                                "INCOME"
                                                    ? "income"
                                                    : "expense"
                                            }`
                                        }
                                    >

                                        {
                                            transaction.type ===
                                            "INCOME"
                                                ? "+"
                                                : "-"
                                        }

                                        ₹{" "}

                                        {
                                            formatAmount(
                                                transaction.amount
                                            )
                                        }

                                    </div>


                                </div>

                            )
                        )}

                    </div>

                )}

            </section>

            <footer className="dashboard-footer">

                Developed by Vighnesh Gunaga

            </footer>

        </div>
    );
}

export default Dashboard;