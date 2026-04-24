const handler = defineEventHandler(async (event): Promise<{ totalCommits: number; totalRepos: number }> => {
  const username = "Dani12600000"
  
  try {
    const commitSearch = await $fetch<any>(`https://api.github.com/search/commits?q=author:${username}`, {
      headers: { 
        "Accept": "application/vnd.github.cloak-preview", 
        "User-Agent": "daniel-dev-portfolio" 
      }
    })

    const userProfile = await $fetch<any>(`https://api.github.com/users/${username}`, {
      headers: { 
        "User-Agent": "daniel-dev-portfolio" 
      }
    })

    return { 
      totalCommits: Number(commitSearch.total_count || 0), 
      totalRepos: Number(userProfile.public_repos || 0) 
    }
  } catch (error) {
    console.error("Error fetching GitHub stats:", error)
    return { 
      totalCommits: 1203, 
      totalRepos: 15 
    }
  }
})

export default handler