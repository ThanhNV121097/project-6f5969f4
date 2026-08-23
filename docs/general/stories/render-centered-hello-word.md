# Story — Render centered Hello Word

## User story
As a Guest, I want to see the stored greeting centered on the page, so that I can confirm frontend reads data from backend.

## In scope
- Public main screen for `general`
- Page requests greeting from backend API
- Page renders returned text from storage
- White background, black text, centered horizontally and vertically
- Empty/error state when API or database cannot provide greeting

## Out of scope
- Editing greeting from browser
- Multiple pages, navigation, authentication, or other controls
- Animation, decoration, or extra copy beyond the single greeting/error state

## UI scope
- Main screen only, matching approved design for a single centered static message on white background
- States: default greeting and error state
- No interactive controls, no focusable elements, no motion

## Acceptance criteria
1. Given backend returns `Hello Word`, when guest opens page, then page shows `Hello Word`.
2. Given frontend source has no hardcoded greeting, when guest opens page, then shown text comes from API response.
3. Given page loads in any viewport size, when guest opens page, then greeting is centered horizontally and vertically.
4. Given page loads, when guest views page, then background is white, text is black, and no animation or extra controls appear.
5. Given backend or database is unavailable, when guest opens page, then page shows an error state instead of blank content.

## Dependencies
- `Persist and serve text` story must land first for API and database storage.
- PostgreSQL must be available.
- Backend API contract must exist for greeting retrieval.
