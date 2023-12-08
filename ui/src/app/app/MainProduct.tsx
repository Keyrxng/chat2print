import { __Prod, __Template, __Variant } from "@/types/all";
import ImagePlacementEditor from "./TemplateEditor";
import templates from "@/data/templates";

interface MainProductProps {
  image: string;
  product: __Prod | undefined;
  variant: __Variant | undefined;
}

export const MainProduct = ({ image, product, variant }: MainProductProps) => {
  const varID = variant?.id;
  const selectedVariant = Object.values(templates)
    .flatMap((template) => template.template.variant_mapping)
    .filter((variant) => variant.variant_id === varID)
    .flatMap((variant) => variant.templates);

  const selectedTemps = Object.values(templates).find((template) => 
    template.template.templates.some((t) => 
      selectedVariant.some((selected) => selected.template_id === t.template_id)
    )
  );

  const selectedTemplate = selectedTemps?.template.templates.find((template) => 
    selectedVariant.some((selected) => selected.template_id === template.template_id)
  );

  return (
    <div className="rounded-lg max-w-3xl overflow-hidden justify-center text-center align-middle shadow-2xl transition-shadow duration-300 ">
      <ImagePlacementEditor selectedTemplate={selectedTemplate} userImage={image} />
    </div>
  );
};

