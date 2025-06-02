import { NextResponse } from "next/server";
import { google } from "googleapis";
import type { AuditionData, AuditionType, AuditionStatus } from "@/types";

export async function POST(req: Request) {
  try {
    const { spreadsheetId, range } = await req.json();

    // Initialize the Sheets API (you'll need to set up OAuth2 or service account credentials)
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      throw new Error("No data found in spreadsheet");
    }

    // Assuming first row contains headers
    const headers = rows[0];
    const auditions: Partial<AuditionData>[] = rows.slice(1).map(row => {
      const audition: Partial<AuditionData> = {};
      headers.forEach((header: string, index: number) => {
        const value = row[index];
        switch (header.toLowerCase()) {
          case "project title":
            audition.projectTitle = value;
            break;
          case "role":
            audition.roleName = value;
            break;
          case "type":
            audition.type = mapAuditionType(value);
            break;
          case "status":
            audition.status = mapAuditionStatus(value);
            break;
          case "date":
            audition.auditionDate = value ? new Date(value) : undefined;
            break;
          case "location":
            audition.location = value;
            break;
          case "casting company":
            audition.castingCompany = value;
            break;
          case "casting director":
            audition.castingDirector = value;
            break;
          case "notes":
            audition.notes = value;
            break;
        }
      });
      return audition;
    });

    // Here you would typically save these to your database
    console.log("Imported auditions:", auditions);

    return NextResponse.json({ success: true, count: auditions.length });
  } catch (error) {
    console.error("Google Sheets import error:", error);
    return NextResponse.json(
      { error: "Failed to import from Google Sheets" },
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