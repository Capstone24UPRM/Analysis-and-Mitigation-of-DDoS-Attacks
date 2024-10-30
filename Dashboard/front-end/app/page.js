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
    <div className="flex items-center justify-center min-h-screen">
      <div className="grid grid-rows-[auto_1fr] items-start justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <WindowSelection
          label1={"Description"}
          label2={"Simulate"}
          onSelect={handleContent}
        />
        <div className="w-full flex justify-start">
          {content == "Description" ? <Description /> : <Simulation />}
        </div>
      </div>
    </div>
  );
}
