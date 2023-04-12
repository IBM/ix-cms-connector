/**
 * Function that mutates the original webpack config.
 * Supports asynchronous changes when a promise is returned (or it's an async function).
 *
 * @param {import('preact-cli').Config} config - original webpack config
 * @param {import('preact-cli').Env} env - current environment and options pass to the CLI
 * @param {import('preact-cli').Helpers} helpers - object with useful helpers for working with the webpack config
 * @param {Record<string, unknown>} options - this is mainly relevant for plugins (will always be empty in the config), default to an empty object
 */
export default (config) => {
  config.node = {
    fs: "empty",
  };

  // a workaround for the issue with babel/traverse library import in react-docgen
  config.module.rules.push({
    test: /FileState\.js$/,
    loader: "string-replace-loader",
    options: {
      search: "traverse.default",
      replace: "traverse",
    },
  });
};
