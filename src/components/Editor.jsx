'use client';

import { StarterKit } from '@tiptap/starter-kit';
import { Underline } from '@tiptap/extension-underline';
import { TextAlign } from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Highlight } from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Image } from '@tiptap/extension-image';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Link } from '@tiptap/extension-link';
import { Typography } from '@tiptap/extension-typography';
import { CharacterCount } from '@tiptap/extension-character-count';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';

import { EditorContent, useEditor } from '@tiptap/react';
import { useEffect, useState, useRef } from 'react';

// Hooks
import { useAutoSave } from '@/hooks/useAutoSave';

// Icons
import {
    LayoutGrid,
    Hand,
    MousePointer2,
    Type,
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    CheckSquare,
    ImageIcon,
    Undo,
    Redo,
    ChevronLeft,
    ChevronRight,
    Minus,
    Plus,
    Maximize2,
    Highlighter,
    Link as LinkIcon,
    Table as TableIcon,
    Code,
    Quote,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Heading1,
    Heading2,
    Heading3,
    FileText,
    Printer,
    Palette,
    Upload,
} from 'lucide-react';

import { EDITOR_LAYOUT } from '@/config/editorConfig';

// Create lowlight instance
const lowlight = createLowlight(common);

// Highlight Colors
const HIGHLIGHT_COLORS = [
    { name: 'Yellow', value: '#fef08a' },
    { name: 'Green', value: '#bbf7d0' },
    { name: 'Blue', value: '#bfdbfe' },
    { name: 'Pink', value: '#fbcfe8' },
    { name: 'Purple', value: '#ddd6fe' },
    { name: 'Orange', value: '#fed7aa' },
    { name: 'Red', value: '#fecaca' },
    { name: 'Cyan', value: '#a5f3fc' },
];

// Text Colors
const TEXT_COLORS = [
    { name: 'Default', value: null },
    { name: 'Gray', value: '#6b7280' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' },
];

// Toolbar Button Component
const ToolbarBtn = ({ icon: Icon, onClick, isActive, title, disabled, children, className = '' }) => (
    <button
        onClick={onClick}
        title={title}
        disabled={disabled}
        className={`p-2 rounded-lg transition-all flex items-center gap-1 ${disabled ? 'opacity-40 cursor-not-allowed' :
                isActive
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100 active:bg-gray-200'
            } ${className}`}
    >
        <Icon size={18} />
        {children}
    </button>
);

// Color Picker Dropdown
const ColorPickerDropdown = ({ isOpen, onClose, onSelectHighlight, onSelectText, activeHighlight, activeTextColor }) => {
    if (!isOpen) return null;

    return (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-3 w-64">
            {/* Highlight Colors */}
            <div className="mb-3">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Highlight</span>
                <div className="grid grid-cols-8 gap-1">
                    <button
                        onClick={() => { onSelectHighlight(null); onClose(); }}
                        className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center text-xs text-gray-400 hover:bg-gray-100"
                        title="Remove highlight"
                    >
                        ✕
                    </button>
                    {HIGHLIGHT_COLORS.map((color) => (
                        <button
                            key={color.value}
                            onClick={() => { onSelectHighlight(color.value); onClose(); }}
                            className={`w-6 h-6 rounded border-2 hover:scale-110 transition-transform ${activeHighlight === color.value ? 'border-blue-500' : 'border-transparent'
                                }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                        />
                    ))}
                </div>
            </div>

            {/* Text Colors */}
            <div>
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Text Color</span>
                <div className="grid grid-cols-8 gap-1">
                    {TEXT_COLORS.map((color) => (
                        <button
                            key={color.value || 'default'}
                            onClick={() => { onSelectText(color.value); onClose(); }}
                            className={`w-6 h-6 rounded border-2 hover:scale-110 transition-transform ${activeTextColor === color.value ? 'border-blue-500' : 'border-gray-200'
                                } ${!color.value ? 'bg-gradient-to-br from-gray-100 to-gray-300' : ''}`}
                            style={color.value ? { backgroundColor: color.value } : {}}
                            title={color.name}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// Heading Dropdown
const HeadingDropdown = ({ isOpen, onClose, editor }) => {
    if (!isOpen) return null;

    const items = [
        { icon: Type, label: 'Paragraph', action: () => editor.chain().focus().setParagraph().run(), active: editor.isActive('paragraph') },
        { icon: Heading1, label: 'Heading 1', action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), active: editor.isActive('heading', { level: 1 }) },
        { icon: Heading2, label: 'Heading 2', action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), active: editor.isActive('heading', { level: 2 }) },
        { icon: Heading3, label: 'Heading 3', action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), active: editor.isActive('heading', { level: 3 }) },
    ];

    return (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 min-w-[160px] py-1">
            {items.map((item, i) => (
                <button
                    key={i}
                    onClick={() => { item.action(); onClose(); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 ${item.active ? 'text-blue-600 bg-blue-50' : 'text-gray-700'}`}
                >
                    <item.icon size={16} />
                    <span>{item.label}</span>
                </button>
            ))}
        </div>
    );
};

// Page Thumbnail Component
const PageThumbnail = ({ pageNum, isActive, onClick }) => (
    <div
        onClick={onClick}
        className={`relative cursor-pointer transition-all duration-200 ${isActive ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'
            }`}
    >
        <div className="w-24 h-32 bg-white border border-gray-200 shadow-sm rounded overflow-hidden">
            <div className="p-2 flex items-center justify-center h-full">
                <FileText size={24} className="text-gray-300" />
            </div>
        </div>
        <div className="flex items-center justify-center mt-1">
            <span className="text-xs text-gray-500">{pageNum}</span>
        </div>
        {isActive && (
            <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r" />
        )}
    </div>
);

export default function Editor() {
    // State
    const [currentPage, setCurrentPage] = useState(1);
    const [zoom, setZoom] = useState(100);
    const [pageCount, setPageCount] = useState(1);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [activeTool, setActiveTool] = useState('select');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [showHeadingMenu, setShowHeadingMenu] = useState(false);

    // Refs
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);

    // Editor Instance
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                codeBlock: false,
            }),
            Underline,
            Highlight.configure({ multicolor: true }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Placeholder.configure({
                placeholder: 'Start typing...',
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
            CharacterCount,
            TextStyle,
            Color,
            CodeBlockLowlight.configure({ lowlight }),
        ],
        immediatelyRender: false,
        content: `
            <h1>Welcome to OpenSphere</h1>
            <p>A modern document editor with PDF-style interface.</p>
            <h2>Features</h2>
            <ul>
                <li>Rich text formatting with <strong>colors</strong></li>
                <li>Upload images from your device</li>
                <li>Highlight text with multiple colors</li>
                <li>Tables and task lists</li>
                <li>Auto-save to local storage</li>
            </ul>
            <h2>Getting Started</h2>
            <p>Use the toolbar above to format your text. Try the following:</p>
            <ul data-type="taskList">
                <li data-checked="false">Select text and use the color picker 🎨</li>
                <li data-checked="false">Upload an image using the image button 📷</li>
                <li data-checked="false">Try different highlight colors</li>
            </ul>
        `,
        editorProps: {
            attributes: {
                class: 'prose prose-slate focus:outline-none max-w-none min-h-full',
            },
        },
        onUpdate: () => {
            requestAnimationFrame(() => calculatePages());
        },
    });

    // Auto-save hook
    const { saveStatus } = useAutoSave(editor);

    // Calculate pages
    const calculatePages = () => {
        if (editorRef.current) {
            const contentHeight = editorRef.current.scrollHeight;
            const pageHeight = 792;
            const estimatedPages = Math.max(1, Math.ceil(contentHeight / pageHeight));
            setPageCount(estimatedPages);
        }
    };

    useEffect(() => {
        if (!editorRef.current) return;
        const observer = new ResizeObserver(() => calculatePages());
        observer.observe(editorRef.current);
        return () => observer.disconnect();
    }, [editor]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.color-picker-container') && !e.target.closest('.heading-menu-container')) {
                setShowColorPicker(false);
                setShowHeadingMenu(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Zoom controls
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
    const handleFitWidth = () => setZoom(100);

    // Page navigation
    const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
    const goToNextPage = () => setCurrentPage(prev => Math.min(pageCount, prev + 1));

    // Image upload from device
    const handleImageUpload = (e) => {
        const file = e.target.files?.[0];
        if (file && editor) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result;
                if (base64) {
                    editor.chain().focus().setImage({ src: base64 }).run();
                }
            };
            reader.readAsDataURL(file);
        }
        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Color actions
    const handleHighlight = (color) => {
        if (color) {
            editor?.chain().focus().toggleHighlight({ color }).run();
        } else {
            editor?.chain().focus().unsetHighlight().run();
        }
    };

    const handleTextColor = (color) => {
        if (color) {
            editor?.chain().focus().setColor(color).run();
        } else {
            editor?.chain().focus().unsetColor().run();
        }
    };

    const addLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) editor?.chain().focus().toggleLink({ href: url }).run();
    };

    const insertTable = () => {
        editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    if (!editor) return null;

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden">
            {/* Hidden file input for image upload */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />

            {/* Top Toolbar */}
            <div className="h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-1">
                {/* View Controls */}
                <div className="flex items-center gap-1 pr-3 border-r border-gray-200">
                    <ToolbarBtn
                        icon={LayoutGrid}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        isActive={sidebarOpen}
                        title="Toggle Pages Sidebar"
                    />
                    <ToolbarBtn
                        icon={Hand}
                        onClick={() => setActiveTool('hand')}
                        isActive={activeTool === 'hand'}
                        title="Pan Tool"
                    />
                    <ToolbarBtn
                        icon={MousePointer2}
                        onClick={() => setActiveTool('select')}
                        isActive={activeTool === 'select'}
                        title="Select Tool"
                    />
                </div>

                {/* Heading Selector */}
                <div className="relative heading-menu-container px-2 border-r border-gray-200">
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowHeadingMenu(!showHeadingMenu); setShowColorPicker(false); }}
                        className="flex items-center gap-1 p-2 rounded-lg text-gray-600 hover:bg-gray-100"
                    >
                        <Type size={18} />
                        <ChevronRight size={12} className={`transition-transform ${showHeadingMenu ? 'rotate-90' : ''}`} />
                    </button>
                    <HeadingDropdown isOpen={showHeadingMenu} onClose={() => setShowHeadingMenu(false)} editor={editor} />
                </div>

                {/* Text Formatting */}
                <div className="flex items-center gap-1 px-3 border-r border-gray-200">
                    <ToolbarBtn
                        icon={Bold}
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold (Ctrl+B)"
                    />
                    <ToolbarBtn
                        icon={Italic}
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic (Ctrl+I)"
                    />
                    <ToolbarBtn
                        icon={UnderlineIcon}
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        title="Underline (Ctrl+U)"
                    />
                    <ToolbarBtn
                        icon={Strikethrough}
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Strikethrough"
                    />

                    {/* Color Picker */}
                    <div className="relative color-picker-container">
                        <button
                            onClick={(e) => { e.stopPropagation(); setShowColorPicker(!showColorPicker); setShowHeadingMenu(false); }}
                            className={`p-2 rounded-lg flex items-center gap-1 ${showColorPicker || editor.isActive('highlight')
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                            title="Colors & Highlight"
                        >
                            <Palette size={18} />
                            <ChevronRight size={12} className={`transition-transform ${showColorPicker ? 'rotate-90' : ''}`} />
                        </button>
                        <ColorPickerDropdown
                            isOpen={showColorPicker}
                            onClose={() => setShowColorPicker(false)}
                            onSelectHighlight={handleHighlight}
                            onSelectText={handleTextColor}
                            activeHighlight={editor.getAttributes('highlight').color}
                            activeTextColor={editor.getAttributes('textStyle').color}
                        />
                    </div>
                </div>

                {/* Alignment */}
                <div className="flex items-center gap-1 px-3 border-r border-gray-200">
                    <ToolbarBtn
                        icon={AlignLeft}
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        isActive={editor.isActive({ textAlign: 'left' })}
                        title="Align Left"
                    />
                    <ToolbarBtn
                        icon={AlignCenter}
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        isActive={editor.isActive({ textAlign: 'center' })}
                        title="Align Center"
                    />
                    <ToolbarBtn
                        icon={AlignRight}
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        isActive={editor.isActive({ textAlign: 'right' })}
                        title="Align Right"
                    />
                </div>

                {/* Lists & Blocks */}
                <div className="flex items-center gap-1 px-3 border-r border-gray-200">
                    <ToolbarBtn
                        icon={List}
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Bullet List"
                    />
                    <ToolbarBtn
                        icon={ListOrdered}
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Numbered List"
                    />
                    <ToolbarBtn
                        icon={CheckSquare}
                        onClick={() => editor.chain().focus().toggleTaskList().run()}
                        isActive={editor.isActive('taskList')}
                        title="Task List"
                    />
                    <ToolbarBtn
                        icon={Quote}
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Blockquote"
                    />
                    <ToolbarBtn
                        icon={Code}
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        isActive={editor.isActive('codeBlock')}
                        title="Code Block"
                    />
                </div>

                {/* Insert */}
                <div className="flex items-center gap-1 px-3 border-r border-gray-200">
                    <ToolbarBtn icon={TableIcon} onClick={insertTable} title="Insert Table" />
                    <ToolbarBtn
                        icon={ImageIcon}
                        onClick={() => fileInputRef.current?.click()}
                        title="Upload Image"
                    />
                    <ToolbarBtn icon={LinkIcon} onClick={addLink} isActive={editor.isActive('link')} title="Add Link" />
                </div>

                {/* Undo/Redo */}
                <div className="flex items-center gap-1 px-3">
                    <ToolbarBtn
                        icon={Undo}
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo (Ctrl+Z)"
                    />
                    <ToolbarBtn
                        icon={Redo}
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo (Ctrl+Shift+Z)"
                    />
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded ${saveStatus === 'saved' ? 'text-green-600 bg-green-50' :
                            saveStatus === 'saving' ? 'text-yellow-600 bg-yellow-50' :
                                'text-gray-500 bg-gray-50'
                        }`}>
                        {saveStatus === 'saved' ? '✓ Saved' : saveStatus === 'saving' ? 'Saving...' : 'Auto-save'}
                    </span>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                    >
                        <Printer size={16} />
                        <span>Print</span>
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Sidebar - Page Thumbnails */}
                <div
                    className={`bg-gray-50 border-r border-gray-200 transition-all duration-300 overflow-hidden ${sidebarOpen ? 'w-40' : 'w-0'
                        }`}
                >
                    <div className="p-4 space-y-4 overflow-y-auto h-full">
                        {Array.from({ length: pageCount }).map((_, i) => (
                            <PageThumbnail
                                key={i}
                                pageNum={i + 1}
                                isActive={currentPage === i + 1}
                                onClick={() => setCurrentPage(i + 1)}
                            />
                        ))}

                        {/* Add Page Button */}
                        <button className="w-full flex items-center justify-center p-3 border-2 border-dashed border-green-400 rounded-lg text-green-500 hover:bg-green-50 transition-colors">
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                {/* Sidebar Toggle */}
                <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="w-4 bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                >
                    <ChevronLeft size={12} className={`text-gray-500 transition-transform ${sidebarOpen ? '' : 'rotate-180'}`} />
                </button>

                {/* Document View */}
                <div className="flex-1 bg-gray-300 overflow-auto p-8 flex justify-center">
                    <div
                        className="relative"
                        style={{
                            transform: `scale(${zoom / 100})`,
                            transformOrigin: 'top center',
                            transition: 'transform 0.2s ease',
                        }}
                    >
                        {/* Paper */}
                        <div
                            ref={editorRef}
                            className="bg-white shadow-2xl"
                            style={{
                                width: '8.5in',
                                minHeight: '11in',
                                padding: '1in',
                            }}
                        >
                            <EditorContent editor={editor} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Navigation Bar */}
            <div className="h-12 bg-white border-t border-gray-200 flex items-center justify-center gap-4">
                {/* Page Navigation */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={goToPrevPage}
                        disabled={currentPage <= 1}
                        className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg">
                        <input
                            type="number"
                            value={currentPage}
                            onChange={(e) => {
                                const val = parseInt(e.target.value);
                                if (val >= 1 && val <= pageCount) setCurrentPage(val);
                            }}
                            className="w-8 text-center bg-transparent outline-none text-sm font-medium"
                            min={1}
                            max={pageCount}
                        />
                        <span className="text-gray-400">/</span>
                        <span className="text-sm text-gray-600">{pageCount}</span>
                    </div>

                    <button
                        onClick={goToNextPage}
                        disabled={currentPage >= pageCount}
                        className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Divider */}
                <div className="h-6 w-px bg-gray-200" />

                {/* Zoom Controls */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleZoomOut}
                        disabled={zoom <= 50}
                        className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-30"
                    >
                        <Minus size={16} />
                    </button>

                    <span className="text-sm text-gray-600 w-12 text-center">{zoom}%</span>

                    <button
                        onClick={handleZoomIn}
                        disabled={zoom >= 200}
                        className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-100 disabled:opacity-30"
                    >
                        <Plus size={16} />
                    </button>

                    <button
                        onClick={handleFitWidth}
                        className="p-1.5 rounded hover:bg-gray-100"
                        title="Fit to Width"
                    >
                        <Maximize2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
