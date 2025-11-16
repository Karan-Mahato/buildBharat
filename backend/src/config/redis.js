import dotenv from "dotenv";

dotenv.config();

const isRedisConfigured = process.env.REDIS_ENABLED === 'true' && (!!process.env.REDIS_HOST || !!process.env.REDIS_URL);

if (isRedisConfigured) {
    // Lazy require to avoid forcing network calls when not needed
    import('redis').then(({ createClient }) => {
        const client = createClient({
            username: 'default',
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : undefined,
            }
        });

        client.on('error', err => console.log('Redis Client Error', err));
        client.connect().catch(err => console.log('Redis connect failed', err));

        // replace the exported default later
        module.exports.default = client; // for ESM interop fallback
    }).catch(err => console.log('Failed to import redis client', err));
}

// In-memory shim
const inMemoryStore = new Map();

const shim = {
    async get(key) {
        const v = inMemoryStore.get(key);
        return v === undefined ? null : JSON.stringify(v);
    },
    async set(key, value, ...args) {
        // support set(key, json, 'EX', ttl)
        try {
            const parsed = typeof value === 'string' ? JSON.parse(value) : value;
            inMemoryStore.set(key, parsed);
        } catch (e) {
            inMemoryStore.set(key, value);
        }
        return 'OK';
    },
    async ping() {
        return 'PONG';
    },
    on() { /* no-op */ },
    async connect() { /* no-op */ },
    async disconnect() { /* no-op */ }
};

export default shim;