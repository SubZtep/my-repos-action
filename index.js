const core = require("@actions/core")
const github = require("@actions/github");
const format = require("date-fns/format")
const formatDistance = require("date-fns/formatDistance")
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

const getNodes = async token => {
  console.log("NODES", [token.substring(0, 6), process.env.GITHUB_GRAPHQL_URL, process.env.GITHUB_ACTOR])
  const octokit = github.getOctokit(token, { baseUrl: process.env.GITHUB_GRAPHQL_URL })
  const {
    user: {
      repositories: { nodes },
    },
  } = await octokit.graphql(
    `
    {
      user(login: "${process.env.GITHUB_ACTOR}") {
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
  console.log({ nodes })
  return nodes
}

const getMarkdown = nodes => {
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

const run = async () => {
  try {
    const token = core.getInput("token")
    console.log("token", token.substring(0, 5))
    const nodes = await getNodes(token)
    console.log("nodes", nodes)
    const md = getMarkdown(nodes)
    console.log("markdown", md)
    core.setOutput("table", md)
  } catch (err) {
    core.setFailed(err)
  }
}

run()
