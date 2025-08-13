// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const { themes } = require("prism-react-renderer");

const organizationName = "azot-dev";
const projectName = "cortex";

const url = `https://${organizationName}.github.io`;
const baseUrl = process.env.NETLIFY ? "/" : `/${projectName}/`;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "cortex",
  tagline: "The React missing brick for TDD and clean architecture",
  favicon: "img/favicon.ico",

  // Set the production url of your site here
  url,
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName, // Usually your GitHub org/user name.
  projectName, // Usually your repo name.

  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: `https://github.com/${organizationName}/${projectName}/tree/main/doc/`,
          versions: {
            current: {
              label: 'v2.x.x',
              path: '',
            },
            '1.x.x': {
              label: 'v1.x.x',
              path: '1.x.x',
            },
          },
          lastVersion: 'current',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: `https://github.com/${organizationName}/${projectName}/tree/main/doc/`,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],



  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: "img/logo_512.png",
      navbar: {
        title: "cortex",
        logo: {
          alt: "My Site Logo",
          src: "img/logo_256.png",
        },
        items: [
          {
            type: "docSidebar",
            sidebarId: "tutorialSidebar",
            position: "left",
            label: "Tutorial",
          },
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownActiveClassDisabled: true,
          },
          {
            href: `https://github.com/${organizationName}/${projectName}`,
            position: "right",
            className: "header-github-link",
          },
          {
            href: `https://www.npmjs.com/package/@${organizationName}/${projectName}`,
            position: "right",
            className: "header-npm-link",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} cortex documentation`,
      },
      prism: {
        theme: themes.vsDark,
      },
    }),
};

module.exports = config;
