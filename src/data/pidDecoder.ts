/*
 * pidDecoders.ts
 * ------------------------------------------------------------
 *
 * This file provides:
 *   1. `pidDecoders`  – functions that translate raw PID byte-arrays
 *      into human-readable strings (two decimals).
 *   2. `pidMeta`      – metadata (unit + description) for every PID
 *      defined in the original C/C++ header (174 entries).
 *
 *  Notes
 *  -----
 *    Only the most common PIDs have fully-implemented decoders.
 *    For the remainder we fall back to `defaultDecoder`, which
 *    simply prints the raw bytes as a hexadecimal string.  This
 *    keeps the table complete while signalling TODOs for future
 *    work.
 *    Helper higher-order functions keep the decoder table concise.
 *    All numeric decoders return a fixed-precision string so that
 *    the UI layer does not need to worry about localisation.
 * ------------------------------------------------------------
 */

export type DecoderFn = (bytes: number[]) => string;

/* ---------- helper primitives ---------- */

const fixed = (value: number) => value.toFixed(2);

/** one-byte PIDs with a linear scale factor */
const one = (f: (A: number) => number): DecoderFn => bytes => fixed(f(bytes[0] ?? 0));

/** two-byte PIDs with a linear transform */
const two = (f: (A: number, B: number) => number): DecoderFn =>
  bytes => fixed(f(bytes[0] ?? 0, bytes[1] ?? 0));

/** default fallback – hex string e.g. "0A 3F" */
const defaultDecoder: DecoderFn = bytes =>
  bytes.map(b => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");

/* ---------- concrete decoder functions ---------- */

const calcEngineLoad     = one(A => A / 2.55);                 // 0x04
const tempMinus40        = one(A => A - 40);                   // 0x05, 0x0F, …
const fuelTrim           = one(A => (100 / 128) * A - 100);    // 0x06-0x09
const fuelPressure       = one(A => A * 3);                    // 0x0A
const manifoldPressure   = one(A => A);                        // 0x0B (kPa)
const engineSpeed        = two((A, B) => (256 * A + B) / 4);   // 0x0C
const vehicleSpeed       = one(A => A);                        // 0x0D (km/h)
const timingAdvance      = one(A => A / 2 - 64);               // 0x0E
const mafFlowRate        = two((A, B) => (256 * A + B) / 100); // 0x10 (g/s)
const throttlePercent    = one(A => (100 / 255) * A);          // 0x11 etc.
const runTimeSeconds     = two((A, B) => 256 * A + B);         // 0x1F

/* ---------- pidDecoders table ---------- */
/**
 * Only PIDs that require *specific* maths are listed explicitly.
 * All others implicitly fall back to `defaultDecoder`.
 */
export const pidDecoders: Record<number, DecoderFn> = {
  /* 0x00 – 0x0F */
  0x04: calcEngineLoad,
  0x05: tempMinus40,
  0x06: fuelTrim,
  0x07: fuelTrim,
  0x08: fuelTrim,
  0x09: fuelTrim,
  0x0A: fuelPressure,
  0x0B: manifoldPressure,
  0x0C: engineSpeed,
  0x0D: vehicleSpeed,
  0x0E: timingAdvance,
  0x0F: tempMinus40,

  /* 0x10 – 0x1F */
  0x10: mafFlowRate,
  0x11: throttlePercent,
  0x1F: runTimeSeconds,

  /* Everything else */
} as const;

/* fill gaps with the default decoder at runtime */
export function getDecoder(pid: number): DecoderFn {
  return pidDecoders[pid] ?? defaultDecoder;
}

/* ---------- metadata ---------- */
/**
 * These arrays are a direct transcription of `unit_LUT` and
 * `pid_desc_bank` from the C++ header.  Index == PID code.
 */

const UNITS: string[] = [
  "", "", "", "", "%", "°C", "%", "%", "%", "%",
  "kPa", "kPa", "rpm", "km/h", "° before TDC", "°C",
  "g/s", "%", "", "", "V", "V", "V", "V",
  "V", "V", "V", "V", "", "", "", "s",
  "", "km", "kPa", "kPa", "ratio", "ratio", "ratio", "ratio",
  "ratio", "ratio", "ratio", "ratio", "%", "%", "%", "%",
  "", "km", "Pa", "kPa", "ratio", "ratio", "ratio", "ratio",
  "ratio", "ratio", "ratio", "ratio", "°C", "°C", "°C", "°C",
  "", "", "V", "%", "ratio", "%", "°C", "%", "%", "%",
  "%", "%", "%", "%", "min", "min", "ratio, V, mA, kPa", "g/s",
  "", "%", "kPa", "Pa", "%", "%", "%", "%", "kPa", "%",
  "%", "°C", "°", "L/h", "", "", "%", "%", "N·m", "%", "",
  "g/s", "°C", "°C", "", "", "", "", "", "", "", "", "", "",
  "", "", "", "", "°C", "", "", "s", "", "", "", "", "",
  "", "%", "", "", "", "", "", "", "", "", "%", "%", "",
  "h", "h", "", "h", "", "", "", "", "", "%", "", "g/s",
  "kg/h", "", "", "ppm", "mg/stroke", "Pa", "ratio", "%", "km",
  "", "", "", "", "", "%", "seconds / Count", "kPa", "h", "km",
  "Bit"
];

const DESCRIPTIONS: string[] = [
  "PIDs supported [$01 - $20]", "Monitor status since DTCs cleared...", "DTC that caused freeze frame to be stored.",
  "Fuel system status", "Calculated engine load", "Engine coolant temperature",
  "Short term fuel trim (STFT)—Bank 1", "Long term fuel trim (LTFT)—Bank 1",
  "Short term fuel trim (STFT)—Bank 2", "Long term fuel trim (LTFT)—Bank 2",
  "Fuel pressure (gauge pressure)", "Intake manifold absolute pressure", "Engine speed",
  "Vehicle speed", "Timing advance", "Intake air temperature", "Mass air flow sensor (MAF) air flow rate",
  "Throttle position", "Commanded secondary air status", "Oxygen sensors present (in 2 banks)",
  "Oxygen Sensor 1", "Oxygen Sensor 2", "Oxygen Sensor 3", "Oxygen Sensor 4",
  "Oxygen Sensor 5", "Oxygen Sensor 6", "Oxygen Sensor 7", "Oxygen Sensor 8",
  "OBD standards this vehicle conforms to", "Oxygen sensors present (in 4 banks)",
  "Auxiliary input status", "Run time since engine start", "PIDs supported [$21 - $40]",
  "Distance traveled with MIL on", "Fuel Rail Pressure (relative to manifold vacuum)",
  "Fuel Rail Gauge Pressure", "Oxygen Sensor 1 (wide) ...", "Oxygen Sensor 2 (wide) ...",
  "Oxygen Sensor 3 (wide) ...", "Oxygen Sensor 4 (wide) ...", "Oxygen Sensor 5 (wide) ...",
  "Oxygen Sensor 6 (wide) ...", "Oxygen Sensor 7 (wide) ...", "Oxygen Sensor 8 (wide) ...",
  "Commanded EGR", "EGR Error", "Commanded evaporative purge", "Fuel Tank Level Input",
  "Warm-ups since codes cleared", "Distance traveled since codes cleared",
  "Evap. System Vapor Pressure", "Absolute Barometric Pressure", "Oxygen Sensor 1 (wide) ...",
  "Oxygen Sensor 2 (wide) ...", "Oxygen Sensor 3 (wide) ...", "Oxygen Sensor 4 (wide) ...",
  "Oxygen Sensor 5 (wide) ...", "Oxygen Sensor 6 (wide) ...", "Oxygen Sensor 7 (wide) ...",
  "Oxygen Sensor 8 (wide) ...", "Catalyst Temperature: Bank 1 Sensor 1",
  "Catalyst Temperature: Bank 2 Sensor 1", "Catalyst Temperature: Bank 1 Sensor 2",
  "Catalyst Temperature: Bank 2 Sensor 2", "PIDs supported [$41 - $60]", "Monitor status this drive cycle",
  "Control module voltage", "Absolute load value", "Commanded Air-Fuel equivalence ratio (λ)",
  "Relative throttle position", "Ambient air temperature", "Absolute throttle position B",
  "Absolute throttle position C", "Accelerator pedal position D", "Accelerator pedal position E",
  "Accelerator pedal position F", "Commanded throttle actuator", "Time run with MIL on",
  "Time since trouble codes cleared", "Maximum values for fuel-air ratio etc.",
  "Maximum air-flow rate from MAF", "Fuel Type", "Ethanol fuel %", "Absolute evap-system vapor pressure",
  "Evap system vapor pressure", "Short-term secondary O₂ trim Bank 1/3", "Long-term secondary O₂ trim Bank 1/3",
  "Short-term secondary O₂ trim Bank 2/4", "Long-term secondary O₂ trim Bank 2/4", "Fuel-rail absolute pressure",
  "Relative accelerator-pedal position", "Hybrid battery pack remaining life", "Engine-oil temperature",
  "Fuel-injection timing", "Engine fuel-rate", "Emission requirements vehicle is designed to",
  "PIDs supported [$61 - $80]", "Driver's demand engine torque", "Actual engine torque",
  "Engine reference torque", "Engine percent-torque data", "Auxiliary I/O supported",
  "Mass-air-flow sensor", "Engine coolant temperature (alt.)", "Intake-air-temperature sensor (alt.)",
  "Actual & Commanded EGR + error", "Commanded diesel intake-air flow control + position",
  "EGR temperature", "Throttle-actuator control & position", "Fuel-pressure control system",
  "Injection-pressure control system", "Turbocharger compressor inlet pressure", "Boost-pressure control",
  "VGT control", "Wastegate control", "Exhaust pressure", "Turbocharger RPM", "Turbocharger temperature (1)",
  "Turbocharger temperature (2)", "Charge-air-cooler temperature", "EGT Bank 1", "EGT Bank 2",
  "DPF", "DPF (alt.)", "DPF temperature", "NOx NTE status", "PM NTE status", "Engine run-time (alt.)",
  "PIDs supported [$81 - $A0]", "Engine run-time for AECD #11-#15", "Engine run-time for AECD #16-#20",
  "NOx sensor", "Manifold-surface temperature", "NOx reagent system", "PM sensor",
  "Intake manifold absolute pressure (alt.)", "SCR induce system", "Run-time for AECD #11-#15",
  "Run-time for AECD #16-#20", "Diesel after-treatment", "Wide-range O₂ sensor", "Throttle position G",
  "Engine friction - percent torque", "PM sensor bank 1&2", "WWH-OBD system info (1)",
  "WWH-OBD system info (2)", "Fuel-system control", "WWH-OBD counters support", "NOx warning / inducement",
  "Exhaust-gas temperature sensor (1)", "Exhaust-gas temperature sensor (2)",
  "Hybrid/EV battery voltage data", "Diesel exhaust-fluid sensor", "O₂-sensor data",
  "Engine fuel-rate (alt.)", "Engine exhaust flow-rate", "Fuel-system percentage use",
  "PIDs supported [$A1 - $C0]", "NOx sensor corrected data", "Cylinder-fuel rate",
  "Evap-system vapor pressure (alt.)", "Transmission actual gear", "Commanded DEF dosing",
  "Odometer", "NOx sensor concentration sensors 3&4", "NOx sensor corrected concentration 3&4",
  "ABS disable-switch state", "PIDs supported [$C1 - $E0]", "Fuel-level input A/B",
  "Exhaust particulate-control diagnostic time/count", "Fuel pressure A&B", "Particulate-control inducement status",
  "Distance since re-flash or module replacement", "NOx/PCD warning-lamp status"
];

/** Pre-built lookup map (number → {unit, description}) */
export const pidMeta: Record<number, { unit: string; description: string }> =
  UNITS.reduce<Record<number, { unit: string; description: string }>>((map, unit, pid) => {
    map[pid] = { unit, description: DESCRIPTIONS[pid] };
    return map;
  }, {});
