import { Schema, model, models, type HydratedDocument, type Model } from "mongoose";

const REQUIRED_STRING_FIELDS = [
  "title",
  "description",
  "overview",
  "image",
  "venue",
  "location",
  "date",
  "time",
  "mode",
  "audience",
  "organizer",
] as const;

export interface IEvent {
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

type EventDocument = HydratedDocument<IEvent>;

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const normalizeDate = (value: string) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error("Event date must be a valid date.");
  }

  return parsedDate.toISOString().split("T")[0];
};

const normalizeTime = (value: string) => {
  const trimmedTime = value.trim();
  const twentyFourHourMatch = /^([01]?\d|2[0-3]):([0-5]\d)$/.exec(trimmedTime);

  if (twentyFourHourMatch) {
    const [, hours, minutes] = twentyFourHourMatch;
    return `${hours.padStart(2, "0")}:${minutes}`;
  }

  const twelveHourMatch = /^(1[0-2]|0?[1-9])(?::([0-5]\d))?\s*(AM|PM)$/i.exec(trimmedTime);

  if (!twelveHourMatch) {
    throw new Error("Event time must be a valid time.");
  }

  const [, rawHours, rawMinutes = "00", meridiem] = twelveHourMatch;
  const baseHours = Number(rawHours) % 12;
  const normalizedHours = meridiem.toUpperCase() === "PM" ? baseHours + 12 : baseHours;

  return `${String(normalizedHours).padStart(2, "0")}:${rawMinutes}`;
};

const nonEmptyString = {
  validator: (value: string) => value.trim().length > 0,
  message: "Field cannot be empty.",
};

const nonEmptyStringArray = {
  validator: (value: string[]) =>
    value.length > 0 && value.every((entry) => entry.trim().length > 0),
  message: "Field must include at least one non-empty value.",
};

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true, validate: nonEmptyString },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true, trim: true, validate: nonEmptyString },
    overview: { type: String, required: true, trim: true, validate: nonEmptyString },
    image: { type: String, required: true, trim: true, validate: nonEmptyString },
    venue: { type: String, required: true, trim: true, validate: nonEmptyString },
    location: { type: String, required: true, trim: true, validate: nonEmptyString },
    date: { type: String, required: true, trim: true, validate: nonEmptyString },
    time: { type: String, required: true, trim: true, validate: nonEmptyString },
    mode: { type: String, required: true, trim: true, validate: nonEmptyString },
    audience: { type: String, required: true, trim: true, validate: nonEmptyString },
    agenda: { type: [String], required: true, validate: nonEmptyStringArray },
    organizer: { type: String, required: true, trim: true, validate: nonEmptyString },
    tags: { type: [String], required: true, validate: nonEmptyStringArray },
  },
  {
    timestamps: true,
  },
);

EventSchema.index({ slug: 1 }, { unique: true });

EventSchema.pre("save", function (this: EventDocument) {
  for (const field of REQUIRED_STRING_FIELDS) {
    if (!this[field]?.trim()) {
      throw new Error(`Event ${field} is required.`);
    }
  }

  if (!this.agenda.length || this.agenda.some((item) => !item.trim())) {
    throw new Error("Event agenda must include non-empty items.");
  }

  if (!this.tags.length || this.tags.some((tag) => !tag.trim())) {
    throw new Error("Event tags must include non-empty items.");
  }

  // Regenerate slugs only when the title changes to keep URLs stable.
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title);
  }

  // Store dates and times in consistent formats for filtering and display.
  this.date = normalizeDate(this.date);
  this.time = normalizeTime(this.time);
});

const Event = (models.Event as Model<IEvent> | undefined) ?? model<IEvent>("Event", EventSchema);

export default Event;
