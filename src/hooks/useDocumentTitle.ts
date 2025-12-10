import { useEffect } from 'react';

/**
 * Hook para establecer el título del documento (pestaña del navegador)
 * @param title - El título a mostrar en la pestaña
 */
export function useDocumentTitle(title: string) {
    useEffect(() => {
        const previousTitle = document.title;
        document.title = title;

        return () => {
            document.title = previousTitle;
        };
    }, [title]);
}
