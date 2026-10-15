import "server-only";
import fs from "node:fs";
import path from "node:path";
import type { Accommodation, Booking, Extra, Post, Promotion, RequestItem, Settings, Tour, User, Vehicle } from "./types";
import { SEED_TOURS } from "./data/seed-tours";
import { DEFAULT_SETTINGS, SEED_ACCOMMODATIONS, SEED_EXTRAS, SEED_POSTS, SEED_PROMOS, SEED_VEHICLES } from "./data/seed-content";

/**
 * Persistence layer.
 *
 * Default: a JSON file (DATA_DIR/store.json) — fine for a single Node server or VPS and for demos.
 * For serverless / multi-instance hosting, replace the functions in this file with a PostgreSQL/Supabase
 * implementation using db/schema.sql. Every other module only talks to this file's exported API.
 */
export interface Db {
  tours: Tour[];
  extras: Extra[];
  accommodations: Accommodation[];
  vehicles: Vehicle[];
  posts: Post[];
  promotions: Promotion[];
  bookings: Booking[];
  requests: RequestItem[];
  users: User[];
  settings: Settings;
  translations: Record<string, string>;
}

export type Collection = Exclude<keyof Db, "settings" | "translations">;

const DATA_DIR = path.resolve(process.cwd(), process.env.DATA_DIR || ".data");
const FILE = path.join(DATA_DIR, "store.json");

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

function seed(): Db {
  return {
    tours: clone(SEED_TOURS),
    extras: clone(SEED_EXTRAS),
    accommodations: clone(SEED_ACCOMMODATIONS),
    vehicles: clone(SEED_VEHICLES),
    posts: clone(SEED_POSTS),
    promotions: clone(SEED_PROMOS),
    bookings: [],
    requests: [],
    users: [],
    settings: clone(DEFAULT_SETTINGS),
    translations: {},
  };
}

let cache: { mtime: number; db: Db } | null = null;

function mergeSettings(stored: Partial<Settings>): Settings {
  const d = clone(DEFAULT_SETTINGS);
  return {
    ...d,
    ...stored,
    company: { ...d.company, ...stored.company },
    social: { ...d.social, ...stored.social },
    payments: { ...d.payments, ...stored.payments },
    homepage: { ...d.homepage, ...stored.homepage },
    analytics: { ...d.analytics, ...stored.analytics },
    seo: { ...d.seo, ...stored.seo },
  };
}

export function readDb(): Db {
  try {
    const stat = fs.statSync(FILE);
    if (cache && cache.mtime === stat.mtimeMs) return cache.db;
    const raw = JSON.parse(fs.readFileSync(FILE, "utf8")) as Partial<Db>;
    const s = seed();
    const db: Db = { ...s, ...raw, settings: mergeSettings(raw.settings || {}) } as Db;
    cache = { mtime: stat.mtimeMs, db };
    return db;
  } catch {
    // No file yet: serve seed data (nothing is written until the first change).
    if (!cache || cache.mtime !== -1) cache = { mtime: -1, db: seed() };
    return cache.db;
  }
}

let queue: Promise<unknown> = Promise.resolve();

/** Serialised read-modify-write. Atomic file replace. */
export function mutateDb<T>(fn: (db: Db) => T): Promise<T> {
  const run = async () => {
    const db = clone(readDb());
    const result = fn(db);
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmp = FILE + "." + process.pid + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
    fs.renameSync(tmp, FILE);
    cache = null;
    return result;
  };
  const p = queue.then(run, run);
  queue = p.catch(() => undefined);
  return p;
}

/* -------- read helpers -------- */
export const getSettings = () => readDb().settings;
export const getTranslations = () => readDb().translations;
export const getPublishedTours = () => readDb().tours.filter((t) => t.published);
export const getTourBySlug = (slug: string) => readDb().tours.find((t) => t.slug === slug && t.published);
export const getTourById = (id: string) => readDb().tours.find((t) => t.id === id);
export const getExtras = () => readDb().extras.filter((e) => e.active);
export const getPublishedStays = () => readDb().accommodations.filter((a) => a.published);
export const getVehicles = () => readDb().vehicles.filter((v) => v.active);
export const getPublishedPosts = () =>
  readDb().posts.filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date));
export const getPostBySlug = (slug: string) => readDb().posts.find((p) => p.slug === slug && p.published);
export const getPromo = (code: string) => {
  const c = code.trim().toUpperCase();
  const today = new Date().toISOString().slice(0, 10);
  return readDb().promotions.find((p) => p.active && p.code.toUpperCase() === c && (!p.validUntil || p.validUntil >= today));
};

export function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
