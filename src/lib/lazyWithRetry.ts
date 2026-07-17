import { lazy, ComponentType } from "react";

/**
 * A wrapper around React.lazy that automatically retries the import if it fails
 * due to network errors, connection timeouts, or cache-busting chunk changes.
 */
export function lazyWithRetry<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  retries = 2,
  delay = 1000
): React.LazyExoticComponent<T> {
  return lazy(() => {
    return new Promise<{ default: T }>((resolve, reject) => {
      const attempt = (remaining: number, currentDelay: number) => {
        importFunc()
          .then(resolve)
          .catch((error) => {
            const errorText = error?.message || "";
            const isNetworkError =
              error instanceof TypeError ||
              errorText.includes("Failed to fetch") ||
              errorText.includes("dynamically imported module") ||
              errorText.includes("Loading chunk") ||
              error.name === "TypeError";

            if (isNetworkError && remaining > 0) {
              console.warn(
                `Dynamic import failed. Retrying in ${currentDelay}ms... (${remaining} attempts left)`,
                error
              );
              setTimeout(() => {
                attempt(remaining - 1, currentDelay * 1.5);
              }, currentDelay);
            } else {
              reject(error);
            }
          });
      };
      attempt(retries, delay);
    });
  });
}
