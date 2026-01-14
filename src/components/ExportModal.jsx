'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, FileDown, FileText, Code, FileType } from 'lucide-react';

gsap.registerPlugin(useGSAP);

export const ExportModal = ({ editor, isOpen, onClose }) => {
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

    const downloadFile = (content, filename, type) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        onClose();
    };

    const exportAsMarkdown = () => {
        if (!editor) return;

        // Convert HTML to basic Markdown
        const html = editor.getHTML();
        let markdown = html
            .replace(/<h1[^>]*>(.*?)<\/h1>/g, '# $1\n\n')
            .replace(/<h2[^>]*>(.*?)<\/h2>/g, '## $1\n\n')
            .replace(/<h3[^>]*>(.*?)<\/h3>/g, '### $1\n\n')
            .replace(/<p[^>]*>(.*?)<\/p>/g, '$1\n\n')
            .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
            .replace(/<em>(.*?)<\/em>/g, '*$1*')
            .replace(/<u>(.*?)<\/u>/g, '_$1_')
            .replace(/<li[^>]*>(.*?)<\/li>/g, '- $1\n')
            .replace(/<ul[^>]*>/g, '')
            .replace(/<\/ul>/g, '\n')
            .replace(/<ol[^>]*>/g, '')
            .replace(/<\/ol>/g, '\n')
            .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/g, '> $1\n')
            .replace(/<code>(.*?)<\/code>/g, '`$1`')
            .replace(/<[^>]+>/g, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .trim();

        downloadFile(markdown, 'document.md', 'text/markdown');
    };

    const exportAsHTML = () => {
        if (!editor) return;

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            font-family: 'Georgia', serif;
            max-width: 800px;
            margin: 2rem auto;
            padding: 2rem;
            line-height: 1.7;
            color: #1a1a1a;
        }
        h1, h2, h3 { font-family: system-ui, sans-serif; }
        h1 { font-size: 2.5em; margin-bottom: 0.5em; }
        h2 { font-size: 1.8em; margin-bottom: 0.4em; }
        h3 { font-size: 1.4em; margin-bottom: 0.3em; }
        p { margin-bottom: 1.5em; }
        blockquote {
            border-left: 4px solid #cbd5e1;
            padding-left: 1.5em;
            font-style: italic;
            color: #475569;
        }
        code {
            background: #f1f5f9;
            padding: 0.2em 0.4em;
            border-radius: 4px;
            font-family: monospace;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            margin: 1em 0;
        }
        th, td {
            border: 1px solid #e2e8f0;
            padding: 0.75em;
            text-align: left;
        }
        th { background: #f8fafc; }
    </style>
</head>
<body>
${editor.getHTML()}
</body>
</html>`;

        downloadFile(html, 'document.html', 'text/html');
    };

    const exportAsText = () => {
        if (!editor) return;
        const text = editor.getText();
        downloadFile(text, 'document.txt', 'text/plain');
    };

    const exportAsPDF = () => {
        window.print();
        onClose();
    };

    if (!isOpen) return null;

    const exportOptions = [
        {
            name: 'Markdown',
            description: 'Plain text with formatting syntax',
            icon: FileType,
            action: exportAsMarkdown,
            extension: '.md',
        },
        {
            name: 'HTML',
            description: 'Web page with styling',
            icon: Code,
            action: exportAsHTML,
            extension: '.html',
        },
        {
            name: 'Plain Text',
            description: 'Simple text without formatting',
            icon: FileText,
            action: exportAsText,
            extension: '.txt',
        },
        {
            name: 'PDF',
            description: 'Print to PDF via browser',
            icon: FileDown,
            action: exportAsPDF,
            extension: '.pdf',
        },
    ];

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className="bg-slate-900/98 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-xl">
                            <FileDown size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Export Document</h2>
                            <p className="text-xs text-slate-500">Choose your format</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 space-y-2">
                    {exportOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                            <button
                                key={option.name}
                                onClick={option.action}
                                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all group"
                            >
                                <div className="p-3 bg-slate-800 group-hover:bg-slate-700 rounded-xl transition-colors">
                                    <Icon size={20} className="text-slate-300" />
                                </div>
                                <div className="text-left flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-white">{option.name}</span>
                                        <span className="text-[10px] text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">
                                            {option.extension}
                                        </span>
                                    </div>
                                    <span className="text-xs text-slate-500">{option.description}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
