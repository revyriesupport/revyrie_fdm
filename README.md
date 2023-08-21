![Myntr](https://imgur.com/laewQrV.png)
# Shopify Base Theme

This is a modern Shopify theme built with Dawn v11.0.0, Vue.js, Tailwind CSS, and Vite. It also includes an integration with Shopify's Storefront API. This theme is designed to be performant and customizable, serving as a foundation for building bespoke Shopify themes.

## Requirements

- Node.js v18.14.2+
- Shopify CLI v3+
- Shopify Storefront API token

> :warning: Ensure a Storefront API token is created and stored in theme settings!

## Features

- Vue.js v3
- Tailwind CSS v3
- Vite build system
- Pinia store for state management
- Shopify Storefront API integration
- Responsive product slider
- Custom product card
- Linting and formatting with ESLint, Stylelint, and Prettier

## Initial Setup ##
1. Clone the repository
2. Run command `nvm use` (_or use Node.js v18.14.2_)
3. Install with command: `npm install`
4. Modify the `login` command in `package.json` to point to the correct store URL
5. Login to the Shopify store with command: `npm run login`
6. Create your development theme and start your dev server using command: `npm run start`
7. Run command `npm run shopify:settings:init` to copy the Theme Settings from the live theme to your development theme.

## Usage After Initial Setup ##
1. Run command `nvm use` (_or use Node.js v18.14.2_)
2. Login to the Shopify store with command: `npm run login`
3. Start your dev server using command: `npm run start`
4. Update `settings_data.json` if needed using command: `npm run shopify:settings:init`

## Docs
- [Myntr Base Theme](https://www.notion.so/myntr/Base-Theme-Documentation-e82148408fdd4cd59f281d0aa504dec7)
- [Shopify CLI](https://shopify.dev/themes/tools/cli)

## Shopify 'settings_data.json' Commands
| Task | Description |
| ---- | ----------- |
| `shopify:settings:init` | Downloads the `settings_data.json` file from the live theme and pushes it to your dev theme |
| `shopify:settings:dev` | Downloads the `settings_data.json` file from the remote dev theme |
| `shopify:settings:update` | Prompts you to choose a theme from which to download the `settings_data.json` file, then after downloading it, prompts you to select a theme to push it to |


## Deployment
1. Build and deploy to a *new* theme with command `npm run deploy:new`.
2. Build and deploy to an *existing* theme (eg. the QA theme) with command `npm run deploy`.

## Development Commands

Commands can be run with yarn or npm.

### Start the development server:

Runs both the Shopify development server and the Vite development server in watch mode:

```bash
start
```

### Linting and Formatting

Lint and format your code using the following commands:

```bash
lint
fix
```

### Deploy
Build and deploy to an existing theme:

```bash
deploy
```

Build and deploy to new, unpublished theme:

```bash
 deploy:new
```

Build the production assets:

```bash
vite:build
```