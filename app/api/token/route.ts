import { AccessToken } from "livekit-server-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const roomName =
    body.room_name || `grameen-${Math.random().toString(36).substring(7)}`;

  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY!,
    process.env.LIVEKIT_API_SECRET!,
    { identity: body.participant_identity || "user" },
  );
  at.addGrant({ roomJoin: true, room: roomName });

  return NextResponse.json({
    server_url: process.env.LIVEKIT_URL,
    participant_token: await at.toJwt(),
  });
}
