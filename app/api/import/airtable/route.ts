import { NextResponse } from "next/server";
import Airtable from "airtable";
import type { AuditionData, AuditionType, AuditionStatus } from "@/types";

export async function POST(req: Request) {
  try {
    const { apiKey, baseId, tableName } = await req.json();

    const base = new Airtable({ apiKey }).base(baseId);

    const records = await base(tableName).select().all();
    
    const auditions: Partial<AuditionData>[] = records.map(record => ({
      projectTitle: record.get("Project Title") as string,
      roleName: record.get("Role") as string,
      type: mapAuditionType(record.get("Type") as string),
      status: mapAuditionStatus(record.get("Status") as string),
      auditionDate: record.get("Date") ? new Date(record.get("Date") as string) : undefined,
      location: record.get("Location") as string,
      castingCompany: record.get("Casting Company") as string,
      castingDirector: record.get("Casting Director") as string,
      notes: record.get("Notes") as string,
    }));

    // Here you would typically save these to your database
    console.log("Imported auditions:", auditions);

    return NextResponse.json({ success: true, count: auditions.length });
  } catch (error) {
    console.error("Airtable import error:", error);
    return NextResponse.json(
      { error: "Failed to import from Airtable" },
      { status: 500 }
    );
  }
}

function mapAuditionType(type: string): AuditionType {
  const typeMap: Record<string, AuditionType> = {
    "TV": "TV",
    "Film": "FILM",
    "Commercial": "COMMERCIAL",
    "Theatre": "THEATRE",
    "Voice Over": "VOICEOVER",
  };
  return typeMap[type] || "OTHER";
}

function mapAuditionStatus(status: string): AuditionStatus {
  const statusMap: Record<string, AuditionStatus> = {
    "Pending": "PENDING",
    "Submitted": "SUBMITTED",
    "Callback": "CALLBACK",
    "Booked": "BOOKED",
    "Released": "RELEASED",
  };
  return statusMap[status] || "PENDING";
}