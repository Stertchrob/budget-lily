import "./globals.css";
import { AuthProvider } from "../components/AuthProvider";
import NavBar from "../components/NavBar";

export const metadata = {
  title: "Budget Lily",
  description: "Budgeting and spending analysis app",
  icons: {
    icon: "/budget-lily.png",
    shortcut: "/budget-lily.png",
    apple: "/budget-lily.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <header className="px-4 pt-6 pb-4">
            <NavBar />
          </header>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
