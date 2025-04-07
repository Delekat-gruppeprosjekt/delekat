import React from "react";
import LoaderModal from "./LoaderModal.jsx"; // Pass på at pathen stemmer!

export default function HomeGame({ onFinish }) {
  return <LoaderModal onClose={onFinish} />;
}
