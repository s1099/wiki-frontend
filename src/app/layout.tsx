import "./globals.css";
import { ThemeProvider } from "./providers/theme-provider";
import { Analytics } from "@vercel/analytics/react"
export const metadata = {
  title: "Wikipedia",
  description: "A Wikipedia frontend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      {process.env.VERCEL_ANALYTICS && <Analytics/>}
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
