import type { ZodError } from "zod";
import qs from "qs";
import type { validateActionT } from "~/types";

type ActionErrorT<T> = Partial<Record<keyof T, string>>;

export async function validationAction<ActionInput>({ request, schema }: validateActionT) {
  const text = await request.text();
  console.log("text: ", text);
  const body = qs.parse(text);
  console.log("body: ", body);

  try {
    const formData = schema.parse(body);
    console.log("formData 2: ", formData);
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
    console.error("parsedErrors: ", parsedErrors);
    return {
      formData: body,
      errors: parsedErrors,
    };
  }
}
