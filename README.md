
# Latency Topology Visualizer

Hi! I'm **Prateek Vishwakarma**, and this is one of my latest projects where I combined my interests in frontend development, data visualization, and real-time systems. The **Latency Topology Visualizer** is a 3D web application that maps out cryptocurrency exchange servers and visualizes latency data across AWS, GCP, and Azure cloud regions — all wrapped in a photorealistic Earth model.

![Earth Visualization](https://via.placeholder.com/800x400/1e3a8a/ffffff?text=3D+Earth+with+Crypto+Exchange+Infrastructure)

---

## 🚀 Features I Implemented

- 🌍 **3D Photorealistic Earth** – Accurate terrain and continent rendering using React Three Fiber
- 📍 **Real-Time Exchange Markers** – Showcasing major crypto exchanges like Binance, OKX, Bybit, and Coinbase
- ☁️ **Cloud Provider Coverage** – Highlighting AWS, Azure, and GCP server regions globally
- ⚡ **Animated Latency Connections** – Color-coded latency lines representing real-time data traffic
- 🎛️ **Interactive Filters** – Easily filter exchanges or cloud providers
- 📈 **Latency History Charts** – Track performance trends over time
- 📱 **Fully Responsive** – Optimized for both desktop and mobile devices

---

## 🧑‍💻 Quick Start

### 🔽 Download the Project

1. **Recommended:** Download ZIP directly from GitHub.
2. **Manual:** Clone or download the entire repo.

### ⚙️ Local Setup

#### Requirements

- Node.js **v18+** – [Download Node.js](https://nodejs.org/)
- npm – Comes pre-installed with Node.js

#### Installation Steps

```bash
# Step 1: Unzip and go to the project folder
cd Latency-Topology-Visualizer

# Step 2: Install all dependencies
npm install

# Step 3: Run the development server
npm run dev
```

Now visit: `http://localhost:5000`

---

## 📁 Project Structure Overview

```
├── client/                 
│   ├── src/
│   │   ├── components/         # Core UI and 3D components
│   │   │   ├── WorldMap.tsx          
│   │   │   ├── ExchangeMarker.tsx    
│   │   │   ├── LatencyConnection.tsx 
│   │   │   └── UI/                   
│   │   ├── data/              # Exchange and cloud server datasets
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # State stores & utilities
│   │   └── utils/             # Helper functions
│   └── public/                # Static assets like textures
├── server/                    # Express backend (basic or mock)
├── shared/                    # Shared TypeScript interfaces
└── package.json               # Scripts and dependencies
```

---

## 🛠️ Tech Stack & Tools

### Frontend
- React 18 + TypeScript
- Tailwind CSS for utility-first styling
- Zustand for global state management
- Radix UI for accessible components

### 3D Visualization
- @react-three/fiber (React wrapper for Three.js)
- @react-three/drei (useful helpers like OrbitControls, Stars)
- Three.js (core 3D rendering engine)

### Backend
- Node.js with Express (used for mocking/stubbing APIs)
- Vite for blazing fast local development

---

## 📊 Available Scripts

```bash
npm run dev         # Start development server
npm run build       # Create production build
npm run preview     # Preview the production build
npm run type-check  # Run static TypeScript checks
```

---

## 🌐 Environment Variables

To enable full flexibility, add a `.env.local` file at root with:

```env
# Optional: For real-time or dynamic data extensions
LATENCY_API_KEY=your_api_key_here
DATABASE_URL=your_database_url_here
```

---

## ✏️ Customization

### Add New Exchanges
You can add more exchanges or region points by editing:

```ts
client/src/data/exchanges.ts
```

Just follow the object format and your markers will appear on the 3D globe.

---

## 🧩 Common Issues & Fixes

| Issue                             | Solution                                |
|----------------------------------|-----------------------------------------|
| Module not found                 | `rm -rf node_modules && npm install`    |
| Port already in use              | `npm run dev -- --port 3001`            |
| Build failing                    | `npm run type-check` for TS errors      |
| 3D Earth not rendering properly  | Ensure browser supports WebGL           |

---

## 🔧 Performance Tips

- Reduce particle count in `WorldMap.tsx`
- Turn off cloud effects for low-end devices
- Consider reducing sphere geometry details

---

## 🌍 Browser Compatibility

| Browser     | Version |
|-------------|---------|
| Chrome      | 90+     |
| Firefox     | 88+     |
| Safari      | 14+     |
| Edge        | 90+     |

WebGL support is required for 3D to work.

---

## 📌 What I Learned

This project helped me deeply understand:

- 3D rendering with React Three Fiber
- Structuring complex frontend applications
- Handling real-time visualization performance in the browser
- Optimizing UI for both mobile and desktop

---

## 🚧 Future Enhancements

- Connect to real-world latency APIs
- Add globe zoom and orbit behavior for better UX
- Dark mode switch and user theme preferences
- Deploy fully on Vercel with dynamic API routes

---

## 🙏 Acknowledgments

- Open source communities of Three.js and React Three Fiber
- Exchange region data sourced from public cloud APIs
- React, Vite, Zustand, and Tailwind teams for their powerful tools

---

## 🤝 Contributing

Feel free to fork the repo, make changes, and send a PR:

```bash
git checkout -b feature/my-feature
git commit -m "Added my feature"
git push origin feature/my-feature
```

---

## 📫 Support

If you face any issue:

1. Check the Troubleshooting section
2. Search open issues or raise a new one
3. Contact me directly for feedback

---

**Built with ❤️ by Prateek Vishwakarma using React, Three.js, and TypeScript**
