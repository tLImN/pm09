"use client";
import { useState } from 'react';
import Button from "@/components/Button";

interface DetailsItemProps {
  question: string;
  children: React.ReactNode;
}

export default function DetailsItem({ question, children }: DetailsItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="border border-[var(--border-color)] rounded-[5px] px-[31px] py-[28px] cursor-pointer"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex justify-between cursor-pointer text-[1.375rem] font-semibold">
        {question}
        <Button
          variant="icon"
          className={isOpen ? 'open' : ''}
          aria-label="Развернуть"
        />
      </div>
      <div
        className="overflow-hidden"
        style={{
          maxHeight: isOpen ? "500px" : "0",
          opacity: isOpen ? 1 : 0,
          transition: "max-height 0.2s ease, opacity 0.2s ease, margin 0.2s ease",
          margin: isOpen ? "16px 0" : "0",
        }}
      >
        <p className="m-0">{children}</p>
      </div>
    </div>
  );
}
