import { ChangeEvent, SubmitEvent, useState } from "react";
import {
    FormElements,
    FormErrors,
    FormFieldReturn,
    HandleSubmitReturn,
    SubmitCallBack,
    UnTouchedError,
    UseFormProps,
    UseFormReturn,
} from "./types.js";

function useForm<T, TError extends string = string>({
    initialData,
    validationSchema,
}: UseFormProps<T>): UseFormReturn<T, TError> {
    const [formData, setFormData] = useState<T>(initialData);
    const [formErrors, setFormErrors] = useState<FormErrors<T, TError>>({});
    const [touched, setTouched] = useState<boolean>(false);

    function reset() {
        setTouched(false);
        setFormData(initialData);
        setFormErrors({});
    }

    function formField<K extends keyof T>(fieldName: K): FormFieldReturn<T, K> {
        return {
            value: formData[fieldName],
            name: fieldName,
            onChange: handleChange,
        };
    }

    function validateData(data: T): boolean {
        const parsed = validationSchema.safeParse(data);
        if (!parsed.success) {
            const errors = parsed.error._zod.def.map(
                (err) =>
                    ({
                        path: err.path[0],
                        message: err.message,
                    }) as UnTouchedError<T, TError>
            );
            const mappedErrors: FormErrors<T, TError> = {};
            errors.forEach(({ path, message }) => {
                if (!mappedErrors[path]) {
                    mappedErrors[path] = message;
                }
            });
            setFormErrors({ ...mappedErrors });
            return false;
        }
        setFormErrors({});
        return true;
    }

    function handleChange(e: ChangeEvent<FormElements>) {
        const { name, value } = e.target;
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
        submitCallback: SubmitCallBack<T>
    ): HandleSubmitReturn {
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
