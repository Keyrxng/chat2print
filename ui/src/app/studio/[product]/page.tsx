"use client";

import { Suspense, useEffect, useState } from "react";
import {
  __Prod,
  __Product,
  __ProductsList,
  __Variant,
  __ProductTemplate,
  __PrintFiles,
  __Temp,
  __Template,
} from "@/types/all";
import ImagePlacementEditor from "./TemplateEditor";
import Image from "next/image";
import DescAndGen from "@/components/BuiltinChat";
import { Database } from "@/lib/database.types";
import { useToast } from "@/components/ui/use-toast";
interface PFILE {
  printfile_id: number;
  width: number;
  height: number;
  dpi: number;
  fill_mode: string;
  can_rotate: boolean;
}
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
const supabase = createClientComponentClient<Database>();

export default function Page(params: { [x: string]: never }) {
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedProduct, setSelectedProduct] = useState<__Prod>();
  const [selectedVariant, setSelectedVariant] = useState<__Variant>();
  const [template, setTemplate] = useState<__Template>();
  const [viewingMock, setViewingMock] = useState<boolean>(false);
  const [printFiles, setPrintFiles] = useState<PFILE>();
  const [userDetails, setUserDetails] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pid = Number(urlParams.get("pid"));
    const vid = Number(urlParams.get("vid"));

    async function load() {
      const data = await fetch("/api/data/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pid, vid }),
      });

      const json = await data.json();
      console.log("json: ", json);

      setSelectedProduct(json.product);
      setSelectedVariant(json.variant);
      loadForEditor(json.template, json.printFiles);
    }

    async function getUser() {
      const { data } = await supabase.auth.getSession();
      const uID = data.session?.user.id;

      if (!uID) {
        toast({
          title: "Haven't signed up yet?",
          description: `Click "View Mockups" to get a feel for what's possible. If you like what you see, click "Profile" to sign up and start creating your own.`,
          duration: 10000,
        });

        return setUserDetails((prev: null) => (prev = null));
      }

      const { data: user } = await supabase.from("users").select("*").match({
        id: uID,
      });

      if (!user?.[0]?.tier) {
        return setUserDetails((prev: null) => (prev = null));
      }

      const usr = {
        id: user?.[0].id,
        full_name: user?.[0].full_name,
        email: data.session?.user.email,
        billing_address: user?.[0].billing_address,
        tier: user?.[0].tier,
      };

      console.log("usr: ", usr);

      setUserDetails((prev: any) => usr);
    }

    getUser();

    load();
  }, []);

  useEffect(() => {
    // @ts-ignore
    if (supabase.changedAccessToken === undefined) {
      setUserDetails((prev: null) => (prev = null));
      return;
    }

    //@ts-ignore
  }, [supabase.changedAccessToken]);

  const handleChosenProduct = (product: __Prod) => {
    setSelectedProduct((prev) => (prev = product));
    setSelectedVariant(product.variants[0]);
  };

  const loadForEditor = async (template: __Template, printFiles: PFILE) => {
    setTemplate(template);
    setPrintFiles(printFiles);
  };

  return (
    <div className="flex mb-10 h-auto flex-row max-[1780px]:flex-col min-w-max text-center">
      <Suspense fallback={<div>Loading...</div>}>
        <div className="gradientBG rounded-md flex flex-col min-h-screen h-max max-w-7xl">
          <div className="text-accent mx-auto p-4">
            {!printFiles ? (
              <>
                <Image
                  blurDataURL={selectedImage}
                  src={selectedImage}
                  alt="Product Image"
                  width={500}
                  height={500}
                />
              </>
            ) : (
              <ImagePlacementEditor
                selectedTemplate={template}
                selectedVariant={selectedVariant}
                selectedProduct={selectedProduct}
                userImage={selectedImage}
                onSelect={handleChosenProduct}
                setSelectedImage={setSelectedImage}
                setSelectedVariant={setSelectedVariant}
                setViewingMock={setViewingMock}
                printFiles={printFiles}
                userDetails={userDetails}
              />
            )}
          </div>
        </div>

        {!viewingMock && (
          <DescAndGen
            selectedProduct={selectedProduct}
            selectedVariant={selectedVariant}
            setSelectedImage={setSelectedImage}
            userDetails={userDetails}
          />
        )}
      </Suspense>
    </div>
  );
}
