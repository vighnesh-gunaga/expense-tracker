import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";
import "./ResetPassword.css";

function ResetPassword() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");

    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (event) => {

        event.preventDefault();

        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        setMessage("");
        setError("");
        setLoading(true);

        try {

            console.log("Reset token:", token);

            const response = await api.post(
                "/api/auth/reset-password",
                {
                    token: token,
                    newPassword: newPassword
                }
            );

            setMessage(response.data);

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data.message ||
                    "Unable to reset password"
                );

            } else {

                setError("Unable to connect to server");
            }

        } finally {

            setLoading(false);
        }
    };

    /*
     * =========================
     * INVALID RESET LINK
     * =========================
     */

    if (!token) {

        return (

            <div className="reset-page">

                <div className="reset-card">

                    <div className="reset-brand">

                        <div className="reset-logo">
                            ₹
                        </div>

                        <h1>
                            Expense Tracker
                        </h1>

                    </div>


                    <div className="reset-content">

                        <div className="reset-status-icon invalid">
                            !
                        </div>

                        <h2>
                            Invalid Reset Link
                        </h2>

                        <p>
                            The password reset token is
                            missing or invalid.
                        </p>


                        <button
                            className="reset-primary-button"
                            onClick={() =>
                                navigate(
                                    "/forgot-password"
                                )
                            }
                        >
                            Request New Reset Link
                        </button>

                    </div>


                    <div className="reset-footer">

                        Developed by
                        <strong>
                            Vighnesh Gunaga
                        </strong>

                    </div>

                </div>

            </div>

        );
    }


    /*
     * =========================
     * RESET PASSWORD PAGE
     * =========================
     */

    return (

        <div className="reset-page">

            <div className="reset-card">

                {/* BRAND */}

                <div className="reset-brand">

                    <div className="reset-logo">
                        ₹
                    </div>

                    <h1>
                        Expense Tracker
                    </h1>

                </div>


                {/* CONTENT */}

                <div className="reset-content">

                    <div className="reset-status-icon">
                        🔑
                    </div>

                    <h2>
                        Reset Password
                    </h2>

                    <p className="reset-description">
                        Create a new password for your
                        Expense Tracker account.
                    </p>


                    {/* SUCCESS */}

                    {message && (

                        <div className="reset-success">
                            ✓ {message}
                        </div>

                    )}


                    {/* ERROR */}

                    {error && (

                        <div className="reset-error">
                            {error}
                        </div>

                    )}


                    <form
                        className="reset-form"
                        onSubmit={handleResetPassword}
                    >

                        <div className="reset-form-group">

                            <label>
                                New Password
                            </label>


                            <div className="reset-input-wrapper">

                                <span>
                                    🔒
                                </span>

                                <input
                                    type="password"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(event) =>
                                        setNewPassword(
                                            event.target.value
                                        )
                                    }
                                    minLength={8}
                                    maxLength={15}
                                    required
                                />

                            </div>

                        </div>


                        <div className="password-requirement">

                            <span>✓</span>

                            Password must contain
                            8–15 characters.

                        </div>


                        <button
                            type="submit"
                            className="reset-primary-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Resetting..."
                                : "Reset Password"}

                        </button>

                    </form>


                    <button
                        type="button"
                        className="reset-back-button"
                        onClick={() =>
                            navigate("/login")
                        }
                    >
                        ← Back to Login
                    </button>

                </div>


                {/* FOOTER */}

                <div className="reset-footer">

                    Developed by

                    <strong>
                        Vighnesh Gunaga
                    </strong>

                </div>

            </div>

        </div>

    );
}

export default ResetPassword;