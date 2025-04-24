'use client';

import { useEffect, type RefObject } from 'react';

export default function useAutoScroll<T>(ref: RefObject<HTMLElement>, dependency: T[], threshold = 100) {
  useEffect(() => {
    const scrollToBottom = () => {
      // Find the closest ScrollArea viewport
      const scrollArea = ref.current?.closest('[data-radix-scroll-area-viewport]');

      if (scrollArea) {
        const { scrollHeight, scrollTop, clientHeight } = scrollArea;
        const isNearBottom = scrollHeight - scrollTop - clientHeight <= threshold;

        if (isNearBottom) {
          setTimeout(() => {
            scrollArea.scrollTop = scrollArea.scrollHeight;
          }, 100);
        }
      }
    };

    scrollToBottom();

    // Add a window resize listener to handle layout shifts
    window.addEventListener('resize', scrollToBottom);

    return () => {
      window.removeEventListener('resize', scrollToBottom);
    };
  }, [dependency, ref, threshold]);
}
