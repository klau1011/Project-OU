"use client";

import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { ontarioUniversitiesNames } from "@/data/universities";

type SearchProps = {
  placeholder: string;
};

export default function Search({ placeholder }: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleSelect = (university: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (university) {
      params.set("university", university);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <label htmlFor="search" className="sr-only">
          Search
        </label>
        <Input
          className="pl-10"
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value);
          }}
          defaultValue={searchParams.get("query")?.toString()}
        />
        <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-muted-foreground peer-focus:text-foreground" />
      </div>
      <div className="sm:w-[220px]">
        <Select onValueChange={handleSelect} defaultValue={searchParams.get("university") ?? "all"}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a university" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Ontario Universities</SelectLabel>
              {ontarioUniversitiesNames.map((university) => (
                <SelectItem
                  key={university.value}
                  value={university.value}
                >
                  {university.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
