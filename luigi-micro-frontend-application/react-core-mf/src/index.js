import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router';
import Home from './views/home.js';
import { dict } from './language.js';
import Product from './views/products.js';
import {
  addInitListener,
  addContextUpdateListener,
  removeContextUpdateListener,
  removeInitListener,
  uxManager
} from '@luigi-project/client';
import ProductDetail from './views/productDetail.js';
import { ThemeProvider } from "@ui5/webcomponents-react";

const container = document.getElementById('root');
const root = createRoot(container);

const App = () => {
  const [currentLocale, setCurrentLocale] = useState('en-US');
  const [initListener, setInitListener] = useState(null);
  const [contextUpdateListener, setContextUpdateListener] = useState(null);

  useEffect(() => {
    const updateCurrentLanguage = () => {
      setCurrentLocale(uxManager().getCurrentLocale())
    }

    setInitListener(
      addInitListener(() => {
        console.log("Luigi Client initialized.");
        // update current language upon Luigi Client initialization
        updateCurrentLanguage();
      })
    );

    setContextUpdateListener(
      addContextUpdateListener(() => {
        // update current language upon Luigi Client context update event
        updateCurrentLanguage();
      })
    );

    return function cleanup() {
      removeContextUpdateListener(contextUpdateListener);
      removeInitListener(initListener);
    };
  }, []);

  return (
    <ThemeProvider>
      <React.StrictMode>
        <Router basename="microfrontend">
          <Routes>
            <Route path="/home" element={<Home localeDict={dict[currentLocale]} currentLocale={currentLocale} />} />
            <Route path="/products" element={<Product localeDict={dict[currentLocale]} />} />
            <Route path="/productDetail/:id" element={<ProductDetail localeDict={dict[currentLocale]} />} />
          </Routes>
        </Router>
      </React.StrictMode>
    </ThemeProvider>

  );
};

root.render(
  <App />
);
