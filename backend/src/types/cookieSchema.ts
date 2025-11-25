import { t } from "elysia";

export const CookieSchema = t.Cookie({
  auth: t.String(),
});
