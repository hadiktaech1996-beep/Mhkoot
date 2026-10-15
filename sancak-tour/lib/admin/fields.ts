// Client-safe field definitions that drive the visual admin editor (no code knowledge needed by the owner).
export type FieldType = "text" | "textarea" | "number" | "checkbox" | "select" | "l" | "ltextarea" | "llist" | "tags" | "multi" | "weekdays" | "image" | "dates" | "repeater";

export interface FieldDef {
  key: string;
  label: string;
  type: FieldType;
  help?: string;
  options?: { value: string; label: string }[];
  sub?: FieldDef[];
  min?: number; max?: number; step?: number;
  half?: boolean;
}

export type CollectionName = "tours" | "accommodations" | "vehicles" | "posts" | "extras" | "promotions";

export interface CollectionDef {
  name: CollectionName;
  label: string;
  singular: string;
  permission: "tours" | "content";
  titleKey: string; // key (L) or string used in lists
  fields: FieldDef[];
  blank: () => Record<string, unknown>;
  listCols: { key: string; label: string }[];
}

const L = () => ({ en: "", tr: "", ar: "", de: "" });
const LL = () => ({ en: [], tr: [], ar: [], de: [] });
const opts = (a: string[]) => a.map((v) => ({ value: v, label: v }));

export const SCENES = ["sarajevo", "mostar", "kravice", "blagaj", "travnik", "jajce", "una", "mountain", "coast", "night", "road"];
export const DESTS = ["sarajevo", "mostar", "kravice", "blagaj", "travnik", "jajce", "una", "bjelasnica", "balkans"];
export const TOUR_CATS = ["sarajevo", "mostar", "kravice", "travnik", "nature", "family", "private", "vip", "multiday", "balkan", "custom"];
export const SERVICE_KEYS = ["transport", "guide", "fuel", "water", "hotelPickup", "entrance", "lunch", "insurance", "tips", "drinks", "flights", "accommodation", "breakfast", "chauffeur", "cableCar", "boat", "ferry", "photos"];
export const AMENITIES = ["wifi", "parking", "breakfast", "pool", "kitchen", "spa", "family", "view", "fireplace", "transfer", "halal"];
export const BLOG_CATS = ["places", "sarajevo", "mostar", "kids", "halal", "season", "winter", "summer", "tips", "roadtrip"];

const sceneField: FieldDef = { key: "scene", label: "Illustration (shown until a photo is added)", type: "select", options: opts(SCENES), half: true };
const imageField: FieldDef = { key: "imageUrl", label: "Photo (upload or paste URL)", type: "image", help: "Only use photographs you own or have a licence for.", half: true };

export const COLLECTIONS: Record<CollectionName, CollectionDef> = {
  tours: {
    name: "tours", label: "Tours", singular: "tour", permission: "tours", titleKey: "title",
    listCols: [{ key: "destination", label: "Destination" }, { key: "priceGroup", label: "€ / person" }, { key: "pricePrivate", label: "€ private" }],
    blank: () => ({
      slug: "", published: false, featured: false, sample: false, title: L(), summary: L(), description: L(), destination: "sarajevo", categories: ["sarajevo"], scene: "sarajevo",
      days: 1, hours: 6, priceGroup: 0, pricePrivate: 0, privateMaxPax: 4, childDiscountPct: 50, maxGroup: 12, minAge: 0, highlights: LL(), itinerary: [],
      included: ["transport"], excluded: ["tips"], pickup: L(), meeting: L(), lat: 43.8563, lng: 18.4131, accessibility: L(), ages: L(), cancellationKey: "standard",
      weekdays: [], blackout: [], reviews: [], relatedIds: [], gallery: [],
    }),
    fields: [
      { key: "published", label: "Published (visible on the website)", type: "checkbox", half: true },
      { key: "featured", label: "Featured on homepage", type: "checkbox", half: true },
      { key: "sample", label: "Mark as demonstration data (shows a 'Demo' badge)", type: "checkbox" },
      { key: "slug", label: "URL name (letters, numbers, dashes)", type: "text", half: true, help: "Example: sarajevo-city-tour → /en/tours/sarajevo-city-tour" },
      { key: "title", label: "Tour name", type: "l" },
      { key: "summary", label: "Short summary", type: "l" },
      { key: "description", label: "Description", type: "ltextarea" },
      { key: "destination", label: "Destination", type: "select", options: opts(DESTS), half: true },
      { key: "categories", label: "Categories", type: "multi", options: opts(TOUR_CATS) },
      sceneField, imageField,
      { key: "gallery", label: "Gallery photo URLs (one per line)", type: "tags", help: "Optional. First three are used." },
      { key: "days", label: "Days (1 = day trip)", type: "number", min: 1, max: 30, half: true },
      { key: "hours", label: "Hours (day trips)", type: "number", min: 0, max: 24, half: true },
      { key: "priceGroup", label: "Group price per adult (EUR, 0 = no group option)", type: "number", min: 0, step: 1, half: true },
      { key: "pricePrivate", label: "Private tour price per vehicle (EUR, 0 = not offered)", type: "number", min: 0, step: 1, half: true },
      { key: "privateMaxPax", label: "Max people per private vehicle", type: "number", min: 1, max: 50, half: true },
      { key: "childDiscountPct", label: "Child discount % (group tours)", type: "number", min: 0, max: 100, half: true },
      { key: "maxGroup", label: "Max group size", type: "number", min: 1, max: 100, half: true },
      { key: "minAge", label: "Minimum age", type: "number", min: 0, max: 18, half: true },
      { key: "weekdays", label: "Runs on these weekdays (none ticked = every day)", type: "weekdays" },
      { key: "blackout", label: "Unavailable dates (YYYY-MM-DD, one per line)", type: "dates" },
      { key: "highlights", label: "Highlights (one per line)", type: "llist" },
      { key: "itinerary", label: "Itinerary", type: "repeater", sub: [{ key: "time", label: "Time or 'Day 1'", type: "text", half: true }, { key: "title", label: "Stop", type: "l" }] },
      { key: "included", label: "Included", type: "multi", options: opts(SERVICE_KEYS) },
      { key: "excluded", label: "Not included", type: "multi", options: opts(SERVICE_KEYS) },
      { key: "pickup", label: "Pickup & drop-off", type: "l" },
      { key: "meeting", label: "Meeting location", type: "l" },
      { key: "lat", label: "Map latitude", type: "number", step: 0.0001, half: true },
      { key: "lng", label: "Map longitude", type: "number", step: 0.0001, half: true },
      { key: "accessibility", label: "Accessibility information", type: "l" },
      { key: "ages", label: "Suitable ages", type: "l" },
      { key: "cancellationKey", label: "Cancellation policy", type: "select", options: opts(["flexible", "standard", "strict"]), half: true },
      { key: "reviews", label: "Real guest reviews (only add genuine reviews)", type: "repeater", sub: [{ key: "name", label: "Guest name", type: "text", half: true }, { key: "rating", label: "Rating 1-5", type: "number", min: 1, max: 5, half: true }, { key: "date", label: "Date", type: "text", half: true }, { key: "text", label: "Review", type: "ltextarea" }] },
      { key: "relatedIds", label: "Related tour IDs (one per line)", type: "tags" },
    ],
  },
  accommodations: {
    name: "accommodations", label: "Accommodation", singular: "listing", permission: "content", titleKey: "name",
    listCols: [{ key: "location", label: "Location" }, { key: "type", label: "Type" }, { key: "pricePerNight", label: "€ / night" }],
    blank: () => ({ slug: "", published: false, sample: false, name: L(), description: L(), type: "hotel", location: "sarajevo", guests: 2, pricePerNight: 0, amenities: [], scene: "sarajevo" }),
    fields: [
      { key: "published", label: "Published", type: "checkbox", half: true }, { key: "sample", label: "Demonstration data", type: "checkbox", half: true },
      { key: "slug", label: "URL name", type: "text", half: true },
      { key: "name", label: "Name", type: "l" }, { key: "description", label: "Description", type: "l" },
      { key: "type", label: "Type", type: "select", options: opts(["hotel", "apartment", "family", "villa", "cabin"]), half: true },
      { key: "location", label: "Location", type: "select", options: opts(["sarajevo", "mostar", "jahorina", "blagaj", "travnik", "jajce", "bihac"]), half: true },
      { key: "guests", label: "Guests", type: "number", min: 1, max: 50, half: true }, { key: "pricePerNight", label: "Price per night (EUR)", type: "number", min: 0, half: true },
      { key: "amenities", label: "Amenities", type: "multi", options: opts(AMENITIES) }, sceneField, imageField,
    ],
  },
  vehicles: {
    name: "vehicles", label: "Vehicles", singular: "vehicle", permission: "content", titleKey: "name",
    listCols: [{ key: "category", label: "Category" }, { key: "passengers", label: "Passengers" }, { key: "priceFrom", label: "From €" }],
    blank: () => ({ active: true, name: L(), note: L(), category: "sedan", passengers: 3, suitcases: 3, priceFrom: 0, scene: "road" }),
    fields: [
      { key: "active", label: "Shown on website", type: "checkbox" }, { key: "name", label: "Name", type: "l" }, { key: "note", label: "Short note", type: "l" },
      { key: "category", label: "Category", type: "select", options: opts(["sedan", "minivan", "suv", "minibus"]), half: true },
      { key: "passengers", label: "Passenger capacity", type: "number", min: 1, max: 60, half: true }, { key: "suitcases", label: "Luggage capacity", type: "number", min: 0, max: 60, half: true },
      { key: "priceFrom", label: "Price from (EUR, 0 = on request)", type: "number", min: 0, half: true }, sceneField, imageField,
    ],
  },
  posts: {
    name: "posts", label: "Blog articles", singular: "article", permission: "content", titleKey: "title",
    listCols: [{ key: "category", label: "Category" }, { key: "date", label: "Date" }],
    blank: () => ({ slug: "", published: false, category: "tips", scene: "mountain", date: new Date().toISOString().slice(0, 10), readMin: 4, title: L(), excerpt: L(), body: LL(), tourIds: [] }),
    fields: [
      { key: "published", label: "Published", type: "checkbox", half: true }, { key: "slug", label: "URL name", type: "text", half: true },
      { key: "category", label: "Category", type: "select", options: opts(BLOG_CATS), half: true }, { key: "date", label: "Date (YYYY-MM-DD)", type: "text", half: true },
      { key: "readMin", label: "Reading time (min)", type: "number", min: 1, max: 60, half: true },
      { key: "title", label: "Title", type: "l" }, { key: "excerpt", label: "Excerpt", type: "l" },
      { key: "body", label: "Article text (one paragraph per line)", type: "llist" },
      { key: "tourIds", label: "Recommended tour IDs (one per line)", type: "tags" }, sceneField, imageField,
    ],
  },
  extras: {
    name: "extras", label: "Booking add-ons", singular: "add-on", permission: "tours", titleKey: "label",
    listCols: [{ key: "price", label: "Price €" }, { key: "perPerson", label: "Per person" }],
    blank: () => ({ active: true, label: L(), price: 0, perPerson: false }),
    fields: [{ key: "active", label: "Active", type: "checkbox", half: true }, { key: "perPerson", label: "Price is per person (otherwise per booking)", type: "checkbox", half: true }, { key: "label", label: "Name", type: "l" }, { key: "price", label: "Price (EUR)", type: "number", min: 0, half: true }],
  },
  promotions: {
    name: "promotions", label: "Promotions", singular: "promotion", permission: "tours", titleKey: "title",
    listCols: [{ key: "code", label: "Code" }, { key: "percent", label: "% off" }, { key: "validUntil", label: "Valid until" }],
    blank: () => ({ active: true, code: "", percent: 10, validUntil: "", title: L() }),
    fields: [{ key: "active", label: "Active", type: "checkbox" }, { key: "code", label: "Promo code (customers type this)", type: "text", half: true }, { key: "percent", label: "Discount %", type: "number", min: 1, max: 90, half: true }, { key: "validUntil", label: "Valid until (YYYY-MM-DD, empty = no end)", type: "text", half: true }, { key: "title", label: "Description", type: "l" }],
  },
};
