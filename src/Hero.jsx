import React, { useState, useEffect } from "react";

// Debounce function to avoid rapid API calls
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Hero = ({ searchQuery }) => {
  const [pokemonData, setPokemonData] = useState([]);
  const [pokemonImages, setPokemonImages] = useState({});
  const [pokemonTypes, setPokemonTypes] = useState({});
  const [pokemonHeight, setPokemonHeight] = useState({});
  const [pokemonWeight, setPokemonWeight] = useState({});

  // Using debounce for search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Function to load data from localStorage or fetch from API
  const loadPokemonData = async () => {
    const cachedData = localStorage.getItem("pokemonData");

    if (cachedData) {
      // If data exists in localStorage, use it
      const parsedData = JSON.parse(cachedData);
      setPokemonData(parsedData.results);
      setPokemonImages(parsedData.images);
      setPokemonTypes(parsedData.types);
      setPokemonHeight(parsedData.height);
      setPokemonWeight(parsedData.weight);
    } else {
      // If data doesn't exist in localStorage, fetch from API
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=150"
      );
      const data = await response.json();
      setPokemonData(data.results);

      // Fetch detailed data about each Pokémon
      const images = {};
      const types = {};
      const heights = {};
      const weights = {};

      const allPromises = data.results.map(async (pokemon) => {
        const pokemonResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonResponse.json();
        images[pokemon.name] = pokemonData.sprites.front_default;
        types[pokemon.name] = pokemonData.types.map((t) => t.type.name);
        heights[pokemon.name] = pokemonData.height;
        weights[pokemon.name] = pokemonData.weight;
      });

      await Promise.all(allPromises);

      // Save the data to localStorage
      const cachedData = {
        results: data.results,
        images,
        types,
        height: heights,
        weight: weights,
      };
      localStorage.setItem("pokemonData", JSON.stringify(cachedData));

      setPokemonImages(images);
      setPokemonTypes(types);
      setPokemonHeight(heights);
      setPokemonWeight(weights);
    }
  };

  // Load Pokemon data on component mount
  useEffect(() => {
    loadPokemonData();
  }, []);

  // Filter pokemonData based on the debounced searchQuery
  const filteredPokemonData = pokemonData.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  const getTypeColor = (type) => {
    switch (type) {
      case "grass":
        return "bg-green-500";
      case "fire":
        return "bg-red-500";
      case "water":
        return "bg-blue-500";
      case "electric":
        return "bg-yellow-400 text-black";
      case "poison":
        return "bg-purple-600";
      case "flying":
        return "bg-indigo-400";
      case "bug":
        return "bg-lime-500";
      case "normal":
        return "bg-gray-400";
      case "ground":
        return "bg-yellow-700";
      case "fairy":
        return "bg-pink-400";
      case "fighting":
        return "bg-orange-600";
      case "psychic":
        return "bg-pink-600";
      case "rock":
        return "bg-stone-600";
      case "ghost":
        return "bg-violet-700";
      case "ice":
        return "bg-cyan-300 text-black";
      case "dragon":
        return "bg-purple-800";
      case "dark":
        return "bg-gray-700";
      case "steel":
        return "bg-slate-400 text-black";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex">
      <div className="w-full min-h-[42rem] overflow-y-scroll p-4">
        <h1 className="text-blue-800 font-extrabold text-6xl flex justify-center items-center mb-8 cursor-pointer">
          POKEDEX
        </h1>

        <div className="grid grid-cols-3 gap-6">
          {filteredPokemonData.length > 0 ? (
            filteredPokemonData.map((pokemon, index) => (
              <div
                className="card p-4 border-2 border-blue-600 rounded-3xl flex flex-col items-center"
                key={index}
              >
                {pokemonImages[pokemon.name] && (
                  <img
                    src={pokemonImages[pokemon.name]}
                    alt={pokemon.name}
                    className="w-32 h-32 mb-4 cursor-pointer"
                  />
                )}
                <h2 className="text-2xl font-bold capitalize mb-2 cursor-pointer">
                  {pokemon.name}
                </h2>
                <p>
                  <b>Height: </b>
                  {pokemonHeight[pokemon.name]}
                </p>
                <p>
                  <b>Weight: </b>
                  {pokemonWeight[pokemon.name]}
                </p>

                <div className="flex gap-2 flex-wrap mt-3 justify-center">
                  {pokemonTypes[pokemon.name]?.map((type, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-sm font-semibold text-white capitalize cursor-pointer ${getTypeColor(
                        type
                      )} hover:scale-105 hover:opacity-80 transition-all duration-300`}
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center text-xl text-gray-500">
              No Results Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Hero;
