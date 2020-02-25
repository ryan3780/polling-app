import React from "react";
import ImgAutoChange from "./ImgAutoChange";

export default {
  title: "components|basic/ImgChange", // 스토리북에서 보여질 그룹과 경로를 명시
  component: ImgAutoChange // 어떤 컴포넌트를 문서화 할지 명시
};

export const autoChange = () => <ImgAutoChange />;