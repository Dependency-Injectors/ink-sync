import { t } from "elysia";

export const UserSchema = t.Object({
  email: t.String({ format: "email" }),
  password: t.String({
    minLength: 8,
    maxLength: 40,
    pattern:
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?`~])[A-Za-z\\d!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?`~]{8,40}$",
    error:
      "Password must be 8-40 characters long, include uppercase and lowercase letters, a number, and a special character.",
  }),
});
