import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req) {
  try {
    const data = await req.formData();
    const file = data.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file into a buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the image temporarily
    const tempPath = path.join(process.cwd(), "public", file.name);
    await writeFile(tempPath, buffer);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(tempPath, {
      folder: "profile_pictures", // Change folder as needed
    });

    // console.log("Cloudinary Upload Result:", result); // Log result

    return NextResponse.json({ url: result.secure_url }, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
