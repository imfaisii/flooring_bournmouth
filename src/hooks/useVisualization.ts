"use client";

import { useState, useCallback, useEffect } from "react";
import { getOrCreateSessionId } from "@/lib/utils/session";
import type { FlooringType } from "@/lib/validators/visualize.schema";

interface VisualizationParams {
  image: File;
  flooringType: FlooringType;
}

interface VisualizationResult {
  imageUrl: string;
  imageBase64?: string;
  attemptsRemaining: number;
  processingTimeMs: number;
}

interface RateLimitStatus {
  attemptsRemaining: number;
  attemptsUsed: number;
  resetAt: string | null;
  allowed: boolean;
}

export function useVisualization() {
  const [attemptsRemaining, setAttemptsRemaining] = useState(3);
  const [resetAt, setResetAt] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    try {
      setIsCheckingStatus(true);
      const sessionId = getOrCreateSessionId();
      const response = await fetch(
        `/api/visualize/status?sessionId=${encodeURIComponent(sessionId)}`
      );
      const data: RateLimitStatus = await response.json();

      setAttemptsRemaining(data.attemptsRemaining);
      setResetAt(data.resetAt);
    } catch (err) {
      console.error("Failed to check visualization status:", err);
      // Default to allowing attempts if status check fails
      setAttemptsRemaining(3);
    } finally {
      setIsCheckingStatus(false);
    }
  }, []);

  // Check status on mount
  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  const generateVisualization = useCallback(
    async (params: VisualizationParams): Promise<VisualizationResult> => {
      setIsLoading(true);
      setError(null);

      try {
        const sessionId = getOrCreateSessionId();

        const formData = new FormData();
        formData.append("image", params.image);
        formData.append("flooringType", params.flooringType);
        formData.append("sessionId", sessionId);

        const response = await fetch("/api/visualize", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 429) {
            setAttemptsRemaining(0);
            setResetAt(data.resetAt);
          }
          throw new Error(data.error || "Failed to generate visualization");
        }

        setAttemptsRemaining(data.attemptsRemaining);

        return {
          imageUrl: data.imageUrl,
          imageBase64: data.imageBase64,
          attemptsRemaining: data.attemptsRemaining,
          processingTimeMs: data.processingTimeMs,
        };
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    attemptsRemaining,
    resetAt,
    isLoading,
    isCheckingStatus,
    error,
    generateVisualization,
    checkStatus,
    clearError,
  };
}
