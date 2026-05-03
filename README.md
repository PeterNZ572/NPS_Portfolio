# Atomic Rentals NPS Console

Portfolio showcase app for a Net Promoter Score workflow in a rental car business.

## Overview

This project is a React + TypeScript demo that simulates:

- demo login access
- NPS dashboard reporting with filters
- seeded customer survey records
- pending surveys that have not been answered yet
- customer survey preview and submission flow
- email template management for survey requests and feedback replies
- user management with admin flags
- CSV export for filtered feedback data

The UI is branded for **Atomic Rentals** and uses the provided logo and primary color `#2F8BFF`.

## Main Features

### Login

- Any username/password combination is accepted
- Intended only for demo and portfolio presentation

### Dashboard

- NPS summary cards
- promoter / passive / detractor breakdown
- filters for:
  - pickup location
  - drop off location
  - booking source
  - vehicle
  - NPS segment

### Feedback Data

- compact table view of survey records
- expandable detail view for each record
- seeded completed and pending surveys
- one-time staff reply workflow for completed surveys
- CSV export for the currently filtered data

### Settings

- **Email Survey** sub-tab
  - edit the outbound NPS survey email HTML
  - live preview of the email
  - survey preview flow that opens a simulated customer survey

- **Survey Reply** sub-tab
  - edit separate reply templates for:
    - promoter
    - passive
    - detractor
  - uses the `{{staffcomments}}` placeholder inline in the email body
  - live preview for each reply template

### Users

- add and edit users
- set default location
- mark user as admin
- reset password demo action

## Tech Stack

- React
- TypeScript
- Vite
- Plain CSS

## Getting Started

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Demo Flows

### Submit a survey response

1. Open **Settings**
2. Stay on **Email Survey**
3. Click **Survey Preview**
4. Choose a score and submit comments
5. The response is added into the in-memory demo system

### Reply to completed feedback

1. Open **Feedback Data**
2. Expand a completed survey
3. Choose a reply template
4. Enter staff comments
5. Click **Send reply**

Each feedback record allows only one stored reply.

## Notes

- Data is stored in local app state for the demo session
- There is no backend or real authentication
- Email sending and password reset are simulated UI flows

