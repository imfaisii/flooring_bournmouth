"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { Wand2, AlertCircle, Loader2, Clock, Smartphone, Upload, Check, ChevronRight, RefreshCw, X, Download, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { ImageUploader } from "./visualizer/ImageUploader";
import { FlooringSelector } from "./visualizer/FlooringSelector";
import { useVisualization } from "@/hooks/useVisualization";
import type { FlooringType } from "@/lib/validators/visualize.schema";
import { cn } from "@/lib/utils/cn";

type ViewState = "upload" | "select" | "processing" | "result" | "error";

export function RoomVisualizer() {
  const [viewState, setViewState] = useState<ViewState>("upload");
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFlooring, setSelectedFlooring] = useState<FlooringType>("hardwood");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBase64, setResultBase64] = useState<string | null>(null);

  const {
    attemptsRemaining,
    resetAt,
    isLoading,
    isCheckingStatus,
    error,
    generateVisualization,
    clearError,
  } = useVisualization();

  // Clean up preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageUpload = useCallback((file: File) => {
    // Clean up old preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setUploadedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    setViewState("select");
    clearError();
  }, [previewUrl, clearError]);

  const handleGenerate = useCallback(async () => {
    if (!uploadedImage) return;

    setViewState("processing");
    clearError();

    try {
      const result = await generateVisualization({
        image: uploadedImage,
        flooringType: selectedFlooring,
      });

      setResultUrl(result.imageUrl);
      setResultBase64(result.imageBase64 || null);
      setViewState("result");
    } catch {
      setViewState("error");
    }
  }, [uploadedImage, selectedFlooring, generateVisualization, clearError]);

  const handleRetry = useCallback(() => {
    setViewState("select");
    setResultUrl(null);
    setResultBase64(null);
    clearError();
  }, [clearError]);

  const handleReset = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setUploadedImage(null);
    setPreviewUrl(null);
    setResultUrl(null);
    setResultBase64(null);
    setViewState("upload");
    clearError();
  }, [previewUrl, clearError]);

  const handleDownload = useCallback(async () => {
    const imageSource = resultBase64
      ? `data:image/png;base64,${resultBase64}`
      : resultUrl;

    if (!imageSource) return;

    try {
      const response = await fetch(imageSource);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `flooring-visualization-${selectedFlooring}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    }
  }, [resultUrl, resultBase64, selectedFlooring]);

  // Format reset time
  const formatResetTime = (resetAt: string | null) => {
    if (!resetAt) return "in an hour";
    const resetDate = new Date(resetAt);
    const now = new Date();
    const diffMs = resetDate.getTime() - now.getTime();
    const diffMins = Math.ceil(diffMs / 60000);
    if (diffMins <= 1) return "in about a minute";
    if (diffMins < 60) return `in ${diffMins} minutes`;
    return `at ${resetDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
  };

  return (
    <section id="visualizer" className="py-24 bg-dark-bg relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary/5 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2" />

      <Container>
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">

          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Wand2 className="w-4 h-4 text-accent" />
              <span className="text-accent text-xs font-bold uppercase tracking-wider">
                AI Room Visualizer
              </span>
            </div>

            <h2 className="text-4xl lg:text-6xl font-heading font-bold text-white leading-tight">
              See Your New Floor <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
                In Your Own Home
              </span>
            </h2>

            <p className="text-lg text-neutral-400 max-w-xl mx-auto lg:mx-0">
              Transform your space instantly. Upload a photo from your phone and let our AI show you exactly how different premium floorings will look in your room.
            </p>

            {!isCheckingStatus && (
              <div className="flex items-center justify-center lg:justify-start gap-4 text-sm font-medium">
                <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-neutral-300">
                  <span className="text-accent mr-2">
                    {attemptsRemaining} / 3
                  </span>
                  Visualizations Remaining
                </div>
                {attemptsRemaining === 0 && (
                  <span className="text-amber-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Resets {formatResetTime(resetAt)}
                  </span>
                )}
              </div>
            )}

            {/* Selection Controls (Only visible when image is selected) */}
            {viewState === "select" && (
              <div className="w-full bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
                <FlooringSelector
                  selected={selectedFlooring}
                  onSelect={setSelectedFlooring}
                />
                <div className="mt-6 flex gap-4">
                  <Button onClick={handleGenerate} disabled={isLoading} className="flex-1 h-12 text-lg">
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Preview"}
                  </Button>
                  <Button variant="outline" onClick={handleReset} className="h-12 w-12 p-0">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            )}
            {viewState === "result" && (
              <div className="w-full bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4">
                <h3 className="text-white font-bold mb-4">Results Ready!</h3>
                <div className="flex flex-col gap-3">
                  <Button onClick={handleDownload} className="w-full h-12">
                    <Download className="w-4 h-4 mr-2" />
                    Download Image
                  </Button>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={handleRetry} className="flex-1">
                      Try Another Style
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      New Photo
                    </Button>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Right Content - Phone Mockup */}
          <div className="relative flex-shrink-0 w-[300px] sm:w-[320px] lg:w-[350px]">
            {/* Phone Frame */}
            <div className="relative z-10 mx-auto border-gray-900 bg-gray-900 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] lg:h-[650px] lg:w-[330px] shadow-xl ring-1 ring-gray-900/5">
              <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
              <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
              <div className="rounded-[2rem] overflow-hidden w-full h-full bg-dark-bg relative">

                {/* Status Bar */}
                <div className="absolute top-0 w-full h-8 bg-black/50 z-20 flex items-center justify-between px-6 text-[10px] text-white font-medium">
                  <span>9:41</span>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 bg-white rounded-full opacity-20" />
                    <div className="w-3 h-3 bg-white rounded-full opacity-20" />
                  </div>
                </div>

                {/* App Content Container */}
                <div className="w-full h-full pt-10 pb-4 px-4 flex flex-col relative">

                  {/* App Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                      <ChevronRight className="w-4 h-4 text-white rotate-180" />
                    </div>
                    <span className="text-white font-bold text-sm tracking-wide">ROOM VISUALIZER</span>
                    <div className="w-8 h-8" />
                  </div>

                  {/* Tries Counter */}
                  {!isCheckingStatus && (
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                        <Sparkles className="w-3 h-3 text-accent" />
                        <span className="text-[10px] text-neutral-300">
                          <span className="text-accent font-bold">{attemptsRemaining}</span> / 3 tries left
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Screen Content */}
                  <div className="flex-1 relative rounded-2xl overflow-hidden bg-neutral-800/50 border border-white/5 group">

                    {/* Loading State */}
                    {isCheckingStatus && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-bg/80 backdrop-blur-sm z-30">
                        <Loader2 className="w-8 h-8 text-accent animate-spin mb-2" />
                        <p className="text-xs text-neutral-400">Loading...</p>
                      </div>
                    )}

                    {/* Processing State */}
                    {viewState === "processing" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-bg/90 backdrop-blur-sm z-30 p-6 text-center">
                        <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
                        <h4 className="text-white font-bold mb-2">Generating...</h4>
                        <p className="text-xs text-neutral-400">Applying {selectedFlooring} flooring to your room.</p>
                      </div>
                    )}

                    {/* Error State */}
                    {viewState === "error" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark-bg/90 backdrop-blur-sm z-30 p-6 text-center">
                        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                        <h4 className="text-white font-bold mb-2">Error</h4>
                        <p className="text-xs text-neutral-400 mb-4">{error}</p>
                        <Button size="sm" onClick={handleRetry}>Try Again</Button>
                      </div>
                    )}

                    {/* Main Display Logic */}
                    {(viewState === "upload") && (
                      <ImageUploader
                        onUpload={handleImageUpload}
                        disabled={attemptsRemaining === 0}
                        minimal={true}
                      />
                    )}

                    {(viewState === "select" || viewState === "processing") && previewUrl && (
                      <div className="relative w-full h-full">
                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                      </div>
                    )}

                    {viewState === "result" && resultUrl && (
                      <div className="relative w-full h-full group">
                        <Image src={resultUrl} alt="Result" fill className="object-cover" />
                        {/* Labels and Download */}
                        <div className="absolute top-3 left-3 px-2 py-1 bg-accent/90 rounded text-[10px] text-dark-bg font-bold">
                          {selectedFlooring.toUpperCase()}
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                          <div className="px-2 py-1 bg-black/60 rounded text-[10px] text-white font-bold backdrop-blur-sm border border-white/10">
                            AFTER
                          </div>
                          <button
                            onClick={handleDownload}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent hover:bg-accent/90 rounded-lg text-[10px] text-dark-bg font-bold transition-colors"
                          >
                            <Download className="w-3 h-3" />
                            Save
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Bottom Controls inside Phone */}
                  <div className="mt-4">
                    {viewState === "upload" && attemptsRemaining > 0 && (
                      <div className="text-center">
                        <p className="text-xs text-neutral-500">Tap above to upload a photo</p>
                      </div>
                    )}
                    {viewState === "upload" && attemptsRemaining === 0 && (
                      <div className="text-center">
                        <p className="text-xs text-amber-400 flex items-center justify-center gap-1">
                          <Clock className="w-3 h-3" />
                          Resets {formatResetTime(resetAt)}
                        </p>
                      </div>
                    )}
                    {viewState === "select" && (
                      <div className="text-center">
                        <p className="text-xs text-neutral-300 font-medium mb-1">Photo Selected</p>
                        <p className="text-[10px] text-neutral-500">Choose a flooring style on the left</p>
                      </div>
                    )}
                    {viewState === "result" && (
                      <div className="text-center">
                        <p className="text-xs text-green-400 font-medium">Generation complete!</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </Container>
    </section>
  );
}
