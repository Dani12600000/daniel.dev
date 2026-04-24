<script setup lang="ts">
const content = useSiteContent()
const site = computed(() => content.value?.site ?? {})
const stats = computed(() => content.value?.site?.stats ?? {})
const footer = computed(() => content.value?.footer ?? {})

interface GithubStats {
  totalCommits: number
  totalRepos: number
}

const { data: githubStats } = await useFetch<GithubStats>('/api/github-stats')
const totalCommits = computed(() => {
  if (githubStats.value?.totalCommits) {
    return new Intl.NumberFormat().format(githubStats.value.totalCommits)
  }
  return stats.value.commits
})
const totalRepos = computed(() => githubStats.value?.totalRepos ?? 0)
const statusLabels = computed(() => content.value?.ui?.statusLabels ?? ({} as any))
</script>

<template>
  <footer class="footer">
    <div class="status-strip">
      <span class="status-item">
        <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--neon);margin-right:6px;box-shadow:0 0 6px var(--neon)" />
        <b>{{ statusLabels.available }}</b> — {{ site.availability }}
      </span>
      <span class="status-item">{{ statusLabels.projects }} <b>{{ totalRepos }}</b></span>
      <span class="status-item">{{ statusLabels.loc }} <b>{{ stats.loc }}</b></span>
      <span class="status-item">{{ statusLabels.commits }} <b>{{ totalCommits }}</b></span>
    </div>
    <div class="footer-right">
      <div class="email">{{ footer.email }}</div>
      <div>{{ footer.colophon }}</div>
    </div>
  </footer>
</template>
