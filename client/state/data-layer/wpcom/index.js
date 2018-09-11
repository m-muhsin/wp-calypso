/** @format */

/**
 * Internal dependencies
 */

import { mergeHandlers } from 'state/action-watchers/utils';
import me from './me';
import read from './read';
import sites from './sites';

export const handlers = mergeHandlers( me, read, sites );

export default handlers;
