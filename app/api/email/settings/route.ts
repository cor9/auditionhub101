import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Fetch from database once implemented
    const settings = {
      enabled: true,
      forwardingAddress: `auditions-${user.id}@yourdomain.com`,
      filterRules: [
        { field: "from", contains: "@breakdownexpress.com" },
        { field: "from", contains: "@castingnetworks.com" },
        { field: "subject", contains: "audition" },
      ],
    };

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Email settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch email settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await req.json();

    // TODO: Save to database once implemented
    console.log("Updated email settings:", settings);

    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error("Email settings error:", error);
    return NextResponse.json(
      { error: "Failed to update email settings" },
      { status: 500 }
    );
  }
}