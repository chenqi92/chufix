import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useResizeObserver } from '../hooks/useResizeObserver';
import type { ChatListProps } from './variants';

export interface ChatListHandle {
  scrollToBottom(behavior?: ScrollBehavior): void;
}

export const ChatList = forwardRef<ChatListHandle, ChatListProps>(function ChatList(props, ref) {
  const {
    autoScroll = true,
    stickToBottom = true,
    stickThreshold = 64,
    groupBy = 'role',
    children,
  } = props;

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const checkAtBottom = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    setIsAtBottom(distance <= stickThreshold);
  }, [stickThreshold]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior });
  }, []);

  useResizeObserver(innerRef, () => {
    if (!autoScroll) return;
    if (!stickToBottom || isAtBottom) scrollToBottom('auto');
  });

  useEffect(() => {
    scrollToBottom('auto');
    checkAtBottom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useImperativeHandle(ref, () => ({ scrollToBottom }), [scrollToBottom]);

  return (
    <div
      ref={scrollerRef}
      className={['cf-chatlist', `cf-chatlist--group-${groupBy}`].join(' ')}
      onScroll={checkAtBottom}
    >
      <div ref={innerRef} className="cf-chatlist__inner">
        {children}
      </div>
      {!isAtBottom && (
        <button
          type="button"
          className="cf-chatlist__jump"
          aria-label="滚动到最新"
          onClick={() => scrollToBottom('smooth')}
        >
          <svg viewBox="0 0 16 16" width={14} height={14}>
            <path d="M8 3v8M4 9l4 4 4-4" stroke="currentColor" strokeWidth={1.6} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </div>
  );
});
