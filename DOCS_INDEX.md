# Documentation Index

Complete guide to all documentation for the General Equipments platform.

## Getting Started

### 1. [Quick Start Guide](./QUICKSTART.md) ⚡
**Start here if you're new!**

Get your CMS running in 5 minutes:
- Install dependencies
- Start the dev server
- Create your first admin user
- Access the admin panel

**Time to complete**: 5 minutes

---

### 2. [Architecture Overview](./ARCHITECTURE.md) 🏗️
**Visual guide to how everything works**

Understand the system with diagrams:
- System architecture
- Authentication flow
- Form submission process
- Data access patterns
- Security layers
- Request flow examples

**Best for**: Understanding the big picture

---

### 3. [Authentication Setup Guide](./AUTHENTICATION_SETUP.md) 🔐
**Complete authentication documentation**

Everything about admin authentication:
- How authentication works
- Creating admin users (3 methods)
- Accessing the admin panel
- Session management
- Security features
- Troubleshooting common issues
- Advanced configuration

**Best for**: Setting up and managing admin access

---

### 4. [Google Sheets Integration](./GOOGLE_SHEETS_SETUP.md) 📊
**Connect your forms to Google Sheets**

Step-by-step setup guide:
- Create a Google Sheet
- Set up Apps Script webhook
- Configure environment variables
- Test the integration
- Troubleshooting

**Best for**: Backing up form data to spreadsheets

---

### 5. [Main README](./README.md) 📘
**Complete project documentation**

Full reference documentation:
- Technology stack
- Project structure
- Setup instructions
- Security architecture
- Database schema
- Feature checklist
- Deployment guide

**Best for**: Complete project reference

---

## Quick Reference

### Admin Login
- **Development**: http://localhost:5173/admin/login
- **Production**: https://yourdomain.com/admin/login

### Supabase Dashboard
- **Your Project**: https://supabase.com/dashboard/project/urvnpiquycoorthpmhnb

### Key Files
```
/
├── QUICKSTART.md              ← Start here
├── ARCHITECTURE.md            ← Visual diagrams
├── AUTHENTICATION_SETUP.md    ← Auth guide
├── GOOGLE_SHEETS_SETUP.md     ← Sheets integration
├── README.md                  ← Full documentation
├── .env                       ← Environment variables
└── package.json               ← Dependencies
```

---

## Common Tasks

### Task: Set up the project for the first time
→ Follow: [QUICKSTART.md](./QUICKSTART.md)

### Task: Create a new admin user
→ Follow: [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) → "Creating Admin Users"

### Task: Understand how authentication works
→ Follow: [ARCHITECTURE.md](./ARCHITECTURE.md) → "Authentication Flow"

### Task: Connect to Google Sheets
→ Follow: [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md)

### Task: Troubleshoot login issues
→ Follow: [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) → "Troubleshooting"

### Task: Deploy to production
→ Follow: [README.md](./README.md) → "Deployment"

### Task: Understand the database structure
→ Follow: [README.md](./README.md) → "Database Schema"

### Task: Understand security architecture
→ Follow: [ARCHITECTURE.md](./ARCHITECTURE.md) → "Security Layers"

---

## Documentation by Role

### For Developers
1. [ARCHITECTURE.md](./ARCHITECTURE.md) - Understand the system
2. [README.md](./README.md) - Technical reference
3. [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) - Auth implementation

### For Site Administrators
1. [QUICKSTART.md](./QUICKSTART.md) - Get started quickly
2. [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) - Manage users
3. [GOOGLE_SHEETS_SETUP.md](./GOOGLE_SHEETS_SETUP.md) - Set up CRM

### For Business Stakeholders
1. [README.md](./README.md) - Feature overview
2. [ARCHITECTURE.md](./ARCHITECTURE.md) - System overview
3. [QUICKSTART.md](./QUICKSTART.md) - See it in action

---

## Support

If you can't find what you need in these guides:

1. **Check the specific documentation** - Each guide has a troubleshooting section
2. **Review the architecture** - Understanding the flow often solves issues
3. **Check Supabase status** - https://status.supabase.com/
4. **Supabase documentation** - https://supabase.com/docs

---

## Quick Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Check for TypeScript errors
npm run typecheck

# Run linter
npm run lint
```

---

## Environment Variables Reference

Your `.env` file should contain:

```env
VITE_SUPABASE_URL=https://urvnpiquycoorthpmhnb.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**Note**: These are already configured in your project.

---

## Project Status

✅ **Complete and production-ready**

- Database schema created
- Authentication configured
- All pages implemented
- Admin CMS functional
- Forms secured with Edge Functions
- Google Sheets integration available
- Complete documentation provided

**Next step**: Create your first admin user and start managing content!

---

## Quick Links

- [Supabase Dashboard](https://supabase.com/dashboard/project/urvnpiquycoorthpmhnb)
- [Admin Login (Local)](http://localhost:5173/admin/login)
- [Homepage (Local)](http://localhost:5173/)

---

**Need help?** Start with the [Quick Start Guide](./QUICKSTART.md) or check the [Troubleshooting section](./AUTHENTICATION_SETUP.md#troubleshooting) in the Authentication Setup Guide.
