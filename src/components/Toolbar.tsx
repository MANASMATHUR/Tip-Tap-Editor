'use client';

import { Editor } from '@tiptap/react';
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
    Type,
    Heading1,
    Heading2,
    Link as LinkIcon,
} from 'lucide-react';

interface ToolbarProps {
    editor: Editor | null;
}

export const Toolbar = ({ editor }: ToolbarProps) => {
    if (!editor) return null;

    const btnClass = (active: boolean) =>
        `p-2 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${active
            ? 'bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)] border border-blue-500/20'
            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
        }`;

    const groupClass = "flex items-center gap-1.5 px-3 border-r border-white/5 last:border-0";

    return (
        <div className="glass-dark rounded-2xl p-2.5 flex flex-col gap-2 shadow-2xl">
            <div className="flex items-center justify-between">
                {/* History & Meta */}
                <div className={groupClass}>
                    <button onClick={() => editor.chain().focus().undo().run()} className={btnClass(false)} title="Undo">
                        <Undo size={16} strokeWidth={2} />
                    </button>
                    <button onClick={() => editor.chain().focus().redo().run()} className={btnClass(false)} title="Redo">
                        <Redo size={16} strokeWidth={2} />
                    </button>
                </div>

                {/* Typography */}
                <div className={groupClass}>
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={btnClass(editor.isActive('bold'))}
                        title="Bold"
                    >
                        <Bold size={16} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={btnClass(editor.isActive('italic'))}
                        title="Italic"
                    >
                        <Italic size={16} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={btnClass(editor.isActive('underline'))}
                        title="Underline"
                    >
                        <UnderlineIcon size={16} strokeWidth={2.5} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHighlight().run()}
                        className={btnClass(editor.isActive('highlight'))}
                        title="Highlight"
                    >
                        <Highlighter size={16} strokeWidth={2} />
                    </button>
                </div>

                {/* Alignment */}
                <div className={groupClass}>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        className={btnClass(editor.isActive({ textAlign: 'left' }))}
                    >
                        <AlignLeft size={16} strokeWidth={2} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        className={btnClass(editor.isActive({ textAlign: 'center' }))}
                    >
                        <AlignCenter size={16} strokeWidth={2} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        className={btnClass(editor.isActive({ textAlign: 'right' }))}
                    >
                        <AlignRight size={16} strokeWidth={2} />
                    </button>
                </div>

                {/* Lists & Tasks */}
                <div className={groupClass}>
                    <button
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={btnClass(editor.isActive('bulletList'))}
                    >
                        <List size={16} strokeWidth={2} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={btnClass(editor.isActive('orderedList'))}
                    >
                        <ListOrdered size={16} strokeWidth={2} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                        className={btnClass(editor.isActive('taskList'))}
                    >
                        <CheckSquare size={16} strokeWidth={2} />
                    </button>
                </div>

                {/* Insertables */}
                <div className={groupClass}>
                    <button
                        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                        className={btnClass(false)}
                        title="Insert Table"
                    >
                        <TableIcon size={16} strokeWidth={2} />
                    </button>
                    <button
                        onClick={() => {
                            const url = window.prompt('URL');
                            if (url) {
                                editor.chain().focus().setImage({ src: url }).run();
                            }
                        }}
                        className={btnClass(false)}
                        title="Insert Image"
                    >
                        <ImageIcon size={16} strokeWidth={2} />
                    </button>
                    <button
                        onClick={() => {
                            const url = window.prompt('URL');
                            if (url) {
                                editor.chain().focus().toggleLink({ href: url }).run();
                            }
                        }}
                        className={btnClass(editor.isActive('link'))}
                    >
                        <LinkIcon size={16} strokeWidth={2} />
                    </button>
                </div>

                <div className="flex-grow" />

                {/* Print Action */}
                <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl transition-all shadow-[0_4px_20px_rgba(37,99,235,0.3)] active:scale-95 group font-medium text-sm"
                >
                    <Printer size={16} className="group-hover:scale-110 transition-transform" />
                    <span>Generate PDF</span>
                </button>
            </div>

            {/* Headings & Text Styles */}
            <div className="flex items-center gap-2 pl-3 pt-1.5 border-t border-white/5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2">Styles</span>
                <button
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${editor.isActive('paragraph') ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'
                        }`}
                >
                    Body
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${editor.isActive('heading', { level: 1 }) ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'
                        }`}
                >
                    Heading 1
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'
                        }`}
                >
                    Heading 2
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${editor.isActive('heading', { level: 3 }) ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300'
                        }`}
                >
                    Subheading
                </button>
            </div>
        </div>
    );
};
