module.exports = {
  apps: [
    {
      name: "auth",
      script: "./bin/www",
      watch: true,
      ignore_watch: ["node_modules", "public", "logs"],
      env_development: {
        PORT: 5001,
        NODE_ENV: "development",
        DOMAIN_URL: "http://127.0.0.1:5001",
        DB_MONGO_URL: "mongodb://localhost:27017/auth",
        JWT_SECRET: "jsonwebtoken",
        SMTP_PORT: 587,
        SMTP_HOST: "smtp.gmail.com",
        SMTP_SECURE_CONNECTION: "",
        SMTP_AUTH_USER: "",
        SMTP_AUTH_PASSWORD: "",
        SMTP_SOURCE_EMAIL: "",
      },
    },
  ],
};

