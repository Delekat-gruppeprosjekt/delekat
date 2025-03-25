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

    const onSubmit = async (e) => {
      e.preventDefault();
      setErrorMessage("");
  
      if (!username.trim()) {
          setErrorMessage("Username is required!");
          return;
      }
  
      if (username.length > 255) {
          setErrorMessage("Username cannot exceed 255 characters!");
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
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={onSubmit} className="flex flex-col text-lg justify-center items-center gap-2">
                <input
                    type="text"
                    placeholder="Brukernavn"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
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
                    placeholder="Passord"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-BGwhite w-2/4 p-2"
                />
                <input
                    type="password"
                    placeholder="Bekreft Passord"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="bg-BGwhite w-2/4 p-2"
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
