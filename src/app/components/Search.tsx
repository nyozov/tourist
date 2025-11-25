"use client";
import { useState, useRef } from "react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

interface PlaceItem {
  key: string;
  label: string;
  description: string;
  lat: number;
  lon: number;
}

const Search = () => {
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      if (!value) return setPlaces([]);
      try {
        const res = await fetch(`/api/places?q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setPlaces(data);
      } catch {
        setPlaces([]);
      }
    }, 300);
  };

 

  return (
    <Autocomplete
      defaultItems={places}
      placeholder="Search a destination"
      labelPlacement="inside"
      inputProps={{
        onChange: handleInputChange,
        value: query,
      }}
    >
      {(place: PlaceItem) => (
        <AutocompleteItem key={place.key} textValue={place.label}>
          <div>
            <span className="font-medium">{place.label}</span>
            <span className="text-gray-500 text-sm ml-2">{place.description}</span>
          </div>
        </AutocompleteItem>
      )}
    </Autocomplete>
  );
};

export default Search;
