import { NextRequest, NextResponse } from "next/server";
import db from "@/db/db";
import { notFound } from "next/navigation";
import { supabase } from "@/db/supabase";
import { getFilenameFromUrl } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params: { id } }: { params: { id: string } },
) {
  const product = await db.product.findUnique({
    where: { id },
    select: { filePath: true, name: true },
  });

  if (product == null) return notFound();

  try {
    const file = await supabase.storage
      .from("soft-products")
      .download(`${getFilenameFromUrl(product.filePath)}`);

    if (!file || file.error || !file.data) {
      return notFound();
    }

    const extension = product.filePath.split(".").pop();

    // Convert Blob to Uint8Array
    const fileData = new Uint8Array(await file.data.arrayBuffer());

    // Calculate content length
    const contentLength = fileData.byteLength;

    return new NextResponse(fileData, {
      headers: {
        "Content-Disposition": `attachment; filename="${product.name}.${extension}"`,
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
