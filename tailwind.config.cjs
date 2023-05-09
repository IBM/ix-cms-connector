/* eslint-disable-next-line */
const defaultTheme = require("tailwindcss/defaultTheme");

/* eslint-disable-next-line no-undef */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      transparent: "transparent",
      text: {
        "01": "#161616",
        "02": "#525252",
        "03": "#A8A8A8",
        "04": "#FFFFFF",
        "05": "#6F6F6F",
        error: "#DA1E28",
      },
      link: {
        "01": "#0F62FE",
        "02": "#0043CE",
        visited: "#8A3FFC",
      },
      ui: {
        "01": "#FFFFFF",
        "02": "#F4F4F4",
        "03": "#E0E0E0",
        "04": "#8D8D8D",
        "05": "#161616",
        "decorative-01": "#E0E0E0",
      },
      interactive: {
        "01": "#0F62FE",
        "02": "#393939",
        "03": "#0F62FE",
        "04": "#0F62FE",
      },
      "interactive-icon": {
        "01": "#161616",
        "02": "#525252",
        "03": "#FFFFFF",
      },
      focus: "#0F62FE",
      field: {
        "01": "#FFFFFF",
        "02": "#F4F4F4",
      },
      hover: {
        primary: "#0353E9",
        "primary-text": "#054ADA",
        secondary: "#4C4C4C",
        tertiary: "#0353E9",
        ui: "#E5E5E5",
        "selected-ui": "#CACACA",
        danger: "#BA1B23",
        row: "#E5E5E5",
      },
      active: {
        primary: "#002D9C",
        secondary: "#6F6F6F",
        tertiary: "#002D9C",
        ui: "#C6C6C6",
        danger: "#750E13",
      },
      selected: {
        ui: "#E0E0E0",
      },
      highlight: "#D0E2FF",
      disabled: {
        "01": "#FFFFFF",
        "02": "#C6C6C6",
        "03": "#8D8D8D",
      },
      "ui-shell": {
        white: "#FFFFFF",
        "gray-100": "#161616",
        "gray-100-hover": "#2C2C2C",
        "gray-90": "#262626",
        "gray-90-hover": "#353535",
        "gray-80": "#393939",
        "gray-70": "#525252",
        "gray-30": "#C6C6C6",
        "gray-20": "#E0E0E0",
        "gray-10": "#F4F4F4",
        "gray-10-hover": "#E5E5E5",
      },
      tag: {
        "blue-background": "#D0E2FF",
        "blue-text": "#0043CE",
        "blue-hover": "#B8D3FF",
        "green-background": "#A7F0BA",
        "green-text": "#0E6027",
        "green-hover": "#74E792",
        "magenta-background": "#FFD6E8",
        "magenta-text": "#9F1853",
        "magenta-hover": "#FFBDDA",
        "purple-background": "#E8DAFF",
        "purple-text": "#6929C4",
        "purple-hover": "#DCC7FF",
        "teal-background": "#9EF0F0",
        "teal-text": "#005D5D",
        "teal-hover": "#57E5E5",
      },
    },
    extend: {
      fontFamily: {
        sans: ["IBM Plex Sans", ...defaultTheme.fontFamily.sans],
        mono: ["IBM Plex Mono", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [],
};
