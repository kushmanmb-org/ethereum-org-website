import { ComponentType } from "react"
import dynamic, { DynamicOptions, Loader } from "next/dynamic"

/**
 * Creates a dynamically imported component with consistent loading behavior.
 *
 * This utility standardizes the pattern of lazy-loading components with a loading fallback,
 * reducing code duplication across multiple lazy.tsx files.
 *
 * @param loader - Function that returns a promise resolving to the component module
 * @param Loading - Optional loading component to show while the main component loads
 * @param options - Optional Next.js dynamic import options (defaults to { ssr: false })
 * @returns A dynamically imported component
 *
 * @example
 * // In your lazy.tsx file:
 * import createLazyComponent from "@/lib/utils/createLazyComponent"
 * import Loading from "./loading"
 *
 * export default createLazyComponent(() => import("."), Loading)
 *
 * @example
 * // With custom options:
 * export default createLazyComponent(
 *   () => import("./MyComponent"),
 *   Loading,
 *   { ssr: true, loading: Loading }
 * )
 */
export default function createLazyComponent<P = Record<string, unknown>>(
  loader: Loader<P>,
  Loading?: ComponentType<unknown>,
  options?: Omit<DynamicOptions<P>, "loader" | "loading">
) {
  return dynamic(loader, {
    ssr: false,
    loading: Loading,
    ...options,
  })
}
