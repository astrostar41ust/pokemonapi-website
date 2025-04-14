import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar';

function PokedexPage() {
  const typeColors = {
    normal: '#A8A77A',
    fire: '#EE8130',
    water: '#6390F0',
    electric: '#F7D02C',
    grass: '#7AC74C',
    ice: '#96D9D6',
    fighting: '#C22E28',
    poison: '#A33EA1',
    ground: '#E2BF65',
    flying: '#A98FF3',
    psychic: '#F95587',
    bug: '#A6B91A',
    rock: '#B6A136',
    ghost: '#735797',
    dragon: '#6F35FC',
    dark: '#705746',
    steel: '#B7B7CE',
    fairy: '#D685AD',
  };

  const pokemonTypeApi = 'https://pokeapi.co/api/v2/type';

  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonListDatabase, setPokemonListDatabase] = useState([]);
  const [pokemonTypeList, setPokemonTypeList] = useState([]);
  const [pokemonNextListApi, setPokemonNextListApi] = useState('https://pokeapi.co/api/v2/pokemon');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuery, setSelectedQuery] = useState('all');

  const filterPokemonList = () => {
    if (searchQuery !== '') {
      const filtered = pokemonListDatabase.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setPokemonList(filtered);
    } else {
      setPokemonList(pokemonListDatabase);
    }
  };

  useEffect(() => {
    filterPokemonList();
  }, [searchQuery]);

  const handleSelectedQuery = (selectedCategory) => {
    if (selectedQuery === selectedCategory) {
      setSelectedQuery('all');
    } else {
      setSelectedQuery(selectedCategory);
    }
  };

  const filterPokemonListByType = () => {
    if (selectedQuery !== 'all') {
      const filtered = pokemonListDatabase.filter((pokemon) =>
        pokemon.types.some((type) =>
          type.name.toLowerCase().includes(selectedQuery.toLowerCase())
        )
      );
      setPokemonList(filtered);
    } else {
      setPokemonList(pokemonListDatabase);
    }
  };

  useEffect(() => {
    filterPokemonListByType();
  }, [selectedQuery]);

  const fetchTypeList = async () => {
    const response = await axios.get(pokemonTypeApi);
    setPokemonTypeList(response.data.results.slice(0, 18));
  };

  const fetchPokemonList = async () => {
    const response = await axios.get(pokemonNextListApi);
    setPokemonNextListApi(response.data.next);

    const fetchPokemonDetail = response.data.results.map(async (item) => {
      const response = await axios.get(item.url);
      return {
        id: response.data.id,
        name: response.data.name,
        types: response.data.types.map((types) => types.type),
        height: response.data.height,
        weight: response.data.weight,
        abilities: response.data.abilities.map((abilities) => abilities.ability),
        stats: response.data.stats.map((stats) => stats),
        moves: response.data.moves.map((moves) => moves),
        sprites: response.data.sprites,
        species: response.data.species
      };
    });

    const pokemonData = await Promise.all(fetchPokemonDetail);

    setPokemonList((prevList) => {
      const existingIds = new Set(prevList.map((pokemon) => pokemon.id));
      const newUnique = pokemonData.filter((pokemon) => !existingIds.has(pokemon.id));
      return [...prevList, ...newUnique];
    });

    setPokemonListDatabase((prevList) => {
      const existingIds = new Set(prevList.map((pokemon) => pokemon.id));
      const newUnique = pokemonData.filter((pokemon) => !existingIds.has(pokemon.id));
      return [...prevList, ...newUnique];
    });
  };

  useEffect(() => {
    fetchTypeList();
    fetchPokemonList();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
        fetchPokemonList();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pokemonNextListApi]);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <main className="px-6 md:px-12 lg:px-20 py-10 max-w-screen-xl mx-auto">
        <h1 className="text-4xl font-bold text-yellow-500 mb-6 text-center">Pokédex</h1>

        <section className="mb-12 flex justify-center">
          <div className="relative w-full sm:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for Pokémon..."
              className="bg-white rounded-full px-5 py-3 w-full shadow-md focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all duration-300 pl-12"
            />
            <svg
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="20"
              height="20"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M17 10.5A6.5 6.5 0 104.5 10.5 6.5 6.5 0 0017 10.5z"
              />
            </svg>
          </div>
        </section>

        <section className="mb-12">
          <p className="text-2xl font-semibold mb-4 text-gray-700">Filter by Type</p>
          <div className="flex flex-wrap gap-3">
            {pokemonTypeList.map((item, index) => (
              <button
                onClick={() => handleSelectedQuery(item.name)}
                key={index}
                style={{ backgroundColor: typeColors[item.name] || '#D1D5DB' }}
                className={`w-28 sm:w-32 h-10 text-white rounded-full capitalize transition-all hover:scale-105
                  ${selectedQuery === item.name ? 'ring-4 ring-yellow-400' : ''}`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </section>

        {/* Flexbox Layout for Pokémon Cards */}
        <section className="flex flex-wrap gap-8 justify-center">
          {pokemonList.map((item) => (
            <Link
              to={`/pokedex/${item.id}`}
              key={item.id}
              state={{ pokemon: item }}
              className="transition-transform hover:scale-105"
            >
              <div className="bg-white rounded-xl p-5 shadow-lg hover:shadow-xl flex flex-col items-center">
                <img
                  src={item.sprites.front_default}
                  className="w-32 h-32 mb-4"
                  alt={item.name}
                />
                <p className="text-2xl font-bold capitalize text-gray-800">{item.name}</p>
                <p className="text-gray-500 text-sm mb-3">ID: {item.id}</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {item.types.map((type, idx) => (
                    <span
                      key={idx}
                      style={{ backgroundColor: typeColors[type.name] || '#D1D5DB' }}
                      className="rounded-full text-white px-3 py-1 text-xs capitalize"
                    >
                      {type.name}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}

export default PokedexPage;
