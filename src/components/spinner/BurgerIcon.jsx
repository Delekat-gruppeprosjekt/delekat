import React from "react";
import burgerBase from "./burger-base.png";
import cheeseIcon from "./cheese.png";
import meatIcon from "./meat.png";
import cucumberIcon from "./cucumber.png";
import pepperIcon from "./pepper.png";

const BurgerIcon = ({ ingredients }) => {
  return (
    <div style={{ position: "relative", width: "100px", height: "100px" }}>
      <img src={burgerBase} alt="Burger" style={{ width: "100%", height: "100%" }} />
      {ingredients.includes("cheese") && (
        <img
          src={cheeseIcon}
          alt="Cheese"
          style={{ position: "absolute", top: "30%", left: "30%", width: "30px", height: "30px" }}
        />
      )}
      {ingredients.includes("meat") && (
        <img
          src={meatIcon}
          alt="Meat"
          style={{ position: "absolute", top: "40%", left: "40%", width: "30px", height: "30px" }}
        />
      )}
      {ingredients.includes("cucumber") && (
        <img
          src={cucumberIcon}
          alt="Cucumber"
          style={{ position: "absolute", top: "20%", left: "20%", width: "30px", height: "30px" }}
        />
      )}
      {ingredients.includes("pepper") && (
        <img
          src={pepperIcon}
          alt="Pepper"
          style={{ position: "absolute", top: "50%", left: "50%", width: "30px", height: "30px" }}
        />
      )}
   
    </div>
  );
};

export default BurgerIcon;
