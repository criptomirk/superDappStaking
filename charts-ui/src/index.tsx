import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { BankShanpshotChart } from './Charts/BankSnapshotChart';
import { Box as ChakraBox, Button, ChakraProvider, Container, HStack, VStack, defineStyleConfig, extendTheme } from '@chakra-ui/react';
import CardBox from './Components/CardBox';
import { PotentialProfitsChart } from './Charts/PotentialProfitsChart';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const Box = defineStyleConfig({
  baseStyle: {
    mt: 5,
    mx: 'auto',
    maxWidth: 'container.sm',
    paddingX: 5,
    paddingY: 5,
    border: '1px solid #eee',
    borderRadius: 'md',
  },
  variants: {
    primary: {
      bg: 'blue.500',
      color: 'white',
    },
    secondary: {
      bg: 'gray.500',
      color: 'white',
    },
  },
  defaultProps: {
    variant: 'primary',
  },
});

const theme = extendTheme({

  components: {
    Box,
  }
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/bank-snapshot-chart',
    element: <BankShanpshotChart />,
  },
  {
    path: '/potential-profits-chart',
    element: <PotentialProfitsChart />
  }
]);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Container w={'100%'} maxWidth="1200px" sx={{ mt: 5 }}>

        <HStack>
          <Button as="a" href="/">Home</Button>
          <Button as="a" href="/bank-snapshot-chart">Bank Snapshot Chart</Button>
          <Button as="a" href="/potential-profits-chart">Potential Profits Chart</Button>
        </HStack>

        <RouterProvider router={router} />
      </Container>
    </ChakraProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
