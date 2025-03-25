// src/components/AdminStatus.jsx
import React, { useEffect, useState } from "react";
import { auth } from "../../../firebase";


function AdminStatus() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const tokenResult = await user.getIdTokenResult();
          setIsAdmin(!!tokenResult.claims.admin);
        } catch (error) {
          console.error("Feil ved uthenting av token:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Laster...</div>;
  }

  return (
    <div>
      {isAdmin ? <p>Du er admin.</p> : <p>Du er ikke admin.</p>}
    </div>
  );
}

export default AdminStatus;
