import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";
import { supabase } from "@/db/supabase";

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

  const getFilenameFromUrl = (url: string) => {
    return url.substring(url.lastIndexOf("/") + 1);
  };

  try {
    const file = await supabase.storage
      .from("soft-products")
      .download(`${getFilenameFromUrl(data.product.filePath)}`);

    if (!file || file.error || !file.data) {
      return NextResponse.error();
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
    return NextResponse.error();
  }
}
