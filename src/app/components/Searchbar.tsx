"use client";

import { useEffect, useState } from "react";
import "../styles/pokemon.css";

interface SearchbarProps {
    setSearchQuery: (query: string) => void;
}

export default function Searchbar({}: SearchbarProps) {
    const [searchValue, setSearchValue] = useState("");
    const [pokemonNames, setPokemonNames] = useState<string[]>([]);

    useEffect(() => {
        const fetchPokemonNames = async () => {
            try {
                const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
                const data = await response.json();
                const names = data.results.map((pokemon: { name: string }) => pokemon.name);
                setPokemonNames(names);
            } catch (error) {
                console.error("Error fetching Pokémon names:", error);
            }
        };

        fetchPokemonNames();
    }, []);

    const handleSearch = () => {
        const searchQuery = searchValue.trim().toLowerCase();
        if (searchQuery) {
            const matchedPokemon = pokemonNames.find(name => name.startsWith(searchQuery));
            if (matchedPokemon) {
                window.location.href = `/pokemon/${matchedPokemon}`;
            } else {
                alert("Pokemon not found");
            }
        }
    };

    return (
        <div className="searchbar">
            <input
                type="text"
                placeholder="Search for a Pokemon"
                value={searchValue}
                onChange={(event) => setSearchValue(event.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
}