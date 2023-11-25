import { FC, PropsWithChildren, useEffect, useRef } from 'react';
import { scrollEventsToBottom } from '../../../cortex/events';

export const EventsPanelContainer: FC<PropsWithChildren> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);

  scrollEventsToBottom.on(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
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
      <div ref={ref} />
    </div>
  );
};
