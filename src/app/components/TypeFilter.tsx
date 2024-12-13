import { useEffect, useState } from "react";
import "../styles/typefilter.css";

interface TypeFilterProps {
  selectedType: string;
  setSelectedType: (type: string) => void;
}

async function getPokemonTypes(): Promise<string[]> {
  const res = await fetch("https://pokeapi.co/api/v2/type");
  if (!res.ok) {
    throw new Error("Failed to fetch pokemon types");
  }
  const data = await res.json();
  return data.results.map((type: { name: string }) => type.name);
}

export default function TypeFilter({ selectedType, setSelectedType }: TypeFilterProps) {
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchTypes = async () => {
      const types = await getPokemonTypes();
      setTypes(types);
    };
    fetchTypes();
  }, []);

  return (
    <div className="filter-section">
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
      >
        <option value="">Tous les types</option>
        {types.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>
    </div>
  );
}