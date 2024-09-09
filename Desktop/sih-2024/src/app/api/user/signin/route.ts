import { dbconnect } from "@/dbconfig/db";
import { User } from "@/model/file";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

dbconnect();

export async function POST(req: NextRequest) {
    try {
        const { username, password } = await req.json();

        // Find user in the database
        const existingUser = await User.findOne({ email: username });
        if (!existingUser) {
            return NextResponse.json({ msg: "User does not exist", ok: false }, { status: 404 });
        }

        // Check if password matches
        if (existingUser.password !== password) {
            return NextResponse.json({ msg: "Incorrect password", ok: false }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { superuser: existingUser.superuser }, 
            "fghjkjhgfghjk", // Ideally, use a strong secret key from environment variables
            { expiresIn: '1d' } // Token expires in 1 day
        );

        // Set the JWT token in cookies
        const res = NextResponse.json({ msg: 'User login', ok: true });
        res.cookies.set('token', token, {
            httpOnly: true, // Prevent access to the cookie from JavaScript
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 24 * 60 * 60, // 1 day in seconds
            path: '/', // Cookie is accessible throughout the site
        });

        return res;
    } catch (error) {
        return NextResponse.json({ msg: "Server error", ok: false, error: error.message }, { status: 500 });
    }
}
