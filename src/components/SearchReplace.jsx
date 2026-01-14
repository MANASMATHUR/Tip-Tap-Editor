'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Search, X, ChevronUp, ChevronDown, Replace, RotateCcw } from 'lucide-react';

gsap.registerPlugin(useGSAP);

export const SearchReplace = ({ editor, isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [replaceTerm, setReplaceTerm] = useState('');
    const [matchCount, setMatchCount] = useState(0);
    const [currentMatch, setCurrentMatch] = useState(0);
    const [caseSensitive, setCaseSensitive] = useState(false);
    const [showReplace, setShowReplace] = useState(false);
    const panelRef = useRef(null);
    const searchInputRef = useRef(null);

    useGSAP(() => {
        if (isOpen && panelRef.current) {
            gsap.fromTo(panelRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.25, ease: 'power3.out' }
            );
        }
    }, { dependencies: [isOpen] });

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const findMatches = useCallback(() => {
        if (!editor || !searchTerm) {
            setMatchCount(0);
            setCurrentMatch(0);
            return [];
        }

        const text = editor.getText();
        const searchText = caseSensitive ? searchTerm : searchTerm.toLowerCase();
        const sourceText = caseSensitive ? text : text.toLowerCase();

        const matches = [];
        let index = sourceText.indexOf(searchText);
        while (index !== -1) {
            matches.push(index);
            index = sourceText.indexOf(searchText, index + 1);
        }

        setMatchCount(matches.length);
        return matches;
    }, [editor, searchTerm, caseSensitive]);

    useEffect(() => {
        const matches = findMatches();
        if (matches.length > 0 && currentMatch === 0) {
            setCurrentMatch(1);
        } else if (matches.length === 0) {
            setCurrentMatch(0);
        }
    }, [searchTerm, caseSensitive, findMatches, currentMatch]);

    const goToMatch = useCallback((direction) => {
        if (matchCount === 0) return;

        let newMatch = currentMatch + direction;
        if (newMatch > matchCount) newMatch = 1;
        if (newMatch < 1) newMatch = matchCount;
        setCurrentMatch(newMatch);
    }, [currentMatch, matchCount]);

    const replaceOne = useCallback(() => {
        if (!editor || !searchTerm || matchCount === 0) return;

        const { from, to } = editor.state.selection;
        const selectedText = editor.state.doc.textBetween(from, to);

        if (selectedText.toLowerCase() === searchTerm.toLowerCase()) {
            editor.chain().focus().insertContent(replaceTerm).run();
        }

        // Find next match
        findMatches();
    }, [editor, searchTerm, replaceTerm, matchCount, findMatches]);

    const replaceAll = useCallback(() => {
        if (!editor || !searchTerm) return;

        const text = editor.getText();
        const regex = new RegExp(searchTerm, caseSensitive ? 'g' : 'gi');
        const newContent = text.replace(regex, replaceTerm);

        editor.commands.setContent(`<p>${newContent}</p>`);
        setMatchCount(0);
        setCurrentMatch(0);
    }, [editor, searchTerm, replaceTerm, caseSensitive]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                goToMatch(1);
            } else if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                goToMatch(-1);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, goToMatch]);

    if (!isOpen) return null;

    return (
        <div
            ref={panelRef}
            className="fixed top-4 right-4 z-[100] w-80 bg-slate-900/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
        >
            <div className="p-3 space-y-3">
                {/* Search Row */}
                <div className="flex items-center gap-2">
                    <div className="flex-1 flex items-center gap-2 bg-slate-800/50 rounded-xl px-3 py-2">
                        <Search size={14} className="text-slate-500" />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Find..."
                            className="bg-transparent text-white text-sm w-full outline-none placeholder:text-slate-500"
                        />
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Replace Row (toggleable) */}
                {showReplace && (
                    <div className="flex items-center gap-2">
                        <div className="flex-1 flex items-center gap-2 bg-slate-800/50 rounded-xl px-3 py-2">
                            <Replace size={14} className="text-slate-500" />
                            <input
                                type="text"
                                value={replaceTerm}
                                onChange={(e) => setReplaceTerm(e.target.value)}
                                placeholder="Replace with..."
                                className="bg-transparent text-white text-sm w-full outline-none placeholder:text-slate-500"
                            />
                        </div>
                    </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => goToMatch(-1)}
                            disabled={matchCount === 0}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all"
                            title="Previous (Shift+Enter)"
                        >
                            <ChevronUp size={16} />
                        </button>
                        <button
                            onClick={() => goToMatch(1)}
                            disabled={matchCount === 0}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 disabled:opacity-30 transition-all"
                            title="Next (Enter)"
                        >
                            <ChevronDown size={16} />
                        </button>
                        <span className="text-xs text-slate-500 min-w-[60px]">
                            {matchCount > 0 ? `${currentMatch} of ${matchCount}` : 'No results'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCaseSensitive(!caseSensitive)}
                            className={`px-2 py-1 text-[10px] font-medium rounded-lg transition-all ${caseSensitive
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                            title="Case Sensitive"
                        >
                            Aa
                        </button>
                        <button
                            onClick={() => setShowReplace(!showReplace)}
                            className={`px-2 py-1 text-[10px] font-medium rounded-lg transition-all ${showReplace
                                    ? 'bg-blue-500/20 text-blue-400'
                                    : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            Replace
                        </button>
                    </div>
                </div>

                {/* Replace Actions */}
                {showReplace && (
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                        <button
                            onClick={replaceOne}
                            disabled={matchCount === 0}
                            className="flex-1 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl disabled:opacity-30 transition-colors"
                        >
                            Replace
                        </button>
                        <button
                            onClick={replaceAll}
                            disabled={matchCount === 0}
                            className="flex-1 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-30 transition-colors"
                        >
                            Replace All
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
