/** @format */

/**
 * Internal dependencies
 */

import { mergeHandlers } from 'state/action-watchers/utils';
import read from './read';
import sites from './sites';

export const handlers = mergeHandlers( read, sites );

export default handlers;
