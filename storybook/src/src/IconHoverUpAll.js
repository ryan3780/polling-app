import React from "react";
import "./IconHover.css";
import place from "./place.png";
import salary from "./graph.png";
import js from "./js-format.png"
import list from "./list.png"
import work from "./work.png"
import emoji from "./emoji.png"
import benefit from "./benefit.png"
import trophy from "./trophy.png"

const ImgHoverUpAll = () => {
  return (
    <ul className="categories">
            <li className="categoryIcon">
            <img src={place} alt="place" className="shadow"></img>
      <h3 className="test">지역</h3>
            </li>
            <li className="categoryIcon">
            <img src={salary} alt="place" className="shadow"></img>
      <h3 className="test">연봉</h3>
            </li>
            <li className="categoryIcon">
            <img src={js} alt="place" className="shadow"></img>
      <h3 className="test">언어</h3>
            </li>
            <li className="categoryIcon">
            <img src={list} alt="place" className="shadow"></img>
      <h3 className="test">직군</h3>
            </li>
            <li className="categoryIcon">
            <img src={work} alt="place" className="shadow"></img>
      <h3 className="test">업종</h3>
            </li>
            <li className="categoryIcon">
            <img src={emoji} alt="place" className="shadow"></img>
      <h3 className="test">분위기</h3>
            </li>
            <li className="categoryIcon">
            <img src={benefit} alt="place" className="shadow"></img>
      <h3 className="test">복지</h3>
            </li>
            <li className="categoryIcon">
            <img src={trophy} alt="place" className="shadow"></img>
      <h3 className="test">기타</h3>
            </li>
          </ul>
  );
};

export default ImgHoverUpAll;