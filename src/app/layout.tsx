import "./globals.css";
import { ThemeProvider } from "./providers/theme-provider";

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
    <html lang="en">
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
