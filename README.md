# Tecno Zone Discovery

Two static pages plus one Vercel serverless function.

```
index.html        opt-in form
discovery.html    video page shown after submit
api/subscribe.js  adds the visitor to MailerLite
```

## Environment variables (Vercel > Project > Settings > Environment Variables)

| Name | Value |
|---|---|
| `MAILERLITE_API_KEY` | MailerLite > Integrations > API |
| `MAILERLITE_GROUP_APP` | ID of your "App" group |
| `MAILERLITE_GROUP_LINKEDIN` | ID of your "LinkedIn" group |

MailerLite's API takes group IDs, not names. Find them in Subscribers > Groups.

## Edit before publishing

- `discovery.html`: set `VIDEO_EMBED_URL_APP`, `VIDEO_EMBED_URL_LINKEDIN`, `BOOKING_URL` in the config block.
- MailerLite: create the two groups, then an automation with trigger "subscriber joins a group" that sends the welcome email.

## Deploy

1. Push this folder to a GitHub repo.
2. In Vercel, Add New > Project > import the repo.
3. Framework preset: **Other**. No build command.
4. Add the three environment variables, then deploy (redeploy after adding them).
