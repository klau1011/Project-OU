"use client";

import { Search as SearchIcon } from "lucide-react";
import { InputProps } from "./input";
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
} & InputProps;

export default function Search({ placeholder, ...props }: SearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const handleSelect = (university: string) => {
    const params = new URLSearchParams(searchParams);

    if (university) {
      params.set("university", university);
    }

    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <>
    <div className="flex gap-2">
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        {...props}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
        defaultValue={searchParams.get("query")?.toString()}
      />
      <SearchIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
    </div>
   <div className="relative flex flex-1 flex-shrink-0 mt-2 md:mt-0 md:ml-2 md:relative md:right-0">
        <div className="absolute right-0">
          <Select onValueChange={handleSelect} >
            <SelectTrigger>
              <SelectValue placeholder="Select a university" />
            </SelectTrigger>
            <SelectContent className="w-full md:max-w-[280px] mt-2 p-2 bg-white border border-gray-200 rounded-md shadow-md">
              <SelectGroup>
                <SelectLabel>Ontario Universities</SelectLabel>
                {ontarioUniversitiesNames.map((university) => (
                  <SelectItem
                    key={university.value}
                    value={university.value}
                    className="cursor-pointer"
                  >
                    {university.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
    </>
  );
}
