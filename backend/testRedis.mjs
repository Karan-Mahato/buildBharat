// testRedis.mjs
// This file used to test a live Redis connection.
// The project has been migrated to an optional Redis setup and a local
// in-memory shim. The `redis` package is no longer a dependency by default,
// so this test is left as a reference only. If you want to re-enable it:
// 1) Re-add `redis` to package.json and run `npm install`.
// 2) Reconfigure REDIS_* env vars in `.env`.

console.log('testRedis.mjs: Redis test is disabled in this workspace.');
