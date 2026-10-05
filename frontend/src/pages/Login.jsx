import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./Login.css";

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
                { email, password }
            );

            const token = response.data.jwtToken;

            localStorage.setItem("token", token);

            navigate("/dashboard");

        } catch (error) {

            if (error.response) {
                setError(
                    error.response.data?.message ||
                    "Invalid email or password"
                );
            } else {
                setError("Unable to connect to server");
            }

        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="lg-page">

            <div className="lg-card">

                {/* ================= LEFT PANEL ================= */}

                <div className="lg-left">

                    <div className="lg-logo">
                        <div className="lg-logo-icon">₹</div>
                        <div className="lg-logo-text">
                            Expense
                            <br />
                            Tracker
                        </div>
                    </div>

                    <div className="lg-title">
                        Track your expenses,
                        <br />
                        build a better
                        <br />
                        tomorrow.
                    </div>

                    <div className="lg-illustration">
                        <div className="lg-circle"></div>

                        <div className="lg-wallet">
                            <div className="lg-wallet-strip"></div>
                            <div className="lg-wallet-line"></div>
                            <div className="lg-wallet-line short"></div>
                            <div className="lg-wallet-circle">₹</div>
                        </div>

                        <div className="lg-coin">₹</div>
                    </div>

                    <div className="lg-features">

                        <div className="lg-feature">
                            <div className="lg-feature-icon">↗</div>
                            <strong>Track</strong>
                            <span>your spending</span>
                        </div>

                        <div className="lg-feature">
                            <div className="lg-feature-icon">✓</div>
                            <strong>Stay</strong>
                            <span>in control</span>
                        </div>

                        <div className="lg-feature">
                            <div className="lg-feature-icon">★</div>
                            <strong>Achieve</strong>
                            <span>your goals</span>
                        </div>

                    </div>

                </div>

                {/* ================= RIGHT PANEL ================= */}

                <div className="lg-right">

                    <div className="lg-content">

                        <h1 className="lg-heading">Welcome Back</h1>

                        <p className="lg-subtitle">
                            Sign in to your account to continue
                        </p>

                        {error && (
                            <div className="lg-error">{error}</div>
                        )}

                        <form className="lg-form" onSubmit={handleLogin}>

                            {/* EMAIL */}

                            <div className="lg-group">

                                <label htmlFor="lg-email">
                                    Email Address
                                </label>

                                <div className="lg-input-wrap">
                                    <span className="lg-input-icon">✉</span>

                                    <input
                                        id="lg-email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(event) =>
                                            setEmail(event.target.value)
                                        }
                                        required
                                    />
                                </div>

                            </div>

                            {/* PASSWORD */}

                            <div className="lg-group">

                                <div className="lg-label-row">

                                    <label htmlFor="lg-password">
                                        Password
                                    </label>

                                    <Link
                                        to="/forgot-password"
                                        className="lg-forgot"
                                    >
                                        Forgot Password?
                                    </Link>

                                </div>

                                <div className="lg-input-wrap">
                                    <span className="lg-input-icon">🔒</span>

                                    <input
                                        id="lg-password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="lg-toggle"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                    >
                                        {showPassword ? "🙈" : "👁"}
                                    </button>
                                </div>

                            </div>

                            <button
                                type="submit"
                                className="lg-submit"
                                disabled={loading}
                            >
                                {loading ? "Signing in..." : "Sign In →"}
                            </button>

                        </form>

                        {/* REGISTER */}

                        <div className="lg-switch">

                            <div className="lg-switch-line">
                                <span></span>
                                <p>Don't have an account?</p>
                                <span></span>
                            </div>

                            <Link to="/register">Create Account</Link>

                        </div>

                        <div className="lg-developed">
                            Developed by
                            <strong>Vighnesh Gunaga</strong>
                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;