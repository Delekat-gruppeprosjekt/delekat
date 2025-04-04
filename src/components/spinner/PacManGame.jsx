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

const INITIAL_INGREDIENTS = [
  { x: 50,  y: 50,  type: "kjott", eaten: false },
  { x: 350, y: 50,  type: "ost",   eaten: false },
  { x: 50,  y: 350, type: "salat", eaten: false },
  { x: 350, y: 350, type: "tomat", eaten: false },
];

const BurgerGame = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Spilstater
  const [burger, setBurger] = useState({
    x: 200,
    y: 200,
    direction: "right",
  });
  const [ingredients, setIngredients] = useState(INITIAL_INGREDIENTS);
  const [collectedIngredients, setCollectedIngredients] = useState([]);

  // Timer og game over
  const [timeLeft, setTimeLeft] = useState(5); // 5 sekunders nedtelling
  const [gameOver, setGameOver] = useState(false);

  // Partikler for konfetti (brukes kun ved seier)
  const [particles, setParticles] = useState([]);

  // Beregn om spilleren har vunnet (alle ingredienser spist)
  const hasWon = ingredients.every((ing) => ing.eaten);

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

  // Timer: trekk fra ett sekund
  useEffect(() => {
    if (gameOver || hasWon) return;
    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerInterval);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [gameOver, hasWon]);

  // Beveg burgeren med økt hastighet og bounce-effekt slik at den ikke går utenfor skjermen.
  useEffect(() => {
    if (gameOver || hasWon) return;
    const interval = setInterval(() => {
      setBurger((prev) => {
        const step = 70;
        let { x, y, direction } = prev;
        if (direction === "right") x += step;
        if (direction === "left") x -= step;
        if (direction === "up")   y -= step;
        if (direction === "down") y += step;
        if (x < 0) {
          x = 0;
          direction = "right";
        }
        if (x > 400) {
          x = 400;
          direction = "left";
        }
        if (y < 0) {
          y = 0;
          direction = "down";
        }
        if (y > 400) {
          y = 400;
          direction = "up";
        }
        return { x, y, direction };
      });
    }, 100);
    return () => clearInterval(interval);
  }, [gameOver, hasWon]);

  // Kollisjon: sjekk om burgeren treffer ingredienser
  useEffect(() => {
    if (gameOver || hasWon) return;
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
  }, [burger, ingredients, collectedIngredients, gameOver, hasWon]);

  // Bestem rekkefølgen for ingrediensene
  const CORRECT_ORDER = ["kjott", "ost", "tomat", "salat"];
  const sortedCollected = CORRECT_ORDER.filter((t) =>
    collectedIngredients.includes(t)
  );

  // Konfetti-animasjon: Start når spilleren har vunnet
  useEffect(() => {
    if (!hasWon) return;
    if (particles.length === 0) {
      const initParticles = [];
      const colors = ["#ff0", "#ff66cc", "#66ff66", "#66ccff", "#ff9966"];
      for (let i = 0; i < 100; i++) {
        initParticles.push({
          x: Math.random() * 400,
          y: Math.random() * -400,
          vy: 2 + Math.random() * 3,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
      setParticles(initParticles);
    }
    const confettiInterval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles.map((p) => {
          let newY = p.y + p.vy;
          if (newY > 400) {
            newY = -10;
          }
          return { ...p, y: newY };
        })
      );
    }, 30);
    return () => clearInterval(confettiInterval);
  }, [hasWon, particles]);

  // Tegn alt på canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f9f9e8";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
      particles.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 5, 5);
      });
      return;
    }

    if (gameOver) {
      ctx.fillStyle = "black";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Game Over!", 200, 200);
      return;
    }

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

    ctx.save();
    ctx.translate(burger.x, burger.y);
    const bunW = 50;
    const bunH = 50;
    const ingW = 50;
    const ingH = 50;
    const overlapIngredients = -45;
    const overlapTop = 40;
    if (sortedCollected.length === 0) {
      const topOffsetNoIngredients = 20;
      ctx.drawImage(bottomBunRef.current, -bunW / 2, -bunH, bunW, bunH);
      ctx.drawImage(topBunRef.current, -bunW / 2, -bunH - topOffsetNoIngredients, bunW, bunH);
    } else {
      ctx.drawImage(bottomBunRef.current, -bunW / 2, -bunH, bunW, bunH);
      let stackY = -bunH;
      sortedCollected.forEach((type) => {
        let avImg;
        if (type === "kjott") avImg = kjottAvlangRef.current;
        else if (type === "ost") avImg = ostAvlangRef.current;
        else if (type === "salat") avImg = salatAvlangRef.current;
        else if (type === "tomat") avImg = tomatAvlangRef.current;
        stackY -= (ingH + overlapIngredients);
        ctx.drawImage(avImg, -ingW / 2, stackY, ingW, ingH);
      });
      ctx.drawImage(topBunRef.current, -bunW / 2, stackY - bunH + overlapTop, bunW, bunH);
    }
    ctx.restore();

    ctx.fillStyle = "black";
    ctx.font = "18px Arial";
    ctx.textAlign = "right";
    ctx.fillText(`Tid: ${timeLeft}s`, 390, 20);
  }, [burger, ingredients, collectedIngredients, topYOffset, gameOver, timeLeft, particles]);

  // Bruk piltastene for å endre retning manuelt
  const handleKeyDown = (e) => {
    if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
    }
    if (gameOver || hasWon) return;
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

  // Reset-funksjon som nullstiller alt ved å lage en dyp kopi av INITIAL_INGREDIENTS
  const handleReset = () => {
    setBurger({ x: 200, y: 200, direction: "right" });
    setIngredients(INITIAL_INGREDIENTS.map((ing) => ({ ...ing })));
    setCollectedIngredients([]);
    setTimeLeft(5);
    setGameOver(false);
    setParticles([]);
    if (containerRef.current) containerRef.current.focus();
  };

  return (
    <div
      ref={containerRef}
      tabIndex="0"
      autoFocus
      onKeyDown={handleKeyDown}
      style={{
        outline: "none",
        width: "100%",
        maxWidth: "500px",
        margin: "20px auto",
        backgroundColor: "#fff",
        padding: "30px",
        borderRadius: "20px",
        boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "15px" }}>BurgerGame</h2>
      <p style={{
          textAlign: "center",
          fontSize: "16px",
          marginBottom: "20px",
          color: "#333"
        }}>
        Siden loader, prøv vårt burger spill mens du venter. Styr med piltastene.
      </p>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ 
          border: "1px solid #ccc", 
          width: "100%", 
          maxWidth: "400px", 
          aspectRatio: "1 / 1",
          display: "block",
          margin: "0 auto"
        }}
      />
      {(gameOver || hasWon) && (
        <div style={{ textAlign: "center", marginTop: "15px" }}>
          <button onClick={handleReset} style={{
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            border: "none",
            backgroundColor: "#f44336",
            color: "#fff",
            cursor: "pointer"
          }}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default BurgerGame;
