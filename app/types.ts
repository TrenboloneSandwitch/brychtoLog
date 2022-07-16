import type { ZodSchema } from "zod";

export type validateActionT = { request: Request; schema: ZodSchema };
export type ActionErrorT<T> = Partial<Record<keyof T, string>>;
