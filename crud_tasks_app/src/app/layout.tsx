import { TaskProvider } from "@/contexts/TaskContext";
import "./globals.css";



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <TaskProvider>
          {children} 
        </TaskProvider>
      </body>
    </html>
  );
}
