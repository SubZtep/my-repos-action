const github = require("@actions/github");
const format = require("date-fns/format")
const formatDistance = require("date-fns/formatDistance")
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

async function getNodes(login, token, baseUrl) {
  const octokit = github.getOctokit(token, { baseUrl })

  const {
    user: {
      repositories: { nodes },
    },
  } = await octokit.graphql(
    `
    {
      user(login: "${login}") {
        repositories(orderBy: { field: UPDATED_AT, direction: DESC }, first: 100, privacy: PUBLIC) {
          nodes {
            id
            url
            createdAt
            description
            homepageUrl
            isArchived
            isTemplate
            isUserConfigurationRepository
            name
            updatedAt
          }
        }
      }
    }
  `
  )

  return nodes
}

exports.getNodes = getNodes

function getMarkdown(nodes) {
  const heads = ["Project", "Description", "Web", "Archived", "Updated", "Since"]
  let markdown = `| ${heads.join(" | ")} |\n|${" - |".repeat(heads.length)}`

  nodes.forEach(repo => {
    const cols = [
      `[${repo.name}](${repo.url})`,
      repo.description,
      repo.homepageUrl ? `[:link:](${repo.homepageUrl})` : "",
      repo.isArchived ? ":heavy_check_mark:" : "",
      capitalize(formatDistance(new Date(), new Date(repo.updatedAt))) + " ago",
      format(new Date(repo.createdAt), "Y"),
    ]
    markdown += `| ${cols.join(" | ")} |`
  })

  markdown += "> :hourglass: " + new Date()
  return markdown
}

exports.getMarkdown = getMarkdown
