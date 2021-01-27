const core = require("@actions/core")
const github = require("@actions/github");
const format = require("date-fns/format")
const formatDistance = require("date-fns/formatDistance")
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)

// async function getNodes(token) {
//   const octokit = github.getOctokit(token, { baseUrl: process.env.GITHUB_GRAPHQL_URL })
//   const {
//     user: {
//       repositories: { nodes },
//     },
//   } = await octokit.graphql(
//     `
//     {
//       user(login: "${process.env.GITHUB_ACTOR}") {
//         repositories(orderBy: { field: UPDATED_AT, direction: DESC }, first: 100, privacy: PUBLIC) {
//           nodes {
//             id
//             url
//             createdAt
//             description
//             homepageUrl
//             isArchived
//             isTemplate
//             isUserConfigurationRepository
//             name
//             updatedAt
//           }
//         }
//       }
//     }
//   `
//   )
//   return nodes
// }

// function getMarkdown(nodes) {
//   const heads = ["Project", "Description", "Web", "Archived", "Updated", "Since"]
//   let markdown = `| ${heads.join(" | ")} |\n|${" - |".repeat(heads.length)}`
//   nodes.forEach(repo => {
//     const cols = [
//       `[${repo.name}](${repo.url})`,
//       repo.description,
//       repo.homepageUrl ? `[:link:](${repo.homepageUrl})` : "",
//       repo.isArchived ? ":heavy_check_mark:" : "",
//       capitalize(formatDistance(new Date(), new Date(repo.updatedAt))) + " ago",
//       format(new Date(repo.createdAt), "Y"),
//     ]
//     markdown += `| ${cols.join(" | ")} |`
//   })
//   markdown += "> :hourglass: " + new Date()
//   return markdown
// }

function run() {
  try {
    const token = core.getInput("token")
    core.debug(`token: ${token.substring(0, 5)}`)
    // const nodes = await getNodes(token)
    // core.debug(`nodes`)
    // const md = getMarkdown(nodes)
    // core.debug(`markdown: ${token.substring(0, 100)}`)
    // core.setOutput("table", md)
    console.log("Core mi Xp")
    core.setOutput("table", "hellobello")
    core.debug("table")
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
