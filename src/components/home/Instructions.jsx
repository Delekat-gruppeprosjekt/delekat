import React from 'react';

export default function Instructions({ instructions }) {
  if (!instructions) return <p>Ingen instruksjoner tilgjengelig.</p>;

  const lines = instructions.split("\n").filter(line => line.trim() !== "");
  const numberedSteps = [];
  const freeTextLines = [];

  lines.forEach(line => {
    const trimmed = line.trim();
    if (/^\d+\.\s?/.test(trimmed)) {
      // Del opp i tallet (inkl. punktum) og teksten bak
      const match = trimmed.match(/^(\d+\.\s?)(.*)$/);
      if (match) {
        numberedSteps.push({ number: match[1], text: match[2] });
      } else {
        numberedSteps.push({ number: '', text: trimmed });
      }
    } else {
      freeTextLines.push(trimmed);
    }
  });

  return (
    <>
      {numberedSteps.length > 0 && (
        <ol className="list-none text-sm space-y-3 text-gray-600 flex flex-col">
          {numberedSteps.map((step, index) => (
            <li key={index} className="flex">
              <span className="text-black font-regular">{step.number}</span>
              <span className="text-gray-600 font-regular ml-1">{step.text}</span>
            </li>
          ))}
        </ol>
      )}
      {freeTextLines.length > 0 && (
        <div className="mt-4">
          {freeTextLines.map((line, index) => (
            <p key={index} className="text-gray-600 text-sm">{line}</p>
          ))}
        </div>
      )}
    </>
  );
}
