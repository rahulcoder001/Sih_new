import { dbconnect } from "@/dbconfig/db";
import { User } from "@/model/file";
import { NextRequest, NextResponse } from "next/server";



dbconnect();

export async function POST(req: NextRequest) {

    const { username , password } = await req.json();

    const existingUser = await User.findOne({ email:username });
    if(existingUser){
        return NextResponse.json({
            msg: "User already exists"
        })
    }

    const newUser = new User({
        email: username,
        password,
        superuser:false,
    });
    await newUser.save();
    return NextResponse.json({
        msg: "User created successfully"
    })

}