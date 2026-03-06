import "./globals.css";
import { AuthProvider } from "../components/AuthProvider";

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
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
