import * as Sentry from '@sentry/nextjs';

// Wraps a server action so it shows up in Sentry as a named, filterable
// action (e.g. "articles.createArticle") instead of an anonymous "Server
// Action" — and so an unexpected throw actually gets reported instead of
// only surfacing to the caller as an opaque error.
export function withAction<Args extends unknown[], R>(
  name: string,
  fn: (...args: Args) => Promise<R>,
): (...args: Args) => Promise<R> {
  // withServerActionInstrumentation's type is `Promise<ReturnType<callback>>`,
  // so passing our already-async fn types it as Promise<Promise<R>> even
  // though it flattens fine at runtime — await here to get back to Promise<R>.
  return async (...args: Args): Promise<R> => {
    return await Sentry.withServerActionInstrumentation(name, {}, () => fn(...args));
  };
}
