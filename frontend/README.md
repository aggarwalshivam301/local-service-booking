# ServiceHub - Frontend

A modern, responsive React application for the Local Service Booking Platform with a sleek black & white design.

## 🎨 Design Features

- **Black & White Theme**: Elegant, professional monochrome design
- **Modern UI/UX**: Clean, minimalist interface with smooth animations
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices
- **Micro-interactions**: Smooth hover effects, transitions, and animations
- **Accessibility**: High contrast, readable fonts, and semantic HTML

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase credentials and backend API URL:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_API_URL=http://localhost:5000/api
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```
   
   Open [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
frontend/
├── public/                 # Static files
│   └── index.html
├── src/
│   ├── assets/
│   │   └── styles/        # Global styles
│   │       └── index.css  # Main stylesheet
│   ├── components/        # Reusable components
│   │   ├── Navbar.js
│   │   ├── Navbar.css
│   │   ├── Footer.js
│   │   └── Footer.css
│   ├── context/           # React Context
│   │   └── AuthContext.js
│   ├── pages/             # Page components
│   │   ├── Home.js
│   │   ├── Home.css
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Auth.css
│   │   ├── Services.js
│   │   └── Services.css
│   ├── services/          # API services
│   │   ├── api.js
│   │   └── firebase.js
│   ├── App.js            # Main App component
│   └── index.js          # Entry point
├── package.json
└── README.md
```

## 🎨 Design System

### Color Palette

```css
--black: #000000
--white: #FFFFFF
--gray-50: #FAFAFA
--gray-100: #F5F5F5
--gray-200: #EEEEEE
--gray-300: #E0E0E0
--gray-400: #BDBDBD
--gray-500: #9E9E9E
--gray-600: #757575
--gray-700: #616161
--gray-800: #424242
--gray-900: #212121
```

### Typography

- **Font Family**: Inter
- **Headings**: 900 weight (Black)
- **Body**: 400 weight (Regular)
- **Buttons**: 600 weight (Semi-bold)

### Component Patterns

- **Cards**: White background, gray borders, hover elevation
- **Buttons**: Black primary, outlined secondary
- **Forms**: Clean inputs with focus states
- **Navigation**: Fixed navbar with dropdown menus

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm build` - Create production build
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## 📦 Dependencies

### Core
- **react**: ^18.2.0
- **react-dom**: ^18.2.0
- **react-router-dom**: ^6.8.0

### State & API
- **axios**: ^1.3.0
- **firebase**: ^9.17.0

### UI Components
- **react-toastify**: ^9.1.1
- **react-icons**: ^4.7.1
- **react-calendar**: ^4.0.0
- **date-fns**: ^2.29.3

## 🎯 Features

### Implemented
✅ User authentication (login/register)
✅ Browse services with filters
✅ Search functionality
✅ Category filtering
✅ Responsive design
✅ Toast notifications
✅ Loading states

### To Be Implemented
- Service detail view
- Booking system
- User profile
- Provider dashboard
- Service management
- Reviews & ratings
- Booking history
- Real-time notifications

## 🔐 Authentication Flow

1. User registers/logs in via Firebase
2. Firebase returns JWT token
3. Token is sent to backend API
4. Backend validates and returns user data
5. User data stored in AuthContext
6. Protected routes check authentication status

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎭 Animation Examples

- Hero section slide-in
- Card hover effects
- Float animations on feature cards
- Smooth page transitions
- Loading spinners

## 🚀 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel --prod
   ```

### Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Drag and drop the `build` folder to Netlify

## 🐛 Troubleshooting

### Firebase Initialization Error
- Ensure all Firebase environment variables are set correctly
- Check Firebase project settings in Firebase Console

### API Connection Error
- Verify backend is running
- Check REACT_APP_API_URL in .env
- Ensure CORS is configured on backend

### Build Errors
- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

## 📄 License

MIT

## 👨‍💻 Author

ServiceHub Team

---

**Built with ❤️ using React and modern web technologies**
