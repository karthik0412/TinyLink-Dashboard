import prisma from "@/lib/db";



export async function POST(req) {
  try {
    const { target_url, code } = await req.json();

    // Validate input
    if (!target_url || !target_url.startsWith("http")) {
      return new Response(JSON.stringify({ error: "Invalid URL" }), { status: 400 });
    }

    // Check duplicate short code
    const existing = await prisma.link.findUnique({
      where: { code },
    });

    if (existing) {
      return new Response(JSON.stringify({ error: "Code already exists" }), {
        status: 409,
      });
    }

    // Create link
    const newLink = await prisma.link.create({
      data: {
        code,
        target_url,
      },
    });

    return new Response(JSON.stringify(newLink), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { created_at: "desc" },
    });

    return new Response(JSON.stringify(links), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500 });
  }
}
