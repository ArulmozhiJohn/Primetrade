#  Scalability Strategy

## Current Architecture
Single Node.js server with PostgreSQL — suitable for development and early-stage production.

---

## Horizontal Scaling

### Load Balancing
- Deploy multiple instances of the API behind an **NGINX** or **AWS ALB** load balancer
- Use **PM2 cluster mode** to utilize all CPU cores on a single machine:
```bash
pm2 start server.js -i max
```

### Stateless JWT Design
- JWTs are stateless — no session stored on server
- Any instance can verify any token without shared session storage
- Ready for multi-instance deployment out of the box

---

## Database Scaling

### Connection Pooling
- Prisma uses built-in connection pooling
- For high load, add **PgBouncer** between app and PostgreSQL

### Read Replicas
- Route read queries (GET) to read replicas
- Route write queries (POST/PUT/DELETE) to primary DB

### Migration to distributed DB
- Schema is ready for migration to **CockroachDB** or **Amazon Aurora**

---

## Caching Strategy (Redis)

Client → API → Redis Cache → PostgreSQL
↓ (cache miss)
PostgreSQL → Cache → Client

---

- Cache frequently read data (task lists, user profiles)
- Invalidate cache on writes
- Use **ioredis** with TTL of 5 minutes for task lists

```js
// Example Redis caching layer
const cached = await redis.get(`tasks:user:${userId}`);
if (cached) return JSON.parse(cached);
const tasks = await prisma.task.findMany(...);
await redis.setex(`tasks:user:${userId}`, 300, JSON.stringify(tasks));
```

---

## Microservices Path

When the app grows, split into:

| Service         | Responsibility                    |
|-----------------|-----------------------------------|
| Auth Service    | Registration, login, JWT          |
| Task Service    | CRUD operations for tasks         |
| User Service    | Profile management                |
| Gateway         | Route requests, rate limiting     |

Communicate via **REST** or **message queues** (RabbitMQ / Kafka)

---

## Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/primetrade_db
    depends_on:
      - db
  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: primetrade_db
```

---

## Monitoring & Logging

- **Winston** for structured logging
- **Morgan** for HTTP request logging
- **Prometheus + Grafana** for metrics
- **Sentry** for error tracking