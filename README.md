# Trainer Diagnostic Interface

This project is a **React-based web application** to simulate and interact with various Atech trainer devices over **Bluetooth LE (BLE)**.  
It supports multiple trainers, each with options to:
- Read Live Data
- Read Diagnostic Trouble Codes (DTC)
- Clear Trouble Codes

---

## 📁 Project Structure

``` bash

│   App.jsx
│   index.css
│   main.jsx
│   
├───assets
│       power_seat_trainer.webp
│       react.svg
│       wiper_washer_trainer.webp
│
├───components
│   │   bluetooth.js
│   │   HomeButton.jsx
│   │   Layout.jsx
│   │   TabNav.jsx
│   │
│   ├───bluetooth
│   │       core.js
│   │       index.js
│   │       powerSeat.js
│   │       wiperWasher.js
│   │
│   ├───ReadCodeComponents
│   │       PS_RC.jsx
│   │       WW_RC.jsx
│   │
│   └───ReadDataComponents
│           PS_RD.jsx
│           WW_RD.jsx
│
└───pages
        ClearCodes.jsx
        HomePage.jsx
        PowerSeatTrainer.jsx
        ReadCodes.jsx
        ReadData.jsx
        TrainerActionPage.jsx
        Trainers.jsx
        WiperWasherTrainer.jsx

```

---

## 🔷 Key Concepts

### 🧰 BLE Service Layer
Located in `components/bluetooth/`:
- **`core.js`**  
  General-purpose BLE utilities: `connectBle`, `disconnectBle`, `setNotifyCallback`, `readAlias`, `subscribeAll`, `requestDTC`, `writeCommand`.
- **`powerSeat.js` and `wiperWasher.js`**  
  Abstraction for trainer-specific BLE command wrappers.  
  If each trainer needs different command sequences or response formats, these modules encapsulate trainer logic.  
  If all trainers share the same BLE protocol, you can call `core.js` directly from components.

---

### 🧩 Components
Trainer actions are organized by **trainer** and **action**:
- **Read Data:**  
  Located in `ReadDataComponents/`, e.g., `PS_RD.jsx`, `WW_RD.jsx`
- **Read Codes:**  
  Located in `ReadCodeComponents/`, e.g., `PS_RC.jsx`, `WW_RC.jsx`

These are used in page-level route components.

---

### 📄 Pages
Each route (e.g., `/trainer/power-seat/read-data`) is handled by a corresponding page in `pages/`.
- **Dynamic routing:**  
  `TrainerActionPage.jsx` handles trainer and action combinations dynamically.
- **Trainer home pages:**  
  `PowerSeatTrainer.jsx` and `WiperWasherTrainer.jsx` display connection controls and route options for their respective trainer.
- **Trainers selection page:**  
  `Trainers.jsx` allows the user to pick a trainer.

---

## 🚀 Routing Overview

| Path                                | Description                     |
|------------------------------------|---------------------------------|
| `/`                                | Home page                      |
| `/trainers`                        | Trainer selection page         |
| `/power-seat`                      | Power Seat home page           |
| `/wiper-washer`                    | Wiper Washer home page         |
| `/trainer/:trainerId/:action`     | Dynamic trainer + action page  |

---

## 🔷 Notes

✅ `core.js` is kept generic and reusable.  
✅ `powerSeat.js` / `wiperWasher.js` can optionally be used for encapsulating trainer-specific protocols.  
✅ Components should **only care about their trainer & action**, not BLE internals.  
✅ Dynamic routing (`TrainerActionPage.jsx`) makes adding new trainers and actions easy.

---

## 📄 Future Enhancements

- Implement `wiperWasher.js` trainer-specific BLE logic.
- Add global connection state using React Context.

---
