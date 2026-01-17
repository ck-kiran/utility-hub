module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@/components': './src/components',
            '@/features': './src/features',
            '@/hooks': './src/hooks',
            '@/services': './src/services',
            '@/utils': './src/utils',
            '@/types': './src/types',
            '@/navigation': './src/navigation',
            '@/i18n': './src/i18n',
            '@/config': './src/config',
          },
        },
      ],
    ],
  };
};
