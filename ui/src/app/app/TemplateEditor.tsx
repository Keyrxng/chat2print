import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import {
  __Prod,
  __Temp,
  __Template,
  __Variant,
  __PrintFiles,
  __VariantMapping,
} from "@/types/all";
import { Button } from "@/components/ui/button";
import PODHandler from "@/classes/PODHandler";
import templates from "@/data/templates";

interface ImagePlacementEditorProps {
  selectedTemplate: __Template | undefined;
  selectedVariant: __Variant | undefined;
  selectedProduct: __Prod | undefined;
  userImage: string;
}

const ImagePlacementEditor: React.FC<ImagePlacementEditorProps> = ({
  selectedTemplate,
  selectedVariant,
  selectedProduct,
  userImage,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0, scale: 1 });
  const [imageSrc, setImageSrc] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);
  const [viewSwitch, setViewSwitch] = useState<HTMLButtonElement | null>(null);
  const [transform, setTransform] = useState({
    scale: 1,
    positionX: 0,
    positionY: 0,
  });
  let observerRef = useRef<MutationObserver | null>(null);

  useEffect(() => {
    const viewSw = document.getElementById("view-switch");
    setViewSwitch(viewSw as HTMLButtonElement);

    if (viewSwitch) {
      observerRef.current = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.attributeName === "data-state") {
            const newState = (mutation.target as HTMLElement).getAttribute(
              "data-state"
            );
            console.log(newState);
            if (newState === "unchecked") {
              setImageSrc(
                (prev) =>
                  (prev =
                    selectedTemplate?.background_url ??
                    selectedTemplate?.image_url ??
                    "")
              );
            } else {
              setImageSrc(
                (prev) =>
                  (prev =
                    selectedTemplate?.image_url ??
                    selectedTemplate?.background_url ??
                    "")
              );
            }
          }
        });
      });
      observerRef.current.observe(viewSwitch, { attributes: true });
    }
  }, [
    imageSrc,
    selectedTemplate?.background_url,
    selectedTemplate?.image_url,
    viewSwitch,
  ]);

  useEffect(() => {
    const initialPosition = {
      x: selectedTemplate?.print_area_left ?? 100,
      y: selectedTemplate?.print_area_top ?? 100,
      scale: 1,
    };
    setPosition(initialPosition);
    setImageSrc(
      selectedTemplate?.background_url ?? selectedTemplate?.image_url ?? ""
    );
  }, [selectedTemplate, userImage]);

  const handleDrag = (event: React.DragEvent) => {
    setPosition({
      x: event.clientX - editorRef.current?.offsetLeft!,
      y: event.clientY - editorRef.current?.offsetTop!,
      scale: 1,
    });
  };

  const onTransformChange = (
    zoomScale: number,
    positionX: number,
    positionY: number
  ) => {
    console.log(
      `zoomScale: ${zoomScale}, positionX: ${positionX}, positionY: ${positionY}`
    );
    setTransform({
      scale: zoomScale,
      positionX: positionX,
      positionY: positionY,
    });
  };

  const handleCreateMockup = async () => {
    const scaledWidth = selectedTemplate?.print_area_width! * transform.scale;
    const scaledHeight = selectedTemplate?.print_area_height! * transform.scale;
    const offsetX = transform.positionX;
    const offsetY = transform.positionY;
    const selectTemplateId = selectedTemplate?.template_id;
    const imageUrl = userImage;
    const varMap = Object.values(templates).flatMap((template) => template);

    const t = varMap.filter(({ template }) =>
      template.templates.find((t) => t.template_id === selectTemplateId)
    );

    console.log("selectTemplateId: ", selectTemplateId);
    console.log("selectedVarMap: ", t);
    const preffixedImageUrl =
      "https://ywaeexoevxxjquwlhfjx.supabase.co/storage/v1/object/public/no_reg_designs/" +
      imageUrl.split("/").pop();

    const prodID = selectedVariant?.product_id;
    const variantID = selectedVariant?.id;
    console.log("slected variant: ", selectedVariant);
    if (!prodID || !variantID) {
      return;
    }

    const res = await fetch("/api/pod/", {
      method: "POST",
      body: JSON.stringify({
        productId: prodID,
        imageUrl: preffixedImageUrl,
        variantIDs: [variantID],
        scaledWidth,
        scaledHeight,
        offsetX,
        offsetY,
      }),
    });
    console.log(imageUrl);

    console.log("client response: ", await res.json());
  };

  return (
    <>
      <TransformWrapper
        initialScale={position.scale}
        initialPositionX={-position.x}
        initialPositionY={-position.y}
        centerOnInit={true}
        limitToBounds={false}
        maxPositionX={Infinity}
        maxPositionY={Infinity}
        minPositionX={-Infinity}
        minPositionY={-Infinity}
        onZoom={({ state }) =>
          onTransformChange(state.scale, state.positionX, state.positionY)
        }
        onPanning={({ state }) =>
          onTransformChange(state.scale, state.positionX, state.positionY)
        }
        onPinching={({ state }) =>
          onTransformChange(state.scale, state.positionX, state.positionY)
        }
        onZoomStop={({ state }) =>
          onTransformChange(state.scale, state.positionX, state.positionY)
        }
        onPanningStop={({ state }) =>
          onTransformChange(state.scale, state.positionX, state.positionY)
        }
      >
        <div
          className="relative bg-center bg-no-repeat bg-cover h-[650px] w-[650px] fill"
          style={{ backgroundImage: `url(${imageSrc})` }}
          ref={editorRef}
        >
          <TransformComponent wrapperClass="relative h-auto w-auto fill">
            <div className="relative w-[650px] h-[650px]">
              <Image
                onDrag={handleDrag}
                alt="user image"
                width={1024}
                height={1024}
                src={userImage}
                className="z-10"
                style={{
                  maxWidth: "100%",
                  width: "15%",
                  height: "15%",
                }}
              />
            </div>
          </TransformComponent>
        </div>
      </TransformWrapper>
      <Button
        onClick={() => handleCreateMockup()}
        className="w-full text-accent bg-background border-2 hover:bg-accent hover:text-background"
      >
        Generate Mockup
      </Button>
    </>
  );
};

export default ImagePlacementEditor;
