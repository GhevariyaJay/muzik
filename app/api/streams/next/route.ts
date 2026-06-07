import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prismaClient } from "../../../lib/db";

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
        // Find the most upvoted stream that hasn't been played
        const nextStream = await prismaClient.stream.findFirst({
            where: {
                userId: user.id,
                played: false
            },
            include: {
                _count: {
                    select: {
                        upvotes: true,
                        downvotes: true
                    }
                }
            },
            orderBy: [
                {
                    upvotes: {
                        _count: 'desc'
                    }
                }
            ]
        });

        if (!nextStream) {
            return NextResponse.json({ message: "No more streams in queue" });
        }

        // Mark it as played
        await prismaClient.stream.update({
            where: { id: nextStream.id },
            data: {
                played: true,
                playedAt: new Date()
            }
        });

        return NextResponse.json({ message: "Advanced to next stream", stream: nextStream });
    } catch (error) {
        console.error("Next Stream Error:", error);
        return NextResponse.json({ message: "Error advancing to next stream" }, { status: 500 });
    }
}
