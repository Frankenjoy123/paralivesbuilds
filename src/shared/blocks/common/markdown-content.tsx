'use client';

// Client-side Markdown renderer for database posts
import MarkdownIt from 'markdown-it';
import { ImageViewer } from './image-viewer';
import { useEffect, useRef } from 'react';
import { createHighlighter } from 'shiki';

import 'github-markdown-css/github-markdown-light.css';
import './markdown.css';

function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  breaks: true,
});

// Custom renderer for headings with IDs
md.renderer.rules.heading_open = function (tokens: any, idx: any) {
  const token = tokens[idx];
  const level = token.markup.length;
  const nextToken = tokens[idx + 1];

  if (nextToken && nextToken.type === 'inline') {
    const headingText = nextToken.content;
    const id = generateHeadingId(headingText);
    return `<h${level} id="${id}">`;
  }

  return `<h${level}>`;
};

// Custom renderer for links with nofollow
md.renderer.rules.link_open = function (tokens: any, idx: any, options: any, env: any, renderer: any) {
  const token = tokens[idx];
  const hrefIndex = token.attrIndex('href');

  if (hrefIndex >= 0) {
    const href = token.attrGet('href');
    // Add nofollow to all links
    token.attrSet('rel', 'nofollow');
    // Optionally add target="_blank" for external links
    if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
      token.attrSet('target', '_blank');
    }
  }

  return renderer.renderToken(tokens, idx, options);
};

// Custom renderer for tables to add wrapper for scrolling
md.renderer.rules.table_open = function (tokens: any, idx: any, options: any, env: any, renderer: any) {
  return '<div class="table-wrapper"><table>';
};

md.renderer.rules.table_close = function (tokens: any, idx: any, options: any, env: any, renderer: any) {
  return '</table></div>';
};

interface MarkdownContentProps {
  content: string;
}

const COPY_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>';
const CHECK_ICON = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500"><path d="M20 6L9 17l-5-5"/></svg>';

/**
 * Client-side Markdown renderer for database posts with image viewer
 * This component uses markdown-it which works in all environments including Edge Runtime
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const html = content ? md.render(content) : '';

  useEffect(() => {
    if (!containerRef.current) return;

    const highlight = async () => {
      const highlighter = await createHighlighter({
        themes: ['github-light', 'github-dark'],
        langs: ['javascript', 'typescript', 'java', 'python', 'json', 'bash', 'shell', 'sql', 'html', 'css', 'go', 'rust', 'yaml', 'markdown'],
      });

      const blocks = containerRef.current?.querySelectorAll('pre code') || [];
      blocks.forEach((block: any) => {
        const pre = block.parentElement;
        if (!pre || pre.dataset.highlighted) return;

        const code = block.textContent || '';
        const lang = Array.from(block.classList)
          .find((c: any) => c.startsWith('language-'))
          ?.toString()
          .replace('language-', '') || 'text';

        try {
          const highlighted = highlighter.codeToHtml(code, {
            lang,
            themes: {
              light: 'github-light',
              dark: 'github-dark',
            },
          });
          
          // Use a temporary div to parse the generated HTML
          const temp = document.createElement('div');
          temp.innerHTML = highlighted;
          const newPre = temp.querySelector('pre');
          
          if (newPre) {
            // Keep original classes but add shiki ones
            newPre.className = `${pre.className} shiki shiki-themes github-light github-dark`;
            newPre.style.margin = '0';
            
            // Add copy button
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-button';
            copyBtn.innerHTML = COPY_ICON;
            copyBtn.title = 'Copy code';
            
            copyBtn.onclick = () => {
              navigator.clipboard.writeText(code);
              copyBtn.innerHTML = CHECK_ICON;
              setTimeout(() => {
                copyBtn.innerHTML = COPY_ICON;
              }, 2000);
            };

            const wrapper = document.createElement('div');
            wrapper.className = 'code-block-wrapper relative';
            wrapper.appendChild(copyBtn);
            wrapper.appendChild(newPre);

            pre.parentNode?.replaceChild(wrapper, pre);
            wrapper.dataset.highlighted = 'true';
          }
        } catch (e) {
          console.error('Highlight error:', e);
        }
      });
    };

    highlight();
  }, [content, html]);

  return (
    <div 
      ref={containerRef}
      className="markdown-body" 
      dangerouslySetInnerHTML={{ __html: html }} 
    />
  );
}
