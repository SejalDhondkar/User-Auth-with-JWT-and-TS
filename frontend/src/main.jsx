import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {BrowserRouter} from 'react-router-dom';
import App from './App.jsx';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './config/queryClient.js';
import {ChakraProvider} from '@chakra-ui/react';
import theme from './theme/index.js';

createRoot(document.getElementById('root')).render(
    <ChakraProvider theme={theme}>
    <QueryClientProvider client={queryClient}>
    <BrowserRouter>
    <App />
    <ReactQueryDevtools position='bottom-right' initialIsOpen={false} />
    </BrowserRouter>
    </QueryClientProvider>
    </ChakraProvider>
)
