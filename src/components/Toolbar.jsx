'use client';

import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Undo,
    Redo,
    Printer,
    Highlighter,
    Table as TableIcon,
    CheckSquare,
    Image as ImageIcon,
    Link as LinkIcon,
    Code,
    Quote,
    Minus,
    FileDown,
    LayoutTemplate,
    Keyboard,
    Search,
    Sun,
    Moon,
} from 'lucide-react';

gsap.registerPlugin(useGSAP);

const ToolbarButton = ({ onClick, isActive, icon: Icon, title, className = '' }) => {
    const buttonRef = useRef(null);

    useGSAP(() => {
        const btn = buttonRef.current;
        if (!btn) return;

        const onEnter = () => gsap.to(btn, { scale: 1.1, duration: 0.2, ease: 'back.out(2)' });
        const onLeave = () => gsap.to(btn, { scale: 1, duration: 0.2, ease: 'power2.out' });
        const onDown = () => gsap.to(btn, { scale: 0.95, duration: 0.1 });
        const onUp = () => gsap.to(btn, { scale: 1.1, duration: 0.1 });

        btn.addEventListener('mouseenter', onEnter);
        btn.addEventListener('mouseleave', onLeave);
        btn.addEventListener('mousedown', onDown);
        btn.addEventListener('mouseup', onUp);

        return () => {
            btn.removeEventListener('mouseenter', onEnter);
            btn.removeEventListener('mouseleave', onLeave);
            btn.removeEventListener('mousedown', onDown);
            btn.removeEventListener('mouseup', onUp);
        };
    }, { scope: buttonRef });

    return (
        <button
            ref={buttonRef}
            onClick={onClick}
            title={title}
            className={`p-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${isActive
                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                } ${className}`}
        >
            <Icon size={16} />
        </button>
    );
};

export const Toolbar = ({
    editor,
    onExport,
    onTemplates,
    onShortcuts,
    onThemeToggle,
    isDark
}) => {
    if (!editor) return null;

    const groupClass = "flex items-center gap-1.5 px-3 border-r border-white/5 last:border-0";

    const addImage = () => {
        const url = window.prompt('Enter image URL:');
        if (url) editor.chain().focus().setImage({ src: url }).run();
    };

    const addLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) editor.chain().focus().toggleLink({ href: url }).run();
    };

    return (
        <div className="glass-dark rounded-2xl p-2.5 flex flex-col gap-2 shadow-2xl">
            {/* Main Toolbar Row */}
            <div className="flex items-center justify-between">
                {/* Undo/Redo */}
                <div className={groupClass}>
                    <ToolbarButton onClick={() => editor.chain().focus().undo().run()} icon={Undo} title="Undo (Ctrl+Z)" />
                    <ToolbarButton onClick={() => editor.chain().focus().redo().run()} icon={Redo} title="Redo (Ctrl+Shift+Z)" />
                </div>

                {/* Text Formatting */}
                <div className={groupClass}>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} icon={Bold} title="Bold (Ctrl+B)" />
                    <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} icon={Italic} title="Italic (Ctrl+I)" />
                    <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} icon={UnderlineIcon} title="Underline (Ctrl+U)" />
                    <ToolbarButton onClick={() => editor.chain().focus().toggleHighlight().run()} isActive={editor.isActive('highlight')} icon={Highlighter} title="Highlight" />
                </div>

                {/* Alignment */}
                <div className={groupClass}>
                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} icon={AlignLeft} title="Align Left" />
                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} icon={AlignCenter} title="Align Center" />
                    <ToolbarButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} icon={AlignRight} title="Align Right" />
                </div>

                {/* Lists */}
                <div className={groupClass}>
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} icon={List} title="Bullet List" />
                    <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} icon={ListOrdered} title="Numbered List" />
                    <ToolbarButton onClick={() => editor.chain().focus().toggleTaskList().run()} isActive={editor.isActive('taskList')} icon={CheckSquare} title="Task List" />
                </div>

                {/* Blocks */}
                <div className={groupClass}>
                    <ToolbarButton onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} icon={TableIcon} title="Insert Table" />
                    <ToolbarButton onClick={addImage} icon={ImageIcon} title="Insert Image" />
                    <ToolbarButton onClick={addLink} isActive={editor.isActive('link')} icon={LinkIcon} title="Add Link" />
                    <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} isActive={editor.isActive('codeBlock')} icon={Code} title="Code Block" />
                    <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} icon={Quote} title="Blockquote" />
                    <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} icon={Minus} title="Horizontal Rule" />
                </div>

                <div className="flex-grow" />

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <ToolbarButton onClick={onShortcuts} icon={Keyboard} title="Keyboard Shortcuts (Ctrl+/)" />
                    <ToolbarButton onClick={onTemplates} icon={LayoutTemplate} title="Templates" />
                    <ToolbarButton onClick={onExport} icon={FileDown} title="Export (Ctrl+Shift+E)" />
                    <ToolbarButton
                        onClick={onThemeToggle}
                        icon={isDark ? Sun : Moon}
                        title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
                    />

                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg active:scale-95 text-sm font-medium"
                    >
                        <Printer size={16} />
                        <span>Print PDF</span>
                    </button>
                </div>
            </div>

            {/* Style Buttons Row */}
            <div className="flex items-center gap-2 pl-3 pt-1.5 border-t border-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2">Styles</span>
                <button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={`px-3 py-1 rounded-lg text-xs transition-all ${editor.isActive('paragraph') ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    Body
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${editor.isActive('heading', { level: 1 }) ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    H1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    H2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${editor.isActive('heading', { level: 3 }) ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    H3
                </button>

                <div className="flex-grow" />

                <span className="text-[9px] text-slate-600">
                    Type <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-400">/</kbd> for commands
                </span>
            </div>
        </div>
    );
};
