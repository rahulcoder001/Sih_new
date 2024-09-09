import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken'; // Use your preferred JWT library

export async function GET(req:NextRequest) {
  try {
    const token = req.cookies.get('token')?.value||"";

    // Verify token
    const decoded = jwt.verify(token, "fghjkjhgfghjk");
    const superuser = decoded.superuser;

    return NextResponse.json({ superuser:superuser });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}
