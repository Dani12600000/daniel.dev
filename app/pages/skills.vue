<script setup lang="ts">
const content = useSiteContent()
const skills = computed(() => content.value?.skills ?? { legend: '', groups: [] })
const totalItems = computed(() =>
  skills.value.groups.reduce((a, g) => a + g.items.length, 0)
)

useHead({ title: 'Stack — Daniel Pereira' })
useReveal()

const lastUpdated = computed(() => content.value?.site?.lastUpdated ?? '—')
</script>

<template>
  <main class="page">
    <header class="page-head reveal">
      <SectionLabel num="02">{{ content?.ui?.labels?.stackToolbox ?? 'Stack / Toolbox' }}</SectionLabel>
    </header>

    <section class="skills-meta-head reveal">
      <h1 style="font-family:var(--display); font-size:clamp(40px,7vw,72px); font-weight:700; letter-spacing:-0.035em; line-height:1; margin:0">
        {{ content?.ui?.skills?.heading1 ?? 'what I' }}<br>
        <span style="color:var(--paper-2)">{{ content?.ui?.skills?.heading2 ?? 'reach for' }}<span style="color:var(--neon)">.</span></span>
      </h1>
      <div class="meta">
        <div>{{ content?.ui?.skills?.lastUpdated ?? 'last updated' }} <b>{{ lastUpdated }}</b></div>
        <div>{{ totalItems }} {{ content?.ui?.skills?.toolsTracked ?? 'tools tracked' }}</div>
      </div>
    </section>

    <section class="skills-table-wrap reveal">
      <div class="skills-table">
        <div class="bar-head">
          <span><span class="prompt-c">$</span> ls ~/stack --group --depth=2</span>
          <span>{{ skills.groups.length }} {{ content?.ui?.skills?.groups ?? 'groups' }}</span>
        </div>

        <div class="skills-legend">
          <span>
            <span class="key-core">●</span> {{ content?.ui?.skills?.core ?? 'core' }}
            <span style="color:var(--paper-3); margin-left:8px">○ {{ content?.ui?.skills?.used ?? 'used' }}</span>
          </span>
          <span>{{ content?.ui?.skills?.experience ?? 'experience' }}</span>
          <span style="text-align:right">{{ content?.ui?.skills?.years ?? 'years' }}</span>
          <span style="text-align:right">{{ content?.ui?.skills?.lastUsed ?? 'last used' }}</span>
        </div>

        <div>
          <div v-for="group in skills.groups" :key="group.group">
            <div class="skills-group-head">
              <span class="arr">▸</span>
              <span class="name">{{ group.group }}</span>
              <span>/ {{ group.items.length }} {{ content?.ui?.skills?.items ?? 'items' }}</span>
              <span class="rule" />
            </div>

            <div class="skills-items">
              <div v-for="s in group.items" :key="s.n" class="skills-row">
                <span class="n">
                  <span :class="['bullet', s.core ? 'core' : 'used']">{{ s.core ? '●' : '○' }}</span>
                  {{ s.n }}
                </span>
                <span class="bars">
                  <span v-for="i in Math.min(s.yrs, 8)" :key="i">▮</span>
                </span>
                <span class="yrs">{{ s.yrs }} {{ s.yrs === 1 ? (content?.ui?.skills?.yr ?? 'yr') : (content?.ui?.skills?.yrs ?? 'yrs') }}</span>
                <span class="last">{{ s.last }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="bar-foot">
          <span><span class="prompt-c">$</span> <span class="blink">_</span></span>
          <span>eof</span>
        </div>
      </div>
    </section>

    <SiteFooter />
  </main>
</template>
