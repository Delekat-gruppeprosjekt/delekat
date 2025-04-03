import React, { useRef, useEffect, useState } from "react";

// **Bytt ut** til fix2-filer der de finnes.
import hamburgerBunn from "./icons/hamburgerBunn-fix2.svg";
import hamburgerTopp from "./icons/hamburgerTopp-fix2.svg";
import kjottHel from "./icons/kjottHel.svg";
// Det finnes ingen fix2-versjon for kjøttAvlang, så bruk original:
import kjottAvlang from "./icons/kjottAvlang.svg";

import ostHel from "./icons/ostHel.svg";
import ostAvlang from "./icons/ostAvlang-fix2.svg";
import salatHel from "./icons/salatHel.svg";
import salatAvlang from "./icons/salatAvlang-fix2.svg";
import tomatHel from "./icons/tomatHel.svg";
import tomatAvlang from "./icons/tomatAvlang-fix2.svg";

import HamburgerHel from "./icons/HamburgerHel.svg";

const BurgerGame = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Burgerens posisjon og retning
  const [burger, setBurger] = useState({
    x: 200,
    y: 200,
    direction: "right",
  });

  // Ingredienser (HEL-ikoner) på brettet – plassert i hjørnene
  const [ingredients, setIngredients] = useState([
    { x: 50, y: 50, type: "kjott", eaten: false },
    { x: 350, y: 50, type: "ost", eaten: false },
    { x: 50, y: 350, type: "salat", eaten: false },
    { x: 350, y: 350, type: "tomat", eaten: false },
  ]);

  // Avlange ingredienser som er fanget
  const [collectedIngredients, setCollectedIngredients] = useState([]);

  // Topp-brødet animeres (litt opp og ned)
  const [topYOffset, setTopYOffset] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const amplitude = 10;
      const period = 300;
      setTopYOffset(amplitude * Math.sin(now / period));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Bilde-refs for canvas
  const bottomBunRef = useRef(new Image());
  const topBunRef = useRef(new Image());
  const kjottHelRef = useRef(new Image());
  const kjottAvlangRef = useRef(new Image());
  const ostHelRef = useRef(new Image());
  const ostAvlangRef = useRef(new Image());
  const salatHelRef = useRef(new Image());
  const salatAvlangRef = useRef(new Image());
  const tomatHelRef = useRef(new Image());
  const tomatAvlangRef = useRef(new Image());
  const hamburgerHelRef = useRef(new Image());

  useEffect(() => {
    bottomBunRef.current.src = hamburgerBunn;
    topBunRef.current.src = hamburgerTopp;
    kjottHelRef.current.src = kjottHel;
    kjottAvlangRef.current.src = kjottAvlang;
    ostHelRef.current.src = ostHel;
    ostAvlangRef.current.src = ostAvlang;
    salatHelRef.current.src = salatHel;
    salatAvlangRef.current.src = salatAvlang;
    tomatHelRef.current.src = tomatHel;
    tomatAvlangRef.current.src = tomatAvlang;
    hamburgerHelRef.current.src = HamburgerHel;
  }, []);

  // Gi fokus til containeren for piltastene
  useEffect(() => {
    if (containerRef.current) containerRef.current.focus();
  }, []);

  // Oppsett for devicePixelRatio
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
  }, []);

  // Flytt burgeren hvert 200 ms
  useEffect(() => {
    const interval = setInterval(() => {
      setBurger((prev) => {
        const step = 20;
        let { x, y, direction } = prev;
        if (direction === "right") x += step;
        if (direction === "left") x -= step;
        if (direction === "up") y -= step;
        if (direction === "down") y += step;
        // Begrens posisjon innenfor 0 - 400
        x = Math.max(0, Math.min(x, 400));
        y = Math.max(0, Math.min(y, 400));
        return { x, y, direction };
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Kollisjon: sjekk om burgeren treffer ingredienser
  useEffect(() => {
    let newIngredients = [...ingredients];
    let newCollected = [...collectedIngredients];
    let changed = false;

    newIngredients.forEach((ing, idx) => {
      if (!ing.eaten) {
        const dx = burger.x - ing.x;
        const dy = burger.y - ing.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 60 && !newCollected.includes(ing.type)) {
          newCollected.push(ing.type);
          newIngredients[idx] = { ...ing, eaten: true };
          changed = true;
        }
      }
    });

    if (changed) {
      setIngredients(newIngredients);
      setCollectedIngredients(newCollected);
    }
  }, [burger]);

  // Tegn alt på canvas – mål: alle elementene skal ligge tett inntil hverandre
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bakgrunn
    ctx.fillStyle = "#f9f9e8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Tegn HEL-ikoner (for ingrediens-ikoner på brettet)
    const ingSize = 150;
    ingredients.forEach((ing) => {
      if (!ing.eaten) {
        let icon = kjottHelRef.current;
        if (ing.type === "ost") icon = ostHelRef.current;
        if (ing.type === "salat") icon = salatHelRef.current;
        if (ing.type === "tomat") icon = tomatHelRef.current;
        ctx.drawImage(
          icon,
          ing.x - ingSize / 2,
          ing.y - ingSize / 2,
          ingSize,
          ingSize
        );
      }
    });

    // Tegn burgeren – stabling av bunn, ingredienser og topp tett sammen
    ctx.save();
    ctx.translate(burger.x, burger.y);

    // Dimensjoner for burger-elementene – juster etter behov
    const bunW = 50;
    const bunH = 50;
    const ingW = 50;
    const ingH = 60;
    // Negativ overlapp: for eksempel -10 tvinger elementene til å ligge litt over hverandre
    const overlap = -45;

    if (collectedIngredients.length === 0) {
      // Ingen ingredienser: tegn bunn og topp tett sammen
      ctx.drawImage(
        bottomBunRef.current,
        -bunW / 2,
        -bunH,
        bunW,
        bunH
      );
      ctx.drawImage(
        topBunRef.current,
        -bunW / 2,
        -bunH,
        bunW,
        bunH
      );
    } else {
      // Tegn bunnbrødet
      ctx.drawImage(
        bottomBunRef.current,
        -bunW / 2,
        -bunH,
        bunW,
        bunH
      );

      // Stable ingrediensene tett oppå bunnbrødet
      let stackY = -bunH;
      collectedIngredients.forEach((type) => {
        let avImg;
        if (type === "kjott") avImg = kjottAvlangRef.current;
        else if (type === "ost") avImg = ostAvlangRef.current;
        else if (type === "salat") avImg = salatAvlangRef.current;
        else if (type === "tomat") avImg = tomatAvlangRef.current;
        // Trekk fra ingH med negativ overlapp slik at lagene overlapper
        stackY -= (ingH + overlap);
        ctx.drawImage(avImg, -ingW / 2, stackY, ingW, ingH);
      });

      // Tegn toppbrødet slik at bunnen møter den øverste ingrediensen tett
      ctx.drawImage(
        topBunRef.current,
        -bunW / 2,
        stackY - bunH,
        bunW,
        bunH
      );
    }

    ctx.restore();
  }, [burger, ingredients, collectedIngredients, topYOffset]);

  // Piltaster for å styre burgeren
  const handleKeyDown = (e) => {
    if (
      ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)
    ) {
      e.preventDefault();
    }
    if (e.key === "ArrowRight") {
      setBurger((prev) => ({ ...prev, direction: "right" }));
    } else if (e.key === "ArrowLeft") {
      setBurger((prev) => ({ ...prev, direction: "left" }));
    } else if (e.key === "ArrowUp") {
      setBurger((prev) => ({ ...prev, direction: "up" }));
    } else if (e.key === "ArrowDown") {
      setBurger((prev) => ({ ...prev, direction: "down" }));
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex="0"
      onKeyDown={handleKeyDown}
      style={{
        outline: "none",
        width: "500px",
        margin: "0 auto",
        backgroundColor: "#f9f9e8",
        padding: "20px",
      }}
    >
      <h2 style={{ textAlign: "center" }}>BurgerGame</h2>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: "1px solid #ccc", width: "400px", height: "400px" }}
      />
      <div style={{ textAlign: "center", marginTop: "10px" }}>
        Bruk piltastene for å styre burgeren og fange ingrediensene!
      </div>
    </div>
  );
};

export default BurgerGame;
