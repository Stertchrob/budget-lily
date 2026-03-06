import { promises as fs } from "fs";
import path from "path";

export async function GET() {
  try {
    const logoPath = path.join(process.cwd(), "..", "budget-lily.png");
    const file = await fs.readFile(logoPath);
    return new Response(file, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=604800",
      },
    });
  } catch {
    return new Response("Logo not found", { status: 404 });
  }
}
