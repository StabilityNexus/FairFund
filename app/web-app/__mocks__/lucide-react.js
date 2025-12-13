const React = require('react');

// Return a simple SVG React component for any named export
module.exports = new Proxy({}, {
  get: (_target, prop) => {
    if (prop === '__esModule') return true;
    return (props) => React.createElement('svg', { ...props, 'data-icon': String(prop) });
  },
});
