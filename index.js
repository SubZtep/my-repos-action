const core = require("@actions/core")
const { getNodes, getMarkdown } = require("./repos");

async function run() {
  try {
    const token = core.getInput("token")
    const nodes = await getNodes(token)
    const md = getMarkdown(nodes)
    core.setOutput("table", md)
  } catch (err) {
    core.setFailed(err.message)
  }
}

run()
