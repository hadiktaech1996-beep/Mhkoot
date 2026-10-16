import type { Dict } from "./i18n";

export interface Field {
  key: string;
  label: string;
  type: "text" | "email" | "tel" | "date" | "datetime-local" | "number" | "select" | "textarea" | "checkboxes";
  required?: boolean;
  options?: { value: string; label: string }[];
  half?: boolean;
  top?: "name" | "email" | "phone";
  min?: number | string;
  max?: number | string;
  autoComplete?: string;
  defaultValue?: string;
}

const person = (d: Dict): Field[] => [
  { key: "name", top: "name", label: d.common.name, type: "text", required: true, half: true, autoComplete: "name" },
  { key: "email", top: "email", label: d.common.email, type: "email", required: true, half: true, autoComplete: "email" },
  { key: "phone", top: "phone", label: d.common.phone, type: "tel", required: true, half: true, autoComplete: "tel" },
];

const num = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => ({ value: String(from + i), label: String(from + i) }));

export function contactFields(d: Dict, withSubject = true): Field[] {
  return [
    ...person(d),
    ...(withSubject ? [{ key: "subject", label: d.contactPage.subject, type: "text", half: true } as Field] : [{ key: "country", label: d.common.country, type: "text", half: true, autoComplete: "country-name" } as Field]),
    { key: "message", label: d.common.message, type: "textarea", required: true },
  ];
}

export function transferFields(d: Dict, defaults: { pickup?: string } = {}): Field[] {
  const airports = d.transfers.airports.map((a) => ({ value: a, label: a }));
  return [
    ...person(d),
    { key: "pickup", label: d.transfers.pickup, type: "select", required: true, half: true, options: airports, defaultValue: defaults.pickup },
    { key: "dropoff", label: d.transfers.dropoff, type: "text", required: true, half: true },
    { key: "datetime", label: d.transfers.datetime, type: "datetime-local", required: true, half: true },
    { key: "flight", label: d.transfers.flight, type: "text", half: true },
    { key: "passengers", label: d.transfers.passengers, type: "select", required: true, half: true, options: num(1, 16), defaultValue: "2" },
    { key: "suitcases", label: d.transfers.suitcases, type: "select", half: true, options: num(0, 16), defaultValue: "2" },
    { key: "vehicle", label: d.transfers.vehicle, type: "select", half: false, options: [{ value: d.transfers.anyVehicle, label: d.transfers.anyVehicle }, ...Object.values(d.transfers.vehicles).map((v) => ({ value: v, label: v }))] },
    { key: "requests", label: d.transfers.requests, type: "textarea" },
  ];
}

export function vipFields(d: Dict): Field[] {
  return [
    ...person(d),
    { key: "dates", label: d.vip.dates, type: "text", required: true, half: true },
    { key: "groupSize", label: d.vip.groupSize, type: "select", required: true, half: true, options: num(1, 20), defaultValue: "2" },
    { key: "budget", label: d.vip.budget, type: "number", half: true, min: 0 },
    { key: "interests", label: d.vip.interests, type: "checkboxes", options: Object.values(d.vip.interestsList).map((v) => ({ value: v, label: v })) },
    { key: "details", label: d.vip.details, type: "textarea", required: true },
  ];
}

export function stayFields(d: Dict, defaults: { listing?: string } = {}): Field[] {
  return [
    ...person(d),
    { key: "location", label: d.stay.location, type: "select", half: true, options: Object.entries(d.stay.locations).map(([, v]) => ({ value: v, label: v })) },
    { key: "guests", label: d.stay.guests, type: "select", required: true, half: true, options: num(1, 20), defaultValue: "2" },
    { key: "checkIn", label: d.stay.checkIn, type: "date", required: true, half: true },
    { key: "checkOut", label: d.stay.checkOut, type: "date", required: true, half: true },
    { key: "budget", label: d.stay.budget, type: "number", half: true, min: 0 },
    { key: "listing", label: d.nav.stay, type: "text", half: true, defaultValue: defaults.listing },
    { key: "message", label: d.stay.custom, type: "textarea" },
  ];
}
