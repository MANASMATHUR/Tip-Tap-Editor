'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, Keyboard } from 'lucide-react';

gsap.registerPlugin(useGSAP);

const SHORTCUTS = {
    'Text Formatting': [
        { keys: ['Ctrl', 'B'], action: 'Bold' },
        { keys: ['Ctrl', 'I'], action: 'Italic' },
        { keys: ['Ctrl', 'U'], action: 'Underline' },
        { keys: ['Ctrl', 'Shift', 'H'], action: 'Highlight' },
        { keys: ['Ctrl', 'Shift', 'X'], action: 'Strikethrough' },
    ],
    'Paragraphs': [
        { keys: ['Ctrl', 'Alt', '1'], action: 'Heading 1' },
        { keys: ['Ctrl', 'Alt', '2'], action: 'Heading 2' },
        { keys: ['Ctrl', 'Alt', '3'], action: 'Heading 3' },
        { keys: ['Ctrl', 'Alt', '0'], action: 'Paragraph' },
    ],
    'Lists': [
        { keys: ['Ctrl', 'Shift', '8'], action: 'Bullet List' },
        { keys: ['Ctrl', 'Shift', '7'], action: 'Numbered List' },
        { keys: ['Ctrl', 'Shift', '9'], action: 'Task List' },
    ],
    'Actions': [
        { keys: ['Ctrl', 'Z'], action: 'Undo' },
        { keys: ['Ctrl', 'Shift', 'Z'], action: 'Redo' },
        { keys: ['Ctrl', 'P'], action: 'Print' },
        { keys: ['Ctrl', 'F'], action: 'Find & Replace' },
        { keys: ['Ctrl', 'S'], action: 'Save' },
    ],
    'Editor': [
        { keys: ['/'], action: 'Open Command Palette' },
        { keys: ['Esc'], action: 'Close Modal / Focus Mode' },
        { keys: ['Ctrl', 'Shift', 'E'], action: 'Export' },
    ],
};

export const ShortcutsModal = ({ isOpen, onClose }) => {
    const modalRef = useRef(null);
    const overlayRef = useRef(null);

    useGSAP(() => {
        if (isOpen) {
            gsap.fromTo(overlayRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 0.2 }
            );
            gsap.fromTo(modalRef.current,
                { opacity: 0, scale: 0.9, y: 20 },
                { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'back.out(2)' }
            );
        }
    }, { dependencies: [isOpen] });

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className="bg-slate-900/98 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-xl">
                            <Keyboard size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
                            <p className="text-xs text-slate-500">Master your workflow</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto max-h-[60vh] grid grid-cols-2 gap-6">
                    {Object.entries(SHORTCUTS).map(([category, shortcuts]) => (
                        <div key={category}>
                            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                                {category}
                            </h3>
                            <div className="space-y-2">
                                {shortcuts.map((shortcut, idx) => (
                                    <div key={idx} className="flex items-center justify-between">
                                        <span className="text-sm text-slate-300">{shortcut.action}</span>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key, keyIdx) => (
                                                <kbd
                                                    key={keyIdx}
                                                    className="px-2 py-1 text-[10px] font-medium bg-slate-800 text-slate-300 rounded-lg border border-white/10"
                                                >
                                                    {key}
                                                </kbd>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-white/5 text-center">
                    <span className="text-[10px] text-slate-600">
                        Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">Esc</kbd> to close
                    </span>
                </div>
            </div>
        </div>
    );
};
