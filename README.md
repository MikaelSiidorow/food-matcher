# food-matcher

Find out what to eat with friends!

## Developing

Once you've created a project and installed dependencies with `pnpm install`, set up the database credentials:

1. Create a database on Planetscale
2. Copy `.env.example` to `.env` and fill the credentials
3. Migrate the database with `pnpm db:push`

After setting up the database, start the development server:

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev -- --open
```

## Building

To create a production version of your app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.

The production is automatically built and deployed from the main branch.
