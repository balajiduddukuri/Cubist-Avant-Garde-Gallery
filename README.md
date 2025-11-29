# Cubist Avant-Garde Gallery & Auction House

## Overview
This application is a React-based interactive digital gallery that uses the Google Gemini API to generate "Cubist Avant-Garde" artwork in real-time. It simulates a high-end NFT auction house environment, featuring algorithmic pricing, bidding systems, and procedural ambient audio.

## Features

### 1. AI Art Generation
- **Model**: Powered by Google's `gemini-2.5-flash-image`.
- **Prompt Engineering**: Uses a sophisticated prompt template (`constants.ts`) that strictly defines Cubist techniques (overlapping planes, deconstruction) while dynamically injecting Subjects and Color Periods.
- **Subjects**: A curated list of over 80 avant-garde and surrealist themes.

### 2. Auction House Simulation
The application wraps every generated image in a simulated commercial context:
- **Algorithmic Pricing**: Generates starting bids and current bids in ETH based on random "hype" factors.
- **Mock Metadata**: Creates fake Artist personas (e.g., "Vector Miró") and Bidder identities.
- **Live State**: Displays countdown timers, bid counts, and expert critic ratings.

### 3. Procedural Audio Engine
- Built with the **Web Audio API**.
- Generates a generative ambient soundscape using a chord of 5 oscillators.
- Mixes Sine waves (sub-bass) and Triangle waves (glassy mid-tones) to match the geometric visual aesthetic.
- Includes LFOs for subtle "breathing" amplitude modulation.

### 4. User Interface
- **Masonry Layout**: A custom flex-based grid that handles images of varying aspect ratios while maintaining chronological order.
- **Theming**: Fully supported Light ("Museum") and Dark ("Vernissage") modes.
- **Controls**: A floating control panel for commissioning pieces, toggling auto-play, and audio.
- **Settings**: Granular control over Subject and Period selection.

## Project Structure

- **`App.tsx`**: The main entry point. Handles global state (`galleryItems`, `theme`), the Audio Context, and the Auto-Curation `setTimeout` loop.
- **`services/geminiService.ts`**: Handles the API call to Gemini. This is also where the *Mock Auction Data* is generated to accompany the image.
- **`constants.ts`**: Contains the configuration for the art style. Edit `SUBJECTS`, `PERIODS`, or `BASE_PROMPT_TEMPLATE` here to change the artistic output.
- **`components/Gallery.tsx`**: The grid display component. Handles the entry animations and responsive layout.
- **`components/ArtModal.tsx`**: The detail view. Contains the "Auction Sidebar" with the simulated trading interface.

## Getting Started

1. **API Key**: Ensure `process.env.API_KEY` is set with a valid Google GenAI API key.
2. **Install**: `npm install`
3. **Run**: `npm start`
