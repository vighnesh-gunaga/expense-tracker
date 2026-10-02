import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import "../components/BackToDashboard.css";
import "./Categories.css";

function Categories() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [type, setType] = useState("EXPENSE");
    const [message, setMessage] = useState("");
    const [editingId, setEditingId] = useState(null);

    const [searchId, setSearchId] = useState("");
    const [searchName, setSearchName] = useState("");
    const [searchedCategory, setSearchedCategory] = useState(null);


    // Load categories
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

            } finally {

                setLoading(false);

            }

        };

        loadCategories();

    }, []);


    // Add category
    const handleAddCategory = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");

        try {

            const response = await api.post(
                "/api/categories",
                {
                    name: name,
                    type: type
                }
            );

            setCategories((previousCategories) => [
                ...previousCategories,
                response.data
            ]);

            setName("");
            setType("EXPENSE");

            setMessage("Category added successfully");

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Unable to add category"
                );

            } else {

                setError(
                    "Unable to connect to server"
                );

            }

        }

    };


    // Delete category
    const handleDeleteCategory = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setMessage("");

        try {

            await api.delete(`/api/categories/${id}`);

            setCategories((previousCategories) =>
                previousCategories.filter(
                    (category) => category.id !== id
                )
            );

            setMessage("Category deleted successfully");

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Unable to delete category"
                );

            } else {

                setError(
                    "Unable to connect to server"
                );

            }

        }

    };


    // Update category
    const handleUpdateCategory = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");

        try {

            const response = await api.put(
                `/api/categories/${editingId}`,
                {
                    name: name,
                    type: type
                }
            );

            setCategories((previousCategories) =>
                previousCategories.map((category) =>
                    category.id === editingId
                        ? response.data
                        : category
                )
            );

            setName("");
            setType("EXPENSE");
            setEditingId(null);

            setMessage("Category updated successfully");

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Unable to update category"
                );

            } else {

                setError(
                    "Unable to connect to server"
                );

            }

        }

    };


    // Edit category
    const handleEditCategory = (category) => {

        setEditingId(category.id);
        setName(category.name);
        setType(category.type);

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // Search by ID
    const handleSearchById = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");
        setSearchedCategory(null);

        try {

            const response = await api.get(
                `/api/categories/${searchId}`
            );

            setSearchedCategory(response.data);

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Category not found"
                );

            } else {

                setError(
                    "Unable to connect to server"
                );

            }

        }

    };


    // Search by name
    const handleSearchByName = async (event) => {

        event.preventDefault();

        setError("");
        setMessage("");
        setSearchedCategory(null);

        try {

            const response = await api.get(
                `/api/categories/search?name=${encodeURIComponent(searchName)}`
            );

            setSearchedCategory(response.data);

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Category not found"
                );

            } else {

                setError(
                    "Unable to connect to server"
                );

            }

        }

    };


    if (loading) {

        return (
            <div className="categories-page">
                <div className="loading-card">
                    Loading categories...
                </div>
            </div>
        );

    }


    return (

        <div className="categories-page">

            <div className="categories-container">

                <div className="categories-header">

                    <h1>Categories</h1>

                    <p>
                        Manage your income and expense categories
                    </p>


                    <button
                        type="button"
                        className="back-dashboard-button"
                        onClick={() => navigate("/dashboard")}
                    >
                        ← Back to Dashboard
                    </button>

                </div>


                {error && (
                    <div className="message error-message">
                        {error}
                    </div>
                )}


                {message && (
                    <div className="message success-message">
                        {message}
                    </div>
                )}


                {/* Add / Update Category */}

                <div className="category-card">

                    <h2>
                        {editingId === null
                            ? "Add Category"
                            : "Update Category"}
                    </h2>

                    <form
                        className="category-form"
                        onSubmit={
                            editingId === null
                                ? handleAddCategory
                                : handleUpdateCategory
                        }
                    >

                        <div className="form-group">

                            <label>
                                Category Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter category name"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Type
                            </label>

                            <select
                                value={type}
                                onChange={(event) =>
                                    setType(event.target.value)
                                }
                            >

                                <option value="EXPENSE">
                                    Expense
                                </option>

                                <option value="INCOME">
                                    Income
                                </option>

                            </select>

                        </div>


                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="primary-button"
                            >
                                {editingId === null
                                    ? "Add Category"
                                    : "Update Category"}
                            </button>


                            {editingId !== null && (

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={() => {

                                        setEditingId(null);
                                        setName("");
                                        setType("EXPENSE");
                                        setMessage("");

                                    }}
                                >
                                    Cancel
                                </button>

                            )}

                        </div>

                    </form>

                </div>


                {/* Search */}

                <div className="category-card">

                    <h2>
                        Find Category
                    </h2>

                    <div className="search-grid">


                        {/* Search by ID */}

                        <form
                            className="search-form"
                            onSubmit={handleSearchById}
                        >

                            <label>
                                Search by ID
                            </label>

                            <div className="search-row">

                                <input
                                    type="number"
                                    placeholder="Category ID"
                                    value={searchId}
                                    onChange={(event) =>
                                        setSearchId(
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                                <button
                                    type="submit"
                                    className="search-button"
                                >
                                    Search
                                </button>

                            </div>

                        </form>


                        {/* Search by Name */}

                        <form
                            className="search-form"
                            onSubmit={handleSearchByName}
                        >

                            <label>
                                Search by Name
                            </label>

                            <div className="search-row">

                                <input
                                    type="text"
                                    placeholder="Category name"
                                    value={searchName}
                                    onChange={(event) =>
                                        setSearchName(
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                                <button
                                    type="submit"
                                    className="search-button"
                                >
                                    Search
                                </button>

                            </div>

                        </form>

                    </div>


                    {/* Search Result */}

                    {searchedCategory && (

                        <div className="search-result">

                            <div>

                                <span className="result-label">
                                    Category
                                </span>

                                <h3>
                                    {searchedCategory.name}
                                </h3>

                            </div>

                            <div>

                                <span className="result-label">
                                    Type
                                </span>

                                <p>
                                    {searchedCategory.type}
                                </p>

                            </div>

                            <div>

                                <span className="result-label">
                                    ID
                                </span>

                                <p>
                                    {searchedCategory.id}
                                </p>

                            </div>

                        </div>

                    )}

                </div>


                {/* Category List */}

                <div className="category-card">

                    <div className="list-header">

                        <div>

                            <h2>
                                Your Categories
                            </h2>

                            <p>
                                {categories.length} categor
                                {categories.length === 1
                                    ? "y"
                                    : "ies"}
                            </p>

                        </div>

                    </div>


                    {categories.length === 0 ? (

                        <div className="empty-state">

                            <h3>
                                No categories found
                            </h3>

                            <p>
                                Add your first category above.
                            </p>

                        </div>

                    ) : (

                        <div className="category-list">

                            {categories.map((category) => (

                                <div
                                    className="category-item"
                                    key={category.id}
                                >

                                    <div className="category-info">

                                        <h3>
                                            {category.name}
                                        </h3>

                                        <span
                                            className={
                                                category.type === "EXPENSE"
                                                    ? "category-type expense"
                                                    : "category-type income"
                                            }
                                        >
                                            {category.type}
                                        </span>

                                    </div>


                                    <div className="category-actions">

                                        <button
                                            className="edit-button"
                                            onClick={() =>
                                                handleEditCategory(
                                                    category
                                                )
                                            }
                                        >
                                            Edit
                                        </button>


                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                handleDeleteCategory(
                                                    category.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default Categories;