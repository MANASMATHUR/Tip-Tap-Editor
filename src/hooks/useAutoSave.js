'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'opensphere-editor-content';
const DEBOUNCE_MS = 2000;

export function useAutoSave(editor) {
    const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
    const [lastSaved, setLastSaved] = useState(null);

    // Save content to localStorage
    const saveContent = useCallback(() => {
        if (!editor) return;

        try {
            setSaveStatus('saving');
            const content = editor.getJSON();
            const data = {
                content,
                timestamp: Date.now(),
                version: '1.0',
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            setSaveStatus('saved');
            setLastSaved(new Date());

            // Reset to idle after 3 seconds
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error) {
            console.error('Failed to save:', error);
            setSaveStatus('error');
        }
    }, [editor]);

    // Load content from localStorage
    const loadContent = useCallback(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const data = JSON.parse(stored);
                return data.content;
            }
        } catch (error) {
            console.error('Failed to load saved content:', error);
        }
        return null;
    }, []);

    // Clear saved content
    const clearSaved = useCallback(() => {
        try {
            localStorage.removeItem(STORAGE_KEY);
            setSaveStatus('idle');
            setLastSaved(null);
        } catch (error) {
            console.error('Failed to clear saved content:', error);
        }
    }, []);

    // Check if there's saved content
    const hasSavedContent = useCallback(() => {
        return localStorage.getItem(STORAGE_KEY) !== null;
    }, []);

    // Debounced auto-save on content change
    useEffect(() => {
        if (!editor) return;

        let timeoutId;

        const handleUpdate = () => {
            setSaveStatus('saving');
            clearTimeout(timeoutId);
            timeoutId = setTimeout(saveContent, DEBOUNCE_MS);
        };

        editor.on('update', handleUpdate);

        return () => {
            clearTimeout(timeoutId);
            editor.off('update', handleUpdate);
        };
    }, [editor, saveContent]);

    // Load on mount
    useEffect(() => {
        if (!editor) return;

        const savedContent = loadContent();
        if (savedContent) {
            // Small delay to ensure editor is ready
            setTimeout(() => {
                editor.commands.setContent(savedContent);
            }, 100);
        }
    }, [editor, loadContent]);

    return {
        saveStatus,
        lastSaved,
        saveContent,
        loadContent,
        clearSaved,
        hasSavedContent,
    };
}
