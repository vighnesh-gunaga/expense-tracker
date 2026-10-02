import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../components/BackToDashboard.css";
import "./Budgets.css";

function Budgets() {

    const navigate = useNavigate();

    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);

    const [summaries, setSummaries] = useState({});

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [limitAmount, setLimitAmount] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    const [editingId, setEditingId] = useState(null);


    // ==============================
    // MONTH NAME
    // ==============================

    const getMonthName = (month) => {

        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];

        return months[month - 1] || "Unknown Month";
    };


    // ==============================
    // LOAD BUDGETS
    // ==============================

    const loadBudgets = async () => {

        try {

            const response =
                await api.get("/api/budgets");

            setBudgets(response.data);

            return response.data;

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Unable to load budgets"
                );

            } else {

                setError(
                    "Unable to connect to server"
                );

            }

            return [];

        }
    };


    // ==============================
    // LOAD CATEGORIES
    // ==============================

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


    // ==============================
    // LOAD SUMMARY
    // ==============================

    const loadBudgetSummaries = async (budgetList) => {

        try {

            const summaryResults =
                await Promise.all(
                    budgetList.map(async (budget) => {

                        try {

                            const response =
                                await api.get(
                                    `/api/budgets/${budget.id}/summary`
                                );

                            return {
                                id: budget.id,
                                summary: response.data
                            };

                        } catch (error) {

                            return {
                                id: budget.id,
                                summary: null
                            };

                        }

                    })
                );

            const summaryMap = {};

            summaryResults.forEach((item) => {

                summaryMap[item.id] =
                    item.summary;

            });

            setSummaries(summaryMap);

        } catch (error) {

            console.error(
                "Unable to load budget summaries",
                error
            );

        }
    };


    // ==============================
    // LOAD DATA
    // ==============================

    useEffect(() => {

        const loadData = async () => {

            const budgetList =
                await loadBudgets();

            await loadCategories();

            if (budgetList.length > 0) {

                await loadBudgetSummaries(
                    budgetList
                );

            }

            setLoading(false);

        };

        loadData();

    }, []);


    // ==============================
    // RESET FORM
    // ==============================

    const resetForm = () => {

        setLimitAmount("");
        setCategoryName("");
        setMonth("");
        setYear("");
        setEditingId(null);

    };


    // ==============================
    // CREATE / UPDATE
    // ==============================

    const handleSaveBudget = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");

        const requestData = {
            limitAmount: Number(limitAmount),
            month: Number(month),
            year: Number(year),
            categoryName: categoryName
        };


        try {

            // CREATE
            if (editingId === null) {

                const response =
                    await api.post(
                        "/api/budgets/create",
                        requestData
                    );

                const newBudget =
                    response.data;

                setBudgets((previousBudgets) => [
                    newBudget,
                    ...previousBudgets
                ]);

                // Load summary for new budget
                try {

                    const summaryResponse =
                        await api.get(
                            `/api/budgets/${newBudget.id}/summary`
                        );

                    setSummaries(
                        (previousSummaries) => ({
                            ...previousSummaries,
                            [newBudget.id]:
                            summaryResponse.data
                        })
                    );

                } catch (summaryError) {

                    console.error(
                        "Unable to load new budget summary",
                        summaryError
                    );

                }

                setMessage(
                    "Budget created successfully"
                );

            }

            // UPDATE
            else {

                const response =
                    await api.put(
                        `/api/budgets/${editingId}`,
                        requestData
                    );

                const updatedBudget =
                    response.data;

                setBudgets((previousBudgets) =>
                    previousBudgets.map((budget) =>
                        budget.id === editingId
                            ? updatedBudget
                            : budget
                    )
                );

                // Reload summary after update
                try {

                    const summaryResponse =
                        await api.get(
                            `/api/budgets/${editingId}/summary`
                        );

                    setSummaries(
                        (previousSummaries) => ({
                            ...previousSummaries,
                            [editingId]:
                            summaryResponse.data
                        })
                    );

                } catch (summaryError) {

                    console.error(
                        "Unable to load updated budget summary",
                        summaryError
                    );

                }

                setMessage(
                    "Budget updated successfully"
                );

            }

            resetForm();

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Unable to save budget"
                );

            } else {

                setError(
                    "Unable to connect to server"
                );

            }

        }

    };


    // ==============================
    // EDIT
    // ==============================

    const handleEditBudget = (budget) => {

        setEditingId(budget.id);

        setLimitAmount(
            budget.limitAmount
        );

        setCategoryName(
            budget.categoryName
        );

        setMonth(
            budget.month
        );

        setYear(
            budget.year
        );

        setError("");
        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ==============================
    // DELETE
    // ==============================

    const handleDeleteBudget = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this budget?"
            );

        if (!confirmed) {
            return;
        }

        setError("");
        setMessage("");

        try {

            await api.delete(
                `/api/budgets/${id}`
            );

            setBudgets(
                (previousBudgets) =>
                    previousBudgets.filter(
                        (budget) =>
                            budget.id !== id
                    )
            );

            setSummaries(
                (previousSummaries) => {

                    const updatedSummaries = {
                        ...previousSummaries
                    };

                    delete updatedSummaries[id];

                    return updatedSummaries;

                }
            );

            setMessage(
                "Budget deleted successfully"
            );

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Unable to delete budget"
                );

            } else {

                setError(
                    "Unable to connect to server"
                );

            }

        }

    };


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (

            <div className="budgets-page">

                <h2>
                    Loading budgets...
                </h2>

            </div>

        );

    }


    return (

        <div className="budgets-page">

            {/* PAGE TITLE */}

            <h1 className="budgets-title">
                Budgets
            </h1>


            <button
                type="button"
                className="back-dashboard-button"
                onClick={() => navigate("/dashboard")}
            >
                ← Back to Dashboard
            </button>


            {/* ERROR */}

            {error && (

                <div className="budget-error">
                    {error}
                </div>

            )}


            {/* SUCCESS */}

            {message && (

                <div className="budget-success">
                    {message}
                </div>

            )}


            {/* ==============================
                CREATE / UPDATE FORM
            ============================== */}

            <section className="budget-section">

                <div className="budget-section-header">

                    <h2>
                        {editingId === null
                            ? "Create Budget"
                            : "Update Budget"}
                    </h2>

                </div>


                <form
                    className="budget-form"
                    onSubmit={handleSaveBudget}
                >

                    {/* LIMIT */}

                    <div className="budget-form-group">

                        <label>
                            Budget Limit
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={limitAmount}
                            onChange={(event) =>
                                setLimitAmount(
                                    event.target.value
                                )
                            }
                            placeholder="Example: 5000"
                            required
                        />

                    </div>


                    {/* CATEGORY */}

                    <div className="budget-form-group">

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
                                        category.type ===
                                        "EXPENSE"
                                )
                                .map((category) => (

                                    <option
                                        key={category.id}
                                        value={category.name}
                                    >
                                        {category.name}
                                    </option>

                                ))}

                        </select>

                    </div>


                    {/* MONTH */}

                    <div className="budget-form-group">

                        <label>
                            Month
                        </label>

                        <select
                            value={month}
                            onChange={(event) =>
                                setMonth(
                                    event.target.value
                                )
                            }
                            required
                        >

                            <option value="">
                                Select Month
                            </option>

                            {[
                                "January",
                                "February",
                                "March",
                                "April",
                                "May",
                                "June",
                                "July",
                                "August",
                                "September",
                                "October",
                                "November",
                                "December"
                            ].map(
                                (monthName, index) => (

                                    <option
                                        key={index + 1}
                                        value={index + 1}
                                    >
                                        {monthName}
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* YEAR */}

                    <div className="budget-form-group">

                        <label>
                            Year
                        </label>

                        <input
                            type="number"
                            min="2000"
                            max="2100"
                            value={year}
                            onChange={(event) =>
                                setYear(
                                    event.target.value
                                )
                            }
                            placeholder="Example: 2026"
                            required
                        />

                    </div>


                    {/* FORM BUTTONS */}

                    <div className="budget-form-actions">

                        <button
                            type="submit"
                            className="budget-submit-button"
                        >
                            {editingId === null
                                ? "Create Budget"
                                : "Update Budget"}
                        </button>


                        {editingId !== null && (

                            <button
                                type="button"
                                className="budget-cancel-button"
                                onClick={() => {

                                    resetForm();
                                    setError("");
                                    setMessage("");

                                }}
                            >
                                Cancel
                            </button>

                        )}

                    </div>

                </form>

            </section>


            {/* ==============================
                BUDGET LIST
            ============================== */}

            <section className="budget-section">

                <div className="budget-section-header">

                    <h2>
                        Your Budgets
                    </h2>

                    <span>
                        {budgets.length} budget
                        {budgets.length !== 1
                            ? "s"
                            : ""}
                    </span>

                </div>


                {budgets.length === 0 ? (

                    <div className="empty-budget">

                        <h3>
                            No budgets found
                        </h3>

                        <p>
                            You have not created any
                            budgets yet.
                        </p>

                    </div>

                ) : (

                    <div className="budget-grid">

                        {budgets.map((budget) => {

                            const summary =
                                summaries[budget.id];

                            let spendingPercentage = 0;

                            if (
                                summary &&
                                Number(
                                    summary.budgetAmount
                                ) > 0
                            ) {

                                spendingPercentage =
                                    (
                                        Number(
                                            summary.actualExpense
                                        ) /
                                        Number(
                                            summary.budgetAmount
                                        )
                                    ) * 100;

                            }

                            const progressWidth =
                                Math.min(
                                    spendingPercentage,
                                    100
                                );


                            return (

                                <div
                                    className="budget-card"
                                    key={budget.id}
                                >

                                    {/* HEADER */}

                                    <div className="budget-card-header">

                                        <h3>
                                            {
                                                budget.categoryName
                                            }
                                        </h3>

                                        <span className="budget-type">
                                            {
                                                getMonthName(
                                                    budget.month
                                                )
                                            }{" "}
                                            {
                                                budget.year
                                            }
                                        </span>

                                    </div>


                                    {/* BASIC INFO */}

                                    <div className="budget-card-content">

                                        <div className="budget-info">

                                            <span>
                                                Budget Limit
                                            </span>

                                            <strong>
                                                ₹{" "}
                                                {Number(
                                                    budget.limitAmount
                                                ).toFixed(2)}
                                            </strong>

                                        </div>


                                        <div className="budget-info">

                                            <span>
                                                Category ID
                                            </span>

                                            <strong>
                                                {
                                                    budget.categoryId
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    {/* SUMMARY */}

                                    {summary ? (

                                        <div className="budget-summary">

                                            <h4>
                                                Budget Summary
                                            </h4>


                                            <div className="budget-summary-row">

                                                <span>
                                                    Actual Expense
                                                </span>

                                                <strong>
                                                    ₹{" "}
                                                    {Number(
                                                        summary.actualExpense
                                                    ).toFixed(2)}
                                                </strong>

                                            </div>


                                            <div className="budget-summary-row">

                                                <span>
                                                    Remaining
                                                </span>

                                                <strong>
                                                    ₹{" "}
                                                    {Number(
                                                        summary.remainingAmount
                                                    ).toFixed(2)}
                                                </strong>

                                            </div>


                                            <div className="budget-summary-row">

                                                <span>
                                                    Status
                                                </span>

                                                <strong
                                                    className={
                                                        `budget-status ${summary.status
                                                            .toLowerCase()
                                                            .replace(
                                                                /\s+/g,
                                                                "-"
                                                            )}`
                                                    }
                                                >
                                                    {
                                                        summary.status
                                                    }
                                                </strong>

                                            </div>


                                            {/* PROGRESS */}

                                            <div className="budget-progress-section">

                                                <div className="budget-progress-header">

                                                    <span>
                                                        Spending
                                                    </span>

                                                    <strong>
                                                        {
                                                            spendingPercentage.toFixed(
                                                                1
                                                            )
                                                        }
                                                        %
                                                    </strong>

                                                </div>


                                                <div className="budget-progress-bar">

                                                    <div
                                                        className={
                                                            `budget-progress-fill ${
                                                                summary.status ===
                                                                "Over Budget"
                                                                    ? "over-budget"
                                                                    : ""
                                                            }`
                                                        }
                                                        style={{
                                                            width: `${progressWidth}%`
                                                        }}
                                                    />

                                                </div>

                                            </div>

                                        </div>

                                    ) : (

                                        <div className="budget-summary-loading">

                                            Unable to load
                                            summary.

                                        </div>

                                    )}


                                    {/* ACTIONS */}

                                    <div className="budget-actions">

                                        <button
                                            type="button"
                                            className="budget-edit-button"
                                            onClick={() =>
                                                handleEditBudget(
                                                    budget
                                                )
                                            }
                                        >
                                            Edit
                                        </button>


                                        <button
                                            type="button"
                                            className="budget-delete-button"
                                            onClick={() =>
                                                handleDeleteBudget(
                                                    budget.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </section>

        </div>

    );

}

export default Budgets;