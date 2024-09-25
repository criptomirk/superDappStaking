import React from 'react';
import './App.css';
import { Box, Text } from '@chakra-ui/react';

function App() {
  return (
    <div>
      <Box sx={{
        mt: 5,
        mx: 'auto',
        maxWidth: 'container.sm',
        paddingX: 5,
        paddingY: 5,
        border: '1px solid #eee',
        borderRadius: 'md',
      }}>

        <Text>
          List of charts from recent tests runs.
        </Text>
      </Box>
    </div>
  );
}

export default App;
