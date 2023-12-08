import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export const SettingsWindow: React.FC = () => {
  return (
    <Box p={3}>
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label">
          Connection settings (for remote debugging)
        </FormLabel>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="none"
          name="radio-buttons-group"
        >
          <Box height={15} />
          <FormControlLabel
            value="none"
            control={<Radio />}
            label="no remote connection"
          />
          <FormControlLabel
            value="remote"
            control={<Radio />}
            label="use local server"
          />
        </RadioGroup>
      </FormControl>
      <Box mt={2} ml={3}>
        <Box flexDirection="column" gap="10px" display="flex">
          <Box>
            <TextField id="outlined-basic" label="Host" variant="outlined" />
          </Box>
          <Box>
            <TextField id="outlined-basic" label="Port" variant="outlined" />
          </Box>
        </Box>
        <Box
          flexDirection="row"
          mt={1}
          alignItems="center"
          gap="5px"
          display="flex"
        >
          <Button variant="outlined">Connect</Button>
          <CheckCircleOutlineIcon color="success" />
          <HighlightOffIcon color="error" />
          <CircularProgress size="16px" />
        </Box>
      </Box>
    </Box>
  );
};
