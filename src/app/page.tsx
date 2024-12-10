"use client";

import { useState, useEffect } from "react";
import PokemonCard from "./components/PokemonCard";
import Image from "next/image";

interface Pokemon {
  name: string;
  url: string;
}

interface PokemonData {
  results: Pokemon[];
}

async function getPokemons(
  limit: number,
  offset: number
): Promise<PokemonData> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch pokemons");
  }
  return res.json();
}

export default function Home() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 20;

  useEffect(() => {
    loadMorePokemons();
  }, []);

  const loadMorePokemons = async () => {
    setLoading(true);
    const data = await getPokemons(limit, offset);
    setPokemons((prev) => [...prev, ...data.results]);
    setOffset((prev) => prev + limit);
    setLoading(false);
  };

  return (
    <main>
      <div className="page-title">
        <Image
          src="/images/pokemon.png"
          alt="Pokémon"
          width={500}
          height={200}
        />
      </div>
      <div className="main-section">
        <div className="pokemon-grid">
          {pokemons.map((pokemon) => (
            <PokemonCard key={pokemon.name} name={pokemon.name} />
          ))}
        </div>
        <div className="load-more">
          <button onClick={loadMorePokemons} disabled={loading}>
            {loading ? "Loading..." : "Voir plus"}
          </button>
        </div>
      </div>
    </main>
  );
}
