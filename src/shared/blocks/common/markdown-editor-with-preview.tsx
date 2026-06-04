'use client';

import { MarkdownEditor } from './markdown-editor';
import { MarkdownContent } from './markdown-content';

export function MarkdownEditorWithPreview({
  value,
  onChange,
  placeholder,
  minHeight = 400,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: number;
}) {
  return (
    <div className="flex gap-4 h-[600px]">
      <div className="flex-1 overflow-auto border rounded-md">
        <MarkdownEditor
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          minHeight={598}
        />
      </div>
      <div className="flex-1 overflow-auto border rounded-md p-4 bg-muted/30">
        <MarkdownContent content={value || '_No content to preview_'} />
      </div>
    </div>
  );
}
