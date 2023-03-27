# Shopify Base Theme

A modern and flexible Shopify theme built with Vue.js, Tailwind CSS, and Vite by Myntr.

This base theme started from DAWN and includes an integration with Shopify's Storefront API. It's designed to be lightweight and easily customizable, serving as a starting point for building your own unique Shopify themes.

> :warning: It's important to configure the Storefront API access token in your theme settings. Make sure to add your token in theme settings.

## Features

- Vue.js 3
- Tailwind CSS v3
- Vite build system
- Pinia store for state management
- Shopify Storefront API integration
- Responsive product slider
- Custom product card
- Linting and formatting with ESLint, Stylelint, and Prettier

## Requirements

- Node.js v14 or higher
- Yarn or npm package manager
- Shopify CLI

## Installation

1. Clone this repository:

```bash
git clone https://github.com/myntr/shopify-base-theme.git
```

## Install dependencies:

```bash
cd shopify-base-theme
yarn install # or npm install
```

# Usage

## Development

1.- Start the development server:

```bash
yarn start
```

This command runs both the Shopify development server and the Vite development server in watch mode.

## Linting and Formatting

Lint and format your code using the following commands:

```bash
yarn lint
yarn fix
```

## Deployment

Build the production assets:

```bash
yarn vite:build
```

## Deploy the theme to your Shopify store:

```bash
yarn deploy
```

To deploy the theme as a new unpublished theme, use the following command:

```bash
yarn deploy:new
```
