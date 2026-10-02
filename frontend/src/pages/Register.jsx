import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);


    /*
     * Password validation
     *
     * Same requirement as backend:
     *
     * 8-15 characters
     * lowercase
     * uppercase
     * number
     * special character
     */

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/;


    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setFormData({
            ...formData,
            [name]: value
        });


        /*
         * Clear old messages
         * while user is typing.
         */

        if (error) {
            setError("");
        }

        if (success) {
            setSuccess("");
        }

    };


    const isPasswordValid =
        passwordRegex.test(
            formData.password
        );


    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");
        setSuccess("");


        /*
         * Frontend password validation
         */

        if (!isPasswordValid) {

            setError(
                "Password must be 8-15 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
            );

            return;
        }


        setLoading(true);


        try {

            await api.post(
                "/api/auth/register",
                formData
            );


            setSuccess(
                "Registration successful. Please login."
            );


            setTimeout(() => {

                navigate("/login");

            }, 1200);


        } catch (error) {

            if (error.response) {

                setError(
                    error.response.data?.message ||
                    "Registration failed"
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

            <div className="auth-card register-card">


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
                                Expense Summary
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
                    FORM
                ========================== */}

                <div className="auth-form-section">

                    <h1>
                        Sign up
                    </h1>

                    <p className="auth-subtitle">
                        Create your account and start managing your money.
                    </p>


                    {/* ERROR */}

                    {error && (

                        <div className="auth-error">

                            {error}

                        </div>

                    )}


                    {/* SUCCESS */}

                    {success && (

                        <div className="auth-success">

                            {success}

                        </div>

                    )}


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >


                        {/* NAME */}

                        <div className="form-group">

                            <label>
                                Full Name
                            </label>

                            <div className="input-wrapper">

                                {/*<span className="input-icon">*/}
                                {/*    👤*/}
                                {/*</span>*/}

                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={formData.name}
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    minLength={2}
                                    maxLength={20}
                                />

                            </div>

                        </div>


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
                                    name="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">

                            <label>
                                Password
                            </label>


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
                                    name="password"
                                    placeholder="Create a password"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                    minLength={8}
                                    maxLength={15}
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


                            {/* PASSWORD REQUIREMENTS */}

                            <div
                                className={
                                    `password-help ${
                                        formData.password.length === 0
                                            ? ""
                                            : isPasswordValid
                                                ? "password-valid"
                                                : "password-invalid"
                                    }`
                                }
                            >

                                {formData.password.length === 0 ? (

                                    <>
                                        8–15 characters with uppercase,
                                        lowercase, number and special
                                        character.
                                    </>

                                ) : isPasswordValid ? (

                                    <>
                                        ✓ Password meets all requirements.
                                    </>

                                ) : (

                                    <>
                                        Password must contain:
                                        <br />
                                        • 8–15 characters
                                        <br />
                                        • At least one uppercase letter
                                        <br />
                                        • At least one lowercase letter
                                        <br />
                                        • At least one number
                                        <br />
                                        • At least one special character
                                        (@$!%*?&)
                                    </>

                                )}

                            </div>

                        </div>


                        {/* REGISTER BUTTON */}

                        <button
                            type="submit"
                            className="auth-submit-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Creating Account..."
                                : "Sign up"
                            }

                        </button>

                    </form>


                    {/* LOGIN */}

                    <div className="auth-switch">

                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Sign in
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

export default Register;