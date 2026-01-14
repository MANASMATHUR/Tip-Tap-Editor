'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
    Type,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    CheckSquare,
    Table,
    Image as ImageIcon,
    Code,
    Quote,
    Minus,
    Sparkles,
} from 'lucide-react';

gsap.registerPlugin(useGSAP);

const COMMANDS = [
    { id: 'paragraph', label: 'Text', description: 'Plain paragraph text', icon: Type, category: 'Basic' },
    { id: 'heading1', label: 'Heading 1', description: 'Large section heading', icon: Heading1, category: 'Basic' },
    { id: 'heading2', label: 'Heading 2', description: 'Medium section heading', icon: Heading2, category: 'Basic' },
    { id: 'heading3', label: 'Heading 3', description: 'Small section heading', icon: Heading3, category: 'Basic' },
    { id: 'bulletList', label: 'Bullet List', description: 'Unordered list', icon: List, category: 'Lists' },
    { id: 'orderedList', label: 'Numbered List', description: 'Ordered list', icon: ListOrdered, category: 'Lists' },
    { id: 'taskList', label: 'Task List', description: 'Checklist with toggles', icon: CheckSquare, category: 'Lists' },
    { id: 'table', label: 'Table', description: '3x3 table', icon: Table, category: 'Blocks' },
    { id: 'image', label: 'Image', description: 'Insert image from URL', icon: ImageIcon, category: 'Blocks' },
    { id: 'codeBlock', label: 'Code Block', description: 'Code with syntax highlighting', icon: Code, category: 'Blocks' },
    { id: 'blockquote', label: 'Quote', description: 'Quotation block', icon: Quote, category: 'Blocks' },
    { id: 'horizontalRule', label: 'Divider', description: 'Horizontal line', icon: Minus, category: 'Blocks' },
];

export const CommandPalette = ({ editor, isOpen, onClose, position }) => {
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const paletteRef = useRef(null);
    const inputRef = useRef(null);

    const filteredCommands = COMMANDS.filter(cmd =>
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.description.toLowerCase().includes(query.toLowerCase())
    );

    useGSAP(() => {
        if (isOpen && paletteRef.current) {
            gsap.fromTo(paletteRef.current,
                { opacity: 0, y: -10, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'back.out(2)' }
            );
        }
    }, { dependencies: [isOpen] });

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const executeCommand = useCallback((commandId) => {
        if (!editor) return;

        switch (commandId) {
            case 'paragraph':
                editor.chain().focus().setParagraph().run();
                break;
            case 'heading1':
                editor.chain().focus().toggleHeading({ level: 1 }).run();
                break;
            case 'heading2':
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                break;
            case 'heading3':
                editor.chain().focus().toggleHeading({ level: 3 }).run();
                break;
            case 'bulletList':
                editor.chain().focus().toggleBulletList().run();
                break;
            case 'orderedList':
                editor.chain().focus().toggleOrderedList().run();
                break;
            case 'taskList':
                editor.chain().focus().toggleTaskList().run();
                break;
            case 'table':
                editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                break;
            case 'image':
                const url = window.prompt('Enter image URL:');
                if (url) editor.chain().focus().setImage({ src: url }).run();
                break;
            case 'codeBlock':
                editor.chain().focus().toggleCodeBlock().run();
                break;
            case 'blockquote':
                editor.chain().focus().toggleBlockquote().run();
                break;
            case 'horizontalRule':
                editor.chain().focus().setHorizontalRule().run();
                break;
            default:
                break;
        }

        onClose();
        setQuery('');
    }, [editor, onClose]);

    const handleKeyDown = useCallback((e) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1));
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => Math.max(prev - 1, 0));
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredCommands[selectedIndex]) {
                    executeCommand(filteredCommands[selectedIndex].id);
                }
                break;
            case 'Escape':
                e.preventDefault();
                onClose();
                setQuery('');
                break;
            default:
                break;
        }
    }, [isOpen, filteredCommands, selectedIndex, executeCommand, onClose]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (!isOpen) return null;

    const groupedCommands = filteredCommands.reduce((acc, cmd) => {
        if (!acc[cmd.category]) acc[cmd.category] = [];
        acc[cmd.category].push(cmd);
        return acc;
    }, {});

    return (
        <div
            ref={paletteRef}
            className="fixed z-[100] w-72 bg-slate-900/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            style={{
                left: position?.x || '50%',
                top: position?.y || '50%',
                transform: position ? 'none' : 'translate(-50%, -50%)',
            }}
        >
            <div className="p-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-blue-400" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search commands..."
                        className="bg-transparent text-white text-sm w-full outline-none placeholder:text-slate-500"
                    />
                </div>
            </div>

            <div className="max-h-80 overflow-y-auto p-2">
                {Object.entries(groupedCommands).map(([category, commands]) => (
                    <div key={category} className="mb-3 last:mb-0">
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-1 block">
                            {category}
                        </span>
                        {commands.map((cmd, idx) => {
                            const globalIdx = filteredCommands.findIndex(c => c.id === cmd.id);
                            const Icon = cmd.icon;
                            return (
                                <button
                                    key={cmd.id}
                                    onClick={() => executeCommand(cmd.id)}
                                    className={`w-full flex items-center gap-3 p-2 rounded-xl transition-all ${globalIdx === selectedIndex
                                            ? 'bg-blue-500/20 text-white'
                                            : 'text-slate-300 hover:bg-white/5'
                                        }`}
                                >
                                    <div className={`p-1.5 rounded-lg ${globalIdx === selectedIndex ? 'bg-blue-500/30' : 'bg-white/5'
                                        }`}>
                                        <Icon size={14} />
                                    </div>
                                    <div className="text-left">
                                        <span className="text-sm font-medium block">{cmd.label}</span>
                                        <span className="text-[10px] text-slate-500">{cmd.description}</span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ))}

                {filteredCommands.length === 0 && (
                    <p className="text-center text-slate-500 text-sm py-4">No commands found</p>
                )}
            </div>

            <div className="p-2 border-t border-white/5 text-center">
                <span className="text-[9px] text-slate-600">
                    ↑↓ Navigate • Enter Select • Esc Close
                </span>
            </div>
        </div>
    );
};
