"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DateRangePicker,
  NumberInput,
} from "@heroui/react";
import { formatHeroDate, HeroDate } from "@/formatters";

interface PlaceItem {
  key: string;
  label: string;
  description: string;
  lat: number;
  lon: number;
}

interface FormPayload {
  destination: PlaceItem | null;
  dateRange: { start: HeroDate | null; end: HeroDate | null };
  travelers: number;
}

const SearchForm = () => {
  const [formPayload, setFormPayload] = useState<FormPayload>({
    destination: null,
    dateRange: { start: null, end: null },
    travelers: 1,
  });

  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const router = useRouter();

  const handleLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setQuery(value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(async () => {
      if (!value) return setPlaces([]);
      try {
        const res = await fetch(`/api/places?q=${encodeURIComponent(value)}`);
        const data: PlaceItem[] = await res.json();
        setPlaces(data);
      } catch {
        setPlaces([]);
      }
    }, 300);
  };

  const handlePlaceSelect = (key: string) => {
    const selected = places.find((p) => p.key === key);
    if (!selected) return;

    setQuery(selected.label);
    setFormPayload((prev) => ({ ...prev, destination: selected }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { destination, dateRange, travelers } = formPayload;

    if (!destination || !dateRange.start || !dateRange.end) {
      setError("Please fill out all fields");
      return;
    }

    const params = new URLSearchParams({
      destination: destination?.label,
      lat: destination?.lat?.toString(),
      lon: destination?.lon?.toString(),
      start: formatHeroDate(dateRange.start)?.toISOString(),
      end: formatHeroDate(dateRange.end)?.toISOString(),
      travelers: travelers.toString(),
    });

    router.push(`/trip?${params.toString()}`);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl flex flex-col lg:flex-row gap-4 items-center p-6 border-1 rounded-lg border-gray-200 shadow-sm"
      >
        <Autocomplete
          defaultItems={places}
          placeholder="Start typing a location..."
          label="Where are you going?"
          labelPlacement="inside"
          inputProps={{
            onChange: handleLocationInputChange,
            value: query,
          }}
          onSelectionChange={handlePlaceSelect}
        >
          {(place: PlaceItem) => (
            <AutocompleteItem key={place.key} textValue={place.label}>
              {place.label}
            </AutocompleteItem>
          )}
        </Autocomplete>

        <DateRangePicker
          label="When are you going?"
          labelPlacement="inside"
          onChange={(range: any) =>
            setFormPayload((prev) => ({ ...prev, dateRange: range }))
          }
        />

        <NumberInput
          label="Number of Travelers"
          labelPlacement="inside"
          minValue={1}
          defaultValue={1}
          className="w-full lg:w-1/2"
          onValueChange={(value) =>
            setFormPayload((prev) => ({ ...prev, travelers: value }))
          }
        />

        <Button
          size="lg"
          radius="full"
          color="primary"
          type="submit"
          className="w-full lg:w-auto"
        >
          Submit
        </Button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}

      <pre className="mt-4 p-2 bg-gray-100 rounded">
        {JSON.stringify(formPayload, null, 2)}
      </pre>
    </>
  );
};

export default SearchForm;
