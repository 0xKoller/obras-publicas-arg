"use client";

import Image from "next/image";
import { PRESIDENTIAL_PERIODS } from "@/lib/presidential-periods";

interface Props {
  selected: string | null;
  onSelect: (president: string | null) => void;
}

export default function PresidentFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* "Todos" button */}
      <button
        onClick={() => onSelect(null)}
        className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
          selected === null
            ? "bg-gov-navy/10 ring-2 ring-gov-navy"
            : "hover:bg-gray-100"
        }`}
      >
        <div className="w-20 h-20 rounded-xl bg-gray-200 flex items-center justify-center">
          <span className="text-base font-semibold text-gray-600">All</span>
        </div>
        <span className="text-[11px] font-medium text-muted-foreground">
          Todos
        </span>
      </button>

      {PRESIDENTIAL_PERIODS.map((period) => {
        const isSelected = selected === period.president;
        return (
          <button
            key={period.president}
            onClick={() =>
              onSelect(isSelected ? null : period.president)
            }
            className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-lg transition-all ${
              isSelected ? "bg-gray-50" : "hover:bg-gray-100"
            }`}
          >
            <div
              className="w-20 h-20 rounded-xl overflow-hidden transition-all"
              style={{
                boxShadow: isSelected
                  ? `0 0 0 3px white, 0 0 0 5px ${period.color}`
                  : "none",
              }}
            >
              <Image
                src={period.image}
                alt={period.president}
                width={80}
                height={80}
                className="w-full h-full object-cover"
              />
            </div>
            <span
              className="text-[11px] font-medium"
              style={{ color: isSelected ? period.color : undefined }}
            >
              {period.shortName}
            </span>
          </button>
        );
      })}
    </div>
  );
}
