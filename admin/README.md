# Database setup and security

For a new project, apply `schema.sql`, then every SQL file in `supabase/migrations/` in filename order before publishing the frontend. The baseline alone is historical and does not include current security protections.

Existing installations apply only unapplied migrations. The hardening migration binds existing administrators to their existing `auth.users.id`. Subsequent administrator enrollment must explicitly record the intended Auth user UUID in `portal_admins.user_id`; matching an email alone grants no privileges. Do not expose this table or grant public writes.

The final migration revokes the legacy public feedback RPC. The current frontend submits feedback through the `drive-proxy` Edge function, which validates requests and invokes service-role-only RPCs. Deploy that function before publishing the frontend. Public materials remain available without an account.

Run `tests/database-security.sql` in the SQL editor to verify policies and functional behavior. It rolls back its test changes. Run `npm ci`, `npm run build:assets`, `npm run test:security`, and `deno test --allow-env supabase/functions/drive-proxy/index_test.ts` for local validation.

The public browser configuration contains only a publishable Supabase key. Google API and service-role credentials belong only in server-side secrets. New JavaScript/CSS dependencies must be pinned and bundled locally; the script CSP intentionally forbids inline handlers and arbitrary CDN scripts.
