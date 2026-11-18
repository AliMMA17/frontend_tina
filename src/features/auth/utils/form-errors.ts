import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { ApiError } from "@/lib/api-client";

/**
 * Applies server-side 422 field validation errors to React Hook Form fields
 * and returns a top-level alert message if appropriate.
 */
export function handleAuthFormError<T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>,
  validFields: ReadonlyArray<Path<T>>,
  fallbackMessage: string
): string | null {
  if (err instanceof ApiError) {
    if (err.fieldErrors) {
      let mappedAny = false;
      for (const [field, msg] of Object.entries(err.fieldErrors)) {
        if (validFields.includes(field as Path<T>)) {
          setError(field as Path<T>, { type: "server", message: msg });
          mappedAny = true;
        }
      }
      if (mappedAny) {
        return err.status === 422
          ? "لطفاً خطاهای مشخص‌شده در فرم را برطرف کنید."
          : err.message;
      }
    }
    return err.message;
  }

  return err instanceof Error ? err.message : fallbackMessage;
}
