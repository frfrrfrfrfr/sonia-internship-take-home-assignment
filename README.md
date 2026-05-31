# Sonia Growth Internship - Viral Shorts Intelligence Agent

This repository contains the Next.js source code for the **Viral Mental Health Shorts Intelligence Agent**, a submission for the Engineering Track of the Sonia Growth Internship.

## Project Overview

The Viral Shorts Agent is a lightweight, AI-powered automation workflow designed to scan YouTube Shorts, Instagram Reels, and TikTok for high-performing mental health/wellness content. It extracts key virality signals (hooks, CTAs, psychological drivers) to generate replication blueprints.

### Sonia Trust & Wellness Guardrails Embedded

This agent has been explicitly tailored to enforce Sonia's product identity:
- **General Wellness Focus**: Analyzes terms like "mindful mornings" and "gentle self care" instead of clinical diagnosis terms.
- **Safety Filtering**: The Claude AI system prompt is strictly configured to flag any shorts that make medical claims, promise to "cure" panic attacks/depression, or use crisis-targeting. Such videos are given a `0/100` Virality Score and highlighted with a warning.

## Architecture

- **Frontend**: Next.js App Router (React), styled with Tailwind CSS and animated using Framer Motion for a premium, dynamic dashboard experience.
- **Backend API Routes**:
  - `/api/fetch-videos`: Designed to interface with the YouTube Data API and RapidAPI. (Currently falls back to simulated fetching if no API keys are provided in `.env`).
  - `/api/analyze-virality`: Integrates with the Anthropic `@anthropic-ai/sdk` to pass video metadata to Claude 3 Haiku, dynamically generating Hook Types, Virality Scores, and CTAs. (Falls back gracefully if no API key is provided).

## Running the App Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup (Optional but Recommended)
Copy the example environment file:
```bash
cp .env.example .env.local
```
Add your Anthropic, YouTube, or RapidAPI keys if you'd like to test the live API connections.

*Note: If you run without keys, the app will gracefully fallback to simulated API responses so you can still review the UX and logic.*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Next Steps / Production Roadmap
- Connect secure OAuth flows for direct video posting.
- Enhance the AI with a deeper contextual window (e.g. feeding top 50 comments per video to Claude for sentiment analysis).
- Deploy via Vercel for continuous internal use.
