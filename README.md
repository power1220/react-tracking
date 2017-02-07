# nyt-react-tracking

## Motivation

- React specific tracking library, to be shared across teams.
- Reduce development cost to add tracking to a codebase.
- Expressive and declarative (as opposed to imperative) API to add tracking.

## Installation

```
npm install --save nytm/nyt-react-tracking#v0.8.2
```

(Or whatever is [latest](https://github.com/nytm/nyt-react-tracking/releases), it was 0.8.2 as of this writing)

## Usage

`nyt-react-tracking` is best used as a `@decorator()` using the [babel decorators plugin](https://github.com/loganfsmyth/babel-plugin-transform-decorators-legacy).

The decorator can be used on React Classes and on methods within those classes.

```js
import React from 'react';
import track from 'nyt-react-tracking';

@track({ page: 'FooPage' })
export default class FooPage extends React.Component {

  @track({ action: 'click' })
  handleClick = () => {
    // ... other stuff
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click Me!
      </button>
    );
  }
}
```

### Usage on Stateless Functional Components

You can also track events by importing `track()` and wrapping your stateless functional component, which will provide `props.trackEvent()` that you can call in your component like so:

```js
import track from 'nyt-react-tracking';

const FooPage = (props) => {
  return (
    <div onClick={() => {
        props.trackEvent({ action: 'click' });

        // ... other stuff
      }}
    />
  )
}

export default track({
  page: 'FooPage'
})(FooComponent);
```

This is also how you would use this module without `@decorators`, although this is obviously awkward and the  decorator syntax is recommended.


### Advanced Usage

You can also pass a function as an argument instead of an object literal, which allows for some advanced usage scenarios such as when your tracking data is a function of some runtime values, like so:

```js
import React from 'react';
import track from 'nyt-react-tracking';

// In this case, the "page" tracking data
// is a function of one of its props (isNew)
@track((props) => {
  return { page: props.isNew ? 'new' : 'existing' }
})
export default class FooButton extends React.Component {

  // In this case the tracking data depends on
  // some unknown (until runtime) value
  @track((props, [event]) => ({
    action: 'click',
    label: event.currentTarget.title || event.currentTarget.textContent
  }))
  handleClick = (event) => {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.props.children}
      </button>
    );
  }

}
```

NOTE: That the above code utilizes some of the newer ES6 syntax. This is what it would look like in ES5:

```js
// ...
  @track(function(props, args) {
    const event = args[0];
    return {
      action: 'click',
      label: event.currentTarget.title || event.currentTarget.textContent
    };
  })
// ...
```

### Tracking Data

Note that there are no restrictions on the objects that are passed in to the decorator.

**The format for the tracking data object is a contract between your app and the ultimate consumer of the tracking data.**

This library simply merges the tracking data objects together (as it flows through your app's React component hierarchy) into a single object that's ultimately sent to the tracking library.

> NOTE: There is one quasi-exception to this, see the next section.

#### "Pageview" actions fired automatically

There is a special case for the tracking data object when passed in to `track()`. If the object contains a `page` property, then it is assumed that this is a `pageview` action and a tracking event will be fired immediately (in `componentDidMount()`).

For example:

```js
@track({ page: 'FooPage' })
class FooPage extends Component { ... }
```

Will fire the following event (assuming no other tracking data in context from the rest of the app):

```
{
  action: 'pageview',
  page: 'FooPage'
}
```

_This is only in affect when decorating a Class, it does not happen when decorating methods._

## Roadmap

- Integration with [tracking-schema](https://github.com/nytm/tracking-schema) to provide developer warnings/errors on invalid data objects
- DataLayer adapters (so that where the data goes can vary by app, e.g. to EventTracker or Google Analytics etc.)
- Babel plugin ?
