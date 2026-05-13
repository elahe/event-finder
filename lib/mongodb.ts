import mongoose, { type Mongoose } from "mongoose";

type MongooseCache = {
  connection: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

const databaseUri: string = MONGODB_URI;

const cached: MongooseCache = globalThis.mongooseCache ?? {
  connection: null,
  promise: null,
};

globalThis.mongooseCache = cached;

export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.connection) {
    return cached.connection;
  }

  if (!cached.promise) {
    // Cache the pending promise so hot reloads do not open duplicate connections.
    cached.promise = mongoose.connect(databaseUri, {
      bufferCommands: false,
    });
  }

  cached.connection = await cached.promise;

  return cached.connection;
}
