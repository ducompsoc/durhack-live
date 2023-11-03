module.exports = {
  apps: [
    {
      name: "live-client",
      script: "npm start",
      cwd: "./client",
      env: {
        NODE_ENV: "production"
      }
    },
    {
      name: "live-api",
      script: "./dist/main.js",
      cwd: "./server",
      node_args: ["--experimental-specifier-resolution=node"],
      env: {
        NODE_ENV: "production"
      },
      instances: 2
    }
  ]
}
