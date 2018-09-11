/** @format */

/**
 * Internal dependencies
 */

import { mergeHandlers } from 'state/action-watchers/utils';
import activityLog from './activity-log';
import gravatarUpload from './gravatar-upload';
import helpSearch from './help/search';
import i18n from './i18n';
import localeGuess from './locale-guess';
import login2fa from './login-2fa';
import me from './me';
import meta from './meta';
import posts from './posts';
import read from './read';
import sites from './sites';
import themeFilters from './theme-filters';
import timezones from './timezones';
import usersAuthOptions from './users/auth-options';

export const handlers = mergeHandlers(
	activityLog,
	gravatarUpload,
	helpSearch,
	i18n,
	localeGuess,
	login2fa,
	me,
	meta,
	posts,
	read,
	sites,
	themeFilters,
	timezones,
	usersAuthOptions
);

export default handlers;
