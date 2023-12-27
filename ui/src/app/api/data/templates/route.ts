import products from "@/data/products";
import templates from "@/data/templates";

export async function POST(req: any, res: any) {
  const { pid, vid } = await req.json();

  const product = Object.values(products).find(
    (product) => product.product.id === pid
  );
  const variant = product?.variants.find((variant) => variant.id === vid);
  const varID = variant?.id;

  const selectedVariant = Object.values(templates)
    .flatMap((template) => template.template.variant_mapping)
    .filter((variant) => variant.variant_id === varID)
    .flatMap((variant) => variant.templates);

  const selectedTemplate = selectedVariant
    .map((selected) => {
      const template = Object.values(templates).find((t) =>
        t.template.templates.some((t) => t.template_id === selected.template_id)
      );

      const id = template?.template.templates.find(
        (t) => t.template_id === selected.template_id
      );

      const printFiles = template?.printFiles.printfiles.find(
        (file) => file.printfile_id === id?.printfile_id
      );

      return { id, printFiles };
    })
    .find((template) => template !== undefined);

  if (!product || !variant) {
    return new Response(JSON.stringify({ error: "Invalid product" }), {
      status: 404,
    });
  }

  if (!selectedTemplate) {
    return new Response(JSON.stringify({ error: "Invalid template" }), {
      status: 404,
    });
  }

  return new Response(
    JSON.stringify({
      product,
      variant,
      template: selectedTemplate.id,
      printFiles: selectedTemplate.printFiles,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}
