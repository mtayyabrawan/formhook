# @mtayyabrawan/formhook

A lightweight React hook for managing forms with built-in Zod validation. Simplify form state, validation, and submission handling in React and Next.js applications.

## Features

- **React Hook API**: `useForm<T>()` provides a simple interface for form state management.
- **Zod Validation**: Integrates seamlessly with Zod schemas for type-safe validation.
- **Type Safety**: Full TypeScript support with inferred types for form values and errors.
- **Flexible API**: Supports field-level access via `formField`, error handling via `formErrors`, and easy reset functionality.
- **Next.js Ready**: Works out of the box with Server Components and App Router.

## Installation

```bash
npm install @mtayyabrawan/formhook
# or
yarn add @mtayyabrawan/formhook
```

## Peer Dependencies

- React (^18 or ^19)
- Zod (^3.25.0 or ^4)

Make sure these are installed in your project.

## Basic Usage

```tsx
import { useForm } from "@mtayyabrawan/formhook";
import { z } from "zod";

const schema = z.object({
    name: z.string().min(3, "Name is required"),
    email: z.string().email("Invalid email"),
    age: z.number().int().min(18, "Must be 18+"),
});

export default function UserForm() {
    const { reset, formField, formErrors, handleSubmit } = useForm({
        initialData: { name: "", email: "", age: 0 },
        validationSchema: schema,
    });

    const onSubmit = (data: { name: string; email: string; age: number }) => {
        console.log("Form submitted:", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <label>
                    Name
                    <input type="text" {...formField("name")} />
                </label>
                {formErrors.name && (
                    <p className="text-red-500">{formErrors.name}</p>
                )}
            </div>

            <div>
                <label>
                    Email
                    <input type="email" {...formField("email")} />
                </label>
                {formErrors.email && (
                    <p className="text-red-500">{formErrors.email}</p>
                )}
            </div>

            <div>
                <label>
                    Age
                    <input type="number" {...formField("age")} />
                </label>
                {formErrors.age && (
                    <p className="text-red-500">{formErrors.age}</p>
                )}
            </div>

            <button type="submit">Submit</button>
            <button type="button" onClick={reset}>
                Reset
            </button>
        </form>
    );
}
```

### Key API Elements

- **`useForm<T>(props: UseFormProps<T>)`**: Returns an object with form state and methods.
- **`formField<K extends keyof T>(fieldName: K)`**: Accessor for a specific field, returns `value`, `name`, and `onChange`.
- **`formErrors: FormErrors<T>`**: Object containing validation errors keyed by field name.
- **`reset()`**: Resets form to initial data and clears errors.
- **`handleSubmit(callback: (data: T) => void)`**: Wraps submit handler to trigger validation and provide `event.preventDefault()`.

### Using with Next.js App Router

The hook works seamlessly with Next.js 13+ App Router. Since it's a client-side hook, wrap your form component in a `"use client"` directive:

```tsx
"use client";

import { useForm } from "@mtayyabrawan/formhook";
import { z } from "zod";

const schema = z.object({
    username: z.string().min(3),
    password: z.string().min(8),
});

export default function LoginForm() {
    const { formField, formErrors, handleSubmit } = useForm({
        initialData: { username: "", password: "" },
        validationSchema: schema,
    });

    const onSubmit = (data: { username: string; password: string }) => {
        // Handle login logic
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...formField("username")} />
            {formErrors.username && <p>{formErrors.username}</p>}

            <input type="password" {...formField("password")} />
            {formErrors.password && <p>{formErrors.password}</p>}

            <button type="submit">Login</button>
        </form>
    );
}
```

## FAQ

**Q: Is the hook compatible with React 19?**
A: Yes, it supports React 18 and 19.

**Q: How do I reset the form programmatically?**
A: Call the `reset` method returned by `useForm`.

## License

MIT © [Muhammad Tayyab](https://linkedin.com/in/mtayyabrawan)

---

_Happy form building!_ 🚀
