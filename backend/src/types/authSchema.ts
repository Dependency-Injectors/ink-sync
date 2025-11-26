import { t } from "elysia";

export const UserSchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({
    minLength: 8,
    maxLength: 64,
    // pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$",
    error:
      "Password must be 8-64 characters long, include uppercase and lowercase letters, a number, and a special character.",
  }),
});
