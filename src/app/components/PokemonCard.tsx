"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import "../styles/pokemon.css";

interface PokemonCardProps {
    name: string;
}

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
    types: {
        type: {
        name: string;
        };
    }[];
}

    export default function PokemonCard({ name }: PokemonCardProps) {
    const [pokemonData, setPokemonData] = useState<PokemonData | null>(null);

    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`)
        .then((response) => response.json())
        .then((data) => {
            setPokemonData(data);
        })
        .catch((error) => {
            console.error("Error fetching Pokemon data:", error);
        });
    }, [name]);

    if (!pokemonData) {
        return <div>Loading...</div>;
    }

    const { sprites, stats, types } = pokemonData;
    const hp = stats.find((stat) => stat.stat.name === "hp")?.base_stat;
    const attack = stats.find((stat) => stat.stat.name === "attack")?.base_stat;
    const primaryType = types[0].type.name;

    return (
        <Link href={`/pokemon/${name}`} className={`pokemon-card ${primaryType}`}>
            <h2>{name}</h2>
            <div className="pokemon-card-image">
                <Image src={sprites.other.home.front_default} alt={name} width={120} height={120} />
            </div>
            <div className="pokemon-card-info">
                <p>HP: {hp}</p>
                <p>Attack: {attack}</p>
            </div>
        </Link>
    );
}