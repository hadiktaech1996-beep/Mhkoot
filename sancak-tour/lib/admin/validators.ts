import "server-only";
import { z } from "zod";
import { AMENITIES, BLOG_CATS, DESTS, SCENES, SERVICE_KEYS, TOUR_CATS, type CollectionName } from "./fields";

const str = (max = 5000) => z.string().max(max);
export const zL = z.object({ en: str(), tr: str(), ar: str(), de: str() });
export const zLL = z.object({ en: z.array(str(3000)).max(60), tr: z.array(str(3000)).max(60), ar: z.array(str(3000)).max(60), de: z.array(str(3000)).max(60) });
const url = z.string().max(500).regex(/^(\/uploads\/[\w.\-]+|https:\/\/[^\s]+)?$/, "must be an https:// or /uploads/ URL").optional().or(z.literal(""));
const slug = z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).min(3).max(80);
const en = <T extends readonly string[]>(a: T) => z.enum(a as unknown as [string, ...string[]]);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const validators: Record<CollectionName, z.ZodTypeAny> = {
  tours: z.object({
    slug, published: z.boolean(), featured: z.boolean(), sample: z.boolean(),
    title: zL, summary: zL, description: zL,
    destination: en(DESTS), categories: z.array(en(TOUR_CATS)).min(1).max(6), scene: en(SCENES), imageUrl: url, gallery: z.array(z.string().max(500)).max(12).optional(),
    days: z.number().int().min(1).max(30), hours: z.number().min(0).max(24),
    priceGroup: z.number().min(0).max(100000), pricePrivate: z.number().min(0).max(100000), privateMaxPax: z.number().int().min(1).max(50),
    childDiscountPct: z.number().min(0).max(100), maxGroup: z.number().int().min(1).max(100), minAge: z.number().int().min(0).max(18),
    highlights: zLL, itinerary: z.array(z.object({ time: str(30), title: zL })).max(40),
    included: z.array(en(SERVICE_KEYS)).max(20), excluded: z.array(en(SERVICE_KEYS)).max(20),
    pickup: zL, meeting: zL, lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180), accessibility: zL, ages: zL,
    cancellationKey: en(["flexible", "standard", "strict"]), weekdays: z.array(z.number().int().min(0).max(6)).max(7), blackout: z.array(date).max(400),
    reviews: z.array(z.object({ name: str(80), rating: z.number().int().min(1).max(5), date: str(20), text: zL })).max(50),
    relatedIds: z.array(str(80)).max(6),
  }),
  accommodations: z.object({
    slug, published: z.boolean(), sample: z.boolean(), name: zL, description: zL,
    type: en(["hotel", "apartment", "family", "villa", "cabin"]), location: en(["sarajevo", "mostar", "jahorina", "blagaj", "travnik", "jajce", "bihac"]),
    guests: z.number().int().min(1).max(50), pricePerNight: z.number().min(0).max(100000), amenities: z.array(en(AMENITIES)).max(20), scene: en(SCENES), imageUrl: url,
  }),
  vehicles: z.object({
    active: z.boolean(), name: zL, note: zL, category: en(["sedan", "minivan", "suv", "minibus"]),
    passengers: z.number().int().min(1).max(60), suitcases: z.number().int().min(0).max(60), priceFrom: z.number().min(0).max(100000), scene: en(SCENES), imageUrl: url,
  }),
  posts: z.object({
    slug, published: z.boolean(), category: en(BLOG_CATS), scene: en(SCENES), imageUrl: url, date, readMin: z.number().int().min(1).max(60),
    title: zL, excerpt: zL, body: zLL, tourIds: z.array(str(80)).max(6),
  }),
  extras: z.object({ active: z.boolean(), label: zL, price: z.number().min(0).max(100000), perPerson: z.boolean() }),
  promotions: z.object({ active: z.boolean(), code: z.string().trim().min(3).max(30).regex(/^[A-Za-z0-9_-]+$/), percent: z.number().min(1).max(90), validUntil: z.string().max(10), title: zL }),
};

export const ID_PREFIX: Record<CollectionName, string> = { tours: "t", accommodations: "a", vehicles: "v", posts: "p", extras: "x", promotions: "promo" };
