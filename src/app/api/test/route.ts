import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const testPost = await prisma.post.findFirst();
    return new Response(JSON.stringify({ success: true, data: testPost }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof Error) {
      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    return new Response(
      JSON.stringify({ success: false, error: "Unknown error occurred" }),
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
