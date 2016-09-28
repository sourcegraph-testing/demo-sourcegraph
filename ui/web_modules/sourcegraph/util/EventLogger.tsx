import { Location } from "history";
import * as React from "react";
import { InjectedRouter, Route } from "react-router";
import { context } from "sourcegraph/app/context";
import { getRouteParams, getRoutePattern, getViewName } from "sourcegraph/app/routePatterns";
import * as Dispatcher from "sourcegraph/Dispatcher";
import * as RepoActions from "sourcegraph/repo/RepoActions";
import * as UserActions from "sourcegraph/user/UserActions";
import * as AnalyticsConstants from "sourcegraph/util/constants/AnalyticsConstants";
import { defPathToLanguage, getLanguageExtensionForPath } from "sourcegraph/util/inventory";

class EventLoggerClass {
	_amplitude: any = null;
	_intercom: any = null;
	_fullStory: any = null;
	_telligent: any = null;

	_intercomSettings: any;
	userAgentIsBot: boolean;
	_dispatcherToken: any;
	_currentPlatform: string = "Web";
	_currentPlatformVersion: string = "";

	constructor() {
		this._intercomSettings = null;

		// Listen for all Stores dispatches.
		// You must separately log "frontend" actions of interest,
		// with the relevant event properties.
		this._dispatcherToken = Dispatcher.Stores.register(this.__onDispatch.bind(this));

		if (typeof document !== "undefined") {
			document.addEventListener("sourcegraph:platform:initalization", this._initializeForSourcegraphPlatform.bind(this));
			document.addEventListener("sourcegraph:metrics:logEventForCategory", this._logDesktopEventForCategory.bind(this));
		}
	}

	_logDesktopEventForCategory(event: any): void {
		if (event && event.detail && event.detail.eventCategory && event.detail.eventAction && event.detail.eventLabel) {
			this.logEventForCategory(event.detail.eventCategory, event.detail.eventAction, event.detail.eventLabel, event.detail.eventProperties);
		}
	}

	_initializeForSourcegraphPlatform(event: any): void {
		if (event && event.detail) {
			if (event.detail.currentPlatform) {
				this._currentPlatform = event.detail.currentPlatform;
			}

			if (event.detail.currentPlatformVersion) {
				this._currentPlatformVersion = event.detail.currentPlatformVersion;
			}
		}
	}

	// init initializes Amplitude and Intercom.
	init(): void {
		if (global.window && !this._amplitude) {
			this._amplitude = require("amplitude-js");

			this._telligent = global.window.telligent;

			let apiKey = "608f75cce80d583063837b8f5b18be54";
			let env = "development";
			if (context.buildVars.Version === "dev") {
				apiKey = "2b4b1117d1faf3960c81899a4422a222";
			} else {
				switch (context.appURL) {
					case "https://sourcegraph.com":
						apiKey = "e3c885c30d2c0c8bf33b1497b17806ba";
						env = "production";
						break;
					case "https://staging.sourcegraph.com":
					case "https://staging2.sourcegraph.com":
					case "https://staging3.sourcegraph.com":
					case "https://staging4.sourcegraph.com":
						apiKey = "903f9390c3eefd5651853cf8dbd9d363";
						break;
					default:
						break;
				}
			}

			this._telligent("newTracker", "sg", "sourcegraph-logging.telligentdata.com", {
				appId: "SourcegraphWeb",
				platform: "Web",
				encodeBase64: false,
				env: env,
				configUseCookies: true,
				useCookies: true,
				metadata: {
					gaCookies: true,
					performanceTiming: true,
					augurIdentityLite: true,
					webPage: true,
				},
			});

			this._amplitude.init(apiKey, null, {
				includeReferrer: true,
			});
		}

		if (global.window.Intercom) { this._intercom = global.window.Intercom; }
		if (global.window.FS) { this._fullStory = global.window.FS; }

		if (typeof window !== "undefined") {
			this._intercomSettings = global.window.intercomSettings;
		}

		this.userAgentIsBot = Boolean(context.userAgentIsBot);

		// Opt out of Amplitude events if the user agent is a bot.
		this._amplitude.setOptOut(this.userAgentIsBot);

		this._updateUser();
	}

	// _updateUser is be called whenever the user changes (on the initial page load).
	//
	// If any events have been buffered, it will flush them immediately.
	// If you do not call _updateUser or it is run on the server,
	// any subequent calls to logEvent or setUserProperty will be buffered.
	_updateUser(): void {
		const user = context.user;
		const emails = context.emails && context.emails.EmailAddrs || null;

		const primaryEmail = (emails && emails.filter(e => e.Primary).map(e => e.Email)[0]) || null;

		this._updateUserForAmplitudeCookies();

		if (context.user) {
			this._setTrackerLoginInfo(context.user.Login);
			this.setIntercomProperty("user_id", context.user.UID.toString());
			this.setUserProperty("internal_user_id", context.user.UID.toString());
		}

		if (context.intercomHash) {
			this.setIntercomProperty("user_hash", context.intercomHash);
			this.setUserProperty("user_hash", context.intercomHash);
		}

		if (this._intercom) { this._intercom("boot", this._intercomSettings); }

		if (user) {
			if (user.Name) {
				this.setIntercomProperty("name", user.Name);
				this.setUserProperty("display_name", user.Name);
			}

			if (user.RegisteredAt) {
				this.setUserProperty("registered_at_timestamp", user.RegisteredAt);
				this.setUserProperty("registered_at", new Date(user.RegisteredAt).toDateString());
				this.setIntercomProperty("created_at", new Date(user.RegisteredAt).getTime() / 1000);
			}

			if (user.Company) {
				this.setUserProperty("company", user.Company);
			}

			if (user.Location) {
				this.setUserProperty("location", user.Location);
			}

			let allowedPrivateAuth = context.gitHubToken && context.gitHubToken.scope && context.gitHubToken.scope.includes("repo") && context.gitHubToken.scope.includes("read:org");
			this.setUserProperty("is_private_code_user", allowedPrivateAuth ? allowedPrivateAuth.toString() : "false");
		}

		if (primaryEmail) {
			this.setUserProperty("email", primaryEmail);
			this.setUserProperty("emails", emails);
			this.setIntercomProperty("email", primaryEmail);
			if (this._fullStory) { this._fullStory.setUserVars({ email: primaryEmail }); }
		}
	}

	logout(): void {
		// Distinguish between 2 users who log in from the same browser; see
		// https://github.com/amplitude/Amplitude-Javascript#logging-out-and-anonymous-users.
		if (this._amplitude) { this._amplitude.regenerateDeviceId(); }

		// Prevent the next user who logs in (e.g., on a public terminal) from
		// seeing the previous user's Intercom messages.
		if (this._intercom) { this._intercom("shutdown"); }

		if (this._fullStory) { this._fullStory.clearUserCookie(); }
	}

	_updateUserForAmplitudeCookies(): void {
		if (this._amplitude && this._amplitude.options && this._amplitude.options.deviceId) {
			this.setAmplitudeDeviceIdForTrackers(this._amplitude.options.deviceId);
		}
	}

	// Responsible for setting the login information for all event trackers
	_setTrackerLoginInfo(loginInfo: string): void {
		if (this._amplitude) {
			this._amplitude.setUserId(loginInfo);
		}

		if (global.window.ga) {
			global.window.ga("set", "userId", loginInfo);
		}

		if (this._telligent) {
			this._telligent("setUserId", loginInfo);
		}

		this.setIntercomProperty("business_user_id", loginInfo);

		if (this._fullStory) {
			this._fullStory.identify(loginInfo);
		}
	}

	getAmplitudeIdentificationProps(): any {
		if (!this._amplitude || !this._amplitude.options) {
			return null;
		}

		return { detail: { deviceId: this._amplitude.options.deviceId, userId: context.user && context.user.Login } };
	}

	setAmplitudeDeviceIdForTrackers(value: string): void {
		if (this._telligent) {
			this._telligent("addStaticMetadataObject", { deviceInfo: { AmplitudeDeviceId: value } });
		}
	}

	// sets current user's properties
	setUserProperty(property: string, value: any): void {
		if (this._telligent) {
			this._telligent("addStaticMetadata", property, value, "userInfo");
		}

		if (this._amplitude) {
			this._amplitude.identify(new this._amplitude.Identify().set(property, value));
		}
	}

	_decorateEventProperties(platformProperties: any): any {
		return Object.assign({}, platformProperties, {Platform: this._currentPlatform, platformVersion: this._currentPlatformVersion, is_authed: context.user ? "true" : "false", path_name: global.window && global.window.location && global.window.location.pathname ? global.window.location.pathname.slice(1) : ""});
	}

	// Use logViewEvent as the default way to log view events for Amplitude and GA
	// location is the URL, page is the path.
	logViewEvent(title: string, page: string, eventProperties: any): void {
		if (context.userAgentIsBot || !page) {
			return;
		}

		this._logToConsole(title, Object.assign({}, this._decorateEventProperties(eventProperties), {page_name: page, page_title: title}));

		if (this._telligent) {
			this._telligent("track", "view", Object.assign({}, this._decorateEventProperties(eventProperties), {page_name: page, page_title: title}));
		}

		// Log Amplitude "View" event
		this._amplitude.logEvent(title, Object.assign({}, eventProperties, { Platform: this._currentPlatform }));
	}

	// Default tracking call to all of our analytics servies.
	// Required fields: eventCategory, eventAction, eventLabel
	// Optional fields: eventProperties
	// Example Call: logEventForCategory(AnalyticsConstants.CATEGORY_AUTH, AnalyticsConstants.ACTION_SUCCESS, "SignupCompletion", AnalyticsConstants.PAGE_HOME, {signup_channel: GitHub})
	logEventForCategory(eventCategory: string, eventAction: string, eventLabel: string, eventProperties?: any): void {
		if (context.userAgentIsBot || !eventLabel) {
			return;
		}
		if (this._telligent) {
			this._telligent("track", eventAction, Object.assign({}, this._decorateEventProperties(eventProperties), {eventLabel: eventLabel, eventCategory: eventCategory, eventAction: eventAction}));
		}
		if (this._amplitude) {
			this._amplitude.logEvent(eventLabel, Object.assign({}, this._decorateEventProperties(eventProperties), {eventCategory: eventCategory, eventAction: eventAction}));
		}
		this._logToConsole(eventAction, Object.assign(this._decorateEventProperties(eventProperties),  {eventLabel: eventLabel, eventCategory: eventCategory, eventAction: eventAction}));

		if (global && global.window) {
			global.window.ga("send", {
				hitType: "event",
				eventCategory: eventCategory || "",
				eventAction: eventAction || "",
				eventLabel: eventLabel,
			});
		}
	}

	_logToConsole(eventAction: string, object?: any): void {
		if (global.window && global.window.localStorage && global.window.localStorage["log_debug"]) {
			console.debug("%cEVENT %s", "color: #aaa", eventAction, object); // tslint:disable-line
		}
	}

	// Tracking call for event level calls that we wish to track, but do not wish to impact bounce rate on our site for Google analytics.
	// An example of this would be the event that gets fired following a view event on a Repo that 404s. We fire a view event and then a 404 event.
	// By adding a non-interactive flag to the 404 event the page will correctly calculate bounce rate even with the additional event fired.
	logNonInteractionEventForCategory(eventCategory: string, eventAction: string, eventLabel: string, eventProperties?: any): void {
		if (context.userAgentIsBot || !eventLabel) {
			return;
		}

		this._logToConsole(eventAction, Object.assign(this._decorateEventProperties(eventProperties),  {eventLabel: eventLabel, eventCategory: eventCategory, eventAction: eventAction, nonInteraction: true}));

		if (this._telligent) {
			this._telligent("track", eventAction, Object.assign({}, this._decorateEventProperties(eventProperties), {eventLabel: eventLabel, eventCategory: eventCategory, eventAction: eventAction}));
		}
		if (this._amplitude) {
			this._amplitude.logEvent(eventLabel, Object.assign({}, this._decorateEventProperties(eventProperties), {eventCategory: eventCategory, eventAction: eventAction}));
		}

		global.window.ga("send", {
			hitType: "event",
			eventCategory: eventCategory || "",
			eventAction: eventAction || "",
			eventLabel: eventLabel,
			nonInteraction: true,
		});
	}

	// sets current user's property value
	setIntercomProperty(property: string, value: any): void {
		if (this._intercom) { this._intercomSettings[property] = value; }
	}

	// records intercom events for the current user
	logIntercomEvent(eventName: string, eventProperties: any): void {
		if (this._intercom && !this.userAgentIsBot) { this._intercom("trackEvent", eventName, eventProperties); }
	}

	_dedupedArray(inputArray: Array<string>): Array<string> {
		return inputArray.filter(function (elem: string, index: number, self: any): any {
			return index === self.indexOf(elem);
		});
	}

	__onDispatch(action: any): void {
		switch (action.constructor) {
			case RepoActions.ReposFetched:
				if (action.data.Repos) {
					let orgs = {};
					let languages: Array<string> = [];
					let privateOrgs: Array<string> = [];
					for (let repo of action.data.Repos) {
						orgs[repo.Owner] = true;
						if (repo["Language"]) {
							languages.push(repo["Language"]);
						}

						if (repo.Private) {
							privateOrgs.push(repo.Owner);
						}
					}

					this.setUserProperty("private_orgs", this._dedupedArray(privateOrgs));
					this.setUserProperty("github_languages", this._dedupedArray(languages));
					this.setUserProperty("orgs", Object.keys(orgs));
					this.setUserProperty("num_github_repos", action.data.Repos.length);
					this.setIntercomProperty("companies", Object.keys(orgs).map(org => ({ id: `github_${org}`, name: org })));
					this.setUserProperty("companies", Object.keys(orgs).map(org => ({ id: `github_${org}`, name: org })));
					if (orgs["sourcegraph"]) {
						this.setUserProperty("is_sg_employee", "true");
					}
				}
				break;

			case UserActions.BetaSubscriptionCompleted:
				if (action.eventName) {
					this.logEventForCategory(AnalyticsConstants.CATEGORY_ENGAGEMENT, AnalyticsConstants.ACTION_SUCCESS, action.eventName);
				}
				break;

			default:
				// All dispatched actions to stores will automatically be tracked by the eventName
				// of the action (if set). Override this behavior by including another case above.
				if (action.eventName) {
					this.logEventForCategory(AnalyticsConstants.CATEGORY_UNKNOWN, AnalyticsConstants.ACTION_FETCH, action.eventName);
				}
				break;
		}

		this._updateUser();
	}
}

export const EventLogger = new EventLoggerClass();

// withViewEventsLogged calls (this.context as any).eventLogger.logEvent when the
// location's pathname changes.
interface WithViewEventsLoggedProps {
	routes: Route[];
	location: Location;
}

export function withViewEventsLogged<P extends WithViewEventsLoggedProps>(component: React.ComponentClass<{}>): React.ComponentClass<{}> {
	class WithViewEventsLogged extends React.Component<P, {}> { // eslint-disable-line react/no-multi-comp
		static contextTypes: React.ValidationMap<any> = {
			router: React.PropTypes.object.isRequired,
		};

		context: {
			router: InjectedRouter,
		};

		componentDidMount(): void {
			this._logView(this.props.routes, this.props.location);
			this._checkEventQuery();
		}

		componentWillReceiveProps(nextProps: P): void {
			// Greedily log page views. Technically changing the pathname
			// may match the same "view" (e.g. interacting with the directory
			// tree navigations will change your URL,  but not feel like separate
			// page events). We will log any change in pathname as a separate event.
			// NOTE: this will not log separate page views when query string / hash
			// values are updated.
			if (this.props.location.pathname !== nextProps.location.pathname) {
				this._logView(nextProps.routes, nextProps.location);
				// Set the identity of the chrome extension only after it is mounted.
				setTimeout(() => document.dispatchEvent(new CustomEvent("sourcegraph:identify", EventLogger.getAmplitudeIdentificationProps())), 50);
			}

			this._checkEventQuery();
		}

		camelCaseToUnderscore(input: string): string {
			if (input.charAt(0) === "_") {
				input = input.substring(1);
			}

			return input.replace(/([A-Z])/g, ($1) => `_${$1.toLowerCase()}`);
		}

		_checkEventQuery(): void {
			// Allow tracking events that occurred externally and resulted in a redirect
			// back to Sourcegraph. Pull the event name out of the URL.
			if (this.props.location.query && this.props.location.query["_event"]) {
				// For login signup related metrics a channel will be associated with the signup.
				// This ensures we can track one metrics "SignupCompleted" and then query on the channel
				// for more granular metrics.
				let eventProperties = {};
				for (let key in this.props.location.query) {
					if (key !== "_event") {
						eventProperties[this.camelCaseToUnderscore(key)] = this.props.location.query[key];
					}
				}

				if (this.props.location.query["_githubAuthed"]) {
					EventLogger.setUserProperty("github_authed", this.props.location.query["_githubAuthed"]);
					EventLogger.logEventForCategory(AnalyticsConstants.CATEGORY_AUTH, AnalyticsConstants.ACTION_SIGNUP, this.props.location.query["_event"], eventProperties);
				} else {
					EventLogger.logEventForCategory(AnalyticsConstants.CATEGORY_EXTERNAL, AnalyticsConstants.ACTION_REDIRECT, this.props.location.query["_event"], eventProperties);
				}

				// Won't take effect until we call replace below, but prevents this
				// from being called 2x before the setTimeout block runs.
				delete this.props.location.query["_event"];
				delete this.props.location.query["_githubAuthed"];

				// Remove _event from the URL to canonicalize the URL and make it
				// less ugly.
				const locWithoutEvent = Object.assign({}, this.props.location, {
					query: Object.assign({}, this.props.location.query, { _event: undefined, _signupChannel: undefined, _onboarding: undefined, _githubAuthed: undefined }), // eslint-disable-line no-undefined
					state: Object.assign({}, this.props.location.state, { _onboarding: this.props.location.query["_onboarding"] }),
				});

				delete this.props.location.query["_signupChannel"];
				delete this.props.location.query["_onboarding"];

				(this.context as any).router.replace(locWithoutEvent);
			}
		}

		_logView(routes: Route[], location: Location): void {
			let eventProps: {
				url: string;
				referred_by_integration?: string;
				referred_by_browser_ext?: string;
				referred_by_sourcegraph_editor?: string;
				language?: string;
			};

			if (location.query && location.query["utm_source"] === "integration" && location.query["type"]) {
				eventProps = {
					// Alfred, ChromeExtension, FireFoxExtension, SublimeEditor, VIMEditor.
					referred_by_integration: location.query["type"],
					url: location.pathname,
				};
			} else if (location.query && location.query["utm_source"] === "chromeext") {
				// TODO:matt remove this once all plugins are switched to new version
				// This is temporarily here for backwards compat
				eventProps = {
					referred_by_browser_ext: "chrome",
					url: location.pathname,
				};
			} else if (location.query && location.query["utm_source"] === "browser-ext" && location.query["browser_type"]) {
				eventProps = {
					referred_by_browser_ext: location.query["browser_type"],
					url: location.pathname,
				};
			} else if (location.query && location.query["utm_source"] === "sourcegraph-editor" && location.query["editor_type"]) {
				eventProps = {
					url: location.pathname,
					referred_by_sourcegraph_editor: location.query["editor_type"],
				};
			} else {
				eventProps = {
					url: location.pathname,
				};
			}

			const routePattern = getRoutePattern(routes);
			const viewName = getViewName(routes);
			const routeParams = getRouteParams(routePattern, location.pathname);

			if (viewName) {
				if (viewName === "ViewBlob" && routeParams) {
					const filePath = routeParams.splat[routeParams.splat.length - 1];
					const lang = getLanguageExtensionForPath(filePath);
					if (lang) { eventProps.language = lang; }
				} else if ((viewName === "ViewDef" || viewName === "ViewDefInfo") && routeParams) {
					const defPath = routeParams.splat[routeParams.splat.length - 1];
					const lang = defPathToLanguage(defPath);
					if (lang) { eventProps.language = lang; }
				}

				EventLogger.logViewEvent(viewName, location.pathname, Object.assign({}, eventProps, {pattern: getRoutePattern(routes)}));
			} else {
				EventLogger.logViewEvent("UnmatchedRoute", location.pathname, Object.assign({}, eventProps, {pattern: getRoutePattern(routes)}));
			}
		}

		render(): JSX.Element | null { return React.createElement(component, this.props); }
	}
	return WithViewEventsLogged;
}
