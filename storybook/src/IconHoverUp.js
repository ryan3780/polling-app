import React from "react";
import "./IconHover.css";
import place from "./place.png";

const IconHoverUp = () => {
  return (
    <div className="categoryIcon">
      <img src={place} alt="place" className="shadow"></img>
      <h2 className="test">지역</h2>
      <p>마우스 포인터를 올리면 아이콘이 위로 올라갑니다</p>
    </div>
  );
};

export default IconHoverUp;