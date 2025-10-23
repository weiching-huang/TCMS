import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from './App';
import store from "./store/store";
import './styles/index.css';

const rootElement = document.getElementById("root") as HTMLElement;

createRoot(rootElement).render(
  <React.StrictMode>
    <Provider store={store}>
     <BrowserRouter>
       <App />
     </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
