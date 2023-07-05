import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from './routing.js';

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

self.addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		self.skipWaiting();
	}
});

// Only dev mode supports globbing in workers.
// Until that is enabled, eager imports is a manual process.
// const modules = import.meta.glob('./pages/**/*.js', { eager: true });
import * as __vite_glob_0_0 from './pages/api/account.json.js';
import * as __vite_glob_0_1 from './pages/api/accounts/$accountId.json.js';
import * as __vite_glob_0_2 from './pages/api/device.json.js';
import * as __vite_glob_0_3 from './pages/api/id.json.js';
import * as __vite_glob_0_4 from './pages/api/orgs/$org.json.js';
import * as __vite_glob_0_5 from './pages/api/orgs/$org/events.json.js';
import * as __vite_glob_0_6 from './pages/join/$code.js';
import * as __vite_glob_0_7 from './pages/orgs/$org/delete.js';
import * as __vite_glob_0_8 from './pages/orgs/$org/event-count.js';
import * as __vite_glob_0_9 from './pages/orgs/$org/events/$event/check-ins/$participant/edit.js';
import * as __vite_glob_0_10 from './pages/orgs/$org/events/$event/check-ins/new.js';
import * as __vite_glob_0_11 from './pages/orgs/$org/events/$event/checkpoint.js';
import * as __vite_glob_0_12 from './pages/orgs/$org/events/$event/circle.js';
import * as __vite_glob_0_13 from './pages/orgs/$org/events/$event/edit.js';
import * as __vite_glob_0_14 from './pages/orgs/$org/events/$event/index.js';
import * as __vite_glob_0_15 from './pages/orgs/$org/events/$event/roster.js';
import * as __vite_glob_0_16 from './pages/orgs/$org/events/new.js';
import * as __vite_glob_0_17 from './pages/orgs/$org/events/year/$year.js';
import * as __vite_glob_0_18 from './pages/orgs/$org/index.js';
import * as __vite_glob_0_19 from './pages/orgs/$org/participants/$participant/edit.js';
import * as __vite_glob_0_20 from './pages/orgs/$org/participants/$participant/hares.js';
import * as __vite_glob_0_21 from './pages/orgs/$org/participants/$participant/index.js';
import * as __vite_glob_0_22 from './pages/orgs/$org/participants/index.js';
import * as __vite_glob_0_23 from './pages/orgs/$org/participants/new.js';
import * as __vite_glob_0_24 from './pages/orgs/$org/rename.js';
import * as __vite_glob_0_25 from './pages/orgs/$org/settings.js';
import * as __vite_glob_0_26 from './pages/orgs/$org/share.js';
import * as __vite_glob_0_34 from './pages/orgs/add.js';
import * as __vite_glob_0_32 from './pages/orgs/code.js';
import * as __vite_glob_0_28 from './pages/orgs/import.js';
import * as __vite_glob_0_29 from './pages/orgs/index.js';
import * as __vite_glob_0_30 from './pages/orgs/new.js';
import * as __vite_glob_0_33 from './pages/orgs/scan.js';
import * as __vite_glob_0_27 from './pages/sync/$orgId.js';
import * as __vite_glob_0_31 from './pages/start.js';
const modules = {
	'./pages/api/account.json.js': __vite_glob_0_0,
	'./pages/api/accounts/$accountId.json.js': __vite_glob_0_1,
	'./pages/api/device.json.js': __vite_glob_0_2,
	'./pages/api/id.json.js': __vite_glob_0_3,
	'./pages/api/orgs/$org.json.js': __vite_glob_0_4,
	'./pages/api/orgs/$org/events.json.js': __vite_glob_0_5,
	'./pages/join/$code.js': __vite_glob_0_6,
	'./pages/orgs/$org/delete.js': __vite_glob_0_7,
	'./pages/orgs/$org/event-count.js': __vite_glob_0_8,
	'./pages/orgs/$org/events/$event/check-ins/$participant/edit.js':
		__vite_glob_0_9,
	'./pages/orgs/$org/events/$event/check-ins/new.js': __vite_glob_0_10,
	'./pages/orgs/$org/events/$event/checkpoint.js': __vite_glob_0_11,
	'./pages/orgs/$org/events/$event/circle.js': __vite_glob_0_12,
	'./pages/orgs/$org/events/$event/edit.js': __vite_glob_0_13,
	'./pages/orgs/$org/events/$event/index.js': __vite_glob_0_14,
	'./pages/orgs/$org/events/$event/roster.js': __vite_glob_0_15,
	'./pages/orgs/$org/events/new.js': __vite_glob_0_16,
	'./pages/orgs/$org/events/year/$year.js': __vite_glob_0_17,
	'./pages/orgs/$org/index.js': __vite_glob_0_18,
	'./pages/orgs/$org/participants/$participant/edit.js': __vite_glob_0_19,
	'./pages/orgs/$org/participants/$participant/hares.js': __vite_glob_0_20,
	'./pages/orgs/$org/participants/$participant/index.js': __vite_glob_0_21,
	'./pages/orgs/$org/participants/index.js': __vite_glob_0_22,
	'./pages/orgs/$org/participants/new.js': __vite_glob_0_23,
	'./pages/orgs/$org/rename.js': __vite_glob_0_24,
	'./pages/orgs/$org/settings.js': __vite_glob_0_25,
	'./pages/orgs/$org/share.js': __vite_glob_0_26,
	'./pages/orgs/add.js': __vite_glob_0_34,
	'./pages/orgs/code.js': __vite_glob_0_32,
	'./pages/orgs/import.js': __vite_glob_0_28,
	'./pages/orgs/index.js': __vite_glob_0_29,
	'./pages/orgs/new.js': __vite_glob_0_30,
	'./pages/orgs/scan.js': __vite_glob_0_33,
	'./pages/sync/$orgId.js': __vite_glob_0_27,
	'./pages/start.js': __vite_glob_0_31,
};

// Reverse the list of modules so dynamic `$key` folders and files are resolved last.
for (const [url, module] of Object.entries(modules).reverse()) {
	const path = url.replace(/^\.\/pages/, '').replace(/\.js$/, '');
	registerRoute(path, module);
}
