import { NextResponse } from "next/server";
import { commentSchema, generateComments } from "@/lib/commentGenerator";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const params = commentSchema.parse(payload);
    const comments = generateComments(params);

    return NextResponse.json({ comments });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Invalid request",
          details: error.message
        },
        {
          status: 400
        }
      );
    }

    return NextResponse.json(
      { error: "Unknown error" },
      {
        status: 500
      }
    );
  }
}
