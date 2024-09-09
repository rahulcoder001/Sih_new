import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

export async function POST(req: NextRequest) {
  try {
    // Extract the file link from the request body
    const { fileLink } = await req.json();

    // Construct the file path to the image
    const filePath = path.join(process.cwd(), 'public', fileLink);

    // Verify the file exists before processing
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Run the Python script
    return new Promise<NextResponse>((resolve) => {
      exec(`python process_image.py "${filePath}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          resolve(NextResponse.json({ error: 'Failed to process image' }, { status: 500 }));
        } else if (stderr) {
          console.error(`stderr: ${stderr}`);
          resolve(NextResponse.json({ error: 'Error processing image' }, { status: 500 }));
        } else {
          // Clean up the temp image file
          try {
            fs.unlinkSync(filePath);
          } catch (cleanupError) {
            console.error(`Cleanup error: ${cleanupError.message}`);
            // Handle cleanup error if necessary
          }

          // Send the output from the Python script as the response
          resolve(NextResponse.json({ data: stdout.trim() }));
        }
      });
    });

  } catch (error) {
    console.error("Error extracting data:", error);
    return NextResponse.json({
      message: "Failed to extract data",
      ok: false,
      error: error.message,
    }, { status: 500 });
  }
}
