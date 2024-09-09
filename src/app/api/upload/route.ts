import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { File } from '@/model/file';
import { dbconnect } from '@/dbconfig/db';

dbconnect();

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('uploadfile') as File | null;
    let filename = '';

    if (file) {
      const uploadsDir = path.join(process.cwd(), 'public', 'upload');
      await mkdir(uploadsDir, { recursive: true });

      filename = file.name;
      const uploadPath = path.join(uploadsDir, filename);

      const bufferData = await file.arrayBuffer();
      const buffer = Buffer.from(bufferData);

      console.log("Saving file to:", uploadPath);
      await writeFile(uploadPath, buffer);
    }

    const Documenttype = formData.get('Documenttype') as string;
    const Name = formData.get('Name') as string;
    const startdate = formData.get('startdate') as string;
    const enddate = formData.get('enddate') as string;

    // Check if a file with the same Name already exists
    const existfile = await File.findOne({ Name });

    if (existfile) {
      return NextResponse.json({
        message: "File already exists",
        ok: false,
        fileLink:existfile.uploadfile
      });
    }

    // If no existing file is found, create a new one
    const newfile = new File({
      Documenttype,
      Name,
      startdate: startdate ? new Date(startdate) : undefined,
      enddate: enddate ? new Date(enddate) : undefined,
      uploadfile: `/upload/${filename}`,
      hash: "",  // Initialize the hash value as an empty string
    });

    await newfile.save();  // Save the new document to the database

    return NextResponse.json({
      message: "File added successfully",
      fileLink: `/upload/${filename}`,
      ok: true,
    });
  } catch (error) {
    console.error("Error adding file:", error);
    return NextResponse.json({
      message: "Failed to add file",
      ok: false,
      error: error.message,
    });
  }
}
