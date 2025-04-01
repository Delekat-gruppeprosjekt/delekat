import React, { useState } from "react";
import { Navigate, Link } from "react-router";
import { doCreateUserWithEmailAndPassword } from "../../../auth";
import { useAuth } from "../../contexts/authContext/auth";
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

/**
 * Signup component that handles new user registration
 * Provides email/password registration with username, form validation,
 * and creates user documents in Firestore
 */
const Signup = () => {
    // Get authentication state
    const { userLoggedIn } = useAuth();

    // State management for form fields and UI states
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [usernameError, setUsernameError] = useState("");

    // Initialize Firestore database
    const db = getFirestore();

    /**
     * Checks if a username already exists in the database (case-insensitive)
     * @param {string} username - The username to check
     * @returns {Promise<boolean>} - True if username exists, false otherwise
     */
    const checkUsernameExists = async (username) => {
        try {
            const usersRef = collection(db, "users");
            const allUsers = await getDocs(usersRef);
            const lowercaseUsername = username.toLowerCase().trim();
            
            return allUsers.docs.some(doc => {
                const userData = doc.data();
                return userData.displayName?.toLowerCase() === lowercaseUsername;
            });
        } catch (error) {
            console.error("Error checking username:", error);
            return false;
        }
    };

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
     * Handles username input changes and checks availability in real-time
     * @param {Event} e - The input change event
     */
    const handleUsernameChange = async (e) => {
        const newUsername = e.target.value;
        setUsername(newUsername);
        setUsernameError("");
        
        if (newUsername.trim()) {
            try {
                const exists = await checkUsernameExists(newUsername);
                if (exists) {
                    setUsernameError("Dette brukernavnet er allerede i bruk");
                }
            } catch (error) {
                console.error("Error checking username:", error);
            }
        }
    };

    /**
     * Creates a new user document in Firestore with default values
     * @param {Object} user - The Firebase auth user object
     */
    const createUserInFirestore = async (user) => {
        try {
            const userRef = doc(db, "users", user.uid);
            await setDoc(userRef, {
                displayName: username,
                email: user.email,
                avatarUrl: "/assets/avatar_placeholder.png",
                bio: "This is your bio. Edit it in your profile settings.",
                createdAt: new Date(),
            });
        } catch (error) {
            console.error("Error adding user to Firestore: ", error);
        }
    };

    /**
     * Handles form submission for registration
     * Validates all inputs and creates new user account
     * @param {Event} e - The form submission event
     */
    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setEmailError("");
        setUsernameError("");

        // Validate username
        if (!username.trim()) {
            setErrorMessage("Brukernavn er påkrevd!");
            return;
        }

        // Check username availability
        try {
            const usernameExists = await checkUsernameExists(username);
            if (usernameExists) {
                setUsernameError("Dette brukernavnet er allerede i bruk");
                return;
            }
        } catch (error) {
            console.error("Error checking username:", error);
            setErrorMessage("Det oppstod en feil ved sjekk av brukernavn");
            return;
        }

        // Validate email
        if (!validateEmail(email)) {
            setEmailError("Vennligst skriv inn en gyldig e-postadresse");
            return;
        }

        // Validate password match
        if (password !== confirmPassword) {
            setErrorMessage("Passordene matcher ikke!");
            return;
        }

        if (!isSigningUp) {
            setIsSigningUp(true);
            try {
                // Create new user account
                const result = await doCreateUserWithEmailAndPassword(email, password, username);
                // Store user data in localStorage
                localStorage.setItem("username", username);
                localStorage.setItem("email", email);
                // Create user document in Firestore
                await createUserInFirestore(result.user);
            } catch (error) {
                // Handle different types of registration errors
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        setErrorMessage('E-postadressen er allerede i bruk');
                        break;
                    case 'auth/invalid-email':
                        setErrorMessage('Ugyldig e-postadresse');
                        break;
                    case 'auth/weak-password':
                        setErrorMessage('Passordet er for svakt');
                        break;
                    default:
                        setErrorMessage('Det oppstod en feil ved registrering');
                }
                setIsSigningUp(false);
            }
        }
    };

    // Redirect to home if user is already logged in
    if (userLoggedIn) {
        return <Navigate to="/" />;
    }

    // Render registration form with all input fields and error handling
    return (
        <div id="signup-container" className="min-h-screen bg-BGcolor flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-semibold mb-12">Registrer deg</h1>
            <div className="w-full max-w-md">
                {/* Error message display */}
                {errorMessage && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">
                                    {errorMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Username input field */}
                    <div>
                        <input
                            type="text"
                            placeholder="Brukernavn"
                            value={username}
                            onChange={handleUsernameChange}
                            required
                            className={`w-full px-4 py-3 rounded-full bg-white border ${
                                usernameError ? 'border-red-500' : 'border-gray-200'
                            } focus:outline-none focus:border-[#3C5A3C] text-lg`}
                        />
                        {usernameError && (
                            <p className="mt-2 text-sm text-red-600 pl-4">
                                {usernameError}
                            </p>
                        )}
                    </div>

                    {/* Email input field */}
                    <div>
                        <input
                            type="email"
                            placeholder="E-postadresse"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            className={`w-full px-4 py-3 rounded-full bg-white border ${
                                emailError ? 'border-red-500' : 'border-gray-200'
                            } focus:outline-none focus:border-[#3C5A3C] text-lg`}
                        />
                        {emailError && (
                            <p className="mt-2 text-sm text-red-600 pl-4">
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
                            className="w-full px-4 py-3 rounded-full bg-white border border-gray-200 focus:outline-none focus:border-[#3C5A3C] text-lg pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
                        </button>
                    </div>

                    {/* Confirm password input field with show/hide toggle */}
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Bekreft Passord"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-full bg-white border border-gray-200 focus:outline-none focus:border-[#3C5A3C] text-lg pr-12"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                        >
                            {showConfirmPassword ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
                        </button>
                    </div>

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={isSigningUp || emailError}
                        className={`w-full py-3 text-white rounded-full text-lg font-medium transition-colors duration-200 ${
                            isSigningUp || emailError
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-[#3C5A3C] hover:bg-[#2C432C]'
                        }`}
                    >
                        {isSigningUp ? "Registrerer..." : "Registrer"}
                    </button>
                </form>

                {/* Login link */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600">Har du allerede en bruker?</p>
                    <Link to="/login" className="block mt-2 text-[#3C5A3C] hover:underline text-lg">
                        Logg inn
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
