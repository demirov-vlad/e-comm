import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";
import { supabase } from "@/db/supabase";
import { notFound } from "next/navigation";
import { getFilenameFromUrl } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } },
) {
  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select: { product: { select: { filePath: true, name: true } } },
  });

  if (data == null) {
    return NextResponse.redirect(
      new URL("/products/download/expired", request.url),
    );
  }

  try {
    const file = await supabase.storage
      .from("soft-products")
      .download(`${getFilenameFromUrl(data.product.filePath)}`);

    if (!file || file.error || !file.data) {
      return notFound();
    }

    const extension = data.product.filePath.split(".").pop();

    // Convert Blob to Uint8Array
    const fileData = new Uint8Array(await file.data.arrayBuffer());

    // Calculate content length
    const contentLength = fileData.byteLength;

    return new NextResponse(fileData, {
      headers: {
        "Content-Disposition": `attachment; filename="${data.product.name}.${extension}"`,
        "Content-Length": contentLength.toString(),
      },
    });
  } catch (error) {
    console.error("Error downloading file:", error);
    return NextResponse.json(
      { error: "Error downloading file" },
      { status: 500 },
    );
  }
}
