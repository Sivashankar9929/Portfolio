# Portfolio Website

A modern personal portfolio for Katta Siva Shankar, built with HTML, CSS, and JavaScript.

## Overview

This portfolio showcases cloud, DevOps, and DevSecOps experience with a polished, animated landing page and profile card. The site is hosted from an Azure account and includes a live status page for ongoing availability and deployment monitoring.

## Live Demo

Hosted on Azure Static Web Apps / Azure App Service.

> Replace the link below with your actual production URL once available.

- Live site: `https://<your-azure-site>.azurestaticapps.net`
- Live status page: `https://<your-azure-status-page-url>`

## Built With

- HTML5
- CSS3
- JavaScript
- Azure Static Web Apps or Azure App Service for hosting

## Features

- Hero section with animated profile introduction
- Profile card with avatar and certifications
- Mobile-friendly navigation and responsive layout
- Dark-themed UI with custom gradients and card styles
- External links to GitHub, LinkedIn, email, and resume

## Project Structure

- `index.html` — main portfolio page
- `style.css` — layout, styling, and animations
- `script.js` — page behavior and interactive effects
- `Profile-Display.jpeg` — profile avatar image

## Local Development

1. Open the project folder in your code editor.
2. Open `index.html` in a browser.

If you want a local dev server, you can use any static server, for example:

```bash
npx http-server .
```

## Azure Deployment

This project can be deployed to Azure using one of the following options:

### Azure Static Web Apps

1. Push this repository to GitHub.
2. Create a new Static Web App in the Azure portal.
3. Connect the repository and branch.
4. Configure the build settings to use `app_location` = `/`, `api_location` = ``, and `output_location` = ``.
5. Deploy and note the generated site URL.

### Azure App Service or Azure Storage Static Website

1. Create a Static Web App, App Service, or Storage account in Azure.
2. Upload the site files from this folder.
3. Configure the custom domain if needed.

## Status Page & Monitoring

Keep an eye on uptime and deployment health using Azure's built-in monitoring tools or a dedicated status page service.

- Azure portal monitoring
- Azure Static Web Apps deployment logs
- Azure Application Insights (optional)

## Notes

Update the live demo and status page links once your Azure site is deployed.
