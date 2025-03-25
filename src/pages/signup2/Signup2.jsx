import React, { useState } from "react";
import { Navigate, Link } from "react-router";
import { doCreateUserWithEmailAndPassword, doSignInWithGoogle } from "../../../auth";
import { useAuth } from "../../contexts/authContext/auth";

const Signup = () => {
    const { userLoggedIn } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Passordvalidering
    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);

        if (password.length < minLength) {
            return "Passordet må være minst 8 tegn langt";
        }
        if (!hasUpperCase) {
            return "Passordet må inneholde minst én stor bokstav";
        }
        if (!hasLowerCase) {
            return "Passordet må inneholde minst én liten bokstav";
        }
        if (!hasNumbers) {
            return "Passordet må inneholde minst ett tall";
        }
        return null;
    };

    const onSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage("");
  
      if (!username.trim()) {
          setErrorMessage("Username is required!");
          return;
      }
  
      if (username.length > 21) {
          setErrorMessage("Username cannot exceed 20 characters!");
          return;
      }

      const passwordError = validatePassword(password);
      if (passwordError) {
          setErrorMessage(passwordError);
          return;
      }
  
      if (password !== confirmPassword) {
          setErrorMessage("Passwords do not match!");
          return;
      }
  
      if (!isSigningUp) {
          setIsSigningUp(true);
          try {
              await doCreateUserWithEmailAndPassword(email, password, username); // ✅ Pass username
              localStorage.setItem("username", username);
              localStorage.setItem("email", email);
          } catch (error) {
              setErrorMessage(error.message);
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
                    localStorage.setItem("username", result.user.displayName || "User");
                    localStorage.setItem("email", result.user.email);
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
        <div id="signup-container" className="bg-BGcolor min-h-screen p-6">
            {errorMessage && <p className="error-message text-red-500 text-center mb-4">{errorMessage}</p>}
            <form onSubmit={onSubmit} className="flex flex-col text-lg justify-center items-center gap-2">
                <input
                    type="text"
                    placeholder="Brukernavn (maks 20 tegn)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    maxLength={20}
                    className="bg-BGwhite w-2/4 p-2"
                />
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
                    placeholder="Passord (min. 8 tegn, minimum 1 stor og liten bokstav og 1 tall)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-BGwhite w-2/4 p-2"
                    minLength={8}
                />
                <input
                    type="password"
                    placeholder="Bekreft Passord"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-BGwhite w-2/4 p-2"
                    minLength={8}
                />
                <button
                  type="submit"
                  disabled={isSigningUp}
                  className="bg-PMgreen text-BGwhite py-2 px-8 cursor-pointer hover:bg-SGgreen duration-150"
                  >
                    {isSigningUp ? "Signing Up..." : "Registrer"}
                </button>
            </form>
            <div className="flex flex-col text-center items-center mt-16">
            <p>
                Har du allerede en bruker?
            </p>
            <Link to="/login"
            className="bg-blue-500 text-BGwhite px-8 py-2 text-lg hover:bg-blue-700 duration-150">
              Logg inn</Link>
            </div>
        </div>
    );
};

export default Signup;
