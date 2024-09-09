import { dbconnect } from "@/dbconfig/db";
import { File } from "@/model/file";
import { NextRequest, NextResponse } from "next/server";

dbconnect();

export async function PUT(req: NextRequest) {
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

    // Update the 'hash' field and save the document
    file.hash = hash;
    await file.save();  // Save the updated document to the database

    // Return the updated file as a response
    return NextResponse.json(file);
  } catch (error) {
    // Log and return error response in case of any issues
    console.error("Error updating file:", error);
    return NextResponse.json({
      message: "Failed to update file",
      error: error.message,
    }, { status: 500 });
  }
}
