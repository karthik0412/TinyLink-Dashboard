import prisma from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import CopyLinkButton from "@/components/CopyLinkButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_BASE_URL) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

async function resolveParams(params) {
  if (typeof params?.then === "function") {
    return await params;
  }
  return params;
}

export default async function StatsPage({ params }) {
  const resolvedParams = await resolveParams(params);
  const code = resolvedParams?.code;

  if (!code) {
    notFound();
  }

  const link = await prisma.link.findUnique({
    where: { code },
  });

  if (!link) {
    notFound();
  }

  const shortUrl = `${getBaseUrl()}/${code}`;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-gray-900 tracking-tight">
          Link Analytics
        </h1>

        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-sm border mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Short Link
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-gray-100 px-4 py-3 rounded-xl">
            <span className="font-medium text-gray-800 break-words">
              {shortUrl}
            </span>
            <CopyLinkButton shortUrl={shortUrl} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
            <h3 className="text-gray-600 text-sm mb-2">Total Clicks</h3>
            <p className="text-4xl font-bold text-blue-600">{link.clicks}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border text-center">
            <h3 className="text-gray-600 text-sm mb-2">Created On</h3>
            <p className="text-lg font-medium text-gray-800">
              {new Date(link.created_at).toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border text-center sm:col-span-2">
            <h3 className="text-gray-600 text-sm mb-2">Last Clicked</h3>
            <p className="text-lg font-medium text-gray-800">
              {link.last_clicked
                ? new Date(link.last_clicked).toLocaleString()
                : "Never clicked yet"}
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-block w-full sm:w-auto text-center px-6 py-3 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

