import React, { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router";
import { doSignInWithEmailAndPassword } from "../../../auth";
import { useAuth } from "../../contexts/authContext/auth";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useToast } from "../../contexts/toastContext/toast";

/**
 * Login component that handles user authentication
 * Provides email/password login functionality with form validation
 */
const LoginComponent = () => {
    // Get authentication state and navigation function
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();

    // State management for form fields and UI states
    const [email, setEmail] = useState(localStorage.getItem("email") || "");
    const [password, setPassword] = useState("");
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");

    // Load saved email from localStorage on component mount
    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    /**
     * Validates email format using regex
     * @param {string} email - The email to validate
     * @returns {boolean} - True if email is valid, false otherwise
     */
    const validateEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };

    /**
     * Handles email input changes and validates in real-time
     * @param {Event} e - The input change event
     */
    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (newEmail && !validateEmail(newEmail)) {
            setEmailError("Vennligst skriv inn en gyldig e-postadresse");
        } else {
            setEmailError("");
        }
    };

    /**
     * Handles form submission for login
     * Validates input and attempts to authenticate user
     * @param {Event} e - The form submission event
     */
    const onSubmit = async (e) => {
        e.preventDefault();
        
        // Validate email before attempting login
        if (!validateEmail(email)) {
            setEmailError("Vennligst skriv inn en gyldig e-postadresse");
            showToast("Vennligst skriv inn en gyldig e-postadresse", "error");
            return;
        }

        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                // Attempt to sign in with email and password
                const result = await doSignInWithEmailAndPassword(email, password);
                // Store user data in localStorage
                localStorage.setItem("email", email);
                localStorage.setItem("userId", result.user.uid);
                // Show success toast notification
                showToast("Du er nå logget inn!", "success");
                // Navigate to home page on successful login
                navigate("/");
            } catch (error) {
                // Handle different types of authentication errors
                console.error('Firebase auth error:', error.code);
                
                // For security reasons, show a generic error message for all authentication errors
                if (error.code === 'auth/invalid-credential' || 
                    error.code === 'auth/user-not-found' || 
                    error.code === 'auth/wrong-password') {
                    showToast('Feil brukernavn eller passord', 'error');
                } else if (error.code === 'auth/invalid-email') {
                    showToast('Ugyldig e-postadresse', 'error');
                } else {
                    showToast('Det oppstod en feil ved innlogging', 'error');
                }
            } finally {
                setIsSigningIn(false);
            }
        }
    };

    // Redirect to home if user is already logged in
    if (userLoggedIn) {
        return <Navigate to="/" />;
    }

    // Render login form with email/password inputs and error handling
    return (
        <div className="w-full max-w-md">
            <form onSubmit={onSubmit} className="space-y-6">
                {/* Email input field */}
                <div>
                    <input
                        type="email"
                        placeholder="E-postadresse"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        className={`w-full px-4 py-3 rounded-md bg-white border ${
                            emailError ? 'border-red-500' : 'border-[#438407]'
                        } focus:outline-none focus:border-[#3C5A3C] text-lg`}
                    />
                    {emailError && (
                        <p className="mt-2 text-sm text-red-btn pl-4">
                            {emailError}
                        </p>
                    )}
                </div>
                
                {/* Password input field with show/hide toggle */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Passord"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-md bg-white border border-[#438407] focus:outline-none focus:border-[#3C5A3C] text-lg pr-12"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                        {showPassword ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
                    </button>
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={isSigningIn || emailError}
                    className={`w-full py-3 text-BGwhite rounded-full text-lg font-medium transition-colors duration-200 ${
                        isSigningIn || emailError
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-green-btn hover:bg-green-btn-hover'
                    }`}
                >
                    {isSigningIn ? "Logger inn..." : "Logg inn"}
                </button>
            </form>

            {/* Sign up link */}
            <div className="mt-8 text-center">
                <p className="text-gray-600">Har du ikke en konto?</p>
                <Link to="/signup" className="block mt-2 text-PMgreen hover:underline text-lg">
                    Registrer deg
                </Link>
            </div>
        </div>
    );
};

export default LoginComponent;
