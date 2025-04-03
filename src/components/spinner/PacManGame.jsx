import React, { useRef, useEffect, useState } from "react";

import hamburgerBunn from "./icons/hamburgerBunn-fix2.svg";
import hamburgerTopp from "./icons/hamburgerTopp-fix2.svg";
import kjottHel from "./icons/kjottHel.svg";
import kjottAvlang from "./icons/kjottAvlangt-fix2.svg"; 
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

  // Ingredienser på brettet – plassert i hjørnene
  const [ingredients, setIngredients] = useState([
    { x: 50,  y: 50,  type: "kjott", eaten: false },
    { x: 350, y: 50,  type: "ost",   eaten: false },
    { x: 50,  y: 350, type: "salat", eaten: false },
    { x: 350, y: 350, type: "tomat", eaten: false },
  ]);

  // Ingredienser som er samlet
  const [collectedIngredients, setCollectedIngredients] = useState([]);

  // Animasjon for toppbrødet (litt opp og ned)
  const [topYOffset, setTopYOffset] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      const amplitude = 10;
      const period = 300;
      setTopYOffset(amplitude * Math.sin(Date.now() / period));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Bilde-refs
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

  useEffect(() => {
    if (containerRef.current) containerRef.current.focus();
  }, []);

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

  // Beveg burgeren
  useEffect(() => {
    const interval = setInterval(() => {
      setBurger((prev) => {
        const step = 20;
        let { x, y, direction } = prev;
        if (direction === "right") x += step;
        if (direction === "left") x -= step;
        if (direction === "up")   y -= step;
        if (direction === "down") y += step;
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

  // Bestem riktig rekkefølge for ingrediensene
  const CORRECT_ORDER = ["kjott", "ost", , "tomat","salat"];
  const sortedCollected = CORRECT_ORDER.filter((t) =>
    collectedIngredients.includes(t)
  );

  // Tegn alt på canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f9f9e8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Hvis alle ingredienser er spist, vis ferdig burger og melding
    const allEaten = ingredients.every((ing) => ing.eaten);
    if (allEaten) {
      const finalSize = 300;
      const dpr = window.devicePixelRatio || 1;
      const centerX = (canvas.width / dpr) / 2;
      const centerY = (canvas.height / dpr) / 2;
      ctx.drawImage(
        hamburgerHelRef.current,
        centerX - finalSize / 2,
        centerY - finalSize / 2,
        finalSize,
        finalSize
      );
      ctx.fillStyle = "black";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Du vant!", centerX, centerY + finalSize / 2 + 30);
      return;
    }

    // Tegn ingrediens-ikoner (ikke spist)
    const ingSize = 150;
    ingredients.forEach((ing) => {
      if (!ing.eaten) {
        let icon = kjottHelRef.current;
        if (ing.type === "ost")   icon = ostHelRef.current;
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

    // Tegn den delvise burgeren (bunn, ingredienser, topp) i riktig rekkefølge
    ctx.save();
    ctx.translate(burger.x, burger.y);

    const bunW = 50;
    const bunH = 50;
    const ingW = 50;
    const ingH = 50;

    // Overlapp: for ingrediensene og for toppbrødet
    const overlapIngredients = -45; 
    const overlapTop = 40;          

    if (sortedCollected.length === 0) {
      const topOffsetNoIngredients = 20; 
      ctx.drawImage(bottomBunRef.current, -bunW / 2, -bunH, bunW, bunH);
      ctx.drawImage(topBunRef.current, -bunW / 2, -bunH - topOffsetNoIngredients, bunW, bunH);
    } else {
      // Tegn bunn
      ctx.drawImage(bottomBunRef.current, -bunW / 2, -bunH, bunW, bunH);
      let stackY = -bunH;
      sortedCollected.forEach((type) => {
        let avImg;
        if (type === "kjott") avImg = kjottAvlangRef.current;
        else if (type === "ost") avImg = ostAvlangRef.current;
        else if (type === "salat") avImg = salatAvlangRef.current;
        else if (type === "tomat") avImg = tomatAvlangRef.current;
        else if (type === "salat") avImg = salatAvlangRef.current;
        stackY -= (ingH + overlapIngredients);
        ctx.drawImage(avImg, -ingW / 2, stackY, ingW, ingH);
      });
      ctx.drawImage(topBunRef.current, -bunW / 2, stackY - bunH + overlapTop, bunW, bunH);
    }
    ctx.restore();
  }, [burger, ingredients, collectedIngredients, topYOffset]);

  const handleKeyDown = (e) => {
    if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
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
