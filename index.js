const core = require("@actions/core")
const github = require("@actions/github");

const getNodes = async token => {
  const octokit = github.getOctokit(token)
  const {
    user: {
      repositories: { nodes },
    },
  } = await octokit.graphql(`{
    user(login: "${process.env.GITHUB_ACTOR}") {
      repositories(orderBy: { field: UPDATED_AT, direction: DESC }, first: 100, privacy: PUBLIC) {
        nodes {
          url
          createdAt
          description
          homepageUrl
          isArchived
          isTemplate
          name
          updatedAt
        }
      }
    }
  }`)
  return nodes
}

const getTableRows = (nodes, ago) =>
  [
    ["Project", "Web", "Template", "Archived", "Updated", "Since"],
    Array.from({ length: 5 }, () => " - "),
    ...nodes.map(repo => [
      `**${repo.name}** — ${repo.description}`,
      repo.homepageUrl ? `[:link:](${repo.homepageUrl})` : "",
      repo.isTemplate ? ":heavy_check_mark:" : "",
      repo.isArchived ? ":heavy_check_mark:" : "",
      `![${repo.updatedAt}](${ago}${new Date(repo.updatedAt).getTime()})`,
      new Date(repo.createdAt).getFullYear().toString()
    ])
  ]

const getMarkdown = rows => rows.map(row => `| ${row.join(" | ")} |`).join("\n")

const main = async () => {
  try {
    const ago = core.getInput("ago")
    const token = core.getInput("token")
    const nodes = await getNodes(token)
    const rows = getTableRows(nodes, ago)
    const md = getMarkdown(rows)
    core.setOutput("md", md)
  } catch (err) {
    core.setFailed(err.message)
  }
}

main()
