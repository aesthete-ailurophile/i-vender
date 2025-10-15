# PolyPioneers - IDEA Vending Machine 🚀

A comprehensive campus innovation platform with AI-powered project generation, alumni mentorship, sustainability incentives, and campus management tools.

## 🌟 Features

### 1. **AI-Powered Project Idea Generator**
- Generate personalized project suggestions based on discipline, budget, and timeline
- Browse trending projects and technologies
- Select and track projects through completion
- Earn milestone-based refunds and rewards

### 2. **Alumni Mentor Network**
- Connect with industry professionals from top companies
- Book 1-on-1 mentorship sessions
- Filter by expertise and availability
- Real-time chat and video call integration

### 3. **Progress Tracker**
- Track project milestones with visual progress bars
- Earn refunds as you complete each milestone
- Accumulate loyalty points for achievements
- Document uploads and professor review system

### 4. **Campus Management**
- Report campus issues with geo-tagging
- Mark attendance with RFID/Face Recognition simulation
- Emergency alert system with instant notifications
- Track issue resolution status

### 5. **Sustainability Hub**
- Recycle plastic bottles and earn points
- Real-time leaderboard with campus rankings
- Redeem rewards (vouchers, credits, parking passes)
- Track CO₂ savings and environmental impact
- Gamified eco-challenges

### 6. **Admin Dashboard**
- Real-time analytics and insights
- Project trends and category distribution
- Mentorship session tracking
- Sustainability metrics and impact reports

## 🔧 Technology Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for styling
- **Shadcn/UI** component library
- **Recharts** for data visualization
- **Lucide React** for icons

### Backend
- **Supabase** for authentication and database
- **Hono** web framework (Edge Functions)
- **Key-Value Store** for flexible data storage
- **RESTful API** architecture

## 🚀 Getting Started

### 1. Sign Up / Login
Create an account or login with:
- Email: demo@polypioneers.edu
- Password: demo123

### 2. Explore Features
Navigate through the six main tabs:
- 💡 **Ideas** - Generate and select project ideas
- 👥 **Mentors** - Connect with alumni mentors
- 📈 **Progress** - Track your project milestones
- 📍 **Campus** - Report issues and mark attendance
- ♻️ **Eco** - Recycle bottles and earn rewards
- 📊 **Admin** - View analytics (admin role)

### 3. Complete Your First Action
- **Recycle a bottle** to earn 5 points
- **Select a project** from the Ideas tab
- **Book a mentor session** for guidance
- **Report a campus issue** to help improve your campus

## 🎯 Workflow Example

1. **Select a Project**
   - Go to Ideas tab
   - Fill in your discipline, budget, and timeline
   - Click "Generate Project Ideas"
   - Select a project that interests you

2. **Get Mentorship**
   - Visit Mentors tab
   - Browse alumni by expertise
   - Book a session with a mentor

3. **Track Progress**
   - Go to Progress tab
   - Complete milestones one by one
   - Earn refunds (up to 90% of fee) and points for each completion

4. **Earn & Redeem**
   - Insert bottles into vending machine drawer in Sustainability Hub
   - Accumulate loyalty points
   - Redeem rewards (vouchers, credits, etc.)

## 📊 Loyalty Points System

### Earning Points
- **Recycle 1 bottle**: 5 points
- **Complete milestone**: 100-300 points
- **Report campus issue**: 10 points
- **Helpful suggestion**: 20 points

### Redeeming Rewards
- **100 pts** - Free Printing Credits (50 pages)
- **150 pts** - Library Late Fee Waiver (₹800)
- **200 pts** - Campus Cafeteria Voucher (₹400)
- **300 pts** - Parking Pass (1 week, ₹1,500)
- **500 pts** - Bookstore Discount (15% off)
- **1000 pts** - Cash Redemption (₹2,000)

## 🔐 Security Features

- Secure authentication with Supabase Auth
- Access token-based API authorization
- Protected routes for sensitive operations
- Server-side validation for points and refunds
- Emergency alerts logged and monitored

## 📱 API Endpoints

All endpoints use base URL: `https://[project-id].supabase.co/functions/v1/make-server-36b2d027`

### Authentication
- `POST /auth/signup` - Register new user

### Projects
- `POST /projects` - Create project
- `GET /projects` - Get user projects
- `POST /projects/:id/milestones` - Update milestone

### Mentorship
- `GET /mentors` - List all mentors
- `POST /mentors/:id/book` - Book session

### Campus Services
- `POST /campus/issues` - Report issue
- `GET /campus/issues` - Get issues
- `POST /campus/attendance` - Mark attendance
- `POST /campus/emergency` - Send alert

### Sustainability
- `POST /sustainability/recycle` - Record recycling
- `POST /sustainability/redeem` - Redeem reward
- `GET /sustainability/leaderboard` - Get rankings

### Admin
- `GET /admin/stats` - Platform statistics
- `GET /profile` - User profile

## 🎨 Customization

### Add New Mentors
Call the seed endpoint:
```bash
POST /seed/mentors
```

### Modify Rewards
Edit the rewards array in `/components/SustainabilityHub.tsx`

### Change Point Values
Update point calculations in `/supabase/functions/server/index.tsx`

## 🌍 Environmental Impact

The platform tracks environmental impact:
- **1 bottle recycled** = ~0.27 kg CO₂ saved
- Real-time leaderboard encourages friendly competition
- Gamification increases recycling participation

## 📈 Future Enhancements

### Phase 2
- [ ] Real-time notifications
- [ ] File upload for milestones
- [ ] Social login (Google, GitHub)
- [ ] Mobile app (React Native)

### Phase 3
- [ ] Blockchain reward tracking
- [ ] AR vending machine finder
- [ ] Multi-campus support
- [ ] Corporate sponsorships

### Phase 4
- [ ] AI project feasibility analysis
- [ ] Virtual reality prototyping
- [ ] IoT integration for smart campus
- [ ] Predictive analytics for trends

## 🤝 Contributing

This is a prototype built for campus innovation. To deploy at your university:

1. Clone and customize branding
2. Connect your Supabase project
3. Configure email templates
4. Add your alumni mentors
5. Customize reward catalog
6. Launch and iterate!

## 📄 License

Educational prototype for PolyPioneers initiative.

## 💬 Support

For questions or issues:
- Check the SETUP.md guide
- Review browser console for errors
- Check Supabase logs for backend issues
- Test with demo account first

---

**Built with ❤️ for campus innovation and sustainability**

Start your innovation journey today! 🚀
