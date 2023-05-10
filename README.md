# Flight status tracking application

## What is it?

Flight status tracking

This repository contains the frontend for an application that allows users to search for their flights, and track the status for changes.

## How it's built

The frontend of this project is built using React for the user interface and Vite as the build tool & development server. The frontend uses `supabase-js` to query the corresponding Supabase project which servers as the [backend](https://github.com/jordanholtdev/status-app-supabase) of this project.

## Functionality

-   Website allows users to sign-up and authenticate via OAuth 2.0.
-   Users can search for, select & track flight information pulled from the [FlightAware Aero API](https://flightaware.com/commercial/aeroapi/).
-   The application updates tracked flight information & performs automatic search for flights scheduled in the future.
-   Users can update their profile, view status updates & delete tracked flights.

## Technologies

-   [React](https://react.dev/): Frontend user interface
-   [Vite](https://vitejs.dev/): Tooling & development server
-   [Supabase](https://supabase.com/): Open source Firebase althernative. Database, authentication & webhooks
-   [Tailwind CSS](https://tailwindcss.com/): CSS framework
-   [OAuth 2.0](https://oauth.net/2/): Authorization protocol
-   [React Router](https://reactrouter.com): client routing
-   [ESLint](https://eslint.org)
-   [Github Actions](https://docs.github.com/en/actions): Build & deploy application

## Getting Started - Develop

### Prerequisites

-   [Node.js](https://nodejs.org/) - version v18.14.2 or higher
-   `env.development.local` file with the following environment variables:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Installation

1. Clone the repository: `git clone https://github.com/[username]/[repository-name].git`
2. Install the dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open web browser and navigate to: http://localhost:5173/

### Deployment

This repository uses Github actions to build the application container and push the container to AWS ECR. When changes are pushed to the main branch the action builds and pushes the container to ECR.

1. Configure your repository with the following Github Secrets:

```
AWS_REGION
AWS_ROLE
ECR_REPO_NAME
VITE_SUPABASE_ANON_KEY
VITE_SUPABASE_URL
```

2. Configure AWS to allow `aws-actions/amazon-ecr-login@v1` access to ECR
3. When changes are pushed to the main branch the action builds and pushes the container to ECR.
