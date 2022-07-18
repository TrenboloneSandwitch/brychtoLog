import type { ZodError } from "zod";
import qs from "qs";
import type { validateActionT } from "~/types";

export async function validationAction<ActionInput>({ request, schema }: validateActionT) {
  const text = await request.text();
  const body = qs.parse(text);

  try {
    const formData = schema.parse(body);
    return { formData, errors: null };
  } catch (err) {
    const zodErrors = err as ZodError<ActionInput>;
    const parsedErrors = zodErrors.issues.reduce(
      (errors, error) =>
        error.path.reduce((a, b, level) => {
          if (level === error.path.length - 1) {
            a[b] = error.message;
            return errors;
          }

          if (!a[b]) a[b] = {};
          return a[b];
        }, errors),
      {} as { [key: string]: any }
    );
    return {
      formData: body,
      errors: parsedErrors,
    };
  }
}
