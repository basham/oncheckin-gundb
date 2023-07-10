<script>
	import { route, org } from '@src/data.js';
	import { APP_NAME } from '@src/constants.js';
	import NavLink from '@src/lib/nav-link.svelte';
	import Layout from '@src/pages/page.svelte';

	const location = route.split('/').slice(2).join('/');
</script>

<Layout>
	<header class="u-border-bottom a2">
		<div class="layout-content lc2">
			<div class="header">
				<a class="icon-link" href="/orgs">
					<img alt={APP_NAME} class="logo" src="/icon.svg" />
				</a>
				<span class="u-flex-grow">
					<a class="link u-text-bold u-ts-2x" href={org.url}>{org.name}</a>
				</span>
				<nav aria-label="Organization" class="list-plain list-plain--inline u-m-top-4x u-p-bottom-4x u-gap-4">
					<NavLink href={org.url} id="events" {location}>Events</NavLink>
					<NavLink
						href={`${org.url}participants/`}
						id="participants"
						{location}
					>
						Hashers
					</NavLink>
					<NavLink href={`${org.url}settings/`} id="settings" {location}>
						Settings
					</NavLink>
				</nav>
			</div>
		</div>
	</header>
	<header class="u-border-bottom" hidden>
		<div class="layout-content">
			<nav aria-label="Organization" class="list-plain list-plain--inline u-gap-4">
				<NavLink href={org.url} id="events" {location}>Events</NavLink>
				<NavLink
					href={`${org.url}participants/`}
					id="participants"
					{location}
				>
					Hashers
				</NavLink>
				<NavLink href={`${org.url}settings/`} id="settings" {location}>
					Settings
				</NavLink>
			</nav>
		</div>
	</header>
	<main class="layout-content u-p-bottom-6">
		<slot />
	</main>
</Layout>

<style>
	.icon-link {
		border-radius: 100%;
		display: flex;
	}

	.a1 {
		background-color: var(--color-base-20);
		color: var(--color-base-75);
	}

	.a2 {
		_background-color: var(--color-base-70);
	}

	.a1 .layout-content,
	.lc2 {
		_padding: calc(var(--size-2) - var(--px-2)) var(--size-4);
		_padding: var(--size-2) var(--size-4);
	}

	.lc2 nav a {
		font-weight: normal !important;
	}

	.header {
		align-items: center;
		display: flex;
		flex-wrap: wrap;
		gap: var(--size-4);
	}

	.logo {
		--size: 2.5rem;
		height: var(--size);
		width: var(--size);
	}

	.logo-link {
		color: inherit;
		text-decoration: none;
	}

	.logo-link:hover {
		text-decoration: underline;
	}

	.link {
		color: inherit;
		text-decoration: none;
	}

	.link:hover {
		text-decoration: underline;
	}

	.breadcrumbs li:not(:last-child)::after {
		color: var(--color-base-15);
		content: '/';
		margin-left: var(--size-4);
	}

	.breadcrumbs a {
		color: inherit;
		text-decoration: none;
	}

	.breadcrumbs a:hover {
		_color: var(--color-base-15);
		text-decoration: underline;
	}
</style>
