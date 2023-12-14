import { Box, Chip, Typography } from '@mui/material';
import { FC } from 'react';

export const Event: FC<{
  label: string;
  color?: string;
  time?: string;
  baseDate?: string;
  isSelected?: boolean;
  isClickable?: boolean;
  onClick?: () => void;
}> = ({ color, time, label, isSelected, isClickable, onClick }) => {
  return (
    <Box
      height={40}
      sx={(theme) => ({
        borderBottom: 1,
        borderColor: theme.palette.primary.main,
        display: 'flex',
        justifyContent: 'space-between',
        paddingLeft: '10px',
        paddingRight: '10px',
        alignItems: 'center',
        backgroundColor: isSelected ? '#484C53' : undefined,
        cursor: isClickable ? 'pointer' : 'default',
      })}
      onClick={onClick}
    >
      <Typography color={color ?? 'textPrimary'}>{label}</Typography>
      <Chip
        label={time}
        variant="outlined"
        size="small"
        sx={{
          backgroundColor: '#3D444F',
          border: '1px solid #74767C',
          borderRadius: 2,
        }}
      />
    </Box>
  );
};
