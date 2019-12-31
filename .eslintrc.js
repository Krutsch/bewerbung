module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: ["plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module",
    ecmaFeatures: {
      impliedStrict: true
    }
  },
  rules: {
    "no-console": "off",
    indent: ["error", 2],
    "linebreak-style": ["error", "windows"],
    semi: ["error", "always"]
  }
};
