"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Star, Bookmark, Plus, X, Trash2 } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useState } from "react";

interface Spot {
    id: number;
    name: string;
    category: string;
    location: string;
    rating: number;
    imageUrl: string;
}

const INITIAL_SPOTS: Spot[] = [
    {
        id: 1,
        name: "Cafe Majestic",
        category: "カフェ",
        location: "Porto",
        rating: 4.8,
        imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 2,
        name: "ベレンの塔",
        category: "観光",
        location: "Lisbon",
        rating: 4.7,
        imageUrl: "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        name: "プラド美術館",
        category: "ミュージアム",
        location: "Madrid",
        rating: 4.9,
        imageUrl: "https://images.unsplash.com/photo-1543783207-ec64e4d95325?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 4,
        name: "サグラダ・ファミリア",
        category: "観光",
        location: "Barcelona",
        rating: 4.9,
        imageUrl: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?q=80&w=800&auto=format&fit=crop"
    }
];

export default function SpotsPage() {
    const [spots, setSpots] = useLocalStorage<Spot[]>("my-saved-spots", INITIAL_SPOTS);
    const [isAdding, setIsAdding] = useState(false);
    const [newSpot, setNewSpot] = useState({ name: "", category: "Sightseeing", location: "Barcelona" });

    const addSpot = () => {
        if (!newSpot.name) return;
        const spot: Spot = {
            id: Date.now(),
            ...newSpot,
            rating: 4.5,
            imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=800&auto=format&fit=crop" // Default placeholder
        };
        setSpots([spot, ...spots]);
        setIsAdding(false);
        setNewSpot({ name: "", category: "Sightseeing", location: "Barcelona" });
    };

    const deleteSpot = (id: number) => {
        if (confirm("このスポットを削除しますか？")) {
            setSpots(spots.filter(s => s.id !== id));
        }
    };

    return (
        <div className="min-h-full bg-slate-50 pb-32">
            <div className="pt-12 px-6 pb-6 flex justify-between items-end">
                <div>
                    <h1 className="font-serif text-3xl text-gray-900 mb-2">Saved Spots</h1>
                    <p className="text-muted text-sm">行きたい場所リスト</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="bg-gray-900 text-white p-3 rounded-full shadow-lg"
                >
                    <Plus size={20} />
                </button>
            </div>

            <div className="px-6 grid grid-cols-1 gap-6">
                <AnimatePresence>
                    {spots.map((spot, i) => (
                        <motion.div
                            key={spot.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer relative"
                        >
                            <button
                                onClick={(e) => { e.stopPropagation(); deleteSpot(spot.id); }}
                                className="absolute top-3 left-3 bg-red-500/80 backdrop-blur-sm p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                    src={spot.imageUrl}
                                    alt={spot.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-secondary">
                                    <Bookmark size={16} fill="currentColor" />
                                </div>
                                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1">
                                    <Star size={12} className="text-yellow-400" fill="currentColor" />
                                    <span className="text-white text-xs font-semibold">{spot.rating}</span>
                                </div>
                            </div>

                            <div className="p-5">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-serif text-xl text-gray-900">{spot.name}</h3>
                                </div>

                                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium uppercase tracking-wider">
                                    <div className="flex items-center gap-1">
                                        <MapPin size={12} />
                                        {spot.location}
                                    </div>
                                    <span className="text-gray-300">•</span>
                                    <span>{spot.category}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Add Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-serif text-xl">スポット追加</h2>
                                <button onClick={() => setIsAdding(false)}><X size={20} className="text-gray-400" /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">名前</label>
                                    <input
                                        value={newSpot.name}
                                        onChange={(e) => setNewSpot({ ...newSpot, name: e.target.value })}
                                        placeholder="例: サン・ジョルジェ城"
                                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        autoFocus
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">都市</label>
                                        <select
                                            value={newSpot.location}
                                            onChange={(e) => setNewSpot({ ...newSpot, location: e.target.value })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option>Porto</option>
                                            <option>Lisbon</option>
                                            <option>Madrid</option>
                                            <option>Barcelona</option>
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">タイプ</label>
                                        <select
                                            value={newSpot.category}
                                            onChange={(e) => setNewSpot({ ...newSpot, category: e.target.value })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="Sightseeing">観光</option>
                                            <option value="Food">食事</option>
                                            <option value="Shop">買い物</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    onClick={addSpot}
                                    className="w-full py-4 bg-primary text-white font-medium rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                                >
                                    保存
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
