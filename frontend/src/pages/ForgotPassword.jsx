import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./ForgotPassword.css";

function ForgotPassword() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleForgotPassword = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");
        setLoading(true);

        try {

            const response = await api.post(
                "/api/auth/forgot-password",
                { email: email }
            );

            setMessage(response.data);

        } catch (error) {

            if (error.response) {
                setError(
                    error.response.data.message ||
                    "Unable to process request"
                );
            } else {
                setError("Unable to connect to server");
            }

        } finally {
            setLoading(false);
        }
    };

    return (

        <div className="fp-page">

            <div className="fp-card">

                {/* BRAND */}

                <div className="fp-brand">
                    <div className="fp-logo">₹</div>
                    <h1>Expense Tracker</h1>
                </div>

                {/* CONTENT */}

                <div className="fp-content">

                    <div className="fp-icon-circle">🔐</div>

                    <h2>Forgot Password?</h2>

                    <p className="fp-description">
                        Enter your registered email address
                        and we'll send you a password reset link.
                    </p>

                    {message && (
                        <div className="fp-success">
                            ✓ {message}
                        </div>
                    )}

                    {error && (
                        <div className="fp-error">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleForgotPassword}
                        className="fp-form"
                    >

                        <div className="fp-group">

                            <label htmlFor="fp-email">
                                Email Address
                            </label>

                            <div className="fp-input-wrap">
                                <input
                                    id="fp-email"
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

                        <button
                            type="submit"
                            className="fp-submit"
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>

                    </form>

                    <button
                        type="button"
                        className="fp-back"
                        onClick={() => navigate("/login")}
                    >
                        ← Back to Login
                    </button>

                </div>

                {/* FOOTER */}

                <div className="fp-footer">
                    Developed by
                    <strong>Vighnesh Gunaga</strong>
                </div>

            </div>

        </div>

    );
}

export default ForgotPassword;