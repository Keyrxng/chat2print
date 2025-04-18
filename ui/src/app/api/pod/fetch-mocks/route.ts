import { NextRequest } from "next/server";
import PODHandler from "../../../../classes/PODHandler";
const podHandler = new PODHandler();

export async function POST(req: NextRequest, res: NextRequest) {
  const args = JSON.parse(await req.text());
  const taskKey = args.taskKey;

  try {
    const response = await podHandler.getMockupTaskStatus(taskKey);
    return new Response(JSON.stringify(response), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify(err), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
