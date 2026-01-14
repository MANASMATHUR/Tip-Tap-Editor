'use client';

import { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Palette, Check } from 'lucide-react';

gsap.registerPlugin(useGSAP);

const TEXT_COLORS = [
    { name: 'Default', value: null },
    { name: 'Gray', value: '#6b7280' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Teal', value: '#14b8a6' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
];

const HIGHLIGHT_COLORS = [
    { name: 'None', value: null },
    { name: 'Yellow', value: '#fef08a' },
    { name: 'Lime', value: '#bef264' },
    { name: 'Green', value: '#86efac' },
    { name: 'Cyan', value: '#67e8f9' },
    { name: 'Blue', value: '#93c5fd' },
    { name: 'Purple', value: '#c4b5fd' },
    { name: 'Pink', value: '#f9a8d4' },
    { name: 'Rose', value: '#fda4af' },
    { name: 'Orange', value: '#fdba74' },
];

export const ColorPicker = ({ editor, isOpen, onClose, triggerRef }) => {
    const [activeTab, setActiveTab] = useState('text');
    const pickerRef = useRef(null);

    useGSAP(() => {
        if (isOpen && pickerRef.current) {
            gsap.fromTo(pickerRef.current,
                { opacity: 0, scale: 0.95, y: -5 },
                { opacity: 1, scale: 1, y: 0, duration: 0.15, ease: 'power2.out' }
            );
        }
    }, { dependencies: [isOpen] });

    const setTextColor = (color) => {
        if (color) {
            editor.chain().focus().setColor(color).run();
        } else {
            editor.chain().focus().unsetColor().run();
        }
        onClose();
    };

    const setHighlightColor = (color) => {
        if (color) {
            editor.chain().focus().toggleHighlight({ color }).run();
        } else {
            editor.chain().focus().unsetHighlight().run();
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            ref={pickerRef}
            className="absolute top-full mt-2 left-0 z-50 w-64 bg-slate-900/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
            {/* Tabs */}
            <div className="flex border-b border-white/5">
                <button
                    onClick={() => setActiveTab('text')}
                    className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === 'text'
                            ? 'text-white bg-white/5'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                >
                    Text Color
                </button>
                <button
                    onClick={() => setActiveTab('highlight')}
                    className={`flex-1 py-2 text-xs font-medium transition-colors ${activeTab === 'highlight'
                            ? 'text-white bg-white/5'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                >
                    Highlight
                </button>
            </div>

            {/* Color Grid */}
            <div className="p-3">
                <div className="grid grid-cols-6 gap-2">
                    {(activeTab === 'text' ? TEXT_COLORS : HIGHLIGHT_COLORS).map((color) => (
                        <button
                            key={color.name}
                            onClick={() => activeTab === 'text' ? setTextColor(color.value) : setHighlightColor(color.value)}
                            className="relative w-8 h-8 rounded-lg border border-white/10 hover:scale-110 transition-transform flex items-center justify-center"
                            style={{ backgroundColor: color.value || 'transparent' }}
                            title={color.name}
                        >
                            {!color.value && (
                                <span className="text-[10px] text-slate-500">∅</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
