# 🚀 DevConnect - Professional Developer & Recruiter Platform

A full-stack MERN application connecting developers and recruiters with advanced features including real-time chat, video interviews, collaborative coding sessions, job portal, hackathon platform, and more.

## ✨ Features

### For Developers
- 👤 **Profile Management** - Showcase skills, bio, GitHub, LinkedIn
- 💼 **Job Portal** - Browse, apply, and save job opportunities
- 🎯 **Hackathons** - Participate in coding competitions
- 💬 **Real-time Messaging** - Chat with recruiters and other developers
- 🎥 **Video Interviews** - WebRTC-powered video calls
- 👨‍💻 **Collaborative Coding** - Real-time code editor with syntax highlighting
- 📝 **Resume Builder** - Create professional resumes
- 🌐 **Community Feed** - Share posts (text, images, videos, audio)
- ⭐ **Endorsements** - Get endorsed for your skills

### For Recruiters
- 🏢 **Company Profiles** - Represent your organization
- 📢 **Job Postings** - Create and manage job listings
- 🔍 **Candidate Search** - Find developers by skills
- 📊 **CRM/ATS** - Manage applicants and track hiring pipeline
- 📅 **Interview Scheduling** - Schedule and conduct video interviews
- 🎪 **Host Hackathons** - Organize coding competitions
- 💼 **Application Management** - Review, accept, or reject applications

### Platform Features
- 🔐 **Authentication** - Secure JWT-based auth with password visibility toggles
- 🌓 **Modern UI** - Beautiful dark theme with glassmorphism effects
- 📱 **Responsive Design** - Works on all devices
- 🔔 **Real-time Notifications** - Stay updated on activities
- 📊 **Analytics** - Profile views and engagement tracking
- ☁️ **Cloud Storage** - Cloudinary integration for media uploads

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Framer Motion** - Animations
- **Socket.io Client** - Real-time communication
- **Monaco Editor** - Code editor
- **Simple Peer** - WebRTC for video calls
- **React Router v7** - Navigation
- **Axios** - HTTP client
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Socket.io** - WebSocket server
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Cloudinary** - Media storage
- **Multer** - File uploads

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Cloudinary account

### Clone Repository
\`\`\`bash
git clone https://github.com/anirudh-1404/DevConnect---mern.git
cd DevConnect---mern
\`\`\`

### Backend Setup
\`\`\`bash
cd Backend
npm install

# Create .env file (use .env.example as template)
cp .env.example .env

# Edit .env with your credentials
# MONGO_URI, JWT_SECRET, CLOUDINARY credentials, etc.

# Start backend server
npm run dev
\`\`\`

Backend runs on `http://localhost:8000`

### Frontend Setup
\`\`\`bash
cd Frontend/devconect
npm install

# Create .env file if needed
# VITE_BASE_URL_API=http://localhost:8000/api

# Start frontend
npm run dev
\`\`\`

Frontend runs on `http://localhost:5174`

## 🌐 Environment Variables

### Backend (.env)
\`\`\`env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
PORT=8000
FRONTEND_URL=http://localhost:5174
\`\`\`

### Frontend (.env)
\`\`\`env
VITE_BASE_URL_API=http://localhost:8000/api
\`\`\`

## 📁 Project Structure

\`\`\`
DevConnect/
├── Backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Auth, multer, etc.
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── socket/          # Socket.io setup
│   └── server.js        # Entry point
│
└── Frontend/
    └── devconect/
        ├── src/
        │   ├── API/            # Axios interceptors
        │   ├── common/         # Layouts, Hero, Footer
        │   ├── components/     # Reusable components
        │   ├── context/        # Auth & Socket context
        │   ├── hooks/          # Custom hooks (WebRTC)
        │   ├── pages/          # Page components
        │   └── App.jsx         # Main app
        └── vite.config.js
\`\`\`

## 🚀 Deployment

### Recommended Platforms
- **Frontend**: Vercel, Netlify, or Render
- **Backend**: Render, Railway, or Fly.io
- **Database**: MongoDB Atlas (Free tier available)
- **Media**: Cloudinary (Free tier available)

### Build Commands

**Frontend:**
\`\`\`bash
cd Frontend/devconect
npm run build
\`\`\`

**Backend:**
\`\`\`bash
cd Backend
npm start
\`\`\`

## 🎯 Key Features Implementation

### Real-time Features
- **Socket.io** for instant messaging, notifications, and online status
- **WebRTC** for peer-to-peer video interviews
- **Collaborative coding** with live cursor tracking

### Security
- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- Protected routes on frontend and backend
- CORS configuration for production

### Media Handling
- Cloudinary for image/video uploads
- Support for avatars, post media, and company logos
- Optimized media delivery

## 📸 Screenshots

*(Add screenshots of your application here)*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Anirudh Joshi**
- GitHub: [@anirudh-1404](https://github.com/anirudh-1404)
- LinkedIn: [Add your LinkedIn]

## 🙏 Acknowledgments

- React team for the amazing library
- MongoDB for the database
- Cloudinary for media storage
- All open-source contributors

---

⭐ **Star this repo if you find it helpful!**
