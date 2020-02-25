import React from "react";
import "../ImgChangeAuto/ImgChangeAuto.css";


const ImgAutoChange = () => {
  return (
    <div>
      <img id="showImg" className="showImg" alt="showImg"></img>
      <br/>
      <h2>자동으로 이미지가 잔상을 남기며 변경됩니다</h2>
    </div>
  );
};

export default ImgAutoChange;