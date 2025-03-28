import React, { useState, useEffect } from "react";
import { Navigate, Link, useNavigate } from "react-router";
import { doSignInWithEmailAndPassword, doSignInWithGoogle, doSignOut } from "../../../auth";
import { useAuth } from "../../contexts/authContext/auth";

const LoginComponent = () => {
    const { userLoggedIn, user } = useAuth(); // Get logged-in user info
    const navigate = useNavigate();  // Hook to navigate programmatically

    const [email, setEmail] = useState(localStorage.getItem("email") || ""); // Get email from localStorage
    const [password, setPassword] = useState("");
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!isSigningIn) {
            setIsSigningIn(true);
            try {
                const result = await doSignInWithEmailAndPassword(email, password);
                // Store the user email and UID in localStorage on successful login
                localStorage.setItem("email", email);
                localStorage.setItem("userId", result.user.uid); // Save user ID in localStorage
                navigate("/"); // Navigate to home page after successful login
            } catch (error) {
                setErrorMessage(error.message);
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
        return (
            <div id="login-container">
                <h2>Welcome, {localStorage.getItem("username") || user?.email || "User"}!</h2>
                <p>You are already logged in.</p>
                <button onClick={onLogout}>Log Out</button>
            </div>
        );
    }

    return (
        <div id="login-container">
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={onSubmit} className="flex flex-col text-lg justify-center items-center gap-2">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-BGwhite w-2/4 p-2"
                />
                <input
                    type="password"
                    placeholder="Passord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-BGwhite w-2/4 p-2"
                />
                <button type="submit"
                        disabled={isSigningIn}
                        className="bg-PMgreen text-BGwhite w-2/4 p-2 hover:bg-SGgreen duration-150"
                >
                    {isSigningIn ? "Signing In..." : "Logg inn"}
                </button>
            </form>
            <div className="flex flex-col justify-center items-center text-center gap-2 mt-16">
                <p>Har du ikke en bruker? </p>
                <Link to="/signup"
                    className="bg-blue-500 text-BGwhite px-8 py-2 text-lg hover:bg-blue-700 duration-150"
                >
                    Registrer ny bruker
                </Link>
            </div>
        </div>
    );
};

export default LoginComponent;
