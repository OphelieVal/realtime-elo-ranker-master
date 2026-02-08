import { rankingEmitter } from "../lib/rankingEmitter";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
   start(controller) {
      // Listener STABLE (référence conservée)
      const listener = (event: unknown) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
        );
      };

      // Abonnement
      rankingEmitter.on("ranking", listener);

      // Cleanup
      req.signal.addEventListener("abort", () => {
        rankingEmitter.removeListener("ranking", listener);
        controller.close();
      });
    },
  });
}
