# Chatbot for Flight Information

## Overview

This application is a chatbot that provides users with real-time flight information through a conversational interface. It integrates with external APIs and uses a service account for secure access to flight data.

## Features

-   Real-time flight information retrieval
-   Natural language understanding via Dialogflow ES
-   Secure API access using service account credentials
-   Multi-step flight booking conversation flow
-   Chat UI built with React
-   Integration-ready with backend APIs for flight data

## Getting Started

This project contains only the frontend for the flight information chatbot, built with React.

### Prerequisites

-   Node.js (version 14 or higher)
-   npm or yarn

### Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <project-directory>
    ```

2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the Application

Start the development server:

```bash
npm run dev
```

## Configuration

-   Update API endpoint URLs in the environment configuration or as needed in the codebase to connect to your backend.

## Folder Structure

```
/src
  /components    # React components for chat UI
  /assets        # Images, icons, and styles
  /utils         # Utility functions and helpers
  App.js         # Main application entry point
  index.js       # ReactDOM render entry
```
