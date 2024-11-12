# Apex Legends Server Status Discord Bot

A Discord bot that provides real-time status updates for Apex Legends servers across different regions. The bot displays server status, response times, and Apex Predator rank thresholds for all platforms.

## Features

- Real-time server status monitoring for multiple regions:
  - US-East
  - US-Central
  - US-West
  - EU-East
  - EU-West
  - South America
  - Asia

- Status information for various services:
  - [Crossplay] Apex Login
  - EA Login
  - EA Accounts
  - Lobby & Matchmaking Services

- Apex Predator rank threshold tracking for all platforms:
  - PC (Steam / EA App)
  - PlayStation
  - Xbox
  - Switch

- Auto-updating status message every 60 seconds
- Visual status indicators using emojis (🟢 UP, 🟡 SLOW, ⭕ DOWN)
- Response time monitoring in milliseconds
- Error handling with automatic retries

## Prerequisites

- Node.js
- Discord.js
- A Discord Bot Token
- An Apex Legends API Key from [Apex Legends Status](https://apexlegendsstatus.com)

## Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd apex-legends-status-bot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DISCORD_TOKEN=your_discord_bot_token
APEX_API_KEY=your_apex_api_key
CHANNEL_ID=your_discord_channel_id
```

4. Start the bot:
```bash
node index.js
```

## Configuration

The bot can be configured by modifying the following parameters in `index.js`:
- `maxRetries`: Maximum number of retry attempts for failed API calls (default: 3)
- Status update interval: Currently set to 60 seconds
- API timeout: Set to 5000ms (5 seconds)

## Error Handling

The bot includes comprehensive error handling:
- Automatic retry mechanism for failed API calls
- Error notifications in Discord when status updates fail
- Rate limit handling with delays between API calls
- Duplicate update prevention

## Credits

Data provided by [Apex Legends Status](https://apexlegendsstatus.com)
