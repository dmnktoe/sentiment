# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0](https://github.com/dmnktoe/sentiment/compare/v1.1.0...v1.2.0) (2026-05-27)

### Features

- **consent:** Add c15t cookie consent with custom UI and Umami analytics integration ([05352e9](https://github.com/dmnktoe/sentiment/commit/05352e9))
- **newsletter:** Migrate newsletter system to listmonk with ALTCHA captcha ([2a2132c](https://github.com/dmnktoe/sentiment/commit/2a2132c))
- **exhibition:** Add exhibition rewrites and mobile navigation ([63a154f](https://github.com/dmnktoe/sentiment/commit/63a154f))

### Bug Fixes

- Fix nav height flicker on theme toggle hydration ([903c89c](https://github.com/dmnktoe/sentiment/commit/903c89c))
- Close mobile nav on link click, escape key, and outside click ([725f39e](https://github.com/dmnktoe/sentiment/commit/725f39e))
- Show mobile nav dropdown ([d677d92](https://github.com/dmnktoe/sentiment/commit/d677d92))
- **newsletter:** Avoid double opt-in emails ([0b19550](https://github.com/dmnktoe/sentiment/commit/0b19550))
- **newsletter:** Harden listmonk/altcha integration and UUID query ([122c17b](https://github.com/dmnktoe/sentiment/commit/122c17b))
- Proxy exhibition `/api/events` and `/public` assets ([d258f98](https://github.com/dmnktoe/sentiment/commit/d258f98))
- Restore Link import for cookie policy references ([87d7905](https://github.com/dmnktoe/sentiment/commit/87d7905))

### Refactoring

- Remove Vercel, prepare for self-hosted Coolify deployment ([a4f69f8](https://github.com/dmnktoe/sentiment/commit/a4f69f8))
- Update privacy policy to reference Hetzner Germany hosting ([e6e8a5a](https://github.com/dmnktoe/sentiment/commit/e6e8a5a))
- Clean up newsletter system and centralize environment variables ([756fc8f](https://github.com/dmnktoe/sentiment/commit/756fc8f))
- Remove confirm/unsubscribe routes from newsletter ([257f6db](https://github.com/dmnktoe/sentiment/commit/257f6db))
- Remove Dockerfile and .dockerignore ([08f04ec](https://github.com/dmnktoe/sentiment/commit/08f04ec))

### Maintenance

- Migrate to Tailwind CSS v4 ([2484bd2](https://github.com/dmnktoe/sentiment/commit/2484bd2))
- Upgrade TypeScript to 6.0.3 ([74c3c59](https://github.com/dmnktoe/sentiment/commit/74c3c59))
- Upgrade ALTCHA to widget v3 and lib v2 ([7ee5c0f](https://github.com/dmnktoe/sentiment/commit/7ee5c0f))
- Update `@c15t/nextjs` to v2.1.0 with built-in Umami integration ([ac1f59e](https://github.com/dmnktoe/sentiment/commit/ac1f59e))
- Upgrade Next.js to v16.2.x
- Upgrade React to v19.2.x
- Various dependency updates via Renovate

## [1.1.0](https://github.com/dmnktoe/sentiment/compare/v1.0.3...v1.1.0) (2026-02-05)

### Features

- **newsletter:** Implement production-ready ALTCHA server with GDPR-compliant newsletter system and branded emails ([#203](https://github.com/dmnktoe/sentiment/pull/203))
- **newsletter:** Newsletter feature ([#204](https://github.com/dmnktoe/sentiment/pull/204))

### Maintenance

- Upgrade Node.js to v24 ([#171](https://github.com/dmnktoe/sentiment/pull/171))
- Upgrade commitlint monorepo to v20 ([#143](https://github.com/dmnktoe/sentiment/pull/143), [#180](https://github.com/dmnktoe/sentiment/pull/180))
- Upgrade actions/checkout to v6 ([#186](https://github.com/dmnktoe/sentiment/pull/186))
- Upgrade actions/setup-node to v6 ([#157](https://github.com/dmnktoe/sentiment/pull/157))
- Upgrade Next.js to v15.5.x
- Upgrade React to v19.2.x
- Various dependency updates via Renovate

**Full Changelog**: https://github.com/dmnktoe/sentiment/compare/v1.0.3...v1.1.0

## [1.0.3](https://github.com/dmnktoe/sentiment/compare/v1.0.2...v1.0.3) (2025-10-16)

### Bug Fixes

- Article sorting after `createdAt` ([#159](https://github.com/dmnktoe/sentiment/pull/159))

### Improvements

- Visual and content updates ([#65](https://github.com/dmnktoe/sentiment/pull/65))
- Update team page SEO title and description ([#66](https://github.com/dmnktoe/sentiment/pull/66))

### Maintenance

- Upgrade ESLint to v9 ([#27](https://github.com/dmnktoe/sentiment/pull/27))
- Upgrade Node.js to v22 ([#109](https://github.com/dmnktoe/sentiment/pull/109))
- Upgrade pnpm to v10 ([#110](https://github.com/dmnktoe/sentiment/pull/110))
- Upgrade actions/checkout to v5 ([#111](https://github.com/dmnktoe/sentiment/pull/111))
- Upgrade actions/setup-node to v5 ([#128](https://github.com/dmnktoe/sentiment/pull/128))
- Upgrade commitlint monorepo to v20 ([#143](https://github.com/dmnktoe/sentiment/pull/143))
- Upgrade Next.js to v15.5.x
- Various dependency updates via Renovate

**Full Changelog**: https://github.com/dmnktoe/sentiment/compare/v1.0.2...v1.0.3

## [1.0.2](https://github.com/dmnktoe/sentiment/compare/v1.0.1...v1.0.2) (2025-06-15)

### Features

- **ci:** Add Playwright e2e testing ([#38](https://github.com/dmnktoe/sentiment/pull/38))

### Maintenance

- Upgrade tailwind-merge to v3 ([#34](https://github.com/dmnktoe/sentiment/pull/34))
- Upgrade lint-staged to v16 ([#31](https://github.com/dmnktoe/sentiment/pull/31))
- Various dependency updates via Renovate

**Full Changelog**: https://github.com/dmnktoe/sentiment/compare/v1.0.1...v1.0.2

## [1.0.1](https://github.com/dmnktoe/sentiment/compare/v1.0.0...v1.0.1) (2025-06-12)

### Features

- **ci:** Improve continuous integration with Jest testing suite ([#25](https://github.com/dmnktoe/sentiment/pull/25))

### Maintenance

- Upgrade Node.js to v22 ([#16](https://github.com/dmnktoe/sentiment/pull/16))
- Upgrade eslint-config-prettier to v10 ([#28](https://github.com/dmnktoe/sentiment/pull/28))
- Upgrade eslint-plugin-simple-import-sort to v12 ([#29](https://github.com/dmnktoe/sentiment/pull/29))

**Full Changelog**: https://github.com/dmnktoe/sentiment/compare/v1.0.0...v1.0.1

## [1.0.0](https://github.com/dmnktoe/sentiment/releases/tag/v1.0.0) (2025-04-10)

### Features

- Add Tailwind CSS ([#8](https://github.com/dmnktoe/sentiment/pull/8))
- Add basic files for block renderer ([#12](https://github.com/dmnktoe/sentiment/pull/12))
- Create paragraph component ([#15](https://github.com/dmnktoe/sentiment/pull/15))
- Make homepage content dynamic ([#18](https://github.com/dmnktoe/sentiment/pull/18))
- First stable version ([#24](https://github.com/dmnktoe/sentiment/pull/24))

### Bug Fixes

- Visual grid and container width ([#13](https://github.com/dmnktoe/sentiment/pull/13))

**Full Changelog**: https://github.com/dmnktoe/sentiment/commits/v1.0.0
