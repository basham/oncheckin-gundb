# OnCheckIn

Membership and event management software for [Blooming Fools Hash House Harriers](http://www.bfh3.com/).

## Dependencies

- [GunDB](https://gun.eco/) for managing the distributed data storage.
- [Svelte](https://svelte.dev/) for building the user interface.
- [Snowpack](https://www.snowpack.dev/) for running the development environment.

## Install

Install dependencies.

```
npm install
```

[Generate SSL certificates](https://www.snowpack.dev/guides/https-ssl-certificates) with [mkcert](https://github.com/FiloSottile/mkcert). This is needed to use IndexedDB for local storage.

```
mkcert -install && mkcert -key-file snowpack.key -cert-file snowpack.crt localhost
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
