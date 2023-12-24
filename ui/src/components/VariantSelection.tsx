"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { __Variant } from "@/types/all";
import { useRouter } from "next/navigation";

interface VariantSelectionProps {
  chosen: __Variant | undefined;
  variants: __Variant[] | undefined;
  setSelectedVariant: (variant: __Variant) => void;
}

export function VariantSelection({
  chosen,
  variants,
  setSelectedVariant,
}: VariantSelectionProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const router = useRouter();

  React.useEffect(() => {
    if (chosen) {
      setValue(chosen.name);
    }
  }, [chosen]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="VariantSelection"
          aria-expanded={open}
          className="w-fit justify-between"
        >
          {value ? value : chosen ? chosen.name : "Select a variant"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search styles..." />
          <CommandEmpty>No style found.</CommandEmpty>
          <CommandGroup>
            {variants?.map((variant) => (
              <CommandItem
                key={variant.name}
                value={variant.name}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setSelectedVariant(variant);
                  setOpen(false);
                  let url = new URL(window.location.href);
                  const split = url.pathname.split("/").pop();

                  const newProdName = variant.name
                    .toLowerCase()
                    .replaceAll(" ", "-")
                    .replaceAll("-/-", "-");

                  url.searchParams.set("vid", variant.id.toString());
                  url.searchParams.set("pid", variant.product_id.toString());
                  url.pathname = url.pathname.replace(split!, `${newProdName}`);
                  router.push(url.toString());
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === variant.name ? "opacity-100" : "opacity-0"
                  )}
                />
                {variant.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
