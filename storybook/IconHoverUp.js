import React from "react";
import "./IconHover.css";
import place from "./place.png";

const IconHoverUp = () => {
  return (
    <div className="categoryIcon">
      <img src={place} alt="place" className="shadow"></img>
      <p className="test">지역</p>
    </div>
  );
};

export default IconHoverUp;
