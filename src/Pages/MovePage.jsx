import React, { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';

const MovePage = () => {
    const [moveList, setMoveList] = useState([]);
    const [moveListDatabase, setMoveListDatabase] = useState([])
    const [moveNextList, setMoveNextList] = useState('https://pokeapi.co/api/v2/move?limit=30&offset=0');
    const [selectedMove, setSelectedMove] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchMoveList = async () => {
        const response = await axios.get(moveNextList);
        setMoveNextList(response.data.next);

        const fetchMoveDetail = response.data.results.map(async (item) => {
            const response = await axios.get(item.url);
            return {
                name: response.data.name,
                type: response.data.type.name,
                power: response.data.power,
                pp: response.data.pp,
                accuracy: response.data.accuracy,
                effect: response.data.effect_entries.find(e => e.language.name === 'en')?.effect || 'N/A'
            };
        });

        const moveData = await Promise.all(fetchMoveDetail);
        setMoveList((prevList) => {
            const existingNames = new Set(prevList.map((item) => item.name))
            const newUnique = moveData.filter((item) => !existingNames.has(item.name))
            return [...prevList, ...newUnique]
        })
        setMoveListDatabase((prevList) => {
            const existingNames = new Set(prevList.map((item) => item.name))
            const newUnique = moveData.filter((item) => !existingNames.has(item.name))
            return [...prevList, ...newUnique]
        })
    };

    useEffect(() => {
        fetchMoveList();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
                fetchMoveList();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [moveNextList]);



    const filteredMoveList = () => {

        if (searchQuery !== '') {
            const filtered = moveListDatabase.filter(((move) => {
                return move.name.toLowerCase().includes(searchQuery.toLowerCase())
            }))

            setMoveList(filtered)
        }
        else {
            setMoveList(moveListDatabase)
        }
    }


    useEffect(() => {
        filteredMoveList()
    }, [searchQuery])

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <main className="px-6 md:px-12 lg:px-20 py-8 max-w-screen-xl mx-auto">


                <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 text-gray-800">Moves</h1>
                        <p className="text-gray-600">Browse Pokémon moves, their types, power, accuracy, and effects.</p>
                    </div>
                    <div className="relative w-full sm:w-96">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search moves..."
                            className="bg-white rounded-full px-5 py-3 w-full shadow focus:ring-2 focus:ring-yellow-400 focus:outline-none pl-12 transition-all duration-300"
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


                <section className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 flex flex-wrap gap-4">
                        {moveList.map((move, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedMove(move)}
                                className="cursor-pointer bg-white rounded-2xl p-5 shadow hover:shadow-lg transition-transform hover:scale-105 flex flex-col items-center w-40"
                            >
                                <p className="text-lg font-semibold capitalize mb-1">{move.name}</p>
                                <p className="text-sm text-gray-500 capitalize">Type: {move.type}</p>
                                <p className="text-sm text-gray-500">Power: {move.power ?? 'N/A'}</p>
                                <p className="text-sm text-gray-500">PP: {move.pp}</p>
                            </div>
                        ))}
                    </div>



                    <aside className="lg:w-80 bg-white p-8 rounded-2xl shadow flex flex-col h-fit sticky top-24">
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">Move Details</h2>
                        {selectedMove ? (
                            <div className="space-y-2">
                                <p className="text-xl font-semibold capitalize">{selectedMove.name}</p>
                                <p className="text-gray-600">Type: <span className="capitalize">{selectedMove.type}</span></p>
                                <p className="text-gray-600">Power: {selectedMove.power ?? 'N/A'}</p>
                                <p className="text-gray-600">PP: {selectedMove.pp}</p>
                                <p className="text-gray-600">Accuracy: {selectedMove.accuracy ?? 'N/A'}</p>
                                <p className="text-gray-600 pt-2 border-t mt-2">{selectedMove.effect}</p>
                            </div>
                        ) : (
                            <p className="text-gray-400">Click a move card to see its details.</p>
                        )}
                    </aside>

                </section>
            </main>
        </div>
    );
};

export default MovePage;
