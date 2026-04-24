<script setup lang="ts">
const content = useSiteContent()
const contact = computed(() => content.value?.contact ?? ({} as any))
const cv = computed(() => content.value?.site?.cv)

useHead({ title: 'Contact — Daniel Pereira' })
useReveal()

const copied = ref<string | null>(null)
const copy = async (text: string, key: string) => {
  try {
    await navigator.clipboard.writeText(text)
    copied.value = key
    setTimeout(() => { if (copied.value === key) copied.value = null }, 1800)
  } catch {
    // noop
  }
}

const form = reactive({ from: '', subject: '', message: '' })
const sending = ref(false)
const sent = ref(false)

const sendMessage = () => {
  if (!form.from || !form.message) return
  sending.value = true
  // open user's mail client as a graceful fallback (no backend required)
  const body = encodeURIComponent(`${form.message}\n\n— ${form.from}`)
  const subj = encodeURIComponent(form.subject || 'hello from daniel.dev')
  window.location.href = `mailto:dp709020@gmail.com?subject=${subj}&body=${body}`
  setTimeout(() => {
    sending.value = false
    sent.value = true
  }, 400)
}

const clearForm = () => {
  form.from = ''
  form.subject = ''
  form.message = ''
  sent.value = false
}

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') clearForm()
}

const { $openCalendly } = useNuxtApp()
const openCalendly = () => $openCalendly()
</script>

<template>
  <main class="page">
    <header class="page-head reveal">
      <SectionLabel num="04">{{ content?.ui?.labels?.contactSayHi ?? 'Contact / say hi' }}</SectionLabel>
    </header>

    <section class="contact-wrap">
      <div class="reveal">
        <h1>
          {{ contact.heading1 }}<br>
          <span class="muted">{{ contact.heading2 }}</span><br>
          {{ contact.heading3?.replace(/\.$/, '') }}<span class="dot">.</span>
        </h1>
        <p class="lede">{{ contact.paragraph }}</p>

        <div class="channels">
          <a
            v-for="c in contact.channels"
            :key="c.k"
            :href="c.href"
            :target="c.href?.startsWith('http') ? '_blank' : undefined"
            rel="noopener"
            class="channel-row"
            :class="{ copied: copied === c.k }"
            data-cursor-hover
            @click="c.copyable ? ($event.preventDefault(), copy(c.v, c.k)) : null"
          >
            <span class="k">{{ c.k }}</span>
            <span class="v">{{ c.v }}</span>
            <span v-if="c.copyable" class="copy-hint">
              {{ copied === c.k ? 'copied ✓' : 'copy ⌘C' }}
            </span>
            <span class="arr">↗</span>
          </a>
        </div>

        <div style="margin-top: 40px; display: flex; gap: 12px; flex-wrap: wrap">
          <button class="btn primary" data-cursor-hover @click="openCalendly">
            {{ content?.ui?.contact?.bookCall ?? 'book a call' }} <span>→</span>
          </button>
          <a v-if="cv" :href="cv.href" download class="btn" data-cursor-hover>
            {{ cv.label }} ↓
          </a>
        </div>
      </div>

      <form
        class="contact-terminal reveal"
        @submit.prevent="sendMessage"
        @keydown="onKeydown"
      >
        <div class="head">
          <span>{{ contact.terminalTitle }}</span>
          <span class="dots"><span /><span /><span /></span>
        </div>
        <div class="body">
          <div class="field">
            <div class="label">&gt; {{ content?.ui?.contact?.from ?? 'from' }}</div>
            <input v-model="form.from" type="email" :placeholder="content?.ui?.contact?.fromPlaceholder ?? 'you@domain.com'" autocomplete="email">
          </div>
          <div class="field">
            <div class="label">&gt; {{ content?.ui?.contact?.subject ?? 'subject' }}</div>
            <input v-model="form.subject" type="text" :placeholder="content?.ui?.contact?.subjectPlaceholder ?? 'What\'s this about?'">
          </div>
          <div class="field">
            <div class="label">&gt; {{ content?.ui?.contact?.message ?? 'message' }}</div>
            <textarea v-model="form.message" :placeholder="content?.ui?.contact?.messagePlaceholder ?? 'Hey Daniel,\n\n// your message here'" />
          </div>
          <div class="foot">
            <span class="hint">{{ contact.formHint }}</span>
            <button type="submit" class="btn primary" :disabled="sending" data-cursor-hover>
              {{ sent ? (content?.ui?.contact?.sent ?? 'sent ✓') : (content?.ui?.contact?.send ?? 'send') }} <span>↵</span>
            </button>
          </div>
        </div>
      </form>
    </section>

    <SiteFooter />
  </main>
</template>
