import "./globals.css";
import { AuthProvider } from "../components/AuthProvider";
import NavBar from "../components/NavBar";

export const metadata = {
  title: "Budget Lily",
  description: "Budgeting and spending analysis app",
  icons: {
    icon: "/budget-lily.png?v=2",
    shortcut: "/budget-lily.png?v=2",
    apple: "/budget-lily.png?v=2",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <AuthProvider>
          <div className="min-h-screen px-4 py-4 sm:px-5 sm:py-5">
            <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-[1600px] flex-col gap-4 lg:flex-row">
              <aside className="w-full lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:max-w-[300px] lg:flex-none">
                <NavBar />
              </aside>
              <div className="min-w-0 flex-1">
                {children}
              </div>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
