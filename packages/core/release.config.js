module.exports = {
  repositoryUrl: "https://github.com/azot-dev/cortex",
  branches: ["main"],
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md",
      },
    ],
    [
      "@semantic-release/npm",
      {
        npmPublish: true,
      },
    ],
    [
      "@semantic-release/github",
      {
        assets: ["dist/**/*"],
        labels: ["automated-release"],
        tagFormat: "core-v${version}",
      },
    ],
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json"],
        message: "chore(release): core-v${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
        tagFormat: "core-v${version}",
      },
    ],
  ],
};
