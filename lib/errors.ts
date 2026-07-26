import { sql } from './db';

/** Never throws — logging a failure should never cause a second failure. */
export async function logError(source: string, err: unknown) {
  try {
    const message = err instanceof Error ? err.message : String(err);
    const detail = err instanceof Error ? err.stack || '' : JSON.stringify(err).slice(0, 4000);
    await sql`insert into error_log (source, message, detail) values (${source}, ${message.slice(0, 500)}, ${detail.slice(0, 4000)})`;
  } catch {
    // logging is best-effort; swallow so the original error response still goes out
  }
}
