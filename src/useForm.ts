import { ChangeEvent, SubmitEvent, useState } from "react";
import { FormErrors, FormFieldProps, UseFormProps } from "./types.js";

function useForm<T>({ initialData, validationSchema }: UseFormProps<T>): {
    reset: () => void;
    formField: <K extends keyof T>(fieldName: K) => FormFieldProps<T, K>;
    formErrors: FormErrors<T>;
    handleSubmit: (
        submitCallback: (data: T) => void
    ) => (e: SubmitEvent) => void;
} {
    const [formData, setFormData] = useState<T>(initialData);
    const [formErrors, setFormErrors] = useState<FormErrors<T>>({});
    const [touched, setTouched] = useState<boolean>(false);

    function reset() {
        setTouched(false);
        setFormData(initialData);
        setFormErrors({});
    }

    function formField<K extends keyof T>(fieldName: K): FormFieldProps<T, K> {
        return {
            value: formData[fieldName],
            name: fieldName,
            onChange: handleChange,
        };
    }

    function validateData(data: T): boolean {
        const parsed = validationSchema.safeParse(data);
        if (!parsed.success) {
            const fieldErrors = parsed.error.flatten().fieldErrors;
            const mappedErrors: FormErrors<T> = {};
            (Object.keys(fieldErrors) as (keyof T)[]).forEach((key) => {
                const message = fieldErrors[key]?.[0];
                if (message) mappedErrors[key] = message;
            });
            setFormErrors({ ...mappedErrors });
            return false;
        }
        setFormErrors({});
        return true;
    }

    function handleChange(e: ChangeEvent) {
        const { name, value } = e.target as
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        setFormData((prev) => {
            const updated = {
                ...prev,
                [name]: value,
            };
            if (touched) validateData(updated);
            return updated;
        });
    }

    function handleSubmit(
        submitCallback: (data: T) => void
    ): (e: SubmitEvent) => void {
        return (e: SubmitEvent) => {
            e.preventDefault();
            setTouched((prev) => (!prev ? true : prev));
            if (validateData(formData)) {
                submitCallback(formData);
            }
        };
    }

    return { reset, formField, formErrors, handleSubmit };
}

export default useForm;
