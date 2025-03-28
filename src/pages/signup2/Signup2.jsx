import React, { useState } from "react";
import { Navigate, Link } from "react-router";
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from "../../../auth";
import { useAuth } from "../../contexts/authContext/auth";
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Signup = () => {
    const { userLoggedIn } = useAuth();

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

    const db = getFirestore();

    const checkUsernameExists = async (username) => {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("displayName", "==", username));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    };

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

    // Create user in Firebase Authentication and Firestore
    const createUserInFirestore = async (user) => {
        try {
            // Create the user document in the Firestore 'users' collection
            const userRef = doc(db, "users", user.uid);  // Use user's UID as document ID

            // Create user data including default avatar URL and bio
            await setDoc(userRef, {
                displayName: user.displayName || username,  // Use displayName from Auth or username provided during sign up
                email: user.email,
                avatarUrl: "/assets/avatar_placeholder.png",  // Set default avatar image
                bio: "This is your bio. Edit it in your profile settings.",  // Default bio
                createdAt: new Date(),
            });
        } catch (error) {
            console.error("Error adding user to Firestore: ", error);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        setEmailError("");
        setUsernameError("");

        if (!username.trim()) {
            setErrorMessage("Brukernavn er påkrevd!");
            return;
        }

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

        if (!validateEmail(email)) {
            setEmailError("Vennligst skriv inn en gyldig e-postadresse");
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage("Passordene matcher ikke!");
            return;
        }

        if (!isSigningUp) {
            setIsSigningUp(true);
            try {
                const result = await doCreateUserWithEmailAndPassword(email, password, username);
                localStorage.setItem("username", username);
                localStorage.setItem("email", email);
                await createUserInFirestore(result.user);
            } catch (error) {
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

    const onGoogleSignUp = async (e) => {
        e.preventDefault();
        if (!isSigningUp) {
            setIsSigningUp(true);
            try {
                const result = await doSignInWithGoogle();
                if (result?.user?.email) {
                    // Store username and email in localStorage
                    localStorage.setItem("username", result.user.displayName || "User");
                    localStorage.setItem("email", result.user.email);

                    // Add the Google user to Firestore
                    await createUserInFirestore(result.user);  // Pass the Google user to Firestore
                }
            } catch (error) {
                setErrorMessage(error.message);
                setIsSigningUp(false);
            }
        }
    };

    if (userLoggedIn) {
        return <Navigate to="/" />;
    }

    return (
        <div id="signup-container" className="min-h-screen bg-BGcolor flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-semibold mb-12">Registrer deg</h1>
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
