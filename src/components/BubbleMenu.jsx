'use client';

import { useRef, useState } from 'react';
import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react/menus';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Highlighter,
    Link as LinkIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Palette,
    X,
    Check,
} from 'lucide-react';

gsap.registerPlugin(useGSAP);

const HIGHLIGHT_COLORS = [
    { name: 'Yellow', value: '#fef08a' },
    { name: 'Green', value: '#bbf7d0' },
    { name: 'Blue', value: '#bfdbfe' },
    { name: 'Pink', value: '#fbcfe8' },
    { name: 'Purple', value: '#ddd6fe' },
    { name: 'Orange', value: '#fed7aa' },
];

const TEXT_COLORS = [
    { name: 'Default', value: null },
    { name: 'Red', value: '#ef4444' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Purple', value: '#8b5cf6' },
];

const BubbleButton = ({ onClick, isActive, icon: Icon, title }) => {
    const btnRef = useRef(null);

    useGSAP(() => {
        const btn = btnRef.current;
        if (!btn) return;
        const onEnter = () => gsap.to(btn, { scale: 1.15, duration: 0.15 });
        const onLeave = () => gsap.to(btn, { scale: 1, duration: 0.15 });
        btn.addEventListener('mouseenter', onEnter);
        btn.addEventListener('mouseleave', onLeave);
        return () => {
            btn.removeEventListener('mouseenter', onEnter);
            btn.removeEventListener('mouseleave', onLeave);
        };
    }, { scope: btnRef });

    return (
        <button
            ref={btnRef}
            onClick={onClick}
            title={title}
            className={`p-1.5 rounded-lg transition-colors ${isActive
                ? 'bg-blue-500/20 text-blue-400'
                : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
        >
            <Icon size={14} />
        </button>
    );
};

export const EditorBubbleMenu = ({ editor }) => {
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [showColorPicker, setShowColorPicker] = useState(false);
    const menuRef = useRef(null);

    useGSAP(() => {
        if (menuRef.current) {
            gsap.fromTo(menuRef.current,
                { opacity: 0, y: 8, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'back.out(2)' }
            );
        }
    }, { scope: menuRef });

    const handleSetLink = () => {
        if (linkUrl) {
            editor.chain().focus().setLink({ href: linkUrl }).run();
        }
        setLinkUrl('');
        setShowLinkInput(false);
    };

    const handleRemoveLink = () => {
        editor.chain().focus().unsetLink().run();
        setShowLinkInput(false);
    };

    if (!editor) return null;

    return (
        <TiptapBubbleMenu
            editor={editor}
            tippyOptions={{
                duration: 150,
                placement: 'top',
                arrow: false,
            }}
            className="bubble-menu-container"
        >
            <div
                ref={menuRef}
                className="flex items-center gap-0.5 p-1.5 rounded-xl bg-slate-900/95 backdrop-blur-xl border border-white/10 shadow-2xl"
            >
                {showLinkInput ? (
                    <div className="flex items-center gap-2 px-2">
                        <input
                            type="url"
                            placeholder="Enter URL..."
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSetLink()}
                            className="bg-transparent text-white text-xs w-40 outline-none placeholder:text-slate-500"
                            autoFocus
                        />
                        <button onClick={handleSetLink} className="text-green-400 hover:text-green-300">
                            <Check size={14} />
                        </button>
                        <button onClick={() => setShowLinkInput(false)} className="text-slate-400 hover:text-white">
                            <X size={14} />
                        </button>
                        {editor.isActive('link') && (
                            <button onClick={handleRemoveLink} className="text-red-400 hover:text-red-300 text-[10px]">
                                Remove
                            </button>
                        )}
                    </div>
                ) : showColorPicker ? (
                    <div className="flex flex-col gap-2 p-2">
                        <div className="flex items-center gap-1">
                            <span className="text-[9px] text-slate-500 uppercase font-bold mr-2">Highlight</span>
                            {HIGHLIGHT_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => {
                                        editor.chain().focus().toggleHighlight({ color: color.value }).run();
                                        setShowColorPicker(false);
                                    }}
                                    className="w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform"
                                    style={{ backgroundColor: color.value }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-[9px] text-slate-500 uppercase font-bold mr-2">Text</span>
                            {TEXT_COLORS.map((color) => (
                                <button
                                    key={color.value || 'default'}
                                    onClick={() => {
                                        if (color.value) {
                                            editor.chain().focus().setColor(color.value).run();
                                        } else {
                                            editor.chain().focus().unsetColor().run();
                                        }
                                        setShowColorPicker(false);
                                    }}
                                    className={`w-5 h-5 rounded-full border border-white/20 hover:scale-110 transition-transform ${!color.value ? 'bg-gradient-to-br from-white to-slate-400' : ''
                                        }`}
                                    style={color.value ? { backgroundColor: color.value } : {}}
                                    title={color.name}
                                />
                            ))}
                        </div>
                        <button
                            onClick={() => setShowColorPicker(false)}
                            className="text-[10px] text-slate-400 hover:text-white mt-1"
                        >
                            Done
                        </button>
                    </div>
                ) : (
                    <>
                        <BubbleButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            isActive={editor.isActive('bold')}
                            icon={Bold}
                            title="Bold (Ctrl+B)"
                        />
                        <BubbleButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            isActive={editor.isActive('italic')}
                            icon={Italic}
                            title="Italic (Ctrl+I)"
                        />
                        <BubbleButton
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            isActive={editor.isActive('underline')}
                            icon={UnderlineIcon}
                            title="Underline (Ctrl+U)"
                        />

                        <div className="w-px h-4 bg-white/10 mx-1" />

                        <BubbleButton
                            onClick={() => editor.chain().focus().toggleHighlight().run()}
                            isActive={editor.isActive('highlight')}
                            icon={Highlighter}
                            title="Highlight"
                        />
                        <BubbleButton
                            onClick={() => setShowColorPicker(true)}
                            icon={Palette}
                            title="Colors"
                        />

                        <div className="w-px h-4 bg-white/10 mx-1" />

                        <BubbleButton
                            onClick={() => setShowLinkInput(true)}
                            isActive={editor.isActive('link')}
                            icon={LinkIcon}
                            title="Add Link"
                        />

                        <div className="w-px h-4 bg-white/10 mx-1" />

                        <BubbleButton
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            isActive={editor.isActive({ textAlign: 'left' })}
                            icon={AlignLeft}
                            title="Align Left"
                        />
                        <BubbleButton
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            isActive={editor.isActive({ textAlign: 'center' })}
                            icon={AlignCenter}
                            title="Align Center"
                        />
                        <BubbleButton
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            isActive={editor.isActive({ textAlign: 'right' })}
                            icon={AlignRight}
                            title="Align Right"
                        />
                    </>
                )}
            </div>
        </TiptapBubbleMenu>
    );
};
