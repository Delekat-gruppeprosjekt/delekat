import { 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    sendEmailVerification, 
    sendPasswordResetEmail, 
    signInWithEmailAndPassword, 
    signInWithPopup,  
    updatePassword, 
    updateProfile  
} from "firebase/auth";
import { auth } from "./firebase";

const DEFAULT_AVATAR_URL = "/assets/avatar_placeholder.png"; // ✅ Default avatar path

export const doCreateUserWithEmailAndPassword = async (email, password, username) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // ✅ Update the user profile with the provided username and default avatar
    await updateProfile(userCredential.user, { 
        displayName: username,
        photoURL: DEFAULT_AVATAR_URL 
    });

    return userCredential;
};

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result;
};

export const doSignOut = () => {
    return auth.signOut();
};

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
    if (!auth.currentUser) {
        throw new Error("No user is currently signed in.");
    }
    return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
    if (!auth.currentUser) {
        throw new Error("No user is currently signed in.");
    }
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
    });
};
