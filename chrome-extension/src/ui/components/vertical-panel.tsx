import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

export const VerticalPanel: FC<
  PropsWithChildren<{ shouldScroll?: boolean }>
> = ({ children, shouldScroll = false }) => {
  const { ref: endElementRef, inView } = useInView();
  const ref = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (!shouldScroll) {
      return;
    }
    if (!inView) {
      scrollToBottom();
    }
  });

  return (
    <div
      style={{
        height: '100%',
        overflowY: 'scroll',
        backgroundColor: '#2A2F3A',
      }}
    >
      {children}
      <div ref={endElementRef} />
      <div ref={ref} />
    </div>
  );
};
