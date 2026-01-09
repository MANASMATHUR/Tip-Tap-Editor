'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Image } from '@tiptap/extension-image';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Link } from '@tiptap/extension-link';
import { Typography } from '@tiptap/extension-typography';
import { useEffect, useState, useRef } from 'react';
import { Toolbar } from './Toolbar';
import { FileText, Layers, Eye, Maximize2 } from 'lucide-react';

const PAGE_HEIGHT_PX = 1056; // 11in
const MARGIN_PX = 96; // 1in

export default function PremiumEditor() {
    const [pageCount, setPageCount] = useState(1);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isOutlineOpen, setIsOutlineOpen] = useState(false);
    const [headings, setHeadings] = useState<{ text: string, level: number, id: string }[]>([]);
    const editorRef = useRef<HTMLDivElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
            }),
            Underline,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({
                placeholder: 'Start writing your professional document...',
            }),
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
            Image.configure({ inline: true, allowBase64: true }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Link.configure({ openOnClick: false }),
            Typography,
        ],
        immediatelyRender: false,
        content: `
      <h1>Untitled Professional Document</h1>
      <p>This document is prepared using <strong>OpenSphere Editorial</strong>. It supports high-fidelity pagination, professional typography, and advanced editorial features.</p>
      <h2>Executive Summary</h2>
      <p>OpenSphere provides a distraction-free writing environment for legal and professional documents.</p>
      <ul data-type="taskList">
        <li data-checked="true">Review the initial draft</li>
        <li data-checked="false">Add executive summary</li>
        <li data-checked="false">Finalize appendix</li>
      </ul>
      <p></p>
    `,
        editorProps: {
            attributes: {
                class: 'prose prose-slate focus:outline-none max-w-none min-h-[9in]',
            },
        },
        onUpdate: ({ editor }) => {
            requestAnimationFrame(() => {
                calculatePages();
                extractHeadings(editor);
            });
        },
    });

    const extractHeadings = (editor: any) => {
        const items: { text: string, level: number, id: string }[] = [];
        editor.state.doc.descendants((node: any, pos: number) => {
            if (node.type.name === 'heading') {
                items.push({
                    text: node.textContent,
                    level: node.attrs.level,
                    id: `heading-${pos}`
                });
            }
        });
        setHeadings(items);
    };

    const calculatePages = () => {
        if (editorRef.current) {
            const contentHeight = editorRef.current.scrollHeight;
            const usableHeightPerPage = PAGE_HEIGHT_PX - (MARGIN_PX * 2);
            const estimatedPages = Math.max(1, Math.ceil(contentHeight / usableHeightPerPage));
            setPageCount(estimatedPages);
        }
    };

    useEffect(() => {
        if (!editorRef.current) return;
        const observer = new ResizeObserver(() => calculatePages());
        observer.observe(editorRef.current);
        if (editor) extractHeadings(editor);
        return () => observer.disconnect();
    }, [editor]);

    if (!editor) return null;

    return (
        <div className={`flex flex-col items-center min-h-screen transition-all duration-1000 ${isFocusMode ? 'bg-[#030304]' : 'bg-[#0a0a0c]'} pb-32`}>
            {/* Top Navigation / Toolbar Area */}
            <div className={`fixed top-8 z-50 w-full max-w-5xl px-6 transition-all duration-700 ease-in-out ${isFocusMode ? 'opacity-0 -translate-y-20 scale-95 pointer-events-none' : 'opacity-100 translate-y-0 scale-100'}`}>
                <Toolbar editor={editor} />
            </div>

            {/* Main Content Area */}
            <div className={`transition-all duration-1000 w-full flex flex-col items-center ${isFocusMode ? 'mt-20' : 'mt-44'} gap-12 px-4 print:mt-0 print:px-0`}>
                <div className="relative w-full max-w-[8.5in]">

                    {/* Floating Sidebar Actions */}
                    <div className={`fixed left-12 top-1/2 -translate-y-1/2 flex flex-col gap-4 no-print transition-all duration-700 ${isFocusMode ? 'opacity-20 hover:opacity-100 backdrop-blur-sm' : 'opacity-100'}`}>
                        <button
                            onClick={() => setIsFocusMode(!isFocusMode)}
                            className={`p-3.5 rounded-2xl glass transition-all hover:scale-110 group ${isFocusMode ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
                            title="Toggle Focus Mode"
                        >
                            <Eye size={18} className="group-active:scale-90 transition-transform" />
                        </button>
                        <button
                            onClick={() => setIsOutlineOpen(!isOutlineOpen)}
                            className={`p-3.5 rounded-2xl glass transition-all hover:scale-110 hover:text-white hover:bg-white/5 group ${isOutlineOpen ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 'text-slate-500'}`}
                            title="Document Outline"
                        >
                            <Layers size={18} />
                        </button>
                        <div className="w-full h-px bg-white/5 my-2" />
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Pages</span>
                            <span className="text-xs font-bold text-blue-500/80">{pageCount}</span>
                        </div>
                    </div>

                    {/* Document Outline Panel */}
                    <div className={`fixed left-28 top-1/2 -translate-y-1/2 w-64 glass-dark rounded-3xl p-6 transition-all duration-500 no-print z-50 shadow-3xl ${isOutlineOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12 pointer-events-none'}`}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Outline</h3>
                            <div className="w-2 h-2 rounded-full bg-blue-500/50 shadow-[0_0_10px_rgba(59,130,246,0.3)]" />
                        </div>
                        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {headings.length > 0 ? headings.map((h, i) => (
                                <button
                                    key={i}
                                    className={`text-left text-[11px] font-medium transition-all hover:text-white truncate py-1 border-l-2 pl-4 ${h.level === 1 ? 'border-blue-500/60 text-slate-200' : h.level === 2 ? 'border-slate-700 text-slate-400 ml-4' : 'border-slate-800 text-slate-500 ml-8'}`}
                                >
                                    {h.text}
                                </button>
                            )) : (
                                <p className="text-[10px] text-slate-600 italic">No headings found</p>
                            )}
                        </div>
                    </div>

                    {/* Paper Sheets Container */}
                    <div className="relative z-10 transition-all duration-1000">
                        {Array.from({ length: pageCount }).map((_, i) => (
                            <div key={i} className="relative mb-12 last:mb-0 print:mb-0">
                                {/* The Paper Sheet */}
                                <div className="absolute inset-0 bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] rounded-sm no-print" />

                                {/* Content Wrapper for this "Page" visible area */}
                                <div
                                    className={`relative z-20 bg-white print:bg-white transition-all duration-500 ${i === 0 ? 'p-[1in]' : 'p-[0] pt-[0]'}`}
                                    style={{
                                        height: '11in',
                                        padding: i === 0 ? '1in' : '0 1in',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {i === 0 && <EditorContent editor={editor} />}

                                    {/* Page Number Overlay */}
                                    <div className="absolute bottom-10 right-12 text-[10px] font-bold text-slate-300 tracking-widest no-print">
                                        PAGE {i + 1}
                                    </div>
                                </div>

                                {/* Artificial Page Break UI for Web */}
                                {i < pageCount - 1 && (
                                    <div className="page-break-indicator no-print">
                                        <span className="text-[9px] font-black text-slate-800 tracking-[0.4em] uppercase opacity-30">Break</span>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Hidden Actual Content for Page 2+ overflow rendering logic */}
                        {/* Currently we're using a simpler approach where all content is in first sheet but scrollHeight defines pageCount */}
                        {/* To fix the multi-sheet rendering, we'd need a more complex decorator or splitting logic */}
                        {/* For now, let's keep the single content block but adjust the sheets for visual fidelity */}
                        <div
                            ref={editorRef}
                            className="absolute inset-0 z-30 p-[1in] pointer-events-none opacity-0"
                            style={{ minHeight: `${pageCount * 11}in` }}
                        >
                            <EditorContent editor={editor} />
                        </div>

                        {/* Active Interactable Content Overlaid on sheets */}
                        <div
                            className="absolute inset-0 z-40 p-[1in] bg-transparent"
                            style={{ minHeight: `${pageCount * 11}in` }}
                        >
                            <EditorContent editor={editor} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Status Bar */}
            <footer className={`fixed bottom-8 left-1/2 -translate-x-1/2 no-print z-50 transition-all duration-500 ${isFocusMode ? 'opacity-0 translate-y-10' : 'opacity-100'}`}>
                <div className="glass-dark px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Cloud Synced</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-2">
                        <FileText size={14} className="text-slate-500" />
                        <span className="text-xs font-semibold text-slate-300 tracking-tight">Standard US Letter</span>
                    </div>
                    <div className="w-px h-4 bg-white/10" />
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter bg-blue-500/10 px-2 py-0.5 rounded leading-none">{pageCount} {pageCount === 1 ? 'PAGE' : 'PAGES'}</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
