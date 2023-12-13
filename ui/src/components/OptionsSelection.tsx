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
import { __PrintFiles, __Variant } from "@/types/all";

interface VariantSelectionProps {
  chosen: __Variant | undefined;
  variants: __Variant[] | undefined;
  options: any | undefined;
}

export function OptionsSelection({
  chosen,
  variants,
  options,
}: VariantSelectionProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="VariantSelection"
          aria-expanded={open}
          className="w-fit justify-between"
        >
          {value
            ? value
            : options?.options
            ? options.options
            : "Select a variant"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search styles..." />
          <CommandEmpty>No style found.</CommandEmpty>
          <CommandGroup>
            {options?.option_groups?.map((variant) => (
              <CommandItem
                key={variant}
                value={variant}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === variant ? "opacity-100" : "opacity-0"
                  )}
                />
                {variant}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
