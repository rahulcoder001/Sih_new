import { NextResponse } from "next/server";


export async function GET(){
    try {
        const res= NextResponse.json({msg:"logout successfully",ok:true})
        res.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0),
          });
        return res;
    } catch (error) {
        return NextResponse.json({msg:"logout failed",ok:false})
    }
}