// page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "../../styles/pokemon.css";

interface PokemonData {
  sprites: {
    other: {
      home: {
        front_default: string;
      };
    };
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  name: string;
  height: number;
  weight: number;
  types: {
    type: {
      name: string;
    };
  }[];
}

export default function PokemonDetails() {
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);

  useEffect(() => {
    const urlParts = window.location.pathname.split("/");
    const name = urlParts[urlParts.length - 1];

    fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
      .then((response) => response.json())
      .then((data) => {
        setPokemonData(data);
      })
      .catch((error) => {
        console.error("Error fetching Pokemon data:", error);
      });
  }, []);

  if (!pokemonData) {
    return <div>Loading...</div>;
  }

  const { sprites, stats, height, weight, types } = pokemonData;
  const hp = stats.find((stat) => stat.stat.name === "hp")?.base_stat;
  const attack = stats.find((stat) => stat.stat.name === "attack")?.base_stat;

  return (
    <main>
      <h1>Détails du Pokémon : {pokemonData.name}</h1>
      <div className="pokemon-details">
        <div className="pokemon-details-image">
          <Image
            src={sprites.other.home.front_default}
            alt={pokemonData.name}
            width={120}
            height={120}
          />
        </div>
        <div className="pokemon-details-info">
          <p>HP: {hp}</p>
          <p>Attack: {attack}</p>
          <p>Height: {height}</p>
          <p>Weight: {weight}</p>
          <p>Types: {types.map((type) => type.type.name).join(", ")}</p>
        </div>
      </div>
      <Link href="/">Back to Pokédex</Link>
    </main>
  );
}
