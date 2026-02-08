"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Download, RefreshCw, RotateCcw, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { flooringLabels, type FlooringType } from "@/lib/validators/visualize.schema";

interface ResultDisplayProps {
  originalUrl: string;
  resultUrl: string;
  resultBase64?: string;
  flooringType: FlooringType;
  attemptsRemaining: number;
  onRetry: () => void;
  onReset: () => void;
}

export function ResultDisplay({
  originalUrl,
  resultUrl,
  resultBase64,
  flooringType,
  attemptsRemaining,
  onRetry,
  onReset,
}: ResultDisplayProps) {
  const [showOriginal, setShowOriginal] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);

  // Use base64 as fallback if URL doesn't load
  const displayUrl = resultBase64
    ? `data:image/png;base64,${resultBase64}`
    : resultUrl;

  const handleDownload = async () => {
    try {
      const response = await fetch(displayUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `room-${flooringType}-visualization.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success message */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">
          Your {flooringLabels[flooringType]} Visualization
        </h3>
        <p className="text-neutral-400">
          Here&apos;s how your room would look with {flooringLabels[flooringType].toLowerCase()} flooring
        </p>
      </div>

      {/* Image comparison */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-800">
        {/* Before/After slider */}
        <div className="relative w-full h-full">
          {/* Original image */}
          <div className="absolute inset-0">
            <Image
              src={originalUrl}
              alt="Original room"
              fill
              className="object-contain"
            />
          </div>

          {/* Result image with clip */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <Image
              src={displayUrl}
              alt="Visualized room"
              fill
              className="object-contain"
            />
          </div>

          {/* Slider line */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <div className="flex gap-0.5">
                <div className="w-0.5 h-4 bg-neutral-400 rounded-full" />
                <div className="w-0.5 h-4 bg-neutral-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* Slider interaction area */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />

          {/* Labels */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 rounded-full text-sm text-white">
            Original
          </div>
          <div className="absolute top-4 right-4 px-3 py-1 bg-accent/80 rounded-full text-sm text-dark-bg font-medium">
            {flooringLabels[flooringType]}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="outline" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>

        {attemptsRemaining > 0 && (
          <Button variant="outline" onClick={onRetry}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Different Flooring ({attemptsRemaining} left)
          </Button>
        )}

        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          New Photo
        </Button>
      </div>

      {/* CTA */}
      <div className="mt-8 p-6 rounded-xl bg-accent/10 border border-accent/20 text-center">
        <h4 className="text-lg font-semibold text-white mb-2">
          Love what you see?
        </h4>
        <p className="text-neutral-400 mb-4">
          Get a free quote for professional installation of {flooringLabels[flooringType].toLowerCase()} flooring
        </p>
        <Link href="/#quote">
          <Button>
            <MessageSquare className="w-4 h-4 mr-2" />
            Get a Free Quote
          </Button>
        </Link>
      </div>
    </div>
  );
}
