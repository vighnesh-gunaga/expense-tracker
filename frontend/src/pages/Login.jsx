import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (event) => {

        event.preventDefault();

        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/api/auth/login",
                {
                    email: email,
                    password: password
                }
            );

            const token = response.data.jwtToken;

            localStorage.setItem(
                "token",
                token
            );

            navigate("/dashboard");

        } catch (error) {

            if (error.response) {

                const message =
                    error.response.data?.message;

                setError(
                    message ||
                    "Invalid email or password"
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


    return (

        <div className="auth-page">

            <div className="auth-card login-card">


                {/* =========================
                    ILLUSTRATION
                ========================== */}

                <div className="auth-illustration">

                    <div className="illustration-brand">
                        <span className="brand-icon">
                            ₹
                        </span>

                        <span>
                            Expense Tracker
                        </span>
                    </div>


                    <div className="illustration-content">

                        <div className="illustration-person person-one">
                            👨‍💼
                        </div>

                        <div className="illustration-document">

                            <div className="document-header">
                                Financial Report
                            </div>

                            <div className="document-line large">
                            </div>

                            <div className="document-line">
                            </div>

                            <div className="document-line short">
                            </div>

                            <div className="document-chart">

                                <span></span>
                                <span></span>
                                <span></span>
                                <span></span>

                            </div>

                        </div>


                        <div className="illustration-coin coin-one">
                            ₹
                        </div>

                        <div className="illustration-coin coin-two">
                            ₹
                        </div>

                        <div className="illustration-plant">
                            🌱
                        </div>

                    </div>

                </div>


                {/* =========================
                    FORM SECTION
                ========================== */}

                <div className="auth-form-section">

                    <h1>
                        Sign in
                    </h1>

                    <p className="auth-subtitle">
                        Welcome back! Manage your money smarter.
                    </p>


                    {/* ERROR */}

                    {error && (

                        <div className="auth-error">
                            {error}
                        </div>

                    )}


                    <form
                        className="auth-form"
                        onSubmit={handleLogin}
                    >


                        {/* EMAIL */}

                        <div className="form-group">

                            <label>
                                Email Address
                            </label>

                            <div className="input-wrapper">

                                {/*<span className="input-icon">*/}
                                {/*    ✉*/}
                                {/*</span>*/}

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">

                            <div className="password-label-row">

                                <label>
                                    Password
                                </label>

                                <Link
                                    to="/forgot-password"
                                    className="forgot-link"
                                >
                                    Forgot Password?
                                </Link>

                            </div>


                            <div className="input-wrapper">

                                {/*<span className="input-icon">*/}
                                {/*    🔒*/}
                                {/*</span>*/}

                                <input
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) =>
                                        setPassword(
                                            event.target.value
                                        )
                                    }
                                    required
                                />


                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >

                                    {showPassword
                                        ? "🙈"
                                        : "👁"}

                                </button>

                            </div>

                        </div>


                        {/* LOGIN BUTTON */}

                        <button
                            type="submit"
                            className="auth-submit-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Signing in..."
                                : "Sign in"
                            }

                        </button>

                    </form>


                    {/* REGISTER */}

                    <div className="auth-switch">

                        <span>
                            Don't have an account?
                        </span>

                        <Link to="/register">
                            Create Account
                        </Link>

                    </div>

                </div>

            </div>


            {/* FOOTER */}

            <footer className="auth-footer">

                Developed by

                <strong>
                    {" "}Vighnesh Gunaga
                </strong>

            </footer>

        </div>

    );
}

export default Login;