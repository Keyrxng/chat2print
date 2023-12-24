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
import { __Prod, __ProductsList } from "@/types/all";
import Products from "@/data/products";
import { useRouter } from "next/navigation";

interface ProductSelectionProps {
  product: __Prod | undefined;
  setSelectedProduct: (product: __Prod) => void;
}

export function ProductSelection({
  product,
  setSelectedProduct,
}: ProductSelectionProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="mr-2">
        <Button
          variant="outline"
          role="VariantSelection"
          aria-expanded={open}
          className="w-min justify-between text-accent"
        >
          {value
            ? value
            : product
            ? product.product.type_name
            : "Select Product..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search products..." />
          <CommandEmpty>No products found.</CommandEmpty>
          <CommandGroup>
            {Object.values(Products)?.map((product) => (
              <CommandItem
                key={product.product.type_name}
                value={product.product.type_name}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setSelectedProduct(product);
                  setOpen(false);
                  let url = new URL(window.location.href);
                  const split = url.pathname.split("/").pop();

                  const newProdName = product.product.type_name
                    .toLowerCase()
                    .replaceAll(" ", "-")
                    .replaceAll("-/-", "-");

                  url.searchParams.set("pid", product.product.id.toString());
                  url.searchParams.set(
                    "vid",
                    product.variants[0].id.toString()
                  );

                  url.pathname = url.pathname.replace(split!, `${newProdName}`);
                  router.push(url.toString());
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === product.product.type_name
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {product.product.type_name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
