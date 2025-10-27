import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps extends React.ComponentProps<"textarea"> {
  autoExpand?: boolean;
  maxHeight?: number; // altura máxima en píxeles
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoExpand = false, maxHeight = 300, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement>(null);
    const textareaRef = (ref as React.RefObject<HTMLTextAreaElement>) || innerRef;

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (textarea && autoExpand) {
        textarea.style.height = 'auto';
        const newHeight = Math.min(textarea.scrollHeight, maxHeight);
        textarea.style.height = `${newHeight}px`;
        
        // Si el contenido excede la altura máxima, mostrar scroll
        if (textarea.scrollHeight > maxHeight) {
          textarea.style.overflowY = 'auto';
        } else {
          textarea.style.overflowY = 'hidden';
        }
      }
    }, [autoExpand, maxHeight, textareaRef]);

    React.useEffect(() => {
      adjustHeight();
    }, [adjustHeight, props.value]);

    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          autoExpand && "resize-none",
          className
        )}
        ref={textareaRef}
        onInput={adjustHeight}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
