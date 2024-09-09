import { dbconnect } from "@/dbconfig/db";
import { File } from "@/model/file";  // Ensure this model contains the 'Name' and 'hash' fields
import { NextRequest, NextResponse } from "next/server";

dbconnect();

export async function POST(req: NextRequest) {
  try {
    // Parse the request body to get the hash and name
    const { hash, name } = await req.json();

    // Find the file by the 'Name' field
    const file = await File.findOne({ Name: name });

    // If the file is not found, return a 404 response
    if (!file) {
      console.log("File not found");
      return NextResponse.json({ message: "File not found" }, { status: 404 });
    }

    // Compare the stored hash with the provided hash
    if (file.hash !== hash) {
      return NextResponse.json({ message: "Verification unsuccessful" }, { status: 400 });
    }

    // If hash matches, return success response
    return NextResponse.json({ message: "Verification successful" });

  } catch (error) {
    // Log and return error response in case of any issues
    console.error("Error verifying file:", error);
    return NextResponse.json({
      message: "Failed to verify file",
      error: error.message,
    }, { status: 500 });
  }
}
