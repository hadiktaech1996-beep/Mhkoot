import type { L, LList } from "./i18n/config";

export type SceneKind =
  | "sarajevo" | "mostar" | "kravice" | "blagaj" | "travnik" | "jajce" | "una" | "mountain" | "coast" | "night" | "road";

export type TourCategory =
  | "sarajevo" | "mostar" | "kravice" | "travnik" | "nature" | "family" | "private" | "vip" | "multiday" | "balkan" | "custom";

export type Destination =
  | "sarajevo" | "mostar" | "kravice" | "blagaj" | "travnik" | "jajce" | "una" | "bjelasnica" | "balkans";

export interface Tour {
  id: string;
  slug: string;
  published: boolean;
  featured: boolean;
  sample: boolean; // demonstration data
  title: L;
  summary: L;
  description: L;
  destination: Destination;
  categories: TourCategory[];
  scene: SceneKind;
  imageUrl?: string;
  gallery?: string[];
  days: number; // 1 = single day
  hours: number; // approximate hours for single-day tours
  priceGroup: number; // EUR per adult in a shared group
  pricePrivate: number; // EUR per private group (0 = not offered)
  privateMaxPax: number;
  childDiscountPct: number; // 0-100
  maxGroup: number;
  minAge: number;
  highlights: LList;
  itinerary: { time: string; title: L }[];
  included: string[]; // keys into dict.service
  excluded: string[];
  pickup: L;
  meeting: L;
  lat: number;
  lng: number;
  accessibility: L;
  ages: L;
  cancellationKey: "flexible" | "standard" | "strict";
  /** weekdays (0=Sun..6=Sat) the tour runs; empty = every day */
  weekdays: number[];
  /** ISO dates (YYYY-MM-DD) that are unavailable */
  blackout: string[];
  /** Sample guest reviews are never invented. Real reviews are added through the admin dashboard. */
  reviews: { name: string; rating: number; text: L; date: string }[];
  relatedIds: string[];
}

export interface Extra {
  id: string;
  label: L;
  price: number;
  perPerson: boolean;
  active: boolean;
}

export interface Accommodation {
  id: string;
  slug: string;
  published: boolean;
  sample: boolean;
  name: L;
  description: L;
  type: "hotel" | "apartment" | "family" | "villa" | "cabin";
  location: "sarajevo" | "mostar" | "jahorina" | "blagaj" | "travnik" | "jajce" | "bihac";
  guests: number;
  pricePerNight: number;
  amenities: string[];
  scene: SceneKind;
  imageUrl?: string;
}

export interface Vehicle {
  id: string;
  name: L;
  category: "sedan" | "minivan" | "suv" | "minibus";
  passengers: number;
  suitcases: number;
  priceFrom: number; // EUR, 0 = on request
  note: L;
  scene: SceneKind;
  imageUrl?: string;
  active: boolean;
}

export interface Post {
  id: string;
  slug: string;
  published: boolean;
  category: string; // key in dict.blog.cats
  scene: SceneKind;
  imageUrl?: string;
  date: string;
  readMin: number;
  title: L;
  excerpt: L;
  body: LList; // paragraphs
  tourIds: string[];
}

export interface Promotion {
  id: string;
  code: string;
  percent: number;
  title: L;
  validUntil: string;
  active: boolean;
}

export type BookingStatus = "pending" | "confirmed" | "paid" | "cancelled" | "completed";
export const BOOKING_STATUSES: BookingStatus[] = ["pending", "confirmed", "paid", "cancelled", "completed"];
export type PaymentMethod = "card" | "paypal" | "bank" | "arrival";

export interface Booking {
  id: string;
  ref: string;
  createdAt: string;
  status: BookingStatus;
  lang: string;
  tourId: string;
  tourTitle: string;
  date: string;
  adults: number;
  children: number;
  mode: "group" | "private";
  extras: { id: string; label: string; qty: number; total: number }[];
  promoCode?: string;
  discount: number;
  total: number;
  currency: "EUR";
  paymentMethod: PaymentMethod;
  paymentStatus: "unpaid" | "awaiting" | "paid" | "refunded";
  paymentRef?: string;
  customer: { name: string; email: string; phone: string; country: string; notes: string };
  internalNotes?: string;
  sample?: boolean;
}

export type RequestType = "transfer" | "vip" | "accommodation" | "contact";
export type RequestStatus = "new" | "in_progress" | "quoted" | "done" | "closed";
export const REQUEST_STATUSES: RequestStatus[] = ["new", "in_progress", "quoted", "done", "closed"];

export interface RequestItem {
  id: string;
  ref: string;
  type: RequestType;
  createdAt: string;
  status: RequestStatus;
  lang: string;
  name: string;
  email: string;
  phone: string;
  data: Record<string, string | number>;
  internalNotes?: string;
}

export type Role = "owner" | "manager" | "editor" | "support";
export type Permission = "bookings" | "requests" | "tours" | "content" | "translations" | "settings" | "payments" | "staff";
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  owner: ["bookings", "requests", "tours", "content", "translations", "settings", "payments", "staff"],
  manager: ["bookings", "requests", "tours", "content", "translations", "settings"],
  editor: ["tours", "content", "translations"],
  support: ["bookings", "requests"],
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
  active: boolean;
  createdAt: string;
}

export interface Settings {
  company: { name: string; email: string; phone: string; address: string; legalInfoPending: boolean };
  whatsappNumber: string; // digits only, international format, e.g. 38761123456
  social: { instagram: string; facebook: string; tiktok: string; youtube: string };
  payments: {
    mode: "test" | "live";
    card: boolean;
    paypal: boolean;
    bank: boolean;
    arrival: boolean;
    bankDetails: string;
  };
  homepage: Record<string, boolean>;
  heroImage: string;
  heroVideo: string;
  showDemoReviews: boolean;
  seo: Record<string, { title: L; description: L }>; // keyed by page id
  analytics: { gaId: string; searchConsole: string };
}
