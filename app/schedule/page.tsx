"use client";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, School as Hotel, Image as ImageIcon, MapPin, Plane, Utensils, Train, Plus, Trash2, X } from "lucide-react";
import { clsx } from "clsx";
import { useState } from "react";

// --- Types ---
type EventType = 'transit' | 'stay' | 'food' | 'activity' | 'other';

interface ScheduleEvent {
    id: number;
    time: string;
    title: string;
    type: EventType;
    description: string;
}

interface DaySchedule {
    day: string;
    date: string;
    events: ScheduleEvent[];
}

// --- Initial Data (Real Itinerary) ---
const INITIAL_SCHEDULE: DaySchedule[] = [
    {
        day: "Day 1",
        date: "2/27",
        events: [
            {
                id: 101,
                time: "22:05",
                title: "フライト: TK199",
                type: "transit",
                description: "羽田 (HND) 発 → イスタンブール (IST)",
            },
        ],
    },
    {
        day: "Day 2",
        date: "2/28",
        events: [
            {
                id: 201,
                time: "05:40",
                title: "イスタンブール着",
                type: "transit",
                description: "乗り継ぎ待機",
            },
            {
                id: 202,
                time: "07:55",
                title: "フライト: TK1449",
                type: "transit",
                description: "イスタンブール (IST) 発 → ポルト (OPO)",
            },
            {
                id: 203,
                time: "09:55",
                title: "ポルト着",
                type: "activity",
                description: "ポルトガル到着！ ホテルへチェックイン",
            },
        ],
    },
    {
        day: "Day 3",
        date: "3/01",
        events: [
            {
                id: 301,
                time: "10:00",
                title: "ポルト観光",
                type: "activity",
                description: "ポルト市内を散策"
            }
        ]
    },
    {
        day: "Day 4",
        date: "3/02",
        events: [
            {
                id: 401,
                time: "Morning",
                title: "リスボンへ移動",
                type: "transit",
                description: "鉄道またはバスで移動"
            }
        ]
    },
    {
        day: "Day 5",
        date: "3/03",
        events: []
    },
    {
        day: "Day 6",
        date: "3/04",
        events: [
            {
                id: 601,
                time: "Morning",
                title: "マドリードへ移動",
                type: "transit",
                description: "フライトまたは鉄道で移動"
            }
        ]
    },
    {
        day: "Day 7",
        date: "3/05",
        events: []
    },
    {
        day: "Day 8",
        date: "3/06",
        events: []
    },
    {
        day: "Day 9",
        date: "3/07",
        events: [
            {
                id: 901,
                time: "Morning",
                title: "バルセロナへ移動",
                type: "transit",
                description: "鉄道 (Renfe) で移動"
            }
        ]
    },
    {
        day: "Day 10",
        date: "3/08",
        events: []
    },
    {
        day: "Day 11",
        date: "3/09",
        events: []
    },
    {
        day: "Day 12",
        date: "3/10",
        events: [
            {
                id: 1201,
                time: "18:30",
                title: "フライト: TK1856",
                type: "transit",
                description: "バルセロナ (BCN) 発 → イスタンブール (IST)",
            },
            {
                id: 1202,
                time: "00:05",
                title: "イスタンブール着 (3/11)",
                type: "transit",
                description: "乗り継ぎ",
            },
            {
                id: 1203,
                time: "02:30",
                title: "フライト: TK198",
                type: "transit",
                description: "イスタンブール (IST) 発 → 羽田 (HND)",
            },
            {
                id: 1204,
                time: "19:45",
                title: "羽田着",
                type: "transit",
                description: "帰国",
            }
        ],
    },
];

const ICONS = {
    transit: Plane,
    stay: Hotel,
    food: Utensils,
    activity: MapPin,
    other: Coffee
}

export default function SchedulePage() {
    const [schedule, setSchedule] = useLocalStorage<DaySchedule[]>("my-itinerary", INITIAL_SCHEDULE);
    const [selectedDayIndex, setSelectedDayIndex] = useState(0);
    const [isAdding, setIsAdding] = useState(false);

    // New Event State
    const [newEvent, setNewEvent] = useState({ time: "", title: "", description: "", type: "activity" as EventType });

    const currentDay = schedule[selectedDayIndex];

    const handleAddEvent = () => {
        if (!newEvent.title) return;
        const newId = Date.now();

        const updatedSchedule = [...schedule];
        updatedSchedule[selectedDayIndex].events.push({
            id: newId,
            ...newEvent
        });
        // Sort by time roughly
        updatedSchedule[selectedDayIndex].events.sort((a, b) => a.time.localeCompare(b.time));

        setSchedule(updatedSchedule);
        setIsAdding(false);
        setNewEvent({ time: "", title: "", description: "", type: "activity" });
    };

    const handleDeleteEvent = (id: number) => {
        if (!confirm("この予定を削除しますか？")) return;
        const updatedSchedule = [...schedule];
        updatedSchedule[selectedDayIndex].events = updatedSchedule[selectedDayIndex].events.filter(e => e.id !== id);
        setSchedule(updatedSchedule);
    };

    return (
        <div className="min-h-full bg-slate-50 pb-32">
            {/* Header */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 pt-12 pb-4 px-6">
                <h1 className="font-serif text-3xl text-gray-900">Itinerary</h1>
                <div className="flex gap-4 mt-4 overflow-x-auto no-scrollbar pb-2">
                    {schedule.map((day, i) => (
                        <button
                            key={day.day}
                            onClick={() => setSelectedDayIndex(i)}
                            className={clsx(
                                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors border",
                                i === selectedDayIndex
                                    ? "bg-secondary text-white border-secondary shadow-md shadow-secondary/20"
                                    : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <span className="opacity-70 text-xs mr-1">{day.date}</span>
                            {day.day}
                        </button>
                    ))}
                </div>
            </div>

            {/* Timeline */}
            <div className="px-6 pt-6 min-h-[50vh]">
                <div className="relative border-l-2 border-gray-200 ml-3 space-y-12">
                    {currentDay.events.length === 0 && (
                        <p className="text-gray-400 pl-8 pt-4">予定はまだありません。</p>
                    )}

                    <AnimatePresence mode="popLayout">
                        {currentDay.events.map((event, index) => {
                            const Icon = ICONS[event.type] || MapPin;
                            return (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={event.id}
                                    className="relative pl-8 group"
                                >
                                    {/* Dot */}
                                    <div className={clsx(
                                        "absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm z-10",
                                        event.type === 'transit' ? "bg-muted" : "bg-primary"
                                    )} />

                                    {/* Card */}
                                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100/50 relative">
                                        <button
                                            onClick={() => handleDeleteEvent(event.id)}
                                            className="absolute top-2 right-2 p-2 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 size={14} />
                                        </button>

                                        <div className="flex justify-between items-start mb-2 pr-6">
                                            <span className="text-sm font-medium text-secondary/90 font-mono tracking-tighter bg-secondary/5 px-2 py-0.5 rounded-md">
                                                {event.time}
                                            </span>
                                            <Icon size={16} className="text-gray-400" />
                                        </div>
                                        <h3 className="font-serif text-lg text-gray-900 leading-snug mb-1">
                                            {event.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 font-light leading-relaxed whitespace-pre-wrap">
                                            {event.description}
                                        </p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
            </div>

            {/* FAB */}
            <button
                onClick={() => setIsAdding(true)}
                className="fixed bottom-24 right-6 bg-primary text-white p-4 rounded-full shadow-lg shadow-primary/30 hover:scale-105 transition-transform z-30"
            >
                <Plus size={24} />
            </button>

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
                                <h2 className="font-serif text-xl">予定を追加</h2>
                                <button onClick={() => setIsAdding(false)}><X size={20} className="text-gray-400" /></button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">タイトル</label>
                                    <input
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        placeholder="例: ランチ @ Sol"
                                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">時間</label>
                                        <input
                                            type="time"
                                            value={newEvent.time}
                                            onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">タイプ</label>
                                        <select
                                            value={newEvent.type}
                                            onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value as EventType })}
                                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        >
                                            <option value="activity">観光 (Activity)</option>
                                            <option value="transit">移動 (Transit)</option>
                                            <option value="food">食事 (Food)</option>
                                            <option value="stay">宿泊 (Stay)</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">メモ</label>
                                    <textarea
                                        value={newEvent.description}
                                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20 h-24 resize-none"
                                    />
                                </div>
                                <button
                                    onClick={handleAddEvent}
                                    className="w-full py-4 bg-primary text-white font-medium rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform"
                                >
                                    追加
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
