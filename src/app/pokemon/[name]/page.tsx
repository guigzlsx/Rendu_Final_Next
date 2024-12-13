"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "../../styles/card.css";
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
  abilities: {
    ability: {
      name: string;
    };
  }[];
  moves: {
    move: {
      name: string;
      url: string;
    };
  }[];
  base_experience: number;
}

interface MoveDetails {
  name: string;
  power: number | null;
  accuracy: number | null;
  pp: number;
}

interface Move {
  move: {
    name: string;
    url: string;
  };
}

interface MoveData {
  power: number | null;
  accuracy: number | null;
  pp: number;
}

export default function PokemonDetails() {
  const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);
  const [moveDetails, setMoveDetails] = useState<MoveDetails[]>([]);

  useEffect(() => {
    const urlParts = window.location.pathname.split("/");
    const name = urlParts[urlParts.length - 1];

    fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
      .then((response) => response.json())
      .then((data) => {
        setPokemonData(data);
        // Fetch move details for the first 5 moves
        const movesToFetch = data.moves.slice(0, 5);
        return Promise.all(
          movesToFetch.map((move: Move) =>
            fetch(move.move.url)
              .then((res) => res.json())
              .then((moveData: MoveData) => ({
                name: move.move.name,
                power: moveData.power,
                accuracy: moveData.accuracy,
                pp: moveData.pp,
              }))
          )
        );
      })
      .then((moves) => setMoveDetails(moves))
      .catch((error) => {
        console.error("Error fetching Pokemon data:", error);
      });
  }, []);

  if (!pokemonData) {
    return <div className="loading-message">Loading...</div>;
  }

  const { sprites, stats, height, weight, types, abilities, base_experience } =
    pokemonData;
  const hp = stats.find((stat) => stat.stat.name === "hp")?.base_stat;
  const attack = stats.find((stat) => stat.stat.name === "attack")?.base_stat;

  return (
    <div className="pokemon-details-container">
      <h1>Pokémon details : {pokemonData.name}</h1>

      <Image
        src={sprites?.other?.home?.front_default || "/path/to/default/image.png"}
        alt={pokemonData.name}
        width={150}
        height={150}
      />

      <p>
        <span>HP:</span> {hp}
      </p>
      <p>
        <span>Attack:</span> {attack}
      </p>
      <p>
        <span>Height:</span> {height} decimetres
      </p>
      <p>
        <span>Weight:</span> {weight} hectograms
      </p>
      <p>
        <span>Base Experience:</span> {base_experience}
      </p>

      <div className="pokemon-types">
        <span>Types:</span>{" "}
        {types?.map((type, index) => (
          <span key={index} className={`pokemon-type ${type.type.name}`}>
            {type.type.name}
          </span>
        ))}
      </div>

      <div className="pokemon-abilities">
        <h2>Abilities:</h2>
        <ul>
          {abilities?.map((ability, index) => (
            <li key={index}>{ability.ability.name}</li>
          ))}
        </ul>
      </div>

      <div className="pokemon-moves">
        <h2>Moves:</h2>
        <ul>
          {moveDetails.map((move, index) => (
            <li key={index}>
              <strong>{move.name}</strong> - Power: {move.power || "N/A"},
              Accuracy: {move.accuracy || "N/A"}, PP: {move.pp}
            </li>
          ))}
        </ul>
      </div>

      <Link href="/" className="back-to-pokedex">
        Back to Pokédex
      </Link>
    </div>
  );
}