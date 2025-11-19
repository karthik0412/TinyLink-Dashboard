import prisma from "@/lib/db";
import { NextResponse } from "next/server";

function extractCode(request, context) {
  if (context?.params?.code) {
    return context.params.code;
  }

  try {
    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);
    return segments.pop();
  } catch (err) {
    console.error("Failed to parse short code from request URL:", err);
    return undefined;
  }
}

export async function GET(req, context) {
  try {
    const code = extractCode(req, context);

    if (!code) {
      return NextResponse.json(
        { error: "Missing short code" },
        { status: 400 }
      );
    }

    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Short code not found" },
        { status: 404 }
      );
    }

    await prisma.link.update({
      where: { code },
      data: {
        clicks: link.clicks + 1,
        last_clicked: new Date(),
      },
    });

    return NextResponse.redirect(link.target_url, { status: 302 });
  } catch (error) {
    console.error("GET /[code] redirect failed:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
