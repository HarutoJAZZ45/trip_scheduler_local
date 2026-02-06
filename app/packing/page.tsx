"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Plus, ShoppingBag, Wallet, Trash2, X } from "lucide-react";
import { clsx } from "clsx";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// --- Types ---
interface PackingGroup {
    category: string;
    items: { id: string; name: string; checked: boolean }[];
}

interface BudgetItem {
    id: string;
    item: string;
    cost: string;
    paid: boolean;
    amount: number;
}

// --- Initial Data ---
const INITIAL_PACKING: PackingGroup[] = [
    {
        category: "必需品",
        items: [
            { id: '1', name: "パスポート", checked: false },
            { id: '2', name: "eチケット (Apple Wallet)", checked: false },
            { id: '3', name: "クレジットカード (Wise)", checked: false }
        ]
    },
    {
        category: "ガジェット",
        items: [
            { id: '4', name: "充電器 (Type-C)", checked: false },
            { id: '5', name: "モバイルバッテリー", checked: false },
            { id: '6', name: "AirPods", checked: false },
            { id: '7', name: "変換プラグ (Cタイプ)", checked: false }
        ]
    },
    {
        category: "衣類 (2月/3月)",
        items: [
            { id: '8', name: "薄手のダウン", checked: false },
            { id: '9', name: "歩きやすい靴", checked: false },
            { id: '10', name: "サングラス", checked: false },
            { id: '11', name: "ストール・マフラー", checked: false }
        ]
    },
];

const INITIAL_BUDGET: BudgetItem[] = [
    { id: '1', item: "航空券 (TK)", cost: "¥230,000", paid: true, amount: 230000 },
    { id: '2', item: "ホテル代 (合計)", cost: "¥120,000", paid: false, amount: 120000 },
    { id: '3', item: "現地滞在費", cost: "€500", paid: false, amount: 80000 },
];

export default function PackingPage() {
    const [activeTab, setActiveTab] = useState<"packing" | "budget">("packing");

    // Persistence
    const [packingList, setPackingList] = useLocalStorage<PackingGroup[]>("my-packing-list", INITIAL_PACKING);
    const [budgetList, setBudgetList] = useLocalStorage<BudgetItem[]>("my-budget-list", INITIAL_BUDGET);

    // Adding Item State
    const [isAdding, setIsAdding] = useState(false);
    const [newItemName, setNewItemName] = useState("");
    const [newItemCategory, setNewItemCategory] = useState("Essentials");

    const toggleCheck = (categoryIdx: number, itemId: string) => {
        const newList = [...packingList];
        const category = newList[categoryIdx];
        const item = category.items.find(i => i.id === itemId);
        if (item) item.checked = !item.checked;
        setPackingList(newList);
    };

    const addItem = () => {
        if (!newItemName) return;
        const newList = [...packingList];
        let categoryIndex = newList.findIndex(g => g.category === newItemCategory);

        // If adding to a category that doesn't strictly match translation, fallback to first (Usually Essentials/必需品)
        if (categoryIndex === -1) categoryIndex = 0;

        newList[categoryIndex].items.push({
            id: Date.now().toString(),
            name: newItemName,
            checked: false
        });

        setPackingList(newList);
        setNewItemName("");
        setIsAdding(false);
    };

    const deleteItem = (categoryIdx: number, itemId: string) => {
        const newList = [...packingList];
        newList[categoryIdx].items = newList[categoryIdx].items.filter(i => i.id !== itemId);
        setPackingList(newList);
    };

    return (
        <div className="min-h-full bg-slate-50 pb-32">
            {/* Tab Header */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md pt-12 p-6 border-b border-gray-100">
                <h1 className="font-serif text-3xl text-gray-900 mb-6">Preparation</h1>
                <div className="flex p-1 bg-gray-100 rounded-xl relative">
                    <motion.div
                        className="absolute top-1 bottom-1 w-1/2 bg-white rounded-lg shadow-sm"
                        initial={false}
                        animate={{ x: activeTab === "packing" ? 0 : "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                    <button
                        onClick={() => setActiveTab("packing")}
                        className={clsx("flex-1 py-2 text-sm font-medium z-10 text-center transition-colors", activeTab === "packing" ? "text-gray-900" : "text-gray-500")}
                    >
                        Packing
                    </button>
                    <button
                        onClick={() => setActiveTab("budget")}
                        className={clsx("flex-1 py-2 text-sm font-medium z-10 text-center transition-colors", activeTab === "budget" ? "text-gray-900" : "text-gray-500")}
                    >
                        Budget
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <AnimatePresence mode="wait">
                    {activeTab === "packing" ? (
                        <motion.div
                            key="packing"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            {packingList.map((group, gIdx) => (
                                <div key={group.category}>
                                    <h3 className="text-xs uppercase tracking-widest text-muted font-bold mb-3 pl-1">{group.category}</h3>
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                                        {group.items.map((item) => (
                                            <div key={item.id} className="flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors group justify-between">
                                                <label className="flex items-center flex-1 cursor-pointer">
                                                    <div className="relative flex items-center justify-center w-5 h-5 border-2 border-gray-200 rounded-full group-hover:border-primary transition-colors flex-shrink-0">
                                                        <input
                                                            type="checkbox"
                                                            className="peer appearance-none w-full h-full"
                                                            checked={item.checked}
                                                            onChange={() => toggleCheck(gIdx, item.id)}
                                                        />
                                                        <Check size={12} className="text-white opacity-0 peer-checked:opacity-100 absolute pointer-events-none peer-checked:bg-primary rounded-full w-full h-full p-0.5 transition-opacity" />
                                                        <div className="absolute inset-0 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform -z-10" />
                                                    </div>
                                                    <span className={clsx("ml-3 text-gray-700 font-medium transition-all", item.checked && "text-gray-400 line-through")}>{item.name}</span>
                                                </label>
                                                <button
                                                    onClick={() => deleteItem(gIdx, item.id)}
                                                    className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            <button
                                onClick={() => setIsAdding(true)}
                                className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 text-sm font-medium hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={16} /> アイテムを追加
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="budget"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="bg-gradient-to-br from-primary to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-primary/30 mb-6">
                                <div className="flex items-center gap-2 opacity-80 mb-1">
                                    <Wallet size={16} />
                                    <span className="text-xs tracking-wider uppercase">予算合計 (概算)</span>
                                </div>
                                <div className="text-3xl font-serif">¥430,000+</div>
                                <div className="text-sm opacity-80 mt-1">航空券 + ホテル含む</div>
                            </div>

                            {budgetList.map((item, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className={clsx("w-2 h-2 rounded-full", item.paid ? "bg-emerald-400" : "bg-orange-400")} />
                                        <span className={clsx("font-medium", item.paid ? "text-gray-400 line-through" : "text-gray-900")}>{item.item}</span>
                                    </div>
                                    <span className="font-mono text-gray-600">{item.cost}</span>
                                </div>
                            ))}
                        </motion.div>
                    )}
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
                                <h2 className="font-serif text-xl">アイテム追加</h2>
                                <button onClick={() => setIsAdding(false)}><X size={20} className="text-gray-400" /></button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">名前</label>
                                    <input
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        placeholder="例: 歯ブラシ"
                                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                        autoFocus
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">カテゴリー</label>
                                    <select
                                        value={newItemCategory}
                                        onChange={(e) => setNewItemCategory(e.target.value)}
                                        className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    >
                                        {packingList.map(g => (
                                            <option key={g.category} value={g.category}>{g.category}</option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={addItem}
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
