import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        userType: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const passwordPattern =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setError("");
    };

    const handleUserTypeSelect = (type) => {
        setFormData({
            ...formData,
            userType: type
        });

        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.userType) {
            setError("Please select what describes you.");
            return;
        }

        if (!passwordPattern.test(formData.password)) {
            setError(
                "Password must be 8-15 characters with uppercase, lowercase, number and special character."
            );
            return;
        }

        try {

            await api.post("/api/auth/register", formData);

            setSuccess("Registration successful! Redirecting to login...");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Registration failed. Please try again."
            );
        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Start managing your money smarter</p>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Name */}
                    <div className="form-group">
                        <label>Full Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>


                    {/* User Type */}
                    <div className="form-group">

                        <label>What describes you?</label>

                        <div className="user-type-grid">

                            {/* Student */}
                            <button
                                type="button"
                                className={`user-type-card ${
                                    formData.userType === "STUDENT"
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleUserTypeSelect("STUDENT")
                                }
                            >
                                <span className="user-type-icon">🎓</span>

                                <span className="user-type-title">
                                    Student
                                </span>

                                <span className="user-type-description">
                                    Track education, food, travel and daily expenses
                                </span>
                            </button>


                            {/* Working Professional */}
                            <button
                                type="button"
                                className={`user-type-card ${
                                    formData.userType === "WORKING_PROFESSIONAL"
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleUserTypeSelect(
                                        "WORKING_PROFESSIONAL"
                                    )
                                }
                            >
                                <span className="user-type-icon">💼</span>

                                <span className="user-type-title">
                                    Working Professional
                                </span>

                                <span className="user-type-description">
                                    Manage salary, bills, rent and savings
                                </span>
                            </button>


                            {/* Business Owner */}
                            <button
                                type="button"
                                className={`user-type-card ${
                                    formData.userType === "BUSINESS_OWNER"
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleUserTypeSelect("BUSINESS_OWNER")
                                }
                            >
                                <span className="user-type-icon">🏢</span>

                                <span className="user-type-title">
                                    Business Owner
                                </span>

                                <span className="user-type-description">
                                    Manage business income and expenses
                                </span>
                            </button>


                            {/* Freelancer */}
                            <button
                                type="button"
                                className={`user-type-card ${
                                    formData.userType === "FREELANCER"
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleUserTypeSelect("FREELANCER")
                                }
                            >
                                <span className="user-type-icon">💻</span>

                                <span className="user-type-title">
                                    Freelancer
                                </span>

                                <span className="user-type-description">
                                    Track projects, earnings and personal expenses
                                </span>
                            </button>

                        </div>
                    </div>


                    {/* Password */}
                    <div className="form-group">

                        <label>Password</label>

                        <div className="password-wrapper">

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? "🙈" : "👁"}
                            </button>

                        </div>

                        <small className="password-hint">
                            8–15 characters, uppercase, lowercase, number
                            and special character (@$!%*?&)
                        </small>

                    </div>


                    {/* Error */}
                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}


                    {/* Success */}
                    {success && (
                        <div className="auth-success">
                            {success}
                        </div>
                    )}


                    {/* Register Button */}
                    <button
                        type="submit"
                        className="auth-button"
                    >
                        Create Account
                    </button>

                </form>


                <div className="auth-footer">

                    <p>
                        Already have an account?{" "}
                        <Link to="/login">
                            Login
                        </Link>
                    </p>

                    <span>
                        Developed by Vighnesh Gunaga
                    </span>

                </div>

            </div>

        </div>
    );
}

export default Register;