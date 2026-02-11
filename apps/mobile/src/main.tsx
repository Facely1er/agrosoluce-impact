/**
 * AgroSoluce Intelligence Mobile App - PWA Entry Point
 * 
 * Separate PWA application for mobile devices
 * Completely independent from the main web app
 * 
 * Three-Tier Interface:
 * 1. ERMITS Team Command Center
 * 2. Cooperative Management Dashboard
 * 3. Farmer Field App
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { IntelligenceApp } from './screens/IntelligenceApp';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IntelligenceApp />
  </StrictMode>
);

