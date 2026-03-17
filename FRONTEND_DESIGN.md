# Video-Debugger — Advanced Frontend Design (Dark Theme)

## 1. Project Vision
Create a **professional, dark-themed frontend** for the Video-Debugger project that:  
- Provides AI-powered video analysis visually  
- Uses sleek black/dark UI for a modern, professional look  
- Supports batch processing, reports, and interactive visualizations  
- Enterprise-ready and demo-ready  

---

## 2. Dark Theme Design Principles
- Background: `#121212` (deep dark gray/black)  
- Cards & Panels: `#1E1E1E` with subtle shadow highlights  
- Text: `#FFFFFF` (main), `#B0B0B0` (secondary), `#FF6B6B` or `#4CAF50` (alerts/status)  
- Buttons: Accent colors (`#FF5722` for actions, `#2196F3` for secondary)  
- Charts: Bright color overlays on dark backgrounds  
- Animations: Subtle transitions using CSS keyframes  
- Focus: High contrast for readability without eye strain  

---

## 3. Tech Stack (Frontend)

| Layer              | Technology / Library          | Purpose                                        |
|--------------------|-------------------------------|------------------------------------------------|
| Framework          | React.js + Vite               | Component-based, fast builds                   |
| Styling            | Tailwind CSS + SCSS            | Dark theme design, smooth transitions          |
| Video Playback     | HTML5 `<video>`               | Frame-by-frame control, dark player theme      |
| File Upload        | React Dropzone (custom)        | Drag-and-drop multi-file uploads               |
| API Communication  | Axios                          | REST API calls to FastAPI backend              |
| Animations         | CSS Keyframes + transitions    | Hover, glow, badge, pulse animations          |

---

## 4. Core UI Modules (Dark Theme)

### 4.1 Dashboard
- Dark card containers (`#1E1E1E`) with soft shadows  
- Summary cards: total videos, processed videos, errors detected  
- Charts with neon/bright colors on dark backgrounds  

### 4.2 Video Upload & Queue
- Drag-and-drop area with glowing border accent (`#2196F3`)  
- Video metadata displayed on dark cards  
- Color-coded progress bars (green = success, red = error, yellow = processing)  

### 4.3 Video Analysis Viewer
- Full dark video player (`#121212`)  
- AI Recommendations Panel: dark sidebar with white text and accent highlights  
- Subtitles, titles, impact score, notes sections  

### 4.4 Reports & Export
- Dark modal windows for exporting reports  
- Buttons with neon accents (`#FF5722` for download, `#2196F3` for export)  
- Table rows with alternating dark shades  

### 4.5 Settings Panel
- Dark-themed panel (`#1E1E1E`)  
- Toggle for Dark / Light mode (default dark)  
- Slider bars with accent colors for AI thresholds  

### 4.6 Notifications & Logs
- Toast notifications with dark background (`#2C2C2C`), white text   
- Logs panel with dark scrollable background  

---

## 5. Advanced Dark Theme Features / Wow Factor
- Interactive heatmap timeline with glowing overlay  
- Multi-video batch preview with dark progress indicators  
- Smooth hover animations for dark cards and buttons  
- Collapsible panels with subtle shadows  
- Drag-and-drop queue with neon border highlights  
- Sidebar recommendations with color-coded AI confidence scores  

---

## 6. UX Flow (Dark Theme)
1. User lands on **Dark Dashboard** → sees summary cards with neon highlights  
2. Drag videos → populate **dark-themed queue**  
3. AI analysis runs → progress bars update with glowing effects  
4. Click a video → **Analysis Viewer** opens with overlays and sidebar  
5. User views AI recommendations and optionally downloads reports  
6. User can access **Settings Panel** to adjust thresholds  

---

## 7. Suggested File Structure

```text
/frontend
  /src
    /components
      Dashboard.jsx
      VideoUploader.jsx (UploadForm.jsx)
      VideoQueue.jsx
      VideoPlayer.jsx
      AnalysisPanel.jsx
      ProgressIndicator.jsx
    /styles
      App.scss
    App.jsx
    main.jsx
    index.css
```

---

## 8. Performance & Scalability (Dark Theme)
- Lazy load heavy components (VideoPlayer, heatmaps)  
- Modular components for easy dark-theme adjustments  
- Smooth CSS animations for hover and transition effects  
- Responsive layout for different screen sizes  

---

## 9. Optional Enhancements
- Real-time collaborative debugging with dark WebSocket notifications  
- Customizable themes: accent colors, glow intensity  
- Mobile-first responsive dark UI  
- Plugin architecture for adding custom AI modules  

---

## ✅ Summary
This **dark-themed frontend design** ensures your **video-debugger** is:  
- Sleek, modern, and professional  
- Highly interactive and visually impressive  
- Enterprise-ready with batch processing, AI highlights, and reports  
- Fully demo-ready with polished dark UI  
