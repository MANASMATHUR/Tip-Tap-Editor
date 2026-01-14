'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { X, FileText, Calendar, Clipboard, Mail, Sparkles } from 'lucide-react';

gsap.registerPlugin(useGSAP);

const TEMPLATES = [
    {
        id: 'blank',
        name: 'Blank Document',
        description: 'Start fresh with an empty page',
        icon: FileText,
        content: `<h1>Untitled Document</h1><p>Start typing here...</p>`,
    },
    {
        id: 'meeting',
        name: 'Meeting Notes',
        description: 'Structured meeting agenda template',
        icon: Calendar,
        content: `
            <h1>Meeting Notes</h1>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Attendees:</strong> </p>
            <h2>Agenda</h2>
            <ul data-type="taskList">
                <li data-checked="false">Topic 1</li>
                <li data-checked="false">Topic 2</li>
                <li data-checked="false">Topic 3</li>
            </ul>
            <h2>Discussion Points</h2>
            <p></p>
            <h2>Action Items</h2>
            <ul data-type="taskList">
                <li data-checked="false">Action item 1</li>
                <li data-checked="false">Action item 2</li>
            </ul>
            <h2>Next Steps</h2>
            <p></p>
        `,
    },
    {
        id: 'brief',
        name: 'Project Brief',
        description: 'Project overview and objectives',
        icon: Clipboard,
        content: `
            <h1>Project Brief</h1>
            <h2>Overview</h2>
            <p>Provide a summary of the project and its goals.</p>
            <h2>Objectives</h2>
            <ul>
                <li>Objective 1</li>
                <li>Objective 2</li>
                <li>Objective 3</li>
            </ul>
            <h2>Scope</h2>
            <p>Define what is included and excluded from this project.</p>
            <h2>Timeline</h2>
            <p><strong>Start Date:</strong> </p>
            <p><strong>End Date:</strong> </p>
            <h2>Team</h2>
            <ul>
                <li><strong>Project Lead:</strong> </li>
                <li><strong>Team Members:</strong> </li>
            </ul>
            <h2>Success Metrics</h2>
            <p>How will we measure the success of this project?</p>
        `,
    },
    {
        id: 'letter',
        name: 'Formal Letter',
        description: 'Professional letter format',
        icon: Mail,
        content: `
            <p style="text-align: right">${new Date().toLocaleDateString()}</p>
            <p><br></p>
            <p>[Recipient Name]</p>
            <p>[Company/Organization]</p>
            <p>[Address]</p>
            <p><br></p>
            <p>Dear [Recipient Name],</p>
            <p><br></p>
            <p>[Opening paragraph - State the purpose of your letter]</p>
            <p><br></p>
            <p>[Body paragraph - Provide details and supporting information]</p>
            <p><br></p>
            <p>[Closing paragraph - Summarize and include any call to action]</p>
            <p><br></p>
            <p>Sincerely,</p>
            <p><br></p>
            <p>[Your Name]</p>
            <p>[Your Title]</p>
        `,
    },
];

export const TemplateGallery = ({ editor, isOpen, onClose }) => {
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

    const selectTemplate = (template) => {
        if (editor) {
            editor.commands.setContent(template.content);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className="bg-slate-900/98 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-xl">
                            <Sparkles size={20} className="text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Start with a Template</h2>
                            <p className="text-xs text-slate-500">Choose a starting point</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-4 grid grid-cols-2 gap-3">
                    {TEMPLATES.map((template) => {
                        const Icon = template.icon;
                        return (
                            <button
                                key={template.id}
                                onClick={() => selectTemplate(template)}
                                className="flex flex-col items-start gap-3 p-4 rounded-2xl bg-slate-800/50 hover:bg-slate-800 border border-transparent hover:border-white/10 transition-all group text-left"
                            >
                                <div className="p-2 bg-slate-700/50 group-hover:bg-slate-700 rounded-xl transition-colors">
                                    <Icon size={18} className="text-slate-300" />
                                </div>
                                <div>
                                    <span className="text-sm font-medium text-white block">{template.name}</span>
                                    <span className="text-[10px] text-slate-500">{template.description}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-white/5 text-center">
                    <span className="text-[10px] text-slate-600">
                        Templates replace your current document
                    </span>
                </div>
            </div>
        </div>
    );
};
