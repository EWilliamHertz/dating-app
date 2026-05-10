# ConnectMatch - International Dating Platform

A modern, SEO-friendly dating application built with Next.js, featuring location-based matching with kilometer radius search and country selection. Real-time timezone support for seamless global connections.

## Features

- 🌍 **Global Reach** - Connect with singles worldwide
- 📍 **Location-Based Search** - Find matches within a specific radius or anywhere
- 🌐 **Country Selection** - Filter by specific countries
- 🕐 **Timezone Support** - Know when matches are online
- 💬 **Real-Time Messaging** - Chat with matches
- ❤️ **Smart Matching** - Algorithm-based profile recommendations
- 📱 **Responsive Design** - Mobile-first interface
- 🔒 **Secure** - Password hashing, input validation, CSRF protection

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth with JWT
- **Hosting**: Vercel
- **UI Components**: Lucide Icons, Custom Components

## Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ewilliamhertz/dating-app.git
cd dating-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Then edit `.env.local` with your configuration:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
- `NEXTAUTH_URL`: Your app URL (http://localhost:3000 for dev)

4. Set up the database:
```bash
npm run prisma:push
```

5. Start development server:
```bash
npm run dev
```

Visit `http://localhost:3000`

## Project Structure

```
dating-app/
├── app/
│   ├── api/              # API routes
│   │   ├── auth/        # Authentication endpoints
│   │   └── matches/     # Matching and interaction endpoints
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/          # Reusable components
├── lib/                 # Utilities and helpers
├── prisma/
│   └── schema.prisma    # Database schema
├── public/              # Static assets
└── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Matching
- `GET /api/matches/browse` - Browse profiles with filters
- `POST /api/matches/like` - Like a profile
- `DELETE /api/matches/like` - Unlike a profile

### Messages
- `GET /api/messages` - Get conversations
- `POST /api/messages` - Send message

## Environment Variables

Create a `.env.local` file with:

```
DATABASE_URL=postgresql://user:password@localhost:5432/dating_db
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

## Database Schema

### User Model
- Stores user profiles with location, preferences, and profile data
- Includes timezone for local time display

### Like Model
- Tracks mutual likes and matches
- Composite unique index on (senderId, receiverId)

### Message Model
- Stores conversations between users
- Read status tracking

### Block Model
- User blocking functionality
- Prevents unwanted messages

## Deployment to Vercel

1. Push code to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Connect to Vercel:
- Go to https://vercel.com/new
- Import this GitHub repository
- Add environment variables in Vercel dashboard
- Deploy

3. Set up database:
- Use Neon.tech or Supabase for PostgreSQL
- Update `DATABASE_URL` in Vercel environment variables

## SEO Optimization

- ✅ Server-side rendering with Next.js
- ✅ Meta tags and OpenGraph
- ✅ Structured data ready
- ✅ Optimized images
- ✅ Sitemap generation support
- ✅ Mobile-friendly design
- ✅ Fast page loads

## Security Considerations

- Password hashing with bcryptjs
- SQL injection prevention with Prisma
- CSRF protection with NextAuth
- Input validation with Zod
- Secure headers configured
- Environment variables for sensitive data

## Performance

- Next.js automatic code splitting
- Image optimization
- Database query optimization with Prisma
- Caching strategies implemented
- Production-ready configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

## Roadmap

- [ ] Video calls integration
- [ ] Advanced matching algorithm
- [ ] Subscription tiers
- [ ] Mobile app (React Native)
- [ ] AI-powered recommendations
- [ ] Photo verification
- [ ] Advanced safety features

---

Made with ❤️ for global connections. Happy matching!
