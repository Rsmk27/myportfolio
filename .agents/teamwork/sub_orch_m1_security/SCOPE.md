# Scope: Milestone 1 — Security Hardening & Dependency Remediation

## Architecture
- Root configuration files: `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig.json`, `vercel.json`.
- Component: `components/ContactInterface.tsx` (MiniMarkdown sanitization, chat message rate bounds).
- Component: `components/common/SEO.tsx` (JSON-LD script escaping).

## Feature Inventory
| # | Feature / Issue | Description | Status |
|---|-----------------|-------------|--------|
| 1 | Dependency CVEs | Run `npm audit fix` to resolve 11 vulnerabilities (9 High) in vite, react-router, postcss, nanoid | DONE |
| 2 | Secret Exposure Hazard | Remove unused client-side `process.env.API_KEY` define block in `vite.config.ts` | DONE |
| 3 | MiniMarkdown XSS | Validate markdown links with regex protocol whitelist `/^(https?:\/\/|mailto:)/i` in `ContactInterface.tsx` | DONE |
| 4 | Security Headers & CSP | Configure comprehensive security headers & strict CSP in `vercel.json` | DONE |
| 5 | Chatbot Input & Rate Bounds | Restore `MAX_MSGS = 20` and set `maxLength={500}` on query input in `ContactInterface.tsx` | DONE |
| 6 | Strict TypeScript & Dead Deps | Prune dead `postcss`/`autoprefixer` devDependencies and enable `"strict": true` in `tsconfig.json` | DONE |
| 7 | JSON-LD Script Escaping | Escape `<` in JSON-LD `<script>` tag in `components/common/SEO.tsx` | DONE |

## Exclusive Write Ownership
This milestone exclusively owns and modifies:
- `package.json`
- `package-lock.json`
- `vite.config.ts`
- `tsconfig.json`
- `vercel.json`
- `components/ContactInterface.tsx`
- `components/common/SEO.tsx`

## Verification Methods
1. `npm audit`: 0 vulnerabilities remaining.
2. `npx tsc --noEmit`: exits with code 0 under strict mode.
3. `npm run build`: builds in <10s with exit code 0.
4. Verify `javascript:` payloads in `MiniMarkdown` do not output executable `<a href="javascript:...">`.
