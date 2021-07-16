# @open-tender/redux

A set of reducers, actions, action creators, and selectors for use with the Open Tender open source apps:

- [open-tender-web](https://github.com/open-tender/open-tender-web)
- [open-tender-pos](https://github.com/open-tender/open-tender-pos)
- [open-tender-kds](https://github.com/open-tender/open-tender-kds)

This library is only relevant for restaurant brands that are customers of Open Tender. To learn more about establishing an Open Tender account, [please visit our website](https://www.opentender.io/).

## Installation

Install via yarn:

```
yarn add @open-tender/redux
```

Or via npm:

```
npm install --save @open-tender/redux
```

## Purpose

This library handles most of the state management for the Open Tender apps listed above, as well as all of the interactions with the Open Tender API.

It provides a number of Redux reducers, actions, async action creators, and selectors that are used extensively throughout the Open Tender apps. All of the state that comes from this library lives under the `data` attribute of the Redux store (see `store.js` for details). This includes over 40 reducers as of July 2021. See [the `reducers` directory](https://github.com/open-tender/open-tender-redux/tree/master/src/reducers) for the details of each of these reducers or just check out the state using the Redux dev tools.

This library also includes an `OpenTenderAPI` class that handles requests to all of the relevant endpoints of the Open Tender Order API (used in the open-tender-web app) and the POS API (used in the open-tender-pos and open-tender-kds apps). [You can see all of the available methods here.](https://github.com/open-tender/open-tender-redux/blob/master/src/services/index.js)

When an Open Tender app initially loads, it creates an API instance using this `OpenTenderAPI` class and stores it in the state of the app for future use by the app and this library. The `api` instance can be used in the app itself via the `selectApi` selector, such as:

```javascript
const api = useSelector(selectApi)
```

However, you don't typically need to do this - most of the requests are handled for you by this library per the example below.

## Usage

To fetch a list of restaurant locations (we can them "revenue centers" in Open Tender), you would simply dispatch an action like so:

```javascript
dispatch(fetchRevenueCenters({ type: 'OLO' }))
```

This will make a request to the Open Tender API to retrieve the restaurants of the `OLO` type for your brand and then load the response into the `data.revenueCenters` reducer, which looks like this:

```javascript
{
  revenueCenters: [],
  loading: 'idle',
  error: null,
}
```

You can then use the `selectRevenueCenters` selector to use the fetched revenue centers in your component like this:

```javascript
const { revenueCenters, loading, error } = useSelector(selectRevenueCenters)
```

### More Examples

The best way to get to know this library is to start working with one of the Open Tender open source apps - it's used so extensively that it will be hard to miss it!

## Issues

If you find a bug or have a question, please file an issue on [our issue tracker on GitHub](https://github.com/open-tender/open-tender-redux/issues).

## About

Built and maintained by [Open Tender](https://www.opentender.io/).
