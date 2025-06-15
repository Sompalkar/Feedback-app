# 🚀 Feedback Hub

A modern, beautiful feedback collection platform built with Next.js, Supabase, and shadcn/ui. Create feedback boards, collect anonymous insights, and make data-driven decisions.

![Feedback Hub](https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&h=400&fit=crop&crop=center)

## ✨ Features

### 🎯 Core Features
- **🔐 User Authentication** - Secure email/password authentication with Supabase
- **📋 Board Creation** - Create beautiful feedback boards with custom categories
- **💬 Anonymous Feedback** - Public pages for anonymous feedback submission
- **📊 Private Dashboard** - View and manage all feedback privately
- **🏷️ Feedback Categories** - Organize feedback with custom categories and colors
- **🔍 Advanced Filtering** - Search and filter feedback by category, date, and content

### 🎨 Design Features
- **🌈 Vibrant Colors** - Beautiful gradient designs throughout the app
- **✨ Smooth Animations** - Framer Motion animations for engaging interactions
- **📱 Responsive Design** - Works perfectly on all devices
- **🎭 Glass Morphism** - Modern UI with backdrop blur effects
- **🔄 Loading States** - Elegant loading animations and states

### 🛡️ Security & Quality
- **🔒 Row-Level Security** - Supabase RLS policies for data protection
- **🚫 Spam Prevention** - Basic validation and spam detection
- **⚡ Performance** - Optimized with Next.js App Router
- **♿ Accessibility** - Built with accessibility best practices

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **UI Components**: shadcn/ui, Radix UI
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Supabase account

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/yourusername/feedback-hub.git
cd feedback-hub
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
# or
pnpm install
\`\`\`

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your project URL and anon key
3. Copy \`.env.example\` to \`.env.local\`:

\`\`\`bash
cp .env.example .env.local
\`\`\`

4. Update \`.env.local\` with your Supabase credentials:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
\`\`\`

### 4. Set Up Database

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the setup script from \`scripts/setup-database.sql\`

This will create all necessary tables and security policies.

### 5. Run the Development Server

\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your app!

## 📁 Project Structure

\`\`\`
feedback-hub/
├── app/                    # Next.js App Router pages
│   ├── board/[slug]/      # Public feedback pages
│   ├── boards/            # Board management
│   ├── dashboard/         # User dashboard
│   ├── login/             # Authentication
│   └── signup/            
├── components/            # React components
│   ├── auth/              # Authentication components
│   ├── boards/            # Board management components
│   ├── dashboard/         # Dashboard components
│   ├── feedback/          # Feedback components
│   └── ui/                # shadcn/ui components
├── lib/                   # Utilities and configurations
│   └── supabase/          # Supabase client setup
├── scripts/               # Database setup scripts
└── middleware.ts          # Next.js middleware for auth
\`\`\`

## 🗄️ Database Schema

### Tables

#### \`boards\`
- \`id\` (UUID, Primary Key)
- \`slug\` (Text, Unique) - URL-friendly identifier
- \`name\` (Text) - Board display name
- \`description\` (Text, Optional) - Board description
- \`owner_id\` (UUID) - References auth.users
- \`created_at\` (Timestamp)

#### \`board_categories\`
- \`id\` (UUID, Primary Key)
- \`board_id\` (UUID) - References boards
- \`name\` (Text) - Category name
- \`color\` (Text) - Hex color code
- \`created_at\` (Timestamp)

#### \`feedback\`
- \`id\` (UUID, Primary Key)
- \`board_id\` (UUID) - References boards
- \`category_id\` (UUID) - References board_categories
- \`content\` (Text) - Feedback content
- \`author_name\` (Text, Optional) - Optional author name
- \`created_at\` (Timestamp)

### Security Policies (RLS)

- **Boards**: Public read, owner-only write
- **Categories**: Public read, board owner-only write
- **Feedback**: Public insert, board owner-only read

## 🎨 Customization

### Colors
The app uses a vibrant color palette with gradients. Main colors:
- Primary: Blue (#3B82F6) to Purple (#8B5CF6)
- Secondary: Purple (#8B5CF6) to Pink (#EC4899)
- Success: Green (#10B981) to Emerald (#059669)

### Animations
Framer Motion is used for:
- Page transitions
- Component entrance animations
- Hover effects
- Loading states

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

\`\`\`bash
# Or use Vercel CLI
npm i -g vercel
vercel
\`\`\`

### Environment Variables for Production
Make sure to set these in your deployment platform:
- \`NEXT_PUBLIC_SUPABASE_URL\`
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/yourusername/feedback-hub/issues) page
2. Create a new issue if your question isn't answered
3. Join our [Discord community](https://discord.gg/feedback-hub)

---

Made with ❤️ by [Your Name](https://github.com/yourusername)
\`\`\`

Let's also create the environment example file:
