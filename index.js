const core = require("@actions/core");
const github = require("@actions/github");
const { config } = require("dotenv")
const { graphql } = require("@octokit/graphql")
const { format, formatDistance } = require("date-fns")
config()

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1)
// user(login: "${process.argv.pop()}") {

const {
  user: {
    repositories: { nodes },
  },
} = await graphql(
  `
    {
      user(login: "SubZtep") {
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
  `,
  {
    headers: {
      authorization: `token ${process.env.GH_ACCESS_TOKEN}`,
    },
  }
)

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

console.log(markdown) 

try {
  // `who-to-greet` input defined in action metadata file
  const nameToGreet = core.getInput('who-to-greet');
  console.log(`Hello ${nameToGreet}!`);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
