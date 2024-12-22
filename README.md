# sparc-judging-app

A web app for judging combat robot matches based on [SPARC Judging Guidelines v1.2](https://sparc.tools/SPARC_Judging_Guidelines_v1.2.pdf).

## Development

This project uses [TanStack Start](https://tanstack.com/start) (fullstack React framework), deployed to [Vercel](https://vercel.com).

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (version 18.12.1 or higher)
- [pnpm](https://pnpm.io/installation)

### Installation

```sh
git clone https://github.com/jasonappah/sparc-judging-app.git
cd sparc-judging-app
pnpm install
```

### Running the app

```sh
pnpm dev
```

This will start the development server.

### Running the app in production

```sh
pnpm build
pnpm start
```

This will build the app for production to the `dist` directory and start the server.

## Future work/ideas

- semver versioning + changelog?
- add glossary for clarification of judging terminology
- support synced scoring sessions between multiple judges
- integrate with Challonge to pull next matches + send final results to Challonge
- link to SPARC Judging Guidelines PDF
- support SPARC Damage, Control, and Aggression Criteria
- printable version of a judging sheet
