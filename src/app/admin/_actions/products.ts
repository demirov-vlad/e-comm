"use server";

import { z } from "zod";
import db from "@/db/db";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { supabase } from "@/db/supabase";
import { getFilenameFromUrl } from "@/lib/utils";

const fileSchema = z.instanceof(File, { message: "Required" });
const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/"),
);

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileSchema.refine((file) => file.size > 0, "Required"),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const filePath = `${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL + "file" + data.file.name}`;
  await supabase.storage
    .from("soft-products")
    .upload(
      "file" + data.file.name,
      Buffer.from(await data.file.arrayBuffer()),
      {
        upsert: true,
      },
    );

  const imagePath = `${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL + "img" + data.image.name}`;
  await supabase.storage
    .from("soft-products")
    .upload(
      "img" + data.image.name,
      Buffer.from(await data.image.arrayBuffer()),
      {
        upsert: true,
      },
    );

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  });
  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData,
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!result.success) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const product = await db.product.findUnique({ where: { id } });
  if (product == null) return notFound();

  const fileToRemove = getFilenameFromUrl(product.filePath);
  let filePath = product.filePath;
  if (data.file != null && data.file.size > 0) {
    await supabase.storage.from("soft-products").remove([`${fileToRemove}`]);
    filePath = `${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL + "file" + data.file.name}`;
    await supabase.storage
      .from("soft-products")
      .upload(
        "file" + data.file.name,
        Buffer.from(await data.file.arrayBuffer()),
        {
          upsert: true,
        },
      );
  }

  const imageToRemove = getFilenameFromUrl(product.imagePath);
  let imagePath = product.imagePath;
  if (data.image != null && data.image.size > 0) {
    await supabase.storage.from("soft-products").remove([`${imageToRemove}`]);
    imagePath = `${process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL + "file" + data.image.name}`;
    await supabase.storage
      .from("soft-products")
      .upload(
        "file" + data.image.name,
        Buffer.from(await data.image.arrayBuffer()),
        {
          upsert: true,
        },
      );
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/products");
}

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean,
) {
  await db.product.update({ where: { id }, data: { isAvailableForPurchase } });

  revalidatePath("/");
  revalidatePath("/products");
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } });
  if (product == null) return notFound();

  const fileToRemove = getFilenameFromUrl(product.filePath);
  await supabase.storage.from("soft-products").remove([`${fileToRemove}`]);
  const imageToRemove = getFilenameFromUrl(product.imagePath);
  await supabase.storage.from("soft-products").remove([`${imageToRemove}`]);

  revalidatePath("/");
  revalidatePath("/products");
}
