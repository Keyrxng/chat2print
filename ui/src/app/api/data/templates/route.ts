import templates from "@/data/templates";

export async function POST(req: any, res: any) {
  const product = await req.text();

  async function getTemplate(product: any) {
    const template = Object.values(templates).map((template) => {
      if (template.name === product) {
        return template;
      }
    });

    return template.filter((item) => item !== undefined)[0];
  }

  const selectedTemplate = await getTemplate(product);

  return new Response(JSON.stringify({ data: selectedTemplate }), {
    headers: { "Content-Type": "application/json" },
  });
}
