import { ReactNode, RefObject, useCallback, useEffect, useRef } from 'react';

// Throttle function to limit how often scroll events are processed
function throttle<T extends (...args: unknown[]) => unknown>(func: T, limit: number): T {
  let inThrottle: boolean;
  return ((...args: unknown[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  }) as T;
}

type ScrollspyProps = {
  children: ReactNode;
  targetRef?: RefObject<HTMLElement | HTMLDivElement | Document | null | undefined>;
  onUpdate?: (id: string) => void;
  offset?: number;
  smooth?: boolean;
  className?: string;
  dataAttribute?: string;
  history?: boolean;
  throttleTime?: number;
};

export function Scrollspy({
  children,
  targetRef,
  onUpdate,
  className,
  offset = 0,
  smooth = true,
  dataAttribute = 'scrollspy',
  history = true,
}: ScrollspyProps) {
  const selfRef = useRef<HTMLDivElement | null>(null);
  const anchorElementsRef = useRef<Element[] | null>(null);
  const prevIdTracker = useRef<string | null>(null);

  // Sets active nav, hash, prevIdTracker, and calls onUpdate
  const setActiveSection = useCallback(
    (sectionId: string | null, force = false) => {
      if (!sectionId) return;
      anchorElementsRef.current?.forEach((item) => {
        const id = item.getAttribute(`data-${dataAttribute}-anchor`);
        if (id === sectionId) {
          item.setAttribute('data-active', 'true');
          // Apply green colors for active state
          if (item instanceof HTMLElement && item.hasAttribute('data-active-style')) {
            item.style.backgroundColor = '#F0F5F2';
            item.style.color = '#4C6C5A';
          }
        } else {
          item.removeAttribute('data-active');
          // Reset to default colors
          if (item instanceof HTMLElement && item.hasAttribute('data-active-style')) {
            item.style.backgroundColor = 'transparent';
            item.style.color = 'inherit';
          }
        }
      });
      if (onUpdate) onUpdate(sectionId);
      if (history && (force || prevIdTracker.current !== sectionId)) {
        window.history.replaceState({}, '', `#${sectionId}`);
      }
      prevIdTracker.current = sectionId;
    },
    [anchorElementsRef, dataAttribute, history, onUpdate],
  );

  const handleScroll = useCallback(() => {
    if (!anchorElementsRef.current || anchorElementsRef.current.length === 0) return;
    const scrollElement = targetRef?.current === document ? window : targetRef?.current;
    if (!scrollElement) return;
    
    const scrollTop =
      scrollElement === window
        ? window.scrollY || document.documentElement.scrollTop
        : (scrollElement as HTMLElement).scrollTop;

    // Find the anchor whose section is closest to but not past the top
    let activeIdx = 0;
    let minDelta = Infinity;
    anchorElementsRef.current.forEach((anchor, idx) => {
      const sectionId = anchor.getAttribute(`data-${dataAttribute}-anchor`);
      const sectionElement = document.getElementById(sectionId!);
      if (!sectionElement) return;
      
      let customOffset = offset;
      const dataOffset = anchor.getAttribute(`data-${dataAttribute}-offset`);
      if (dataOffset) customOffset = parseInt(dataOffset, 10);
      
      // Calculate position relative to the scroll container
      let sectionTop: number;
      if (scrollElement === window) {
        sectionTop = sectionElement.offsetTop;
      } else {
        // For scroll containers, calculate relative position
        const containerRect = (scrollElement as HTMLElement).getBoundingClientRect();
        const sectionRect = sectionElement.getBoundingClientRect();
        sectionTop = scrollTop + (sectionRect.top - containerRect.top);
      }
      
      const delta = Math.abs(sectionTop - customOffset - scrollTop);
      
      if (sectionTop - customOffset <= scrollTop && delta < minDelta) {
        minDelta = delta;
        activeIdx = idx;
      }
    });

    // If at bottom, force last anchor
    if (scrollElement) {
      const scrollHeight =
        scrollElement === window ? document.documentElement.scrollHeight : (scrollElement as HTMLElement).scrollHeight;
      const clientHeight = scrollElement === window ? window.innerHeight : (scrollElement as HTMLElement).clientHeight;
      if (scrollTop + clientHeight >= scrollHeight - 2) {
        activeIdx = anchorElementsRef.current.length - 1;
      }
    }

    // Set only one anchor active and sync the URL hash
    const activeAnchor = anchorElementsRef.current[activeIdx];
    const sectionId = activeAnchor?.getAttribute(`data-${dataAttribute}-anchor`) || null;
    setActiveSection(sectionId);
    // Remove data-active from all others
    anchorElementsRef.current.forEach((item, idx) => {
      if (idx !== activeIdx) {
        item.removeAttribute('data-active');
        // Reset colors for inactive items
        if (item instanceof HTMLElement && item.hasAttribute('data-active-style')) {
          item.style.backgroundColor = 'transparent';
          item.style.color = 'inherit';
        }
      }
    });
  }, [anchorElementsRef, targetRef, dataAttribute, offset, setActiveSection]);

  const scrollTo = useCallback(
    (anchorElement: HTMLElement) => (event?: Event) => {
      if (event) event.preventDefault();
      const sectionId = anchorElement.getAttribute(`data-${dataAttribute}-anchor`)?.replace('#', '') || null;
      if (!sectionId) return;
      const sectionElement = document.getElementById(sectionId);
      if (!sectionElement) return;

      const scrollToElement = targetRef?.current === document ? window : targetRef?.current;
      if (!scrollToElement) return;

      let customOffset = offset;
      const dataOffset = anchorElement.getAttribute(`data-${dataAttribute}-offset`);
      if (dataOffset) {
        customOffset = parseInt(dataOffset, 10);
      }

      // Calculate scroll position relative to the scroll container
      let scrollTop: number;
      if (scrollToElement === window) {
        const sectionRect = sectionElement.getBoundingClientRect();
        scrollTop = window.scrollY + sectionRect.top - customOffset;
      } else {
        const containerRect = (scrollToElement as HTMLElement).getBoundingClientRect();
        const sectionRect = sectionElement.getBoundingClientRect();
        const currentScrollTop = (scrollToElement as HTMLElement).scrollTop;
        scrollTop = currentScrollTop + sectionRect.top - containerRect.top - customOffset;
      }

      if (scrollToElement && 'scrollTo' in scrollToElement) {
        scrollToElement.scrollTo({
          top: scrollTop,
          left: 0,
          behavior: smooth ? 'smooth' : 'auto',
        });
      }
      setActiveSection(sectionId, true);
    },
    [dataAttribute, offset, smooth, targetRef, setActiveSection],
  );

  // Scroll to the section if the ID is present in the URL hash
  const scrollToHashSection = useCallback(() => {
    const hash = CSS.escape(window.location.hash.replace('#', ''));

    if (hash) {
      const targetElement = document.querySelector(`[data-${dataAttribute}-anchor="${hash}"]`) as HTMLElement;
      if (targetElement) {
        scrollTo(targetElement)();
      }
    } else {
      // If no hash, activate the first element
      if (anchorElementsRef.current && anchorElementsRef.current.length > 0) {
        const firstAnchor = anchorElementsRef.current[0];
        const firstSectionId = firstAnchor.getAttribute(`data-${dataAttribute}-anchor`);
        if (firstSectionId) {
          setActiveSection(firstSectionId, false);
        }
      }
    }
  }, [dataAttribute, scrollTo, setActiveSection]);

  useEffect(() => {
    // Query elements and store them in the ref, avoiding unnecessary re-renders
    if (selfRef.current) {
      anchorElementsRef.current = Array.from(selfRef.current.querySelectorAll(`[data-${dataAttribute}-anchor]`));
    }

    anchorElementsRef.current?.forEach((item) => {
      item.addEventListener('click', scrollTo(item as HTMLElement));
    });

    const scrollElement = targetRef?.current === document ? window : targetRef?.current;

    // Throttle scroll handler to reduce frequency of updates
    const throttledHandleScroll = throttle(handleScroll, 50);

    // Attach the scroll event to the correct scrollable element
    scrollElement?.addEventListener('scroll', throttledHandleScroll);

    // Check if there's a hash in the URL and scroll to the corresponding section
    setTimeout(() => {
      scrollToHashSection();
      // Wait for scroll to settle, then update nav highlighting
      setTimeout(() => {
        handleScroll();
      }, 100);
    }, 100); // Adding a slight delay to ensure content is fully rendered

    return () => {
      scrollElement?.removeEventListener('scroll', throttledHandleScroll);
      anchorElementsRef.current?.forEach((item) => {
        item.removeEventListener('click', scrollTo(item as HTMLElement));
      });
    };
  }, [targetRef, selfRef, handleScroll, dataAttribute, scrollTo, scrollToHashSection]);

  return (
    <div data-slot="scrollspy" className={className} ref={selfRef}>
      {children}
    </div>
  );
}
