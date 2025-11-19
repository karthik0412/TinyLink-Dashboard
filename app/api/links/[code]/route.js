import prisma from "@/lib/db";

function jsonResponse(body, init = {}) {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
}

function extractCode(request, context) {
  if (context?.params?.code) {
    return context.params.code;
  }

  try {
    const url = new URL(request.url);
    const segments = url.pathname.split("/").filter(Boolean);
    return segments.pop();
  } catch (err) {
    console.error("Failed to parse request URL for code:", err);
    return undefined;
  }
}

export async function GET(req, context) {
  try {
    const code = extractCode(req, context);

    if (!code) {
      return jsonResponse({ error: "Missing short code" }, { status: 400 });
    }

    const link = await prisma.link.findUnique({
      where: { code },
    });

    if (!link) {
      return jsonResponse({ error: "Not found" }, { status: 404 });
    }

    return jsonResponse(link, { status: 200 });
  } catch (error) {
    console.error("GET /api/links/[code] failed:", error);
    return jsonResponse({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const code = extractCode(req, context);

    if (!code) {
      return jsonResponse({ error: "Missing short code" }, { status: 400 });
    }

    const exists = await prisma.link.findUnique({
      where: { code },
    });

    if (!exists) {
      return jsonResponse({ error: "Not found" }, { status: 404 });
    }

    await prisma.link.delete({
      where: { code },
    });

    return jsonResponse({ success: true }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/links/[code] failed:", error);
    return jsonResponse({ error: "Server error" }, { status: 500 });
  }
}
