import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "../../../lib/db";
import { getServerSession } from "next-auth/next";

export async function GET(req: NextRequest) {
    const session = await getServerSession();
    
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? ""
        }
    });

    if(!user){
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    try {
        const streams = await prismaClient.stream.findMany({
            where: {
                userId: user.id ?? ""
            },
            include: {
                _count: {
                    select: {
                        upvotes: true,
                        downvotes: true
                    }
                },
                upvotes: {
                    where: {
                        userId: user.id
                    }
                },
                downvotes: {
                    where: {
                        userId: user.id
                    }
                }
            }
        });

        return NextResponse.json({
            streams: streams.map(({ _count, ...res }) => ({
                ...res,
                votes: _count.upvotes - _count.downvotes,
                haveUpvoted: res.upvotes.length > 0,
                haveDownvoted: res.downvotes.length > 0
            }))
        });
    } catch (e) {
        console.error("API Error:", e);
        return NextResponse.json({ error: "Internal Server Error", details: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
    }
}