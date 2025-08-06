# Trainer Diagnostic Interface – Developer README

Welcome to the **Trainer Diagnostic Interface**.  This document is a reference for new contributors and explains the overall architecture, project layout, and the conventions you will need to follow when adding features or new *trainers*.

---

## 1. Tech Stack

| Layer             | Library / Tool                       | Notes                                                          |
| ----------------- | ------------------------------------ | -------------------------------------------------------------- |
| UI                | **React 18** + React‑Router v6       | Functional components + hooks only.                            |
| Styling           | **Tailwind CSS**                     | Utility‑first classes (personal preference).                   |
| Build             | **Vite**                             | Instant HMR + ESM build.                                       |
| BLE               | **Web Bluetooth API**                | Runs entirely in the browser (not available for all browsers). |
| State fan‑out     | Custom pub/sub in `core/ble/core.js` | Keeps UI protocol‑agnostic.                                    |

---

## 2. Getting Started

### 2.1 Prerequisites

- **Node.js 18+**
- Available Browsers: Chrome, Edge, Opera, Chrome Android, Opera Android, Samsung Internet

### 2.2 Install & Run

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:5173 by default)
npm run dev

# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## 3. Directory Structure

```
src/
│  App.jsx                 # App's Top‑level Router
│  index.css               # Tailwind init + custom layers (none right now)
├─ assets/                 # Static images (trainers, bg, etc..)
├─ components/
│   ├─ generic/            # Re‑usable UI & trainer‑agnostic pages
│   └─ layout/             # Header, Layout, Tabs, etc.
├─ core/
│   └─ ble/                # Low‑level Bluetooth helpers (important)
├─ data/                   # PID library (decode functions, dtc Definitions, general PID info)
├─ pages/                  # Stand‑alone route pages (Home, About, Help)
├─ trainers/               # **One folder per trainer** (see #6)
└─ utils/                  # Misc utilities (trainerRegistry, helpers)
```

### 3.1 Important Files

| Path                                  | Purpose                                            |
| ------------------------------------- | -------------------------------------------------- |
| `core/ble/core.js`                    | Connection management, notify fan‑out, write queue |
| `core/ble/commands.js`                | Codec / opcode helpers + high‑level wrappers       |
| `components/generic/ReadData.jsx`     | Generic Live‑and‑snapshot data page                |
| `components/generic/ReadCodes.jsx`    | Generic DTC reader / clearer                       |
| `components/generic/Card.jsx`         | Animated card used on Trainers dashboard           |
| `components/router/TrainerRouter.jsx` | Dynamically mounts **all** trainers                |
| `utils/trainerRegistry.js`            | Auto‑discovers trainers via `import.meta.glob`     |

---

## 4. Data Flow Overview

```
┌──────────────┐          writeCommand([...])          ┌────────────────┐
│  UI Layer    │  ───────────────────────────────────▶ │  ESP32 trainer │
└──────────────┘                                       └────────────────┘
       ▲                                                      │
       │    characteristicvaluechanged                        │
       │   (raw 20‑byte frames)                               ▼
┌──────────────┐   onBleNotify(raw)   ┌───────────────────────────────────┐
│  components  │◀──────────────────── │ core/ble/core.js  (pub/sub fan‑out)│
└──────────────┘                     └───────────────────────────────────┘
```

- **Write queue** (`enqueue`) guarantees BLE writes never overlap.
- **Pub/Sub** allows multiple React components to listen for the same stream without coupling.
- UI stays *protocol‑agnostic*; each trainer module provides thin wrappers that translate UI intents into the proper BLE opcodes.

---

## 5. The Trainer System

A *trainer* is a folder under `src/trainers/` exposing a default export with the following signature (example):

```js
export default {
  id: 'air-conditioner',      // URL segment => /trainers/air-conditioner
  name: 'Air Conditioner',    // Display text
  hero,                       // 1920×600 hero banner
  cardImg,                    // 3:2 tile image for dashboard
  gapPrefix: 'Trainer-AC',    // BLE GAP name prefix used for scanning

  components: {
    Home: null,               // optional override pages
    ReadData: null,
    ReadCodes: null,
  },

  ble: {
    readCodes:  () => [CMD.CMD_PENDING],
    clearCodes: () => [CMD.CMD_CLEAR],
    status:     () => [CMD.CMD_STATUS],
    liveStart:  () => [CMD.CMD_LIVE_START],
    liveStop:   () => [CMD.CMD_LIVE_STOP],
  },
};
```
**Why?**
> - Decouples domain logic from UI. UI just calls `trainer.ble.status()` – whatever that returns is pushed straight down to BLE.
> - Route generation and tab labels can be completely automated.

### 5.1 Routing

`TrainerRouter.jsx` dynamically creates nested routes for every trainer:

- `/trainers/:id` -> Home page (generic or overridden)
- `/trainers/:id/read-data` -> Live Data page
- `/trainers/:id/read-codes` -> DTC page

Because the registry is populated via `import.meta.glob`, **adding a trainer requires zero manual wiring**--simply drop an `index.js` in a new folder.

---

## 6. Adding a New Trainer  

Follow this checklist to integrate a new trainer module:

| Step | Action                                                                                                            |
| ---- | ----------------------------------------------------------------------------------------------------------------- |
| 1.   | **Create assets** in `src/assets/` – a hero (`myTrainer_hero.webp`) and a card image (`bg_myTrainer.png`).        |
| 2.   | **Scaffold folder**: `src/trainers/my-trainer/index.js`.                                                          |
| 3.   | **Fill descriptor** (copy template below). Adjust `gapPrefix` to match the BLE advertising name of your hardware. |
| 4.   | *(Optional)* Create custom pages under `src/components/my-trainer/` and reference them in the `components` map.   |
| 5.   | *(Optional)* Override `ble` helpers if your command set differs. Each function must return an **array** of bytes. |

```js
// src/trainers/my-trainer/index.js
import hero    from '../../assets/myTrainer_hero.webp';
import cardImg from '../../assets/bg_myTrainer.png';
import * as CMD from '../../core/ble/commands';

export default {
  id:        'my-trainer',
  name:      'My Trainer',
  hero,
  cardImg,
  gapPrefix: 'Trainer-MY',

  // Optional custom pages (set to null to fall back to generic ones)
  components: {
    Home:      null,
    ReadData:  null,
    ReadCodes: null,
  },

  // Wrap BLE commands so the UI layer remains device‑agnostic
  ble: {
    readCodes:  () => [CMD.CMD_PENDING],
    clearCodes: () => [CMD.CMD_CLEAR],
    status:     () => [CMD.CMD_STATUS],
    liveStart:  () => [CMD.CMD_LIVE_START],
    liveStop:   () => [CMD.CMD_LIVE_STOP],
  },
};
```
---

## 7. Next Steps

1. Cleanup and fix overlap error with "Get Data" Backend - start, stop, and status commands overlap with PID 0x05, 0x06, 0x07
2. Implement live stream functionality
3. Add Guardrails (stop live stream upon dismount)
4. Generalize BLE Characteristics and Service UUIDs for different trainers.
