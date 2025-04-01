import React, { useRef, useEffect, useState } from "react";

const BurgerGame = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [burger, setBurger] = useState({ x: 50, y: 50, direction: "right" });
  const [ingredients, setIngredients] = useState([]);
  const [collectedIngredients, setCollectedIngredients] = useState([]);

  // Prelaster bilder for burgeren og ingrediensene
  const burgerImg = useRef(new Image());
  const cheeseImg = useRef(new Image());
  const meatImg = useRef(new Image());
  const cucumberImg = useRef(new Image());
  const pepperImg = useRef(new Image());

  useEffect(() => {
    burgerImg.current.src = "/assets/burger-base.png";
    cheeseImg.current.src = "/assets/cheese.png";
    meatImg.current.src = "/assets/meat.png";
    cucumberImg.current.src = "/assets/cucumber.png";
    pepperImg.current.src = "/assets/pepper.png";
  }, []);

  // Generer fallende ingredienser ved montering
  useEffect(() => {
    const generatedIngredients = [];
    for (let i = 0; i < 10; i++) {
      const ingredientX = Math.floor(Math.random() * (380 - 20 + 1)) + 20;
      const ingredientY = Math.floor(Math.random() * (380 - 20 + 1)) + 20;
      // Tilfeldig type fra en liste
      const types = ["cheese", "meat", "cucumber", "pepper"];
      const type = types[Math.floor(Math.random() * types.length)];
      generatedIngredients.push({ x: ingredientX, y: ingredientY, type, eaten: false });
    }
    setIngredients(generatedIngredients);
  }, []);


  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.focus();
    }
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setBurger((prev) => {
        const step = 20;
        let { x, y, direction } = prev;
        if (direction === "right") x += step;
        if (direction === "left") x -= step;
        if (direction === "up") y -= step;
        if (direction === "down") y += step;
        // Sørg for at burgeren holder seg innenfor canvasen
        x = Math.max(10, Math.min(x, 390));
        y = Math.max(10, Math.min(y, 390));
        return { x, y, direction };
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  
  useEffect(() => {
    setIngredients((prevIngredients) =>
      prevIngredients.map((ingredient) => {
        if (!ingredient.eaten) {
          const dx = burger.x - ingredient.x;
          const dy = burger.y - ingredient.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 20) {
            // Legg til denne ingrediens-typen i collectedIngredients
            setCollectedIngredients((prev) => [...prev, ingredient.type]);
            return { ...ingredient, eaten: true };
          }
        }
        return ingredient;
      })
    );
  }, [burger]);

  // Tegn alt på canvasen
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    // Tøm canvas med svart bakgrunn
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ingredients.forEach((ingredient) => {
      if (!ingredient.eaten) {
        ctx.beginPath();
        ctx.arc(ingredient.x, ingredient.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.fill();
      }
    });

    // Tegn burgerikonet
    const burgerSize = 40;
    ctx.drawImage(burgerImg.current, burger.x - burgerSize / 2, burger.y - burgerSize / 2, burgerSize, burgerSize);

    const iconSize = 16;
    collectedIngredients.forEach((type, index) => {
      let img;
      if (type === "cheese") img = cheeseImg.current;
      else if (type === "meat") img = meatImg.current;
      else if (type === "cucumber") img = cucumberImg.current;
      else if (type === "pepper") img = pepperImg.current;
      const offsetX = burger.x - (collectedIngredients.length * iconSize) / 2 + index * iconSize;
      const offsetY = burger.y - burgerSize / 2 - iconSize - 2;
      ctx.drawImage(img, offsetX, offsetY, iconSize, iconSize);
    });

    const win = ingredients.length > 0 && ingredients.every((ing) => ing.eaten);
    if (win) {
      ctx.fillStyle = "white";
      ctx.font = "24px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Du vant!", canvas.width / 2, canvas.height / 2);
    }
  }, [burger, ingredients, collectedIngredients]);

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
    <div ref={containerRef} tabIndex="0" onKeyDown={handleKeyDown} style={{ outline: "none" }}>
      <canvas ref={canvasRef} width={400} height={400} />
      <div style={{ textAlign: "center", marginTop: "10px", color: "white", fontSize: "16px" }}>
        Spill burger: bruk piltastene for å styre burgeren og spis ingrediensene!
      </div>
    </div>
  );
};

export default BurgerGame;
