import React from "react";

// Importer dine ikoner – bytt ut med de nye fix2-versjonene der de finnes
import hamburgerBunn from "./icons/hamburgerBunn-fix2.svg";
import hamburgerTopp from "./icons/hamburgerTopp-fix2.svg";
import kjottAvlang from "./icons/kjottAvlang.svg"; // Ingen fix2-versjon for kjøtt
import ostAvlang from "./icons/ostAvlang-fix2.svg";
import salatAvlang from "./icons/salatAvlang-fix2.svg";
import tomatAvlang from "./icons/tomatAvlang-fix2.svg";
import HamburgerHel from "./icons/HamburgerHel.svg"; // Komplett burger ved fullføring

const BurgerIcon = ({ ingredients }) => {
  const required = ["kjott", "ost", "salat", "tomat"];
  const harAlle = required.every((ing) => ingredients.includes(ing));

  if (harAlle) {
    // Vinner-tilstand: vis kun den komplette burgeren
    return (
      <img
        src={HamburgerHel}
        alt="Full burger"
        style={{ width: "300px", height: "auto", objectFit: "cover" }}
      />
    );
  }

  // Dimensjoner for burgerikon
  const bunWidth = 100;  // bredde på brødene
  const bunHeight = 100; // høyde på hvert brød
  const ingH = 100;      // høyde på hver ingrediens
  const overlapMargin = 0; // ingen overlap (kan justeres om nødvendig)

  const containerHeight =
    ingredients.length === 0
      ? bunHeight
      : bunHeight + ingredients.length * ingH - overlapMargin;

  const commonImgStyle = {
    position: "absolute",
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  };

  return (
    <div style={{ position: "relative", width: bunWidth, height: containerHeight }}>
      {/* Nederste brød */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: bunHeight,
          overflow: "hidden",
        }}
      >
        <img src={hamburgerBunn} alt="Burgerbunn" style={commonImgStyle} />
      </div>
      {ingredients.length > 0 &&
        ingredients.map((type, index) => {
          let src;
          if (type === "kjott") src = kjottAvlang;
          else if (type === "ost") src = ostAvlang;
          else if (type === "salat") src = salatAvlang;
          else if (type === "tomat") src = tomatAvlang;
          const offset = bunHeight + index * ingH;
          return (
            <div
              key={index}
              style={{
                position: "absolute",
                bottom: offset,
                width: "100%",
                height: ingH,
                overflow: "hidden",
              }}
            >
              <img src={src} alt={type} style={commonImgStyle} />
            </div>
          );
        })}
      {/* Burgertopp – plasseres tett over ingrediensene */}
      <div
        style={{
          position: "absolute",
          bottom:
            ingredients.length === 0
              ? 0
              : bunHeight + ingredients.length * ingH - overlapMargin,
          width: "100%",
          height: bunHeight,
          overflow: "hidden",
        }}
      >
        <img src={hamburgerTopp} alt="Burger-topp" style={commonImgStyle} />
      </div>
    </div>
  );
};

export default BurgerIcon;
