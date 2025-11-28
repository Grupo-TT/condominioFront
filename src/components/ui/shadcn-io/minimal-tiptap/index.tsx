'use client';

import * as React from 'react';
import { EditorContent, useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Separator } from '@/components/ui/separator';
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Minus,
  Undo,
  Redo,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pressed?: boolean;
  onPressedChange?: () => void;
  size?: 'sm' | 'default';
};

function Toggle({
  pressed,
  onPressedChange,
  size = 'default',
  className,
  children,
  ...buttonProps
}: ToggleProps) {
  return (
    <button
      type="button"
      onClick={onPressedChange}
      data-pressed={pressed ? 'on' : 'off'}
      className={cn(
        'inline-flex items-center justify-center rounded-md border border-transparent bg-transparent text-gray-400 hover:bg-gray-200/50 hover:text-gray-600 focus-visible:outline-none transition-colors',
        size === 'sm' ? 'h-9 w-9 text-xs' : 'h-9 px-3 text-sm',
        pressed && 'bg-gray-200 text-gray-900',
        className,
      )}
      {...buttonProps}
    >
      {children}
    </button>
  );
}

interface MinimalTiptapProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  editable?: boolean;
  className?: string;
  toolbarClassName?: string;
  renderToolbar?: (editor: Editor) => React.ReactNode;
}

// Componente de Toolbar separado para usar externamente
function TiptapToolbar({ editor, className }: { editor: Editor | null; className?: string }) {
  if (!editor) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-0.5', className)}>
      <Toggle
        size="sm"
        pressed={editor.isActive('bold')}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        title="Negrita"
      >
        <Bold className="h-4 w-4" />
      </Toggle>
      
      <Toggle
        size="sm"
        pressed={editor.isActive('italic')}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        title="Cursiva"
      >
        <Italic className="h-4 w-4" />
      </Toggle>
      
      <Toggle
        size="sm"
        pressed={editor.isActive('strike')}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        title="Tachado"
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-5 mx-1" />

      <Toggle
        size="sm"
        pressed={editor.isActive('bulletList')}
        onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
        title="Lista con viñetas"
      >
        <List className="h-4 w-4" />
      </Toggle>
      
      <Toggle
        size="sm"
        pressed={editor.isActive('orderedList')}
        onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
        title="Lista numerada"
      >
        <ListOrdered className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-5 mx-1" />

      <Toggle
        size="sm"
        pressed={editor.isActive('blockquote')}
        onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
        title="Cita"
      >
        <Quote className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().setHorizontalRule().run()}
        title="Línea separadora"
      >
        <Minus className="h-4 w-4" />
      </Toggle>

      <Separator orientation="vertical" className="h-5 mx-1" />

      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        title="Deshacer"
      >
        <Undo className="h-4 w-4" />
      </Toggle>
      
      <Toggle
        size="sm"
        onPressedChange={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        title="Rehacer"
      >
        <Redo className="h-4 w-4" />
      </Toggle>
    </div>
  );
}

// Hook para usar el editor externamente
function useTiptapEditor({
  content = '',
  onChange,
  editable = true,
  placeholder = '',
}: {
  content?: string;
  onChange?: (content: string) => void;
  editable?: boolean;
  placeholder?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm focus:outline-none',
          'min-h-[150px] w-full text-sm text-gray-600 leading-relaxed',
          '[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1',
          '[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500',
          '[&_hr]:border-gray-200 [&_hr]:my-4',
          '[&_.is-editor-empty:first-child::before]:text-gray-300 [&_.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.is-editor-empty:first-child::before]:float-left [&_.is-editor-empty:first-child::before]:h-0 [&_.is-editor-empty:first-child::before]:pointer-events-none',
          'selection:bg-black selection:text-white'
        ),
      },
      handlePaste: (view, event) => {
        const text = event.clipboardData?.getData('text/plain');
        if (text) {
          event.preventDefault();
          const { state, dispatch } = view;
          const { from, to } = state.selection;
          dispatch(state.tr.insertText(text, from, to));
          return true;
        }
        return false;
      },
    },
  });

  return editor;
}

// Componente del área de texto del editor
function TiptapContent({ 
  editor, 
  className,
  placeholder 
}: { 
  editor: Editor | null; 
  className?: string;
  placeholder?: string;
}) {
  if (!editor) return null;

  return (
    <div className={cn('w-full h-full overflow-y-auto', className)}>
      <EditorContent 
        editor={editor} 
        placeholder={placeholder}
        className="h-full [&_.ProseMirror]:min-h-full [&_.ProseMirror]:outline-none [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-gray-300 [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)] [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none"
      />
    </div>
  );
}

// Componente completo (por compatibilidad)
function MinimalTiptap({
  content = '',
  onChange,
  placeholder = 'Escribe aquí...',
  editable = true,
  className,
}: MinimalTiptapProps) {
  const editor = useTiptapEditor({ content, onChange, editable });

  if (!editor) {
    return null;
  }

  return (
    <div className={cn('flex flex-col', className)}>
      <TiptapContent editor={editor} placeholder={placeholder} className="flex-1" />
    </div>
  );
}

export { 
  MinimalTiptap, 
  TiptapToolbar, 
  TiptapContent, 
  useTiptapEditor,
  type MinimalTiptapProps 
};