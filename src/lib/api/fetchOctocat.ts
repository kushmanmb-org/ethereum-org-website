/**
 * Fetches ASCII art of the GitHub Octocat mascot from the GitHub API.
 * 
 * @returns The Octocat ASCII art as a string
 * @throws Error if the fetch fails or if the GitHub token is not configured
 */
export const fetchOctocat = async (): Promise<string> => {
  const gitHubToken = process.env.GITHUB_TOKEN_READ_ONLY

  if (!gitHubToken) {
    throw new Error("GITHUB_TOKEN_READ_ONLY environment variable is not set")
  }

  try {
    const response = await fetch("https://api.github.com/octocat", {
      headers: {
        // Using Bearer token format as specified in the API requirements
        Authorization: `Bearer ${gitHubToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })

    if (!response.ok) {
      throw new Error(
        `GitHub API responded with ${response.status}: ${response.statusText}`
      )
    }

    return await response.text()
  } catch (error) {
    console.error("Failed to fetch Octocat:", error)
    throw error
  }
}
