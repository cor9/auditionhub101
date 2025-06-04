import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type { AuditionData, AuditionType, AuditionStatus } from "@/types";

// Email parsing patterns
const patterns = {
  projectTitle: /Project:\s*(.+?)(?:\n|$)/i,
  roleName: /Role:\s*(.+?)(?:\n|$)/i,
  type: /Type:\s*(TV|FILM|COMMERCIAL|THEATRE|VOICEOVER)(?:\n|$)/i,
  auditionDate: /Date:\s*(.+?)(?:\n|$)/i,
  location: /Location:\s*(.+?)(?:\n|$)/i,
  castingCompany: /Casting Company:\s*(.+?)(?:\n|$)/i,
  castingDirector: /Casting Director:\s*(.+?)(?:\n|$)/i,
};

function parseAuditionFromEmail(emailBody: string): Partial<AuditionData> {
  const audition: Partial<AuditionData> = {
    status: "PENDING" as AuditionStatus,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // Extract information using patterns
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = emailBody.match(pattern);
    if (match && match[1]) {
      if (key === 'auditionDate') {
        audition[key] = new Date(match[1]);
      } else if (key === 'type') {
        audition[key] = match[1] as AuditionType;
      } else {
        audition[key] = match[1].trim();
      }
    }
  }

  return audition;
}

export async function POST(req: Request) {
  try {
    // Verify webhook signature (implement based on your email service)
    const signature = headers().get("X-Email-Signature");
    
    // Parse email data
    const emailData = await req.json();
    const { from, subject, text, html } = emailData;

    // Create email log
    const emailLog = {
      sender: from,
      subject,
      receivedAt: new Date(),
      parsedContent: text || html,
      status: "PENDING",
    };

    // Parse audition details
    const auditionData = parseAuditionFromEmail(text || html);

    if (!auditionData.projectTitle || !auditionData.roleName) {
      return NextResponse.json(
        { error: "Could not parse required audition details" },
        { status: 400 }
      );
    }

    // TODO: Save to database once implemented
    console.log("Parsed Audition:", auditionData);
    console.log("Email Log:", emailLog);

    return NextResponse.json({ success: true, audition: auditionData });
  } catch (error) {
    console.error("Email webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process email" },
      { status: 500 }
    );
  }
}