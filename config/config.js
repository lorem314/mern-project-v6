const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3006,
  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGO_HOST ||
    "mongodb://" +
      (process.env.IP || "127.0.0.1") +
      ":" +
      (process.env.MONGO_PORT || 27017) +
      "/mern-project-v6",

  jwtSecret: "for-test-only-not-a-valid-secret-key",
}

export default config
