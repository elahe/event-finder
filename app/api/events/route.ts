import  Event  from "@/database/event.model";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest ) {
   try{
        await connectToDatabase();

        const formData = await req.formData()

        let event

        try{
            event = Object.fromEntries(formData.entries())
        }catch(e){
            return NextResponse.json({message:"invalid json data format"}, {status: 400})
        }

        const createdEvent= await Event.create(event)

        return NextResponse.json({message:"event created succesfully", event:createdEvent}, {status:201})
   }catch(e){
    console.error(e)
    return NextResponse.json({message:"event creation faild", error: e instanceof Error ? e.message :"unknown"},{status: 500})
   }
}
