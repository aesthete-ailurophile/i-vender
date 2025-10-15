# PolyPioneers - Setup Guide

## Backend Integration with Supabase

Your application is now connected to Supabase with full backend functionality!

## Features Implemented

### 🔐 Authentication
- User signup with role selection (Student, Mentor, Professor, Admin)
- Login with email and password
- Session management
- Auto-confirm email (no email server required)

### 📊 Data Storage
- User profiles with loyalty points and recycling stats
- Projects with milestone tracking
- Mentorship bookings
- Campus issue reporting
- Attendance tracking
- Emergency alerts
- Sustainability transactions and leaderboard

### 🚀 API Endpoints

All endpoints are prefixed with `/make-server-36b2d027/`

#### Auth
- `POST /auth/signup` - Create new user

#### Projects
- `POST /projects` - Create project
- `GET /projects` - Get user's projects
- `POST /projects/:id/milestones` - Update milestone

#### Mentors
- `GET /mentors` - Get all mentors
- `POST /mentors/:id/book` - Book session

#### Campus
- `POST /campus/issues` - Report issue
- `GET /campus/issues` - Get all issues
- `POST /campus/attendance` - Mark attendance
- `POST /campus/emergency` - Send alert

#### Sustainability
- `POST /sustainability/recycle` - Record recycling
- `POST /sustainability/redeem` - Redeem reward
- `GET /sustainability/leaderboard` - Get leaderboard

#### Admin
- `GET /admin/stats` - Get platform statistics

#### Profile
- `GET /profile` - Get user profile

## Quick Start

### 1. Seed Demo Data (Optional)

To populate the platform with sample mentors, make a POST request to:
```
POST https://[your-project-id].supabase.co/functions/v1/make-server-36b2d027/seed/mentors
```

### 2. Create Demo Account

Use the signup form to create an account:
- Email: demo@polypioneers.edu
- Password: demo123
- Name: Demo User
- Role: Student

### 3. Test Features

1. **Generate Ideas** - Go to Ideas tab and generate project suggestions (budgets in ₹)
2. **Select Project** - Choose a project to track (₹5,000 initial fee)
3. **Track Progress** - Mark milestones as complete (earn up to 90% refund)
4. **Recycle Bottles** - Insert bottles through machine drawer in Sustainability Hub
5. **Report Issues** - Submit campus issues
6. **Check In** - Mark attendance

## Data Structure

All data is stored in the Supabase KV store with the following prefixes:

- `user:{userId}` - User profiles
- `project:{projectId}` - Projects
- `mentor:{mentorId}` - Mentors
- `session:{sessionId}` - Mentorship sessions
- `issue:{issueId}` - Campus issues
- `attendance:{userId}:{date}` - Attendance records
- `emergency:{alertId}` - Emergency alerts
- `transaction:{transactionId}` - Recycling transactions
- `redemption:{redemptionId}` - Reward redemptions

## Security Notes

- Access tokens are required for most endpoints
- Email confirmation is automatic (production should use real email)
- Emergency alerts are logged server-side
- Points and refunds are calculated server-side to prevent tampering
- Maximum refund is capped at 90% of project fee to ensure platform sustainability

## Next Steps

Consider these enhancements:

1. **Real Email** - Configure Supabase Auth email templates
2. **Social Login** - Add Google/GitHub OAuth
3. **File Uploads** - Add document uploads for milestones
4. **Real-time Updates** - Implement Supabase Realtime subscriptions
5. **Push Notifications** - Add FCM for emergency alerts
6. **Analytics Dashboard** - Enhanced admin analytics
7. **Multi-campus** - Support for multiple universities
8. **Blockchain Integration** - For transparent reward tracking

## Support

For issues or questions, check:
- Supabase Dashboard for logs
- Browser console for client-side errors
- Server logs in Supabase Functions
