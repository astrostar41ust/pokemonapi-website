import { useEffect, useState } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';



const ItemPage = () => {
    const [itemList, setItemList] = useState([]);
    const [itemListDatabase, setItemListDatabase] = useState([])
    const [itemNextList, setItemNextList] = useState("https://pokeapi.co/api/v2/item");
    const [selectedEffect, setSelectedEffect] = useState([]);

    const [searchQuery, setSearchQuery] = useState('')


    const filterItemList = () => {

        if (searchQuery !== '') {
            const filtered = itemListDatabase.filter(((item) => {
                return item.name.toLowerCase().includes(searchQuery.toLowerCase())
            }))

            setItemList(filtered)
        }
        else {
            setItemList(itemListDatabase)
        }
    }

    useEffect(() => {
        filterItemList()
    }, [searchQuery])

    const fetchItemList = async () => {
        const response = await axios.get(itemNextList);

        setItemNextList(response.data.next)

        const fetchItemDetail = response.data.results.map(async (item) => {
            const response = await axios.get(item.url);
            return {
                name: response.data.name,
                category: response.data.category.name,
                sprites: response.data.sprites.default,
                effect: response.data.effect_entries.map((effect) => effect.effect)
            };
        });

        const itemData = await Promise.all(fetchItemDetail);


        setItemList((prevList) => {
            const existingNames = new Set(prevList.map((item) => item.name))
            const newUnique = itemData.filter((item) => !existingNames.has(item.name))
            return [...prevList, ...newUnique]
        })
        setItemListDatabase((prevList) => {
            const existingNames = new Set(prevList.map((item) => item.name))
            const newUnique = itemData.filter((item) => !existingNames.has(item.name))
            return [...prevList, ...newUnique]
        })

    };

    useEffect(() => {
        fetchItemList();
    }, []);


    useEffect(() => {
        const handleScroll = () => {

            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
                fetchItemList();
            }
        }

        window.addEventListener('scroll', handleScroll)

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [itemNextList]);


    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />
            <main className="px-6 md:px-12 lg:px-20 py-8 max-w-screen-xl mx-auto">


                <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold mb-2 text-gray-800">Items</h1>
                        <p className="text-gray-600">Explore Pokémon items, tools, and battle aids!</p>
                    </div>

                    <div className="relative w-full sm:w-96">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search items..."
                            className="bg-white rounded-full px-5 py-3 w-full shadow focus:ring-2 focus:ring-yellow-400 focus:outline-none transition-all duration-300 pl-12"
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

                <section>
                    <div className="flex flex-col lg:flex-row gap-8">


                        <div className="flex-1 flex flex-wrap gap-4">
                            {itemList.map((item, index) => (
                                <div
                                    key={index}
                                    onClick={() => setSelectedEffect(item.effect)}
                                    className="cursor-pointer bg-white rounded-2xl p-5 shadow hover:shadow-lg transition-transform hover:scale-105 flex flex-col items-center w-36"
                                >
                                    {item.sprites ? (
                                        <img
                                            src={item.sprites}
                                            alt={item.name}
                                            className="w-20 h-20 mb-4"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 mb-4 bg-gray-300 rounded-full" />
                                    )}
                                    <p className="text-center text-lg font-semibold capitalize mb-1">{item.name}</p>
                                    <p className="text-sm text-gray-500 capitalize">Category: {item.category}</p>
                                </div>
                            ))}
                        </div>


                        <aside className="lg:w-80 bg-white p-8 rounded-2xl shadow flex flex-col h-fit sticky top-24">
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">Item Effect</h2>
                            {selectedEffect.length > 0 ? (
                                selectedEffect.map((effect, index) => (
                                    <p key={index} className="text-gray-600 mb-2">• {effect}</p>
                                ))
                            ) : (
                                <p className="text-gray-400">Click on an item to see its effect.</p>
                            )}
                        </aside>
                    </div>
                </section>
            </main >
        </div >
    );
};

export default ItemPage;
