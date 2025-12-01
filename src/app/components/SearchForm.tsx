"use client";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DateRangePicker,
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
}

const SearchForm = () => {
  const [formPayload, setFormPayload] = useState<FormPayload>({
    destination: null,
    dateRange: { start: null, end: null },
  });

  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<PlaceItem[]>([]);
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
    }, 200);
  };

  const handlePlaceSelect = (key: string) => {
    const selected = places.find((p) => p.key === key);
    if (!selected) return;

    setQuery(selected.label);
    setFormPayload((prev) => ({ ...prev, destination: selected }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { destination, dateRange } = formPayload;

    const params = new URLSearchParams({
      destination: destination?.label,
      lat: destination?.lat?.toString(),
      lon: destination?.lon?.toString(),
      start: formatHeroDate(dateRange.start)?.toISOString(),
      end: formatHeroDate(dateRange.end)?.toISOString(),
    });

    router.push(`/trip?${params.toString()}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-6xl flex flex-col lg:flex-row gap-4 items-center p-6 border-1 rounded-3xl border-gray-200 shadow-sm"
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
        aria-label="Trip date range"
        onChange={(range: any) =>
          setFormPayload((prev) => ({ ...prev, dateRange: range }))
        }
      />
      <Button
        size="lg"
        radius="full"
        color="primary"
        type="submit"
        className="w-full lg:w-auto"
        isDisabled={
          !formPayload.destination ||
          !formPayload.dateRange.start ||
          !formPayload.dateRange.end
        }
      >
        Submit
      </Button>
    </form>
  );
};

export default SearchForm;
