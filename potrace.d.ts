declare module 'potrace' {
  export function trace(
    file: Buffer | string,
    options: Record<string, any>,
    cb: (err: Error | null, svg: string) => void
  ): void;
}
