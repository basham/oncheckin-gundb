# OnCheckIn

Membership and event management software for [Blooming Fools Hash House Harriers](http://www.bfh3.com/).

## Dependencies

- [GUN](https://gun.eco/) for managing the distributed data storage.
- [Svelte](https://svelte.dev/) for building the user interface.
- [Snowpack](https://www.snowpack.dev/) for running the development environment.

## Install

Install dependencies.

```
npm install
```

## Scripts

Start the development environment.

```
npm run start
```

Build for production. Files export to the `./build` folder.

```
npm run build
```

## Testing

This project uses the [GUN SEA API](https://gun.eco/docs/SEA), which requires the use of the [WebCrypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API). Given the development environment is served with HTTP rather than HTTPS, it will only work over localhost and not the network. This means mobile testing with the development environment is currently not available.

To get this to work, it would involve [generating SSL certificates](https://www.snowpack.dev/guides/https-ssl-certificates), getting the [mobile device to trust the certificate](https://github.com/FiloSottile/mkcert#mobile-devices), and serving the GUN relay server over HTTPS/WSS.
