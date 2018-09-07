/** @format */
/**
 * External dependencies
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { isEmpty, noop } from 'lodash';
import { dispatch } from '@wordpress/data';
import '@wordpress/core-data'; // Initializes core data store
import { registerCoreBlocks } from '@wordpress/block-library';

/**
 * Internal dependencies
 */
import Editor from './edit-post/editor.js';
import QueryGutenbergCreatePost from 'components/data/query-gutenberg-create-post';
// needed to load a post if provided via the route using the `wp/v2` API namespace
// import QueryGutenbergSitePost from 'components/data/query-gutenberg-site-post';
import getGutenbergCurrentPost from 'state/selectors/get-gutenberg-current-post';
import { getSelectedSiteId } from 'state/ui/selectors';
import { getSiteSlug } from 'state/sites/selectors';
import { applyAPIMiddlewares } from './utils';

const editorSettings = {};

class GutenbergEditor extends Component {
	componentDidMount() {
		registerCoreBlocks();
		// Prevent Guided tour from showing when editor loads.
		dispatch( 'core/nux' ).disableTips();
	}

	render() {
		const { siteId, siteSlug, post } = this.props;

		if ( isEmpty( siteSlug ) ) {
			return null;
		}

		applyAPIMiddlewares( siteSlug );

		return (
			<Fragment>
				{ isEmpty( post ) && <QueryGutenbergCreatePost siteId={ siteId } /> }
				{ ! isEmpty( post ) && (
					<Editor
						settings={ editorSettings }
						hasFixedToolbar={ true }
						post={ post }
						onError={ noop }
					/>
				) }
			</Fragment>
		);
	}
}

const mapStateToProps = state => {
	const siteId = getSelectedSiteId( state );

	return {
		siteId,
		siteSlug: getSiteSlug( state, siteId ),
		post: getGutenbergCurrentPost( state ),
	};
};

export default connect( mapStateToProps )( GutenbergEditor );
