'use client';

import {useEffect, type RefObject} from 'react';

export default function useAutoScroll<T>(
  ref: RefObject<HTMLElement>,
  dependency: T[],
  threshold = 100,
) {
  useEffect(() => {
    const scrollToBottom = () => {
      if (ref.current) {
        const {scrollHeight, scrollTop, clientHeight} = ref.current
          .parentElement || {
          scrollHeight: 0,
          scrollTop: 0,
          clientHeight: 0,
        };
        const isNearBottom =
          scrollHeight - scrollTop - clientHeight <= threshold;

        if (isNearBottom) {
          setTimeout(() => {
            if (ref.current?.parentElement) {
              ref.current.parentElement.scrollTop =
                ref.current.parentElement.scrollHeight;
            }
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
