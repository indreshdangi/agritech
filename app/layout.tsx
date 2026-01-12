import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import "./globals.css"; // Comment this out if it causes issues, or leave it.

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IND Agritech",
  description: "Jai Jawan, Jai Kisan",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Tailwind CDN - Direct Design Fix */}
        <script src="https://cdn.tailwindcss.com"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            tailwind.config = {
              darkMode: 'class',
              theme: {
                extend: {
                  colors: {
                    primary: "#166534", 
                    saffron: "#FF9933",
                    indiaGreen: "#138808",
                  },
                  animation: {
                    'float': 'float 6s ease-in-out infinite',
                  },
                  keyframes: {
                    float: {
                      '0%, 100%': { transform: 'translateY(0)' },
                      '50%': { transform: 'translateY(-20px)' },
                    }
                  }
                }
              }
            }
          `
        }} />
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Custom Styles directly in Layout */
            .glass-panel {
              background: rgba(255, 255, 255, 0.7);
              backdrop-filter: blur(12px);
              border: 1px solid rgba(255, 255, 255, 0.3);
            }
            .dark .glass-panel {
              background: rgba(20, 20, 20, 0.6);
              border: 1px solid rgba(255, 255, 255, 0.1);
            }
            ::-webkit-scrollbar { width: 8px; }
            ::-webkit-scrollbar-thumb { background: #138808; border-radius: 10px; }
          `
        }} />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
