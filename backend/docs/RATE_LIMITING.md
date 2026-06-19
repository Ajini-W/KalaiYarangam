# Authentication Rate Limiting

## Overview
Rate limiting has been implemented to protect authentication endpoints from brute force attacks and abuse.

## Rate Limits

### Login Endpoint
- **Limit**: 5 attempts per hour
- **Tracking**: By IP address + email combination
- **Lockout**: 1 hour after exceeding limit
- **Message**: "Too many attempts. Please try again after 1 hour."

### Registration Endpoint
- **Limit**: 3 attempts per hour
- **Tracking**: By IP address + email combination
- **Lockout**: 1 hour after exceeding limit

### Refresh Token Endpoint
- **Limit**: 10 attempts per hour
- **Tracking**: By IP address + email combination
- **Lockout**: 1 hour after exceeding limit

### Logout Endpoint
- **No rate limit** (requires valid authentication)

## Technical Implementation

### Database Schema
`UserLoginLog` table now includes:
- `accessToken` (Text) - Stores the issued JWT access token
- `refreshToken` (Text) - Stores the issued refresh token
- `ipAddress` (indexed) - For rate limit tracking
- `success` (Boolean) - Tracks failed vs successful attempts

### Components

#### AuthThrottlerGuard
Custom guard that:
- Tracks attempts by IP + email combination
- Returns user-friendly error message
- Prevents timing attacks by using combined key

#### ThrottlerModule Configuration
```typescript
ThrottlerModule.forRoot([{
  ttl: 3600000, // 1 hour in milliseconds
  limit: 5,     // Default limit
}])
```

### Error Response
When rate limit is exceeded:
```json
{
  "statusCode": 429,
  "message": "Too many attempts. Please try again after 1 hour."
}
```

## Security Features

1. **Failed Login Tracking**: All failed attempts are logged with IP and timestamp
2. **Token Audit Trail**: Every successful login stores both access and refresh tokens
3. **IP-based Tracking**: Prevents distributed attacks from single email
4. **Graceful Degradation**: Rate limits don't affect existing valid sessions

## Testing

### Test Rate Limiting
```bash
# Make 6 login attempts with same IP + email
for i in {1..6}; do
  curl -X POST http://localhost:4000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrongpass"}'
done
```

After 5 attempts, you'll receive the 1-hour lockout message.

## Database Migration

Run the migration to add token fields:
```bash
pnpm db:push
# or
pnpm db:migrate
```

## Environment Variables
No new environment variables required. Uses existing JWT configuration.
