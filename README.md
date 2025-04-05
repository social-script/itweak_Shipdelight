# Next.js Firebase Auth Boilerplate

A simple boilerplate for Next.js applications with Firebase authentication and shadcn/ui components.

## Features

- ⚡ Next.js 15 with App Router
- 🔥 Firebase Authentication with Google Sign-In
- 🎨 shadcn/ui components and styling
- 🌙 Dark mode ready (based on user's system preference)
- 📱 Responsive design
- 🔒 Protected routes (can be implemented using middleware)

## Getting Started

### Prerequisites

- Node.js 18.17.0 or later
- npm, yarn, or pnpm
- Firebase project (for authentication)

### Installation

1. Clone this repository or use it as a template
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up your Firebase project:
   - Create a new project on [Firebase Console](https://console.firebase.google.com/)
   - Add a web app to your project
   - Enable Google Sign-in in the Authentication section
   - Copy your Firebase configuration

4. Create a `.env.local` file in the root directory with your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/
├── app/                  # Next.js App Router
├── components/           # React components
│   ├── ui/               # shadcn/ui components
│   ├── AuthButton.tsx    # Authentication button
│   ├── Header.tsx        # Header component
│   ├── UserProfile.tsx   # User profile component
│   └── LoginForm.tsx     # Login form component
├── lib/                  # Utility functions
│   ├── firebase/         # Firebase related code
│   │   ├── auth-context.tsx  # Auth context provider
│   │   └── firebase-config.ts # Firebase configuration
│   └── utils.ts          # General utility functions
└── public/               # Static assets
```

## Customization

- Add more authentication providers (GitHub, Facebook, etc.) by configuring them in Firebase and updating the auth-context.tsx file
- Implement protected routes using Next.js middleware
- Add more pages and components as needed for your application

## License

MIT

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
