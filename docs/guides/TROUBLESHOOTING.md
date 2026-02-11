# Troubleshooting Guide

## Common Issues and Solutions

### 503 Service Unavailable Error

**Symptoms:**
- Browser shows 503 errors for main.tsx, @react-refresh, etc.
- Server not responding

**Solutions:**
1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Dev Server:**
   ```bash
   npm run dev
   ```

3. **Check Port Availability:**
   - Default port is 5173
   - If port is in use, Vite will automatically use next available port
   - Check terminal output for actual port number

### Map Not Displaying

**Symptoms:**
- Map container is empty
- Leaflet errors in console

**Solutions:**
1. **Check Leaflet CSS Import:**
   - Ensure `leaflet/dist/leaflet.css` is imported in CooperativeMap.tsx
   - CSS should load automatically

2. **Check Container Height:**
   - Map container needs explicit height (e.g., `h-[600px]`)
   - Check browser console for CSS errors

3. **Verify Leaflet Installation:**
   ```bash
   npm list leaflet
   ```

### Data Not Loading

**Symptoms:**
- No cooperatives displayed
- Empty list or error messages

**Solutions:**
1. **Check JSON File:**
   - Verify `public/cooperatives_cote_ivoire.json` exists
   - Check file is valid JSON

2. **Check Network Tab:**
   - Open browser DevTools → Network tab
   - Look for failed requests to `/cooperatives_cote_ivoire.json`
   - Check CORS issues

3. **Verify Public Directory:**
   - Files in `public/` should be accessible at root path
   - Example: `public/cooperatives_cote_ivoire.json` → `/cooperatives_cote_ivoire.json`

### TypeScript Errors

**Symptoms:**
- Red squiggles in IDE
- Build fails

**Solutions:**
1. **Check Type Definitions:**
   ```bash
   npm install --save-dev @types/leaflet @types/node
   ```

2. **Restart TypeScript Server:**
   - VS Code: Ctrl+Shift+P → "TypeScript: Restart TS Server"

3. **Verify tsconfig.json:**
   - Check paths are correct
   - Ensure `src` is included

### Tailwind CSS Not Working

**Symptoms:**
- Styles not applying
- Classes not recognized

**Solutions:**
1. **Check Tailwind Config:**
   - Verify `tailwind.config.js` exists
   - Check content paths include `./src/**/*.{js,ts,jsx,tsx}`

2. **Check PostCSS Config:**
   - Verify `postcss.config.js` includes tailwindcss plugin

3. **Restart Dev Server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

### Build Errors

**Symptoms:**
- `npm run build` fails
- Type errors or import errors

**Solutions:**
1. **Check All Imports:**
   - Verify all imported files exist
   - Check file extensions (.tsx vs .ts)

2. **Clear Cache:**
   ```bash
   rm -rf node_modules/.vite
   npm run build
   ```

3. **Check for Missing Dependencies:**
   ```bash
   npm install
   ```

### Port Already in Use

**Symptoms:**
- Server won't start
- "Port 5173 is already in use"

**Solutions:**
1. **Kill Process on Port:**
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   ```

2. **Use Different Port:**
   ```bash
   npm run dev -- --port 3000
   ```

### React Router Not Working

**Symptoms:**
- Navigation doesn't work
- 404 errors on routes

**Solutions:**
1. **Check Route Configuration:**
   - Verify routes in `src/App.tsx`
   - Check all imported components exist

2. **Check Browser Router:**
   - Ensure `<BrowserRouter>` wraps routes
   - Check for nested routers (should only be one)

### Leaflet Icons Missing

**Symptoms:**
- Map markers show broken images
- Console errors about missing icon files

**Solutions:**
1. **Icons are configured in CooperativeMap.tsx:**
   - Default icon is set automatically
   - Custom divIcon markers don't need default icons

2. **If using default markers:**
   - Icons are imported from leaflet package
   - Should work automatically

## Getting Help

If issues persist:

1. **Check Console:**
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed requests

2. **Check Terminal:**
   - Look for errors in dev server output
   - Check for TypeScript compilation errors

3. **Verify Setup:**
   ```bash
   # Check Node version (should be 18+)
   node --version
   
   # Check npm version
   npm --version
   
   # Verify dependencies
   npm list --depth=0
   ```

4. **Clean Install:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

