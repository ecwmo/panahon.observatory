# Panahon Website

## https://panahon.observatory.ph

### mirror: https://habagat.observatory.ph

## Pages

1. Weather QuickView
2. WRF Model
3. PH Climatology
4. Extreme Weather Reports

## Requirements

- graphicsmagick
- ghostscript
- node
- yarn

## Development

1. Clone the repo
2. Install dependencies (`yarn`)
3. Run development (`yarn dev`)

## Deployment

1. Build docker image (`yarn deploy:docker`)

## .env file

1. Create .env file with the following information:

- APP_HOST : localhost ip for your device
- APP_PORT : port you want to host the site
- APP_SITE : something
- APP_RES_DIR : path to public/resources
- MAPBOX_TOKEN : token from mapbox
- PUBLIC_API_URL : api where the data will be coming from
