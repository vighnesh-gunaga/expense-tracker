import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./Register.css";

const USER_TYPES = [
    {
        value: "STUDENT",
        icon: "🎓",
        title: "Student",
        text: "Education, food and daily expenses"
    },
    {
        value: "WORKING_PROFESSIONAL",
        icon: "💼",
        title: "Working Professional",
        text: "Salary, bills, rent and savings"
    },
    {
        value: "BUSINESS_OWNER",
        icon: "🏢",
        title: "Business Owner",
        text: "Business income and expenses"
    },
    {
        value: "FREELANCER",
        icon: "💻",
        title: "Freelancer",
        text: "Projects, earnings and expenses"
    }
];

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

    const handleChange = (event) => {

        const { name, value } = event.target;

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

    const handleSubmit = async (event) => {

        event.preventDefault();

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

            setSuccess(
                "Registration successful! Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        }
    };

    return (

        <div className="rg-page">

            <div className="rg-card">

                {/* ================= LEFT ================= */}

                <div className="rg-left">

                    <div className="rg-logo">
                        <div className="rg-logo-icon">₹</div>
                        <div className="rg-logo-text">
                            Expense
                            <br />
                            Tracker
                        </div>
                    </div>

                    <div className="rg-title">
                        Take control
                        <br />
                        of your money,
                        <br />
                        one transaction
                        <br />
                        at a time.
                    </div>

                    <div className="rg-illustration">
                        <div className="rg-circle"></div>

                        <div className="rg-wallet">
                            <div className="rg-wallet-strip"></div>
                            <div className="rg-wallet-line"></div>
                            <div className="rg-wallet-line short"></div>
                            <div className="rg-wallet-circle">₹</div>
                        </div>

                        <div className="rg-coin">₹</div>
                    </div>

                    <div className="rg-features">

                        <div className="rg-feature">
                            <div className="rg-feature-icon">+</div>
                            <strong>Simple</strong>
                            <span>expense tracking</span>
                        </div>

                        <div className="rg-feature">
                            <div className="rg-feature-icon">₹</div>
                            <strong>Smart</strong>
                            <span>money management</span>
                        </div>

                        <div className="rg-feature">
                            <div className="rg-feature-icon">✓</div>
                            <strong>Better</strong>
                            <span>financial control</span>
                        </div>

                    </div>

                </div>

                {/* ================= RIGHT ================= */}

                <div className="rg-right">

                    <div className="rg-content">

                        <h1 className="rg-heading">Create Account</h1>

                        <p className="rg-subtitle">
                            Start managing your money smarter
                        </p>

                        <form className="rg-form" onSubmit={handleSubmit}>

                            {/* NAME */}

                            <div className="rg-group">

                                <label htmlFor="rg-name">Full Name</label>

                                <div className="rg-input-wrap">
                                    <span className="rg-input-icon">👤</span>

                                    <input
                                        id="rg-name"
                                        type="text"
                                        name="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                            </div>

                            {/* EMAIL */}

                            <div className="rg-group">

                                <label htmlFor="rg-email">Email Address</label>

                                <div className="rg-input-wrap">
                                    <span className="rg-input-icon">✉</span>

                                    <input
                                        id="rg-email"
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                            </div>

                            {/* USER TYPE */}

                            <div className="rg-group">

                                <span className="rg-label">
                                    What describes you?
                                </span>

                                <div className="rg-type-grid">

                                    {USER_TYPES.map((type) => (

                                        <button
                                            key={type.value}
                                            type="button"
                                            className={`rg-type-card ${
                                                formData.userType === type.value
                                                    ? "selected"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                handleUserTypeSelect(type.value)
                                            }
                                        >
                                            <span className="rg-type-icon">
                                                {type.icon}
                                            </span>

                                            <strong>{type.title}</strong>

                                            <span className="rg-type-text">
                                                {type.text}
                                            </span>
                                        </button>

                                    ))}

                                </div>

                            </div>

                            {/* PASSWORD */}

                            <div className="rg-group">

                                <label htmlFor="rg-password">Password</label>

                                <div className="rg-input-wrap">
                                    <span className="rg-input-icon">🔒</span>

                                    <input
                                        id="rg-password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="rg-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? "🙈" : "👁"}
                                    </button>
                                </div>

                                <small className="rg-hint">
                                    8–15 characters • uppercase • lowercase • number • special character
                                </small>

                            </div>

                            {/* ERROR */}

                            {error && (
                                <div className="rg-error">{error}</div>
                            )}

                            {/* SUCCESS */}

                            {success && (
                                <div className="rg-success">{success}</div>
                            )}

                            <button type="submit" className="rg-submit">
                                Create Account →
                            </button>

                        </form>

                        {/* LOGIN */}

                        <div className="rg-switch">

                            <div className="rg-switch-line">
                                <span></span>
                                <p>Already have an account?</p>
                                <span></span>
                            </div>

                            <Link to="/login">Sign In</Link>

                        </div>

                        <div className="rg-developed">
                            Developed by
                            <strong>Vighnesh Gunaga</strong>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;