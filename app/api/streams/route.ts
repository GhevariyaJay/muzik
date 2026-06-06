import {z} from "zod";
import {NextRequest, NextResponse} from "next/server";
import {prismaClient} from "../../lib/db";



// match https://www.youtube.com/watch?v=XXXXXXXXXXX
const YT_REGEX = /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/;

const CreateStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string()
});

export async function POST(req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());
        const isYT = YT_REGEX.test(data.url);
        if (!isYT) {
            return NextResponse.json({ message: "Invalid URL" }, { status: 411 });
        }

        const extractedId = data.url.split("?v=")[1];

        
       
        
        
        const stream = await prismaClient.stream.create({
            data: {
                userId: data.creatorId,
                url: data.url,
                extractedId,
                type: "Youtube"

            }
        });

        return NextResponse.json({ message: "Created" ,
            id: stream.id
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: "Error while adding" }, { status: 411 });
    }
}

export async function GET(req: NextRequest) {
    const creatorId = req.nextUrl.searchParams.get("creatorId");
    const streams = await prismaClient.stream.findMany({
        where: {
            userId: creatorId ?? ""
        }
    });

    return NextResponse.json({ streams });
}