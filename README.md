# Flight status application

## What is it?

Flight status tracking

This repository contains the frontend for an application that allows users to search for their flights, and track the flight status for changes.

## How it's built

The frontend of this project is built using React for the user interface and Vite as the build tool & development server. Styled using Tailwind CSS, the frontend uses `supabase-js` to query the corresponding Supabase project which serves as the [backend](https://github.com/jordanholtdev/status-app-supabase) of this project.

## Functionality

-   Website allows users to sign-up & authenticate using OAuth 2.0 via Supabase providers. Google & Github enabled - others can be added.
-   Users can search for, select, add, delete & track specific flights available from the [FlightAware Aero API](https://flightaware.com/commercial/aeroapi/).
-   The application updates user selected flights on a regular schedule to retrieve the latest status updates.
-   Users can schedule future flights and the application will retrieve the information and notify user when it becomes available.
-   Users can update their profile, view status updates & delete tracked flights.
-   Realtime in-app notifications allow users to receive the latest updates.

## Technologies

-   [React](https://react.dev/): Frontend user interface
-   [Vite](https://vitejs.dev/): Tooling & development server
-   [Supabase Javascript Client Library](https://supabase.com/docs/reference/javascript/installing): Open source Firebase althernative. Database, authentication & webhooks
-   [Tailwind CSS](https://tailwindcss.com/): CSS framework
-   [OAuth 2.0](https://oauth.net/2/): Authorization protocol
-   [React Router](https://reactrouter.com): Client routing
-   [ESLint](https://eslint.org): Static code linting
-   [Github Actions](https://docs.github.com/en/actions): Build & deploy application
-   [Amazon Elastic Container Registry](https://aws.amazon.com/ecr/)

## Getting Started - Develop

### Prerequisites

-   [Node.js](https://nodejs.org/) - version v18.14.2 or higher
-   `env.development.local` file with the following environment variables:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Installation

1. Clone the repository: `git clone https://github.com/jordanholtdev/status-app.git`
2. Install the dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Open web browser and navigate to: http://localhost:5173/

### Deployment

This repository uses Github Actions to build the application container and push the container to AWS ECR. When changes are pushed to the main branch the action builds and pushes the container to ECR.

1. Configure AWS Credentials & AWS ECR to use the following actions:

-   [Configure AWS Credentials for GitHub Actions](https://github.com/aws-actions/configure-aws-credentials#configure-aws-credentials-for-github-actions)
-   [Amazon ECR "Login" Action for GitHub Actions](https://github.com/aws-actions/amazon-ecr-login#aws-credentials)

2. Configure your repository Github Secrets according to your requirements. Example:

```
AWS_REGION
AWS_ROLE
ECR_REPO_NAME
VITE_SUPABASE_ANON_KEY
VITE_SUPABASE_URL
```

3. When changes are pushed to the main branch the action builds the docker container and pushes the container to ECR where it can then be deployed.
