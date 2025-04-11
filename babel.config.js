module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['.'],
          alias: {
            '@firebase': './firebase',
            '@components': './Components',
            '@context': './context',
          },
        },
      ],
    ],
  };
};
