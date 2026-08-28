# XYLO Esports - Premium BGMI Tournament Platform

Welcome to the **XYLO Esports** repository! This is a comprehensive, modern Next.js 16 web application designed to host and manage BGMI (Battlegrounds Mobile India) esports tournaments. It allows users to register, pay entry fees securely, compete for cash prizes, and stay updated with the latest gaming news.

## 🚀 Tech Stack & Core Technologies

The platform is built using bleeding-edge web technologies, prioritizing performance, SEO, and stunning visuals:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router) & React 19
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) for utility-first styling with modern UI/UX principles (Glassmorphism, Dark Mode)
- **Animations:** [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/), and [Lottie React](https://lottiereact.com/) for smooth, premium micro-interactions and transitions
- **Database & Authentication:** [Supabase](https://supabase.com/) for secure user management and dynamic data (e.g., blogs)
- **Payment Gateway:** [Cashfree Payments](https://www.cashfree.com/) (`@cashfreepayments/cashfree-js`, `cashfree-pg`) for seamless entry fee transactions
- **PDF Generation:** `jspdf` & `jspdf-autotable` for generating invoices, tickets, or reports
- **Icons:** [Lucide React](https://lucide.dev/)
- **SEO:** Built-in dynamic metadata and JSON-LD schema generation for superior search engine visibility

## 📂 Site Structure & Pages

The application is structured logically with the Next.js App Router. Here is a breakdown of the core pages and the content they deliver:

### 1. Home Page (`/`)
The main landing page is designed to wow users and convert them into participants.
- **Hero Section:** High-impact visual intro to the platform.
- **Upcoming Tournament:** Highlights the next major event to drive registrations.
- **Past Live Streams:** Features previous event broadcasts.
- **Live Stats:** Real-time statistics of the platform (players, prize pools).
- **About Section:** Brief intro to XYLO Esports.
- **Game Expo & Categories:** Explores the types of tournaments (Solo, Duo, Squad) and game modes.
- **Timeline Section:** Schedule of events.
- **Home CTA:** Call to action to join the community.

### 2. Tournaments (`/tournaments`)
The core competitive hub.
- Browse all upcoming BGMI tournaments.
- Details for Mega Championships, prize pools (e.g., ₹800 for 1st place), and entry fees.
- Integrated Event Schema (JSON-LD) for rich Google search results.

### 3. Registration & Payments (`/registration`)
- Secure registration flow for tournaments.
- Integrated with Cashfree PG for collecting entry fees directly on the platform.

### 4. Blogs (`/blogs`)
- Dynamic blog page fetching the latest strategies, esports news, and tips from Supabase.
- Beautiful grid layout with hover effects, reading times, and category tags.

### 5. User Dashboard (`/user-dashboard`)
- Personalized space for users after they log in (`/login`).
- Tracks registered tournaments, past results, and payment history.

### 6. Results & Streams
- **Results (`/results`):** Leaderboards and post-tournament standings.
- **Past Streams (`/past-streams`):** Archive of tournament broadcasts.

### 7. Informational Pages
- **About (`/about`):** Detailed mission, vision, and fair play commitment.
- **FAQ (`/faq`):** Frequently asked questions regarding tournaments and payouts.
- **Legal:** Privacy Policy (`/privacy`), Terms of Service (`/terms`, `/terms-of-service`).

## 🛠️ Getting Started Locally

To run this project on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AbdulAhad0007/bgmi.git
   cd bgmi
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Variables:**
   Ensure you have the required environment variables set up (Supabase keys, Cashfree API keys, etc.) based on the `.env.example` or required integrations.

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **View the Application:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎨 Design Philosophy
The UI relies heavily on modern gaming aesthetics. We utilize a "Tactical Black" and "PUBG Yellow" color scheme, glassmorphism (`backdrop-filter`), and dynamic backgrounds (e.g., animated golden mist) to ensure the platform feels alive and premium.

---
*Built for the Indian Gaming Community by XYLO Esports.*