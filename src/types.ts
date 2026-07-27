import { ChangeEvent, SubmitEvent } from "react";
import { ZodType } from "zod";

export type HandleSubmitReturn = (e: SubmitEvent) => void;
export type SubmitCallBack<T> = (data: T) => void;
export type FormElements =
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

export type FormFieldReturn<T, K extends keyof T> = {
    value: T[K];
    name: K;
    onChange: (e: ChangeEvent<FormElements>) => void;
};

export type FormErrors<T, TError> = Partial<Record<keyof T, TError>>;

export type UseFormProps<T> = {
    initialData: T;
    validationSchema: ZodType<T>;
};

export type UseFormReturn<T, TError> = {
    reset: () => void;
    formField: <K extends keyof T>(fieldName: K) => FormFieldReturn<T, K>;
    formErrors: FormErrors<T, TError>;
    handleSubmit: (submitCallback: SubmitCallBack<T>) => HandleSubmitReturn;
};
