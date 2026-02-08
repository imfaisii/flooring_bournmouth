"use client";

import { Check } from "lucide-react";
import {
  flooringTypes,
  flooringLabels,
  flooringColors,
  type FlooringType,
} from "@/lib/validators/visualize.schema";

interface FlooringSelectorProps {
  selected: FlooringType;
  onSelect: (type: FlooringType) => void;
}

const flooringImages: Record<FlooringType, string> = {
  hardwood: "/images/flooring/hardwood.jpg",
  laminate: "/images/flooring/laminate.jpg",
  vinyl: "/images/flooring/vinyl.jpg",
  marble: "/images/flooring/marble.jpg",
  tile: "/images/flooring/tile.jpg",
};

export function FlooringSelector({ selected, onSelect }: FlooringSelectorProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">
        Choose Your Flooring Type
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {flooringTypes.map((type) => {
          const isSelected = selected === type;
          const color = flooringColors[type];

          return (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-200
                flex flex-col items-center gap-3
                ${
                  isSelected
                    ? "border-accent bg-accent/10"
                    : "border-neutral-700 hover:border-neutral-500 bg-neutral-800/50"
                }
              `}
            >
              {/* Color swatch */}
              <div
                className="w-12 h-12 rounded-lg shadow-inner"
                style={{
                  backgroundColor: color,
                  backgroundImage:
                    type === "hardwood" || type === "laminate"
                      ? `repeating-linear-gradient(
                          90deg,
                          transparent,
                          transparent 2px,
                          rgba(0,0,0,0.1) 2px,
                          rgba(0,0,0,0.1) 4px
                        )`
                      : type === "marble"
                      ? `linear-gradient(
                          135deg,
                          transparent 40%,
                          rgba(200,200,200,0.3) 45%,
                          transparent 50%
                        )`
                      : undefined,
                }}
              />

              {/* Label */}
              <span
                className={`text-sm font-medium ${
                  isSelected ? "text-accent" : "text-neutral-300"
                }`}
              >
                {flooringLabels[type]}
              </span>

              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                  <Check className="w-3 h-3 text-dark-bg" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
