import React from "react";

export function FormattedText({ text }) {
  if (!text) return null;

  // Split lines to preserve linebreaks and bullet points
  const lines = text.split("\n");

  return (
    <div className="space-y-1.5 font-sans">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Parse inline bold (**bold**) and inline code (`code`)
        const parseInline = (content) => {
          const parts = [];
          let currentStr = "";
          let isBold = false;
          let i = 0;

          while (i < content.length) {
            if (content.substring(i, i + 2) === "**") {
              if (currentStr) {
                parts.push(currentStr);
                currentStr = "";
              }
              isBold = !isBold;
              i += 2;
            } else {
              currentStr += content[i];
              i++;
            }
          }
          if (currentStr) {
            parts.push(currentStr);
          }

          return parts.map((part, pIdx) => {
            if (pIdx % 2 === 1) {
              return (
                <strong key={pIdx} className="font-extrabold text-white">
                  {part}
                </strong>
              );
            }
            return part;
          });
        };

        // Bullet point line
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-sky-400 font-bold">•</span>
              <span>{parseInline(trimmed.substring(2))}</span>
            </div>
          );
        }

        // Numbered list line (e.g. 1., 2.)
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
        if (numMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-sky-400 font-bold">{numMatch[1]}.</span>
              <span>{parseInline(numMatch[2])}</span>
            </div>
          );
        }

        // Header line (e.g. # Header or ## Header)
        if (trimmed.startsWith("#")) {
          const headerText = trimmed.replace(/^#+\s*/, "");
          return (
            <h4 key={idx} className="text-base font-extrabold text-white pt-1">
              {parseInline(headerText)}
            </h4>
          );
        }

        return <p key={idx}>{parseInline(line)}</p>;
      })}
    </div>
  );
}

export default FormattedText;
