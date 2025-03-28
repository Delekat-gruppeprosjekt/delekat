import React, { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router";
import { doSignInWithEmailAndPassword, doSignInWithGoogle, doSignOut } from "../../../auth";
import { useAuth } from "../../contexts/authContext/auth";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const LoginComponent = () => {
    const { userLoggedIn, user } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState(localStorage.getItem("email") || "");
    const [password, setPassword] = useState("");
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [emailError, setEmailError] = useState("");

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        setEmail(newEmail);
        if (newEmail && !validateEmail(newEmail)) {
            setEmailError("Vennligst skriv inn en gyldig e-postadresse");
        } else {
            setEmailError("");
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setEmailError("");
        
        if (!validateEmail(email)) {
            setEmailError("Vennligst skriv inn en gyldig e-postadresse");
            return;
        }

        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                const result = await doSignInWithEmailAndPassword(email, password);
                localStorage.setItem("email", email);
                localStorage.setItem("userId", result.user.uid);
                navigate("/");
            } catch (error) {
                console.error('Firebase auth error:', error.code);
                switch (error.code) {
                    case 'auth/user-not-found':
                        setErrorMessage('Ingen bruker funnet med denne e-postadressen');
                        break;
                    case 'auth/wrong-password':
                        setErrorMessage('Feil passord');
                        break;
                    case 'auth/invalid-email':
                        setErrorMessage('Ugyldig e-postadresse');
                        break;
                    case 'auth/invalid-credential':
                        setErrorMessage('Ingen bruker funnet med denne e-postadressen');
                        break;
                    default:
                        setErrorMessage('Det oppstod en feil ved innlogging');
                }
            } finally {
                setIsSigningIn(false);
            }
        }
    };

    const onGoogleSignIn = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                const result = await doSignInWithGoogle();
                if (result?.user?.email) {
                    // Store the user email and UID in localStorage on successful Google login
                    localStorage.setItem("email", result.user.email);
                    localStorage.setItem("userId", result.user.uid); // Save user ID in localStorage
                    setEmail(result.user.email);
                }
                navigate("/home"); // Navigate to home page after Google login
            } catch (error) {
                setErrorMessage(error.message);
                setIsSigningIn(false);
            }
        }
    };

    const onLogout = async () => {
        await doSignOut();
        localStorage.removeItem("email"); // Clear email from localStorage on logout
        localStorage.removeItem("userId"); // Clear userId from localStorage on logout
        setEmail("");
    };

    if (userLoggedIn) {
        return <Navigate to="/" />;
    }

    return (
        <div className="w-full max-w-md">
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

                <button
                    type="submit"
                    disabled={isSigningIn || emailError}
                    className={`w-full py-3 text-white rounded-full text-lg font-medium transition-colors duration-200 ${
                        isSigningIn || emailError
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#3C5A3C] hover:bg-[#2C432C]'
                    }`}
                >
                    {isSigningIn ? "Logger inn..." : "Logg inn"}
                </button>
            </form>

            <div className="mt-6 text-center">
                <Link to="/reset-password" className="text-[#3C5A3C] hover:underline">
                    Glemt passord?
                </Link>
            </div>

            <div className="mt-8 text-center">
                <p className="text-gray-600">Har du ikke en konto?</p>
                <Link to="/signup" className="block mt-2 text-[#3C5A3C] hover:underline text-lg">
                    Registrer deg
                </Link>
            </div>
        </div>
    );
};

export default LoginComponent;
