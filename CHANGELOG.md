# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
