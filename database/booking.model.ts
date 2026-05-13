import { Schema, Types, model, models, type HydratedDocument, type Model } from "mongoose";

import Event from "./event.model";

export interface IBooking {
  eventId: Types.ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

type BookingDocument = HydratedDocument<IBooking>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isValidEmail = (value: string) => emailPattern.test(value.trim().toLowerCase());

const BookingSchema = new Schema<IBooking>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: isValidEmail,
        message: "Booking email must be valid.",
      },
    },
  },
  {
    timestamps: true,
  },
);

BookingSchema.index({ eventId: 1 });

BookingSchema.pre("save", async function (this: BookingDocument) {
  if (!isValidEmail(this.email)) {
    throw new Error("Booking email must be valid.");
  }

  // Ensure bookings cannot point to deleted or missing events.
  const eventExists = await Event.exists({ _id: this.eventId });

  if (!eventExists) {
    throw new Error("Booking eventId must reference an existing event.");
  }
});

const Booking =
  (models.Booking as Model<IBooking> | undefined) ?? model<IBooking>("Booking", BookingSchema);

export default Booking;
