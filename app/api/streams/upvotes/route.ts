import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prismaClient } from "../../../lib/db";
import { z } from "zod";

const UpvoteSchema = z.object({
    streamId: z.string()
});

export async function POST(req: NextRequest) {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prismaClient.user.findFirst({
        where: { email: session.user.email }
    });

    if (!user) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    try {
        const data = await req.json();
        console.log("Upvote Request Data:", data);
        
        const { streamId } = UpvoteSchema.parse(data);

        // Use a transaction to ensure atomic operations
        await prismaClient.$transaction([
            // Delete any existing downvote by this user for this stream
            prismaClient.downvote.deleteMany({
                where: { userId: user.id, streamId }
            }),
            // Use upsert to avoid duplicate key errors if upvote already exists
            prismaClient.upvote.upsert({
                where: {
                    userId_streamId: {
                        userId: user.id,
                        streamId
                    }
                },
                update: {}, // Do nothing if it exists
                create: {
                    userId: user.id,
                    streamId
                }
            })
        ]);

        return NextResponse.json({ message: "Upvoted successfully" });
    } catch (error) {
        console.error("Upvote Error:", error);
        return NextResponse.json({ 
            message: "Error while upvoting",
            details: error instanceof Error ? error.message : "Unknown error" 
        }, { status: 403 });
    }
}