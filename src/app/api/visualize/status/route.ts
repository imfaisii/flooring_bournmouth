import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/api";
import { getClientIP } from "@/lib/utils/request";

export async function GET(req: NextRequest) {
  try {
    const sessionId = req.nextUrl.searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID required" },
        { status: 400 }
      );
    }

    const ipAddress = getClientIP(req);
    const supabase = createServiceClient();

    const { data, error } = await supabase.rpc(
      "check_visualization_rate_limit",
      {
        p_ip_address: ipAddress,
        p_session_id: sessionId,
        p_max_attempts: 3,
        p_window_hours: 1,
      }
    );

    if (error) {
      console.error("Rate limit check error:", error);
      // Return default values if check fails
      return NextResponse.json({
        attemptsRemaining: 3,
        attemptsUsed: 0,
        resetAt: null,
      });
    }

    // RPC returns an array, get first result
    const result = data?.[0];

    return NextResponse.json({
      attemptsRemaining: result?.attempts_remaining ?? 3,
      attemptsUsed: result?.attempts_used ?? 0,
      resetAt: result?.reset_at ?? null,
      allowed: result?.allowed ?? true,
    });
  } catch (error) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}
