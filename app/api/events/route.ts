import  Event  from "@/database/event.model";
import { connectToDatabase } from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const formData = await req.formData();
    const event = Object.fromEntries(formData.entries());

    const createdEvent = await Event.create(event);

    return NextResponse.json(
      {
        message: "event created successfully",
        event: createdEvent,
      },
      { status: 201 }
    );
  } catch (e) {
    return NextResponse.json(
      {
        message: "event creation failed",
        error: e instanceof Error ? e.message : "unknown",
      },
      { status: 500 }
    );
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     await connectToDatabase();

//     const event = await req.json();

//     const createdEvent = await Event.create(event);

//     return NextResponse.json(
//       {
//         message: "event created successfully",
//         event: createdEvent,
//       },
//       { status: 201 }
//     );
//   } catch (e) {
//     return NextResponse.json(
//       {
//         message: "event creation failed",
//         error: e instanceof Error ? e.message : "unknown",
//       },
//       { status: 500 }
//     );
//   }
// }