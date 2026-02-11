/**
 * AgroSoluce Intelligence Mobile App - Main Component
 * 
 * Field Intelligence & Operations Platform
 * 
 * DIFFERENT PURPOSE FROM WEB APP:
 * - Web App: B2B Marketplace (buyers, cooperatives, directory)
 * - Mobile App: Field Intelligence (ERMITS team, cooperative managers, farmers)
 * 
 * Three-Tier Interface:
 * 1. ERMITS Team Command Center
 * 2. Cooperative Management Dashboard  
 * 3. Farmer Field App (offline-first, voice-guided)
 */

import { ThemeProvider } from './components/ThemeProvider';
import { BrandLogo } from './components/BrandLogo';
import './index.css';
import styles from './App.module.css';

function App() {
  return (
    <ThemeProvider>
      <div className={styles.container}>
        <BrandLogo 
          showTagline={true}
          height={80}
          showBrandName={true}
        />
        <div className={styles.content}>
          <h1 className={styles.title}>
            AgroSoluce Intelligence
          </h1>
          <p className={styles.subtitle}>
            Field Intelligence & Operations Platform
          </p>
          <div className={styles.infoBox}>
            <h2 className={styles.infoTitle}>
              Three-Tier Interface:
            </h2>
            <ul className={styles.infoList}>
              <li className={styles.infoItem}>
                <strong>1. ERMITS Command Center</strong><br />
                Real-time monitoring, compliance alerts, market intelligence
              </li>
              <li className={styles.infoItem}>
                <strong>2. Cooperative Dashboard</strong><br />
                Member management, sales tracking, compliance status
              </li>
              <li className={styles.infoItem}>
                <strong>3. Farmer Field App</strong><br />
                Offline-first, voice-guided, multi-language support
              </li>
            </ul>
          </div>
          <p className={styles.status}>
            Development in Progress
          </p>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
