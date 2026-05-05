import { getRouter } from "./router";
import { hydrateRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

const router = getRouter();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

hydrateRoot(rootElement, <RouterProvider router={router} />);
