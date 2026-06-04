'use client';

import { useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { EditorView } from '@codemirror/view';
import { mdMirrorExtension } from '@/config/codemirror-theme';
import { toast } from 'sonner';
import { Toggle } from '@/shared/components/ui/toggle';
import { Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MarkdownPreview } from './markdown-preview';

type PreviewMode = 'pc' | 'mobile';

const compressImage = async (file: File, quality = 0.7): Promise<File> => {
  if (!file.type.startsWith('image/')) return file;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        let width = img.width;
        let height = img.height;
        const maxDimension = 1920;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve(file);
              return;
            }

            const newName = file.name.replace(/\.[^/.]+$/, '') + '.jpg';
            const compressedFile = new File([blob], newName, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            console.log(`Image compressed: ${file.size} -> ${compressedFile.size} bytes`);
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
};

export function MdniceEditor({
  value,
  onChange,
  placeholder,
  minHeight = 400,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
  showToolbar?: boolean;
}) {
  const t = useTranslations('admin.game-categories.fields');
  const previewRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('pc');
  const editorRef = useRef<any>(null);
  const isSyncingRef = useRef(false);

  const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        event.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;

        const editor = editorRef.current?.view;
        const cursorPosition = editor?.state.selection.main.head || 0;

        const toastId = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
        const fileName = file.name || '图片';
        
        toast.loading(`${fileName} 正在压缩上传中...`, { id: toastId });

        try {
          const compressedFile = await compressImage(file);
          
          const formData = new FormData();
          formData.append('file', compressedFile);

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();
          if (result.success && result.url) {
            toast.success(`${fileName} 上传成功`, { id: toastId });
            
            const imageMarkdown = `![image](${result.url})\n`;
            
            if (editor) {
              const currentCursor = editor.state.selection.main.head;
              editor.dispatch({
                changes: { from: currentCursor, insert: imageMarkdown },
                selection: { anchor: currentCursor + imageMarkdown.length },
                scrollIntoView: true
              });
              editor.focus();
            } else {
              // Fallback to older method if editor is not available
              const currentValue = value || '';
              const newValue = 
                currentValue.slice(0, cursorPosition) + 
                imageMarkdown + 
                currentValue.slice(cursorPosition);
              onChange(newValue);
            }
          } else {
            toast.error(`${fileName} 上传失败: ${result.error || '未知错误'}`, { id: toastId });
          }
        } catch (error) {
          console.error('Upload error:', error);
          toast.error(`${fileName} 上传失败`, { id: toastId });
        }
      }
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Scroll sync logic tailored for MarkdownPreview structure
    const timer = setTimeout(() => {
      const editor = editorRef.current?.view?.dom;
      if (editor) {
        editor.addEventListener('paste', handlePaste);
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      const editor = editorRef.current?.view?.dom;
      if (editor) {
        editor.removeEventListener('paste', handlePaste);
      }
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    
    const timer = setTimeout(() => {
      const editorScroll = editorRef.current?.view?.scrollDOM;
      const previewScroll = previewRef.current;

      if (!editorScroll || !previewScroll) return;

      const waitForImages = () => {
        const images = previewScroll.querySelectorAll('img');
        const promises = Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
          });
        });
        return Promise.all(promises);
      };

      const handleEditorScroll = () => {
        if (isSyncingRef.current) return;
        isSyncingRef.current = true;
        
        waitForImages().then(() => {
          const scrollPercentage = editorScroll.scrollTop / (editorScroll.scrollHeight - editorScroll.clientHeight || 1);
          if (!isNaN(scrollPercentage)) {
            previewScroll.scrollTop = scrollPercentage * (previewScroll.scrollHeight - previewScroll.clientHeight);
          }
          requestAnimationFrame(() => { isSyncingRef.current = false; });
        });
      };

      const handlePreviewScroll = () => {
        if (isSyncingRef.current) return;
        isSyncingRef.current = true;
        
        const scrollPercentage = previewScroll.scrollTop / (previewScroll.scrollHeight - previewScroll.clientHeight || 1);
        if (!isNaN(scrollPercentage)) {
          editorScroll.scrollTop = scrollPercentage * (editorScroll.scrollHeight - editorScroll.clientHeight);
        }
        
        requestAnimationFrame(() => { isSyncingRef.current = false; });
      };

      editorScroll.addEventListener('scroll', handleEditorScroll, { passive: true });
      previewScroll.addEventListener('scroll', handlePreviewScroll, { passive: true });

      return () => {
        editorScroll.removeEventListener('scroll', handleEditorScroll);
        previewScroll.removeEventListener('scroll', handlePreviewScroll);
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [mounted, value]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 rounded-lg border bg-card p-3">
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{t('preview_mode')}</span>
          <Toggle
            variant="outline"
            size="sm"
            pressed={previewMode === 'mobile'}
            onPressedChange={(pressed) => setPreviewMode(pressed ? 'mobile' : 'pc')}
            className="gap-2 rounded-full px-4 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
          >
            <Smartphone className="h-4 w-4" />
            {t('preview_mobile')}
          </Toggle>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Editor Section */}
        <div className="flex flex-col min-w-0">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            {t('editor')}
          </div>
          <div className="overflow-hidden rounded-lg border shadow-sm">
            <CodeMirror
              ref={editorRef}
              value={value}
              height="600px"
              extensions={[markdown(), mdMirrorExtension, EditorView.lineWrapping]}
              onChange={(val) => onChange(val)}
              placeholder={placeholder}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLineGutter: true,
                highlightActiveLine: true,
                foldGutter: true,
                allowMultipleSelections: true,
              }}
            />
          </div>
        </div>

        {/* Preview Section */}
        <div className="flex flex-col min-w-0">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {t('preview')}
          </div>
          
          <div
            ref={previewRef}
            className={`overflow-auto rounded-lg border bg-background shadow-sm h-[600px] relative ${
              previewMode === 'mobile' ? 'max-w-[375px] min-w-[300px] mx-auto border-x' : ''
            }`}
            style={{ padding: previewMode === 'mobile' ? '16px' : '24px' }}
          >
             {value ? (
                <MarkdownPreview key={previewMode} content={value} />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2 opacity-50">
                    <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm">{t('begin_preview')}</p>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
