/** @format */

/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import analytics from 'lib/analytics';

let deferredPrompt;

export function init() {
	// disable push notifications to install the app
	window.addEventListener( 'load', () => {
		if ( navigator.getInstalledRelatedApps ) {
			const sw = navigator.serviceWorker.ready;

			navigator
				.getInstalledRelatedApps()
				.then( apps => ( apps.length > 0 ? sw.then( reg => reg.pushManager ) : undefined ) )
				.then( pushManager => {
					if ( pushManager ) {
						pushManager.unsubscribe();
					}
				} );
		}
	} );

	// delay prompt to install the app
	window.addEventListener( 'beforeinstallprompt', event => {
		// Prevent Chrome 67 and earlier from automatically showing the prompt
		event.preventDefault();
		deferredPrompt = event;
	} );
}

// Check if calypso is allowed to boot offline
// see `client/lib/service-worker/service-worker.js`
function canBootOffline() {
	let downlink = 1;

	if ( process.env.NODE_ENV === 'production' ) {
		return Promise.reject();
	}

	if ( 'connection' in navigator && 'downlink' in navigator.connection ) {
		downlink = navigator.connection.downlink;
	}

	// Do not cache assets if bandwidth is less than 10Mb/s
	if ( downlink < 10 ) {
		return Promise.reject();
	}

	if ( 'storage' in navigator && 'estimate' in navigator.storage ) {
		return navigator.storage.estimate().then( function( storageEstimate ) {
			// Do not cache assets if browser has less than 150 MB available for the app
			// Note that private browsing quota may be too limited for calypso to be cached entirely,
			// especially in development
			if ( storageEstimate.quota < 150 * 1000000 ) {
				return Promise.reject();
			}
		} );
	}

	return Promise.reject();
}

// Check if a native app is installed on the device
export function hasNativeAppInstalled() {
	if ( navigator.getInstalledRelatedApps ) {
		return Promise.resolve( false );
	}

	return navigator.getInstalledRelatedApps().then( relatedApps => {
		return relatedApps.length === 0;
	} );
}

// Check if we can install the app as a "standalone" PWA
export function canInstall() {
	return hasNativeAppInstalled().then( hasNativeApp => {
		if ( hasNativeApp ) {
			return false;
		}

		return canBootOffline()
			.then( function() {
				return !! deferredPrompt;
			} )
			.catch( function() {
				return false;
			} );
	} );
}

// Show the install prompt to the user
export function promptInstall() {
	if ( ! deferredPrompt ) {
		return;
	}

	deferredPrompt.prompt();

	// Wait for the user to respond to the prompt
	deferredPrompt.userChoice.then( choiceResult => {
		if ( choiceResult.outcome === 'accepted' ) {
			analytics.tracks.recordEvent( 'calypso_pwa_a2hs_accept' );
		} else {
			analytics.tracks.recordEvent( 'calypso_pwa_a2hs_dismiss' );
		}

		deferredPrompt = null;
	} );
}
