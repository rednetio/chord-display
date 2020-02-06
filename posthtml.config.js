const package = require('./package.json');

const authorMatch = package.author.match(/^([^\(]+)\((.+)\)$/)
const AUTHOR_NAME = authorMatch && authorMatch[1].trim();
const AUTHOR_URL = authorMatch && authorMatch[2].trim();
const repositoryMatch = package.repository.match(/^github:(.+)$/)
const GITHUB_REPOSITORY = repositoryMatch && repositoryMatch[1].trim();

module.exports = {
  plugins: {
    "posthtml-expressions": {
      locals: {
        VERSION: package.version,
        TITLE: package.title,
        DESCRIPTION: package.description,
        KEYWORDS: package.keywords.join(','),
        HOMEPAGE: package.homepage,
        AUTHOR_NAME,
        AUTHOR_URL,
        GITHUB_REPOSITORY,
      }
    }
  }
};
