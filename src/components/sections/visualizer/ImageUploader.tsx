"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, ImageIcon, X } from "lucide-react";
import { imageValidation } from "@/lib/validators/visualize.schema";

interface ImageUploaderProps {
  onUpload: (file: File) => void;
  disabled?: boolean;
  minimal?: boolean;
}

export function ImageUploader({ onUpload, disabled, minimal = false }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);

      const validation = imageValidation.validate({
        size: file.size,
        type: file.type,
      });

      if (!validation.valid) {
        setError(validation.error);
        return;
      }

      onUpload(file);
    },
    [onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [disabled, handleFile]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    },
    [handleFile]
  );

  return (
    <div className={minimal ? "absolute inset-0 flex flex-col justify-center" : "space-y-4"}>
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative rounded-2xl transition-all duration-300 cursor-pointer
          flex flex-col items-center justify-center gap-4
          ${minimal ? "h-full m-2 bg-transparent border-2 border-dashed border-white/10 hover:bg-white/5 hover:border-white/20" : "min-h-[300px] border-2 border-dashed p-12"}
          ${disabled
            ? "border-neutral-700 bg-neutral-900/50 cursor-not-allowed opacity-50"
            : isDragging
              ? "border-accent bg-accent/10"
              : !minimal ? "border-neutral-700 hover:border-accent/50 hover:bg-neutral-800/50" : ""
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleChange}
          disabled={disabled}
          className="hidden"
        />

        <div
          className={`
            rounded-full flex items-center justify-center
            transition-colors duration-300
            ${minimal ? "w-12 h-12" : "w-20 h-20"}
            ${isDragging ? "bg-accent/20" : "bg-neutral-800"}
          `}
        >
          {isDragging ? (
            <Upload className={minimal ? "w-6 h-6 text-accent" : "w-10 h-10 text-accent"} />
          ) : (
            <ImageIcon className={minimal ? "w-6 h-6 text-neutral-400" : "w-10 h-10 text-neutral-400"} />
          )}
        </div>

        <div className="text-center">
          <p className={`${minimal ? "text-sm" : "text-lg"} font-medium text-white mb-1`}>
            {isDragging ? "Drop here" : "Upload Photo"}
          </p>
          {!minimal && (
            <>
              <p className="text-sm text-neutral-400">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-neutral-500 mt-2">
                JPEG, PNG, or WebP up to 10MB
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 absolute bottom-4 left-4 right-4 z-40">
          <X className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
}
