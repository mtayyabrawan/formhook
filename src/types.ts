import { ChangeEvent } from "react";
import z from "zod";

export type FormErrors<T> = Partial<Record<keyof T, string>>;

export type FormFieldProps<T, K extends keyof T> = {
    value: T[K];
    name: K;
    onChange: (e: ChangeEvent) => void;
};

export type UseFormProps<T> = {
    initialData: T;
    validationSchema: z.ZodType<T>;
};
