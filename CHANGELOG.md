# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-06-05

### Added
- **ViLife `web_sota` (FastMCP 3.2)**: Fleet-standard pages — Dashboard, Chat, Skills, Tools, Settings, Help, Apps, Logs.
- **Switchable LLM providers**: Ollama, LM Studio, and OpenAI (API key) with per-provider model dropdown in Settings.
- **Vienna chat preprompts**: Six chips on `/chat` backed by `VIENNA_SYSTEM_PREPROMPT`.
- **Bundled Vienna skills**: `vienna-life`, `vienna-alsergrund`, `vienna-transit`, `vienna-kaffeehaus`, `vienna-kultur`, `vienna-shopping`.
- **`vienna_life` MCP**: Portmanteau tool, resources, prompts, skills provider, agentic sampling at `/mcp`.

### Changed
- **Ports**: Frontend **10988**, backend + MCP **10922** (`web_sota/start.ps1`, strict Vite port).
- **Capabilities API**: Live introspection of tools, prompts, resources, skills from mounted MCP.
- **Fleet manifest**: ViLife on 10922; `vienna-live-mcp` deprecated (redirect to ViLife).

### Fixed
- **Tailwind / layout**: Added `tailwind.config.js` + `postcss.config.js`; sidebar offset (`ml-64`) for main content.
- **Resource URI bug**: `AnyUrl` coerced to `str` for capabilities skills/resources flags.

## [1.1.0] - 2026-04-04

### Added
- **SOTA 2026 Web Interface**: Complete rewrite of the frontend using Vite, React, and glassmorphism aesthetics.
- **KaffeehausHub**: Specialized Vienna coffee house exploration with categorization and interactive maps.
- **ShoppingOffers**: Real-time grocery discount tracking for Spar and Billa.
- **Mobile-Responsive Design**: Grid layouts and collapsible navigation for all screen sizes.

### Changed
- **Unified Branding**: Updated all pages to use the "Vienna Life Assistant" design tokens and HSL palettes.
- **Performance Optimization**: Pruned unused imports across core pages (`ShoppingOffers.tsx`, `KaffeehausHub.tsx`, `ConcertHall.tsx`).
- **ConcertHall Logic**: Fixed missing `Clock` icon import from `lucide-react`.

### Fixed
- **Accessibility Hardening**: Added discernible text (`title` attributes) to icon-only action buttons in the shopping list UI.
- **Dark Mode Selection**: Standardized selection colors and contrast ratios for OLED displays.

## [1.0.0] - 2025-12-03

### Added
- Initial release with backend scrapers and basic React frontend.
- Spar/Billa scraper integration.
- Ollama LLM support.
