import React from "react";
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from "@chakra-ui/react";
import backgroundImage from './Images/backgroundImage.jpg'
import App from "./App.jsx";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement, { suppressDeprecationWarnings: true });

document.body.style.backgroundImage = `url(${backgroundImage})`;
document.body.style.backgroundSize = 'cover';

root.render(
  <ChakraProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ChakraProvider>
);
