
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { __Temp, __Template, __VariantMapping } from '@/types/all';

interface ImagePlacementEditorProps {
  selectedTemplate: __Template | undefined;
  userImage: string;
}

const ImagePlacementEditor: React.FC<ImagePlacementEditorProps> = ({ selectedTemplate, userImage }) => {
  const [position, setPosition] = useState({ x: 0, y: 0, scale: 1 });
  const [size, setSize] = useState({ width: selectedTemplate?.template_width, height: selectedTemplate?.template_height });
  const [imageSrc, setImageSrc] = useState<string>("");
  const [templateImg, setTemplateImg] = useState<string>("");
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initialPosition = {
      x: selectedTemplate?.print_area_left ?? 100,
      y: selectedTemplate?.print_area_top ?? 100,
      scale: 1
    };
    const initialSize = {
      width: selectedTemplate?.print_area_width ?? 700,
      height: selectedTemplate?.print_area_height ?? 700,
    };
    setPosition(initialPosition);
    setSize(initialSize);
    setTemplateImg(selectedTemplate?.background_url ?? selectedTemplate?.image_url ?? "");
    setImageSrc(userImage);
  }, [selectedTemplate, userImage]);

  const handleDrag = (event: React.DragEvent) => {
    setPosition({
      x: event.clientX - editorRef.current?.offsetLeft!,
      y: event.clientY - editorRef.current?.offsetTop!,
      scale: 1
    });
  };

  return (
    <div className="relative bg-center bg-no-repeat bg-cover h-[650px] w-[650px] fill"
      style={{ backgroundImage: `url(${templateImg})` }}
      ref={editorRef}
    >
      <TransformWrapper
        initialScale={position.scale}
        initialPositionX={position.x}
        initialPositionY={position.y}
        centerOnInit={true}
        limitToBounds={false}
        maxPositionX={Infinity}
        maxPositionY={Infinity}
        minPositionX={-Infinity}
        minPositionY={-Infinity} >

        <div className="-z-1 relative bg-center bg-no-repeat bg-cover w-full h-full">
          <TransformComponent contentClass='w-[600px] h-[600px]' wrapperClass='w-[600px] h-[600px]'>
            <div className="w-[1200px] h-[1200px]">
              <div className='w-[100px] h-[100px]'>
                <Image onDrag={handleDrag} alt="fuck off" width={1024} height={1024} src={userImage}
                  className="z-10" />
              </div>
            </div>
          </TransformComponent>
        </div>
      </TransformWrapper>
    </div>
  );
};

export default ImagePlacementEditor;