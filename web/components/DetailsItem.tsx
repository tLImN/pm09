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
      style={{
        border: "1px solid var(--border-color)",
        borderRadius: 5,
        padding: "28px 31px",
        cursor: "pointer"
      }}
      onClick={() => setIsOpen(!isOpen)}
    >
      <div
        style={{
          fontSize: "1.375rem",
          listStyle: "none",
          display: "flex",
          justifyContent: "space-between",
          cursor: "pointer",
          fontWeight: 600
        }}
      >
        {question}
        <Button
          variant="icon"
          className={isOpen ? 'open' : ''}
          aria-label="Развернуть"
        />
      </div>
      <div
        style={{
          maxHeight: isOpen ? "500px" : "0",
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.2s ease, opacity 0.2s ease, margin 0.2s ease",
          margin: isOpen ? "16px 0" : "0"
        }}
      >
        <p style={{ margin: 0 }}>{children}</p>
      </div>
    </div>
  );
}

// СТАРАЯ ВЕРСИЯ
// export default function DetailsItem({ question, children }: DetailsItemProps) {
//   return (
//     <details
//       style={{
//         border: "1px solid var(--border-color)",
//         borderRadius: 5,
//         padding: "28px 31px",
//       }}
//     >
//       <summary
//         style={{
//           fontSize: "1.375rem",
//           listStyle: "none",
//           display: "flex",
//           justifyContent: "space-between",
//           cursor: "pointer",
//           fontWeight: 600
//         }}
//       >
//         {question}
//         <button
//           className="expand-button"
//           type="button"
//           aria-label="Развернуть"
//         ></button>
//       </summary>
//       <p style={{ margin: "16px 0", }}>{children}</p>
//     </details>
//   );
// }