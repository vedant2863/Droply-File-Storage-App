/**
 * Application Environment Configuration
 * Centralized, type-safe, deeply frozen object containing all environment variables.
 */

// Recursive deep freeze to guarantee complete immutability at runtime
function deepFreeze<T extends object>(obj: T): Readonly<T> {
  Object.keys(obj).forEach((prop) => {
    const value = (obj as Record<string, unknown>)[prop];
    if (
      value !== null &&
      typeof value === "object" &&
      !Object.isFrozen(value)
    ) {
      deepFreeze(value as object);
    }
  });
  return Object.freeze(obj);
}

const rawEnv = {
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5433/droply",
  JWT_ACCESS_SECRET:
    process.env.JWT_ACCESS_SECRET ||
    "droply_jwt_access_super_secret_development_key_32chars!",
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET ||
    "droply_jwt_refresh_super_secret_development_key_32chars!",
  NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY:
    process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY ||
    "public_bthjFz8GV4yw490x2a2jem5v7xs=",
  IMAGEKIT_PRIVATE_KEY:
    process.env.IMAGEKIT_PRIVATE_KEY || "private_F5W4p6yC7Cl4usHx6GvMNpp7zHY=",
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT:
    process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT ||
    "https://ik.imagekit.io/zde5yttmx/droply/",
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
};

const config = {
  /**
   * Raw key-value map of environment variables
   */
  raw: rawEnv,

  /**
   * Database settings
   */
  database: {
    url: rawEnv.DATABASE_URL,
  },

  /**
   * Authentication secrets & JWT expiry
   */
  jwt: {
    accessSecret: rawEnv.JWT_ACCESS_SECRET,
    refreshSecret: rawEnv.JWT_REFRESH_SECRET,
    accessExpiry: "15m",
    refreshExpiryDays: 7,
  },

  /**
   * ImageKit CDN & Cloud storage configuration
   */
  imagekit: {
    publicKey: rawEnv.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: rawEnv.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: rawEnv.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
  },

  /**
   * Application runtime context
   */
  app: {
    url: rawEnv.NEXT_PUBLIC_APP_URL,
    env: rawEnv.NODE_ENV,
    isProduction: rawEnv.NODE_ENV === "production",
    isDevelopment: rawEnv.NODE_ENV === "development",
  },
};

/**
 * Deeply frozen environment configuration object
 */
export const ENV = deepFreeze(config);

export type EnvConfig = typeof ENV;

export default ENV;
