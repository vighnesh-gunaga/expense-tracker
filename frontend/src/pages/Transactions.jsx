import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../components/BackToDashboard.css";
import "./Transactions.css";

function Transactions() {

    const navigate = useNavigate();

    // ==============================
    // TRANSACTIONS
    // ==============================

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==============================
    // TRANSACTION FORM
    // ==============================

    const [amount, setAmount] = useState("");
    const [type, setType] = useState("EXPENSE");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [categoryName, setCategoryName] = useState("");

    // ==============================
    // CATEGORIES
    // ==============================

    const [categories, setCategories] = useState([]);

    // ==============================
    // MESSAGES
    // ==============================

    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState(null);

    // ==============================
    // SEARCH
    // ==============================

    const [searchId, setSearchId] = useState("");
    const [searchedTransaction, setSearchedTransaction] = useState(null);

    // ==============================
    // FILTERS
    // ==============================

    const [filterType, setFilterType] = useState("ALL");
    const [filterCategory, setFilterCategory] = useState("");
    const [filterDate, setFilterDate] = useState("");

    // ==============================
    // SORTING
    // ==============================

    const [sortOption, setSortOption] = useState("NEWEST");

    // ==============================
    // PAGINATION
    // ==============================

    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 5;

    // ==============================
    // VIEW TRANSACTION
    // ==============================

    const [viewedTransaction, setViewedTransaction] = useState(null);

    // ==============================
    // LOAD CATEGORIES
    // ==============================

    useEffect(() => {

        const loadCategories = async () => {

            try {

                const response =
                    await api.get("/api/categories");

                setCategories(response.data);

            } catch (error) {

                if (error.response) {

                    setError(
                        error.response.data.message ||
                        "Unable to load categories"
                    );

                } else {

                    setError(
                        "Unable to connect to server"
                    );

                }

            }

        };

        loadCategories();

    }, []);

    // ==============================
    // LOAD TRANSACTIONS
    // ==============================

    useEffect(() => {

        const loadTransactions = async () => {

            try {

                const response =
                    await api.get("/api/transactions");

                setTransactions(response.data);

            } catch (error) {

                if (error.response) {

                    setError(
                        error.response.data.message ||
                        "Unable to load transactions"
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

        loadTransactions();

    }, []);

    // ==============================
    // EDIT TRANSACTION
    // ==============================

    const handleEditTransaction = (transaction) => {

        setEditingId(transaction.id);

        setAmount(transaction.amount);
        setType(transaction.type);
        setDescription(transaction.description);
        setDate(transaction.date);
        setCategoryName(transaction.categoryName);

        setMessage("");
        setError("");
    };

    // ==============================
    // SAVE TRANSACTION
    // ==============================

    const handleSaveTransaction = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");

        const requestData = {
            amount: Number(amount),
            type: type,
            description: description,
            date: date,
            categoryName: categoryName
        };

        try {

            if (editingId === null) {

                const response = await api.post(
                    "/api/transactions",
                    requestData
                );

                setTransactions((previousTransactions) => [
                    response.data,
                    ...previousTransactions
                ]);

                setCurrentPage(1);

                setMessage(
                    "Transaction added successfully"
                );

            } else {

                const response = await api.put(
                    `/api/transactions/${editingId}`,
                    requestData
                );

                setTransactions((previousTransactions) =>
                    previousTransactions.map(
                        (transaction) =>
                            transaction.id === editingId
                                ? response.data
                                : transaction
                    )
                );

                setEditingId(null);

                setMessage(
                    "Transaction updated successfully"
                );
            }

            // Reset form
            setAmount("");
            setType("EXPENSE");
            setDescription("");
            setDate("");
            setCategoryName("");

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Unable to save transaction"
                );

            } else {

                setError(
                    "Unable to connect to server"
                );

            }

        }

    };

    // ==============================
    // VIEW TRANSACTION
    // ==============================

    const handleViewTransaction = async (id) => {

        setError("");
        setMessage("");
        setViewedTransaction(null);

        try {

            const response = await api.get(
                `/api/transactions/${id}`
            );

            setViewedTransaction(response.data);

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Unable to load transaction"
                );

            } else {

                setError(
                    "Unable to connect to server"
                );

            }

        }

    };

    // ==============================
    // DELETE TRANSACTION
    // ==============================

    const handleDeleteTransaction = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setMessage("");

        try {

            await api.delete(
                `/api/transactions/${id}`
            );

            setTransactions(
                (previousTransactions) =>
                    previousTransactions.filter(
                        (transaction) =>
                            transaction.id !== id
                    )
            );

            setMessage(
                "Transaction deleted successfully"
            );

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Unable to delete transaction"
                );

            } else {

                setError(
                    "Unable to connect to server"
                );

            }

        }

    };

    // ==============================
    // SEARCH TRANSACTION
    // ==============================

    const handleSearchTransaction = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");
        setSearchedTransaction(null);

        try {

            const response = await api.get(
                `/api/transactions/${searchId}`
            );

            setSearchedTransaction(
                response.data
            );

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Transaction not found"
                );

            } else {

                setError(
                    "Unable to connect to server"
                );

            }

        }

    };

    // ==============================
    // FILTER TRANSACTIONS
    // ==============================

    const filteredTransactions =
        transactions.filter((transaction) => {

            const matchesType =
                filterType === "ALL" ||
                transaction.type === filterType;

            const matchesCategory =
                filterCategory === "" ||
                transaction.categoryName
                    .toLowerCase()
                    .includes(
                        filterCategory.toLowerCase()
                    );

            const matchesDate =
                filterDate === "" ||
                transaction.date === filterDate;

            return (
                matchesType &&
                matchesCategory &&
                matchesDate
            );

        });

    // ==============================
    // SORT TRANSACTIONS
    // ==============================

    const sortedTransactions =
        [...filteredTransactions].sort(
            (a, b) => {

                if (sortOption === "NEWEST") {

                    return (
                        new Date(b.date) -
                        new Date(a.date)
                    );

                }

                if (sortOption === "OLDEST") {

                    return (
                        new Date(a.date) -
                        new Date(b.date)
                    );

                }

                if (sortOption === "HIGH_AMOUNT") {

                    return (
                        Number(b.amount) -
                        Number(a.amount)
                    );

                }

                if (sortOption === "LOW_AMOUNT") {

                    return (
                        Number(a.amount) -
                        Number(b.amount)
                    );

                }

                return 0;

            }
        );

    // ==============================
    // PAGINATION
    // ==============================

    const totalPages =
        Math.ceil(
            sortedTransactions.length /
            transactionsPerPage
        );

    const startIndex =
        (currentPage - 1) *
        transactionsPerPage;

    const paginatedTransactions =
        sortedTransactions.slice(
            startIndex,
            startIndex + transactionsPerPage
        );

    // ==============================
    // STATISTICS
    // ==============================

    const totalTransactions =
        filteredTransactions.length;

    const totalIncome =
        filteredTransactions
            .filter(
                (transaction) =>
                    transaction.type === "INCOME"
            )
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );

    const totalExpense =
        filteredTransactions
            .filter(
                (transaction) =>
                    transaction.type === "EXPENSE"
            )
            .reduce(
                (total, transaction) =>
                    total + Number(transaction.amount),
                0
            );

    const balance =
        totalIncome - totalExpense;

    // ==============================
    // EXPORT CSV
    // ==============================

    const handleExportCSV = () => {

        if (filteredTransactions.length === 0) {

            setError(
                "No transactions available to export"
            );

            return;
        }

        const headers = [
            "ID",
            "Date",
            "Description",
            "Category",
            "Type",
            "Amount"
        ];

        const rows = filteredTransactions.map(
            (transaction) => [
                transaction.id,
                transaction.date,
                transaction.description,
                transaction.categoryName,
                transaction.type,
                transaction.amount
            ]
        );

        const exportIncome =
            filteredTransactions
                .filter(
                    (transaction) =>
                        transaction.type === "INCOME"
                )
                .reduce(
                    (total, transaction) =>
                        total + Number(transaction.amount),
                    0
                );

        const exportExpense =
            filteredTransactions
                .filter(
                    (transaction) =>
                        transaction.type === "EXPENSE"
                )
                .reduce(
                    (total, transaction) =>
                        total + Number(transaction.amount),
                    0
                );

        const exportBalance =
            exportIncome - exportExpense;

        const csvContent = [
            headers,
            ...rows,
            [],
            ["SUMMARY"],
            [
                "Total Transactions",
                filteredTransactions.length
            ],
            ["Total Income", exportIncome],
            ["Total Expense", exportExpense],
            ["Balance", exportBalance]
        ]
            .map((row) =>
                row
                    .map((value) =>
                        `"${String(value).replace(/"/g, '""')}"`
                    )
                    .join(",")
            )
            .join("\n");

        const blob = new Blob(
            [csvContent],
            {
                type: "text/csv;charset=utf-8;"
            }
        );

        const url =
            URL.createObjectURL(blob);

        const link =
            document.createElement("a");

        const exportDate = new Date()
            .toISOString()
            .split("T")[0];

        link.href = url;

        link.download =
            `transactions_${exportDate}.csv`;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (
            <div className="transactions-page">

                <h2 className="loading-text">
                    Loading transactions...
                </h2>

            </div>
        );

    }

    // ==============================
    // MAIN UI
    // ==============================

    return (

        <div className="transactions-page">

            <h1 className="transactions-title">
                Transactions
            </h1>

            <button
                type="button"
                className="back-dashboard-button"
                onClick={() => navigate("/dashboard")}
            >
                ← Back to Dashboard
            </button>

            {/* ==============================
                STATISTICS
            ============================== */}

            <div className="transaction-statistics">

                <div className="transaction-stat-card">

                    <h3>
                        Total Transactions
                    </h3>

                    <p>
                        {totalTransactions}
                    </p>

                </div>

                <div className="transaction-stat-card income-stat">

                    <h3>
                        Total Income
                    </h3>

                    <p>
                        ₹ {totalIncome.toFixed(2)}
                    </p>

                </div>

                <div className="transaction-stat-card expense-stat">

                    <h3>
                        Total Expense
                    </h3>

                    <p>
                        ₹ {totalExpense.toFixed(2)}
                    </p>

                </div>

                <div className="transaction-stat-card balance-stat">

                    <h3>
                        Balance
                    </h3>

                    <p>
                        ₹ {balance.toFixed(2)}
                    </p>

                </div>

            </div>

            {/* ==============================
                EXPORT
            ============================== */}

            <div className="transaction-actions">

                <button
                    type="button"
                    className="export-button"
                    onClick={handleExportCSV}
                >
                    Export CSV
                </button>

            </div>

            {/* ==============================
                MESSAGES
            ============================== */}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {/* ==============================
                ADD / UPDATE TRANSACTION
            ============================== */}

            <section className="transaction-form-section">

                <h2>
                    {editingId === null
                        ? "Add Transaction"
                        : "Update Transaction"}
                </h2>

                <form
                    className="transaction-form"
                    onSubmit={handleSaveTransaction}
                >

                    {/* AMOUNT */}

                    <div className="form-group">

                        <label>
                            Amount
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={amount}
                            onChange={(event) =>
                                setAmount(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>

                    {/* TYPE */}

                    <div className="form-group">

                        <label>
                            Type
                        </label>

                        <select
                            value={type}
                            onChange={(event) => {

                                setType(
                                    event.target.value
                                );

                                // Reset category when type changes
                                setCategoryName("");

                            }}
                        >

                            <option value="EXPENSE">
                                Expense
                            </option>

                            <option value="INCOME">
                                Income
                            </option>

                        </select>

                    </div>

                    {/* DESCRIPTION */}

                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <input
                            type="text"
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                            minLength="3"
                            maxLength="100"
                            placeholder="Example: Monthly salary"
                            required
                        />

                    </div>

                    {/* DATE */}

                    <div className="form-group">

                        <label>
                            Date
                        </label>

                        <input
                            type="date"
                            value={date}
                            onChange={(event) =>
                                setDate(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>

                    {/* CATEGORY */}

                    <div className="form-group">

                        <label>
                            Category
                        </label>

                        <select
                            value={categoryName}
                            onChange={(event) =>
                                setCategoryName(
                                    event.target.value
                                )
                            }
                            required
                        >

                            <option value="">
                                Select Category
                            </option>

                            {categories
                                .filter(
                                    (category) =>
                                        category.type === type
                                )
                                .map((category) => (

                                    <option
                                        key={category.id}
                                        value={category.name}
                                    >
                                        {category.name}
                                    </option>

                                ))
                            }

                        </select>

                    </div>

                    {/* BUTTONS */}

                    <div className="form-buttons">

                        <button
                            className="primary-button"
                            type="submit"
                        >
                            {editingId === null
                                ? "Add Transaction"
                                : "Update Transaction"}
                        </button>

                        {editingId !== null && (

                            <button
                                className="cancel-button"
                                type="button"
                                onClick={() => {

                                    setEditingId(null);
                                    setAmount("");
                                    setType("EXPENSE");
                                    setDescription("");
                                    setDate("");
                                    setCategoryName("");
                                    setMessage("");
                                    setError("");

                                }}
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </section>

            {/* ==============================
                SEARCH TRANSACTION
            ============================== */}

            <section className="search-section">

                <h2>
                    Find Transaction
                </h2>

                <form
                    className="search-form"
                    onSubmit={handleSearchTransaction}
                >

                    <input
                        type="number"
                        placeholder="Enter transaction ID"
                        value={searchId}
                        onChange={(event) =>
                            setSearchId(
                                event.target.value
                            )
                        }
                        required
                    />

                    <button
                        className="search-button"
                        type="submit"
                    >
                        Search
                    </button>

                </form>

                {searchedTransaction && (

                    <div className="searched-transaction">

                        <h3>
                            {searchedTransaction.description}
                        </h3>

                        <p>
                            <strong>ID:</strong>{" "}
                            {searchedTransaction.id}
                        </p>

                        <p>
                            <strong>Amount:</strong>{" "}
                            ₹ {searchedTransaction.amount}
                        </p>

                        <p>
                            <strong>Type:</strong>{" "}
                            {searchedTransaction.type}
                        </p>

                        <p>
                            <strong>Category:</strong>{" "}
                            {searchedTransaction.categoryName}
                        </p>

                        <p>
                            <strong>Date:</strong>{" "}
                            {searchedTransaction.date}
                        </p>

                    </div>

                )}

            </section>

            {/* ==============================
                FILTER AND SORT
            ============================== */}

            <section className="filter-section">

                <h2>
                    Filter Transactions
                </h2>

                <div className="filter-container">

                    {/* TYPE */}

                    <div className="filter-group">

                        <label>
                            Type
                        </label>

                        <select
                            value={filterType}
                            onChange={(event) => {

                                setFilterType(
                                    event.target.value
                                );

                                setCurrentPage(1);

                            }}
                        >

                            <option value="ALL">
                                All
                            </option>

                            <option value="EXPENSE">
                                Expense
                            </option>

                            <option value="INCOME">
                                Income
                            </option>

                        </select>

                    </div>

                    {/* CATEGORY */}

                    <div className="filter-group">

                        <label>
                            Category
                        </label>

                        <input
                            type="text"
                            placeholder="Example: Food"
                            value={filterCategory}
                            onChange={(event) => {

                                setFilterCategory(
                                    event.target.value
                                );

                                setCurrentPage(1);

                            }}
                        />

                    </div>

                    {/* DATE */}

                    <div className="filter-group">

                        <label>
                            Date
                        </label>

                        <input
                            type="date"
                            value={filterDate}
                            onChange={(event) => {

                                setFilterDate(
                                    event.target.value
                                );

                                setCurrentPage(1);

                            }}
                        />

                    </div>

                    {/* SORT */}

                    <div className="filter-group">

                        <label>
                            Sort By
                        </label>

                        <select
                            value={sortOption}
                            onChange={(event) => {

                                setSortOption(
                                    event.target.value
                                );

                                setCurrentPage(1);

                            }}
                        >

                            <option value="NEWEST">
                                Newest First
                            </option>

                            <option value="OLDEST">
                                Oldest First
                            </option>

                            <option value="HIGH_AMOUNT">
                                Amount: High to Low
                            </option>

                            <option value="LOW_AMOUNT">
                                Amount: Low to High
                            </option>

                        </select>

                    </div>

                    {/* CLEAR FILTERS */}

                    <button
                        className="clear-filter-button"
                        type="button"
                        onClick={() => {

                            setFilterType("ALL");
                            setFilterCategory("");
                            setFilterDate("");
                            setSortOption("NEWEST");
                            setCurrentPage(1);

                        }}
                    >
                        Clear Filters
                    </button>

                </div>

            </section>

            {/* ==============================
                VIEWED TRANSACTION
            ============================== */}

            {viewedTransaction && (

                <section className="transaction-details-section">

                    <div className="transaction-details-header">

                        <h2>
                            Transaction Details
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                setViewedTransaction(null)
                            }
                        >
                            Close
                        </button>

                    </div>

                    <div className="transaction-details-card">

                        <h3>
                            {viewedTransaction.description}
                        </h3>

                        <p>
                            <strong>ID:</strong>{" "}
                            {viewedTransaction.id}
                        </p>

                        <p>
                            <strong>Amount:</strong>{" "}
                            ₹ {viewedTransaction.amount}
                        </p>

                        <p>
                            <strong>Type:</strong>{" "}
                            {viewedTransaction.type}
                        </p>

                        <p>
                            <strong>Category:</strong>{" "}
                            {viewedTransaction.categoryName}
                        </p>

                        <p>
                            <strong>Date:</strong>{" "}
                            {viewedTransaction.date}
                        </p>

                    </div>

                </section>

            )}

            {/* ==============================
                TRANSACTION LIST
            ============================== */}

            <section className="transaction-list-section">

                <h2>
                    Your Transactions
                </h2>

                {filteredTransactions.length === 0 ? (

                    <p className="empty-message">

                        {transactions.length === 0
                            ? "No transactions found."
                            : "No transactions match your filters."}

                    </p>

                ) : (

                    <>

                        <div className="transaction-list">

                            {paginatedTransactions.map(
                                (transaction) => (

                                    <div
                                        className={`transaction-card ${
                                            transaction.type === "EXPENSE"
                                                ? "expense-card"
                                                : "income-card"
                                        }`}
                                        key={transaction.id}
                                    >

                                        <div className="transaction-card-header">

                                            <h3>
                                                {transaction.description}
                                            </h3>

                                            <span
                                                className={`transaction-type ${
                                                    transaction.type === "EXPENSE"
                                                        ? "expense-type"
                                                        : "income-type"
                                                }`}
                                            >
                                                {transaction.type}
                                            </span>

                                        </div>

                                        <div className="transaction-details">

                                            <p>
                                                <strong>
                                                    Amount:
                                                </strong>{" "}
                                                ₹ {transaction.amount}
                                            </p>

                                            <p>
                                                <strong>
                                                    Category:
                                                </strong>{" "}
                                                {transaction.categoryName}
                                            </p>

                                            <p>
                                                <strong>
                                                    Date:
                                                </strong>{" "}
                                                {transaction.date}
                                            </p>

                                        </div>

                                        <div className="transaction-actions">

                                            <button
                                                className="view-button"
                                                type="button"
                                                onClick={() =>
                                                    handleViewTransaction(
                                                        transaction.id
                                                    )
                                                }
                                            >
                                                View
                                            </button>

                                            <button
                                                className="edit-button"
                                                type="button"
                                                onClick={() =>
                                                    handleEditTransaction(
                                                        transaction
                                                    )
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteTransaction(
                                                        transaction.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                        {/* ==============================
                            PAGINATION
                        ============================== */}

                        {totalPages > 1 && (

                            <div className="pagination">

                                <button
                                    type="button"
                                    disabled={
                                        currentPage === 1
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (previousPage) =>
                                                previousPage - 1
                                        )
                                    }
                                >
                                    Previous
                                </button>

                                <span>
                                    Page {currentPage} of{" "}
                                    {totalPages}
                                </span>

                                <button
                                    type="button"
                                    disabled={
                                        currentPage === totalPages
                                    }
                                    onClick={() =>
                                        setCurrentPage(
                                            (previousPage) =>
                                                previousPage + 1
                                        )
                                    }
                                >
                                    Next
                                </button>

                            </div>

                        )}

                    </>

                )}

            </section>

        </div>

    );
}

export default Transactions;