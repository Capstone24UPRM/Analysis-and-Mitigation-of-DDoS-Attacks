"use client";
import { useState } from "react";
import WindowSelection from "@/components/ButtonGroup";
import Description from "./Content/Description";
import Simulation from "./Content/Simulation";

export default function Home() {
  const [content, setContent] = useState("Description");

  const handleContent = (content) => {
    setContent(content);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <WindowSelection
        label1={"Description"}
        label2={"Simulate"}
        onSelect={handleContent}
      />
      {content == "Description" ? <Description /> : <Simulation />}
    </div>
  );
}
