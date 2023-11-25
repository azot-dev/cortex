import { FC } from 'react';
import { useAppSelector, useAppService } from '../../../cortex/utils/hooks';
import { Box } from '@mui/material';
import { Event } from '../../components/event';
import { eventsVM } from './events.vm';
import { EventsPanelContainer } from './events-panel-container';

export const EventsPanel: FC = () => {
  // @ts-ignore
  const eventsViewModel = useAppSelector(eventsVM);
  const eventsService = useAppService('events');

  return (
    <EventsPanelContainer>
      <Box sx={{ marginLeft: '-5px', marginRight: '-5px' }}>
        {eventsViewModel.map(
          ({ label, color, id, isSelected, isClickable, time }: any) => {
            return (
              <Event
                label={label}
                color={color}
                key={id}
                isSelected={isSelected}
                onClick={
                  isClickable ? () => eventsService.selectEvent(id) : undefined
                }
                isClickable={isClickable}
                time={time}
              />
            );
          }
        )}
      </Box>
    </EventsPanelContainer>
  );
};
