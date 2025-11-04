import type { Metadata } from "next";
import "./globals.css"; // keep your styles

export const metadata: Metadata = {
  title: "TailorLink",
  description: "Get connected with professional tailors easily and efficiently.",
  icons: {
    icon: [
      { url: "/ti1.png", sizes: "16x16", type: "image/png" },
      { url: "/ti1.png", sizes: "32x32", type: "image/png" },
      { url: "/ti1.png", sizes: "any" },
    ],
    apple: [{ url: "/ti1.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
