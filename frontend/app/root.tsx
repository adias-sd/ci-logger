import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { ThemeProvider, createTheme } from '@mui/material/styles';

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

const queryClient = new QueryClient();

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

export function Layout({ children }: { children: React.ReactNode }) {
  const themeScript = `
    (function () {
      const htmlElement = document.documentElement;
      const theme = localStorage.getItem('theme') || 'system';

      if (theme === 'dark') {
        htmlElement.classList.add('dark');
        htmlElement.style.colorScheme = 'dark';
      } else if (theme === 'light') {
        htmlElement.classList.remove('dark');
        htmlElement.style.colorScheme = 'light';
      } else if (theme === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          htmlElement.classList.add('dark');
          htmlElement.style.colorScheme = 'dark';
        } else {
          htmlElement.classList.remove('dark');
          htmlElement.style.colorScheme = 'light';
        }
      }
    })();
  `;
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
          <html lang="en">
          <head>
            <Meta />
            <Links />
            <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
          <body>
            {children}
            <ScrollRestoration />
            <Scripts />
          </body>
        </html>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
