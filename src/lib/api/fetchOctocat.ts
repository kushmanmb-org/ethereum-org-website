/**
 * Fetches ASCII art of the GitHub Octocat mascot from the GitHub API.
 * 
 * @returns The Octocat ASCII art as a string
 * @throws Error if the fetch fails
 */
export const fetchOctocat = async (): Promise<string> => {
  try {
    const response = await fetch("https://api.github.com/octocat", {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN_READ_ONLY}`,
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
