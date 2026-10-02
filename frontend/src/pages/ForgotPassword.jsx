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
                {
                    email: email
                }
            );

            setMessage(response.data);

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Unable to process request"
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

            <div className="auth-card">

                <div className="reset-brand">

                    <div className="reset-logo">
                        ₹
                    </div>

                    <h1>
                        Expense Tracker
                    </h1>

                </div>


                <div className="auth-content">

                    <div className="auth-icon-circle">
                        🔐
                    </div>

                    <h2>
                        Forgot Password?
                    </h2>

                    <p className="auth-description">
                        Enter your registered email address
                        and we'll send you a password reset link.
                    </p>


                    {message && (

                        <div className="auth-success">
                            ✓ {message}
                        </div>

                    )}


                    {error && (

                        <div className="auth-error">
                            {error}
                        </div>

                    )}


                    <form
                        onSubmit={handleForgotPassword}
                        className="auth-form"
                    >

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


                        <button
                            type="submit"
                            className="auth-primary-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Sending..."
                                : "Send Reset Link"}

                        </button>

                    </form>


                    <button
                        type="button"
                        className="auth-back-button"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        ← Back to Login
                    </button>

                </div>


                <div className="auth-footer">

                    Developed by
                    <strong>
                        Vighnesh Gunaga
                    </strong>

                </div>

            </div>

        </div>

    );
}

export default ForgotPassword;