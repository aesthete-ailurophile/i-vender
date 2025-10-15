# PolyPioneers - System Architecture

## Overview

PolyPioneers is a full-stack web application built with React frontend and Supabase backend, designed to support campus innovation through project management, mentorship, and sustainability initiatives.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐  │
│  │  Ideas   │ Mentors  │ Progress │  Campus  │   Eco    │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘  │
│                            │                                 │
│                    API Layer (utils/api.ts)                  │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTPS/REST
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                 Supabase Edge Functions                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Hono Web Server (index.tsx)                │  │
│  │  ┌──────┬──────┬──────┬──────┬──────┬──────────┐   │  │
│  │  │ Auth │ Proj │ Mntr │ Camp │ Sust │  Admin   │   │  │
│  │  └──────┴──────┴──────┴──────┴──────┴──────────┘   │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│              ┌─────────────┴─────────────┐                  │
│              ▼                           ▼                  │
│  ┌───────────────────┐       ┌───────────────────┐         │
│  │  Supabase Auth    │       │   KV Store (DB)   │         │
│  │  - Session Mgmt   │       │   - User Profiles │         │
│  │  - User Creation  │       │   - Projects      │         │
│  │  - Access Tokens  │       │   - Transactions  │         │
│  └───────────────────┘       └───────────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **Shadcn/UI** - Component library
- **Recharts** - Data visualization
- **Lucide Icons** - Icon system
- **Supabase Client** - Auth integration

### Backend
- **Supabase** - Backend-as-a-Service
- **Hono** - Lightweight web framework
- **Deno Runtime** - Edge function execution
- **KV Store** - NoSQL key-value database

### Infrastructure
- **Edge Functions** - Serverless compute
- **Row Level Security** - Data protection
- **Real-time subscriptions** - Live updates (future)

## Data Models

### User Profile
```typescript
{
  id: string;              // UUID from Supabase Auth
  email: string;           // User email
  name: string;            // Display name
  role: string;            // student | mentor | professor | admin
  loyaltyPoints: number;   // Accumulated points
  bottlesRecycled: number; // Sustainability metric
  createdAt: string;       // ISO timestamp
}
```

### Project
```typescript
{
  id: string;              // UUID
  userId: string;          // Owner ID
  title: string;           // Project name
  category: string;        // Project type
  difficulty: string;      // Beginner | Intermediate | Advanced
  budget: string;          // Cost estimate
  duration: string;        // Timeline
  description: string;     // Full description
  technologies: string[];  // Tech stack
  status: string;          // active | completed | archived
  progress: number;        // 0-100
  refundEarned: number;    // Milestone refunds
  pointsEarned: number;    // Milestone points
  totalFee: number;        // Initial fee paid
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}
```

### Mentor
```typescript
{
  id: string;              // UUID
  name: string;            // Full name
  role: string;            // Job title
  company: string;         // Employer
  expertise: string[];     // Skills
  rating: number;          // 0-5 stars
  sessions: number;        // Total sessions
  available: boolean;      // Current availability
  bio: string;             // Description
}
```

### Transaction (Sustainability)
```typescript
{
  id: string;              // UUID
  userId: string;          // User ID
  type: string;            // recycle | redeem
  bottles?: number;        // Bottles recycled
  points: number;          // Points earned/spent
  qrCode?: string;         // QR code scanned
  createdAt: string;       // ISO timestamp
}
```

### Campus Issue
```typescript
{
  id: string;              // UUID
  userId: string;          // Reporter ID
  title: string;           // Issue title
  description: string;     // Full description
  location: string;        // Campus location
  type: string;            // Cleanliness | Maintenance | Safety
  priority: string;        // low | medium | high
  status: string;          // pending | in-progress | resolved
  createdAt: string;       // ISO timestamp
}
```

## API Endpoints

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/signup` | Public | Create user account |
| N/A | (Supabase) | Public | Sign in with password |
| N/A | (Supabase) | Public | Sign out |
| N/A | (Supabase) | Public | Get session |

### Projects
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/projects` | Required | Create new project |
| GET | `/projects` | Required | Get user projects |
| POST | `/projects/:id/milestones` | Required | Update milestone |

### Mentorship
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/mentors` | Public | List all mentors |
| POST | `/mentors/:id/book` | Required | Book session |

### Campus Services
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/campus/issues` | Required | Report issue |
| GET | `/campus/issues` | Public | Get all issues |
| POST | `/campus/attendance` | Required | Mark attendance |
| POST | `/campus/emergency` | Required | Send alert |

### Sustainability
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/sustainability/recycle` | Required | Record bottles |
| POST | `/sustainability/redeem` | Required | Redeem reward |
| GET | `/sustainability/leaderboard` | Public | Get rankings |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/stats` | Required | Platform metrics |
| GET | `/profile` | Required | User profile |

### Utilities
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/seed/mentors` | Public | Seed demo data |

## Security

### Authentication Flow
1. User signs up via `/auth/signup` endpoint
2. Backend creates user with Supabase Admin API
3. User logs in via Supabase Client
4. Client receives access token
5. Token passed in Authorization header for protected routes

### Authorization
- Access tokens verified on every protected endpoint
- User ID extracted from token
- Ownership validated for user-specific resources
- Admin endpoints check role metadata

### Data Protection
- Passwords hashed by Supabase Auth
- Tokens expire after configurable time
- CORS enabled for frontend domain only
- Environment variables for secrets
- Service role key never exposed to frontend

## State Management

### Frontend State
- **Local State** - Component-level (useState)
- **Auth State** - App-level (user, token, profile)
- **API State** - Request/response handling
- **LocalStorage** - Initialization flag

### Backend State
- **Stateless** - No server-side sessions
- **Token-based** - JWT validation per request
- **KV Store** - Persistent data storage

## Performance Optimizations

### Frontend
- Component lazy loading (future)
- Memoization for expensive calculations
- Debounced search inputs
- Optimistic UI updates

### Backend
- Edge function deployment (low latency)
- Efficient KV store queries
- Prefix-based key lookups
- Minimal data transfer

## Scalability Considerations

### Current Limits
- Single campus/institution
- KV store for all data
- No file storage
- No real-time updates

### Future Scaling
1. **Multi-tenancy** - Support multiple campuses
2. **PostgreSQL** - Migrate to relational DB
3. **File Storage** - Supabase Storage integration
4. **CDN** - Static asset delivery
5. **Caching** - Redis for hot data
6. **Queues** - Background job processing
7. **Search** - Full-text search engine
8. **Analytics** - Dedicated analytics DB

## Deployment

### Frontend
- Deployed via Figma Make hosting
- Automatic HTTPS
- Global CDN distribution

### Backend
- Supabase Edge Functions
- Automatic scaling
- Global edge network
- 99.9% uptime SLA

## Monitoring & Logging

### Current Implementation
- Console logging in server
- Client-side error logging
- Supabase Dashboard metrics

### Recommended Additions
- Application Performance Monitoring (APM)
- Error tracking (Sentry)
- User analytics (Mixpanel)
- Uptime monitoring (Pingdom)
- Log aggregation (Logtail)

## Backup & Recovery

### Data Backup
- Supabase automatic daily backups
- Point-in-time recovery (paid plans)
- Export functionality for migrations

### Disaster Recovery
- Multi-region deployment (future)
- Database replication
- Automated failover

## Development Workflow

### Local Development
1. Clone repository
2. Configure Supabase credentials
3. Run development server
4. Test with demo account

### Deployment
1. Push to main branch
2. Automatic deployment via Figma Make
3. Edge functions auto-deploy
4. Test production build

## Testing Strategy

### Current Testing
- Manual testing via UI
- Demo account for scenarios
- Console logging for debugging

### Recommended Testing
- Unit tests (Vitest)
- Integration tests (Playwright)
- E2E tests (Cypress)
- Load testing (k6)
- Security testing (OWASP ZAP)

## Cost Estimation

### Supabase Free Tier
- 500MB database
- 2GB file storage
- 50MB Edge Functions
- 50,000 monthly active users
- 2 million edge function invocations

### Scaling Costs
- Pro: $25/month
- Team: $599/month
- Enterprise: Custom pricing

## Future Architecture Considerations

### Microservices Migration
```
Frontend → API Gateway → Services
                        ├─ Auth Service
                        ├─ Project Service
                        ├─ Mentor Service
                        ├─ Campus Service
                        └─ Sustainability Service
```

### Event-Driven Architecture
- Message queue (RabbitMQ/AWS SQS)
- Event bus for real-time updates
- Async processing for heavy operations

### Mobile App Integration
- Shared backend API
- React Native frontend
- Push notifications
- Offline-first architecture

---

This architecture provides a solid foundation for the PolyPioneers platform with clear paths for future enhancement and scaling.
