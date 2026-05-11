<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import {
  CfAlert,
  CfAvatar,
  CfBadge,
  CfButton,
  CfEmpty,
  CfInput,
  CfTextarea,
} from '@chufix-design/vue';

type CommentStatus = 'approved' | 'pending' | 'rejected';

interface CommentItem {
  id: string;
  parentId?: string | null;
  author: string;
  role?: 'user' | 'admin';
  content: string;
  status?: CommentStatus;
  createdAt: string;
  replies?: CommentItem[];
}

const isEn = typeof window !== 'undefined' && window.location.pathname.startsWith('/en/');
const T = isEn
  ? {
      eyebrow: 'Feedback & discussion',
      title: 'Discussion',
      unavailableTitle: 'Comments backend not configured',
      unavailableBody: 'This page has the comments module wired up. Once Cloudflare Pages Functions and the D1 binding are configured, submissions will land in the moderation queue.',
      placeholderNick: 'Nickname',
      placeholderBody: 'Share suggestions, questions, or usage feedback',
      emojiLabel: 'Quick emoji reply',
      emojiSend: 'One-click send',
      emojiAria: 'Send',
      submit: 'Submit',
      loading: 'Loading comments…',
      emptyTitle: 'No public comments yet',
      emptyBody: 'The first high-quality piece of feedback often saves the next reader a wrong turn.',
      role: 'Maintainer',
      noticeSubmitted: 'Submitted — your comment will appear after moderation.',
      noticeFailed: "Couldn't submit just now, please try again shortly.",
      noticeNeedNick: 'Fill in a nickname first, then tap an emoji to send.',
    }
  : {
      eyebrow: '反馈与讨论',
      title: '讨论',
      unavailableTitle: '评论接口尚未启用',
      unavailableBody: '当前页面已经预留评论模块。配置 Cloudflare Pages Functions 和 D1 绑定后，用户评论会进入待审核队列。',
      placeholderNick: '昵称',
      placeholderBody: '留下建议、问题或使用反馈',
      emojiLabel: '快捷 emoji 评论',
      emojiSend: '一键发送',
      emojiAria: '发送',
      submit: '提交评论',
      loading: '正在加载评论...',
      emptyTitle: '还没有公开评论',
      emptyBody: '第一条高质量反馈，往往会帮后面的使用者少走一点弯路。',
      role: '维护者',
      noticeSubmitted: '评论已提交，审核通过后会显示在这里。',
      noticeFailed: '评论暂时没有提交成功，请稍后再试。',
      noticeNeedNick: '先填写昵称，再点 emoji 就能一键发送。',
    };

const props = withDefaults(defineProps<{
  pageId: string;
  title?: string;
}>(), {
  title: '',
});
const resolvedTitle = computed(() => props.title || T.title);

const api = '/api/comments';
const apiEnabled = !import.meta.env.DEV || import.meta.env.PUBLIC_ENABLE_COMMENTS_API === 'true';
const loading = ref(true);
const posting = ref(false);
const unavailable = ref(false);
const notice = ref('');
const comments = ref<CommentItem[]>([]);
const author = ref('');
const content = ref('');
const quickEmojis = ['👍', '❤️', '🎉', '👀', '🙌', '💡'];

const count = computed(() =>
  comments.value.reduce((sum, item) => sum + 1 + (item.replies?.length ?? 0), 0),
);

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(isEn ? 'en-US' : 'zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function normalize(items: CommentItem[]) {
  const byId = new Map<string, CommentItem>();
  const roots: CommentItem[] = [];

  for (const item of items) {
    byId.set(item.id, { ...item, replies: [] });
  }
  for (const item of byId.values()) {
    if (item.parentId && byId.has(item.parentId)) {
      byId.get(item.parentId)?.replies?.push(item);
    } else {
      roots.push(item);
    }
  }
  return roots;
}

async function loadComments() {
  loading.value = true;
  notice.value = '';
  try {
    const res = await fetch(`${api}?pageId=${encodeURIComponent(props.pageId)}`, {
      headers: { accept: 'application/json' },
    });
    if (res.status === 404 || res.status === 501) {
      unavailable.value = true;
      comments.value = [];
      return;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json() as {
      ok?: boolean;
      code?: string;
      comments?: CommentItem[];
    };
    if (data.ok === false && data.code === 'COMMENTS_DB_NOT_BOUND') {
      unavailable.value = true;
      comments.value = [];
      return;
    }
    comments.value = normalize(data.comments ?? []);
  } catch {
    unavailable.value = true;
    comments.value = [];
  } finally {
    loading.value = false;
  }
}

async function submit(overrideContent?: string) {
  const nextAuthor = author.value.trim();
  const nextContent = (overrideContent ?? content.value).trim();
  if (!nextAuthor || !nextContent || posting.value || unavailable.value) return;

  posting.value = true;
  notice.value = '';
  try {
    const res = await fetch(api, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        pageId: props.pageId,
        author: nextAuthor,
        content: nextContent,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (!overrideContent) content.value = '';
    notice.value = T.noticeSubmitted;
    await loadComments();
  } catch {
    notice.value = T.noticeFailed;
  } finally {
    posting.value = false;
  }
}

function quickSendEmoji(emoji: string) {
  if (posting.value || unavailable.value) return;
  if (!author.value.trim()) {
    content.value = emoji;
    notice.value = T.noticeNeedNick;
    return;
  }
  submit(emoji);
}

onMounted(() => {
  if (!apiEnabled) {
    unavailable.value = true;
    loading.value = false;
    return;
  }
  loadComments();
});
</script>

<template>
  <section class="doc-comments" aria-labelledby="doc-comments-title">
    <header class="doc-comments__header">
      <div>
        <p class="doc-comments__eyebrow">{{ T.eyebrow }}</p>
        <h2 id="doc-comments-title">{{ resolvedTitle }}</h2>
      </div>
      <CfBadge tone="info" :content="count" show-zero />
    </header>

    <CfAlert v-if="unavailable" tone="warning" variant="soft" :title="T.unavailableTitle">
      {{ T.unavailableBody }}
    </CfAlert>

    <form class="doc-comments__form" @submit.prevent="submit()">
      <CfInput
        v-model="author"
        :placeholder="T.placeholderNick"
        size="md"
        :disabled="posting || unavailable"
      />
      <CfTextarea
        v-model="content"
        :placeholder="T.placeholderBody"
        :rows="4"
        :maxlength="600"
        show-count
        auto-resize
        :disabled="posting || unavailable"
      />
      <div class="doc-comments__emoji" :aria-label="T.emojiLabel">
        <span>{{ T.emojiSend }}</span>
        <CfButton
          v-for="emoji in quickEmojis"
          :key="emoji"
          type="button"
          variant="ghost"
          size="sm"
          shape="square"
          :disabled="posting || unavailable"
          :aria-label="`${T.emojiAria} ${emoji}`"
          @click="quickSendEmoji(emoji)"
        >
          {{ emoji }}
        </CfButton>
      </div>
      <div class="doc-comments__actions">
        <p v-if="notice" class="doc-comments__notice">{{ notice }}</p>
        <CfButton
          type="submit"
          size="sm"
          :loading="posting"
          :disabled="!author.trim() || !content.trim() || unavailable"
        >
          {{ T.submit }}
        </CfButton>
      </div>
    </form>

    <div v-if="loading" class="doc-comments__loading">{{ T.loading }}</div>
    <CfEmpty
      v-else-if="!comments.length"
      :title="T.emptyTitle"
      :description="T.emptyBody"
      illustration="empty"
    />

    <ol v-else class="doc-comments__list">
      <li v-for="item in comments" :key="item.id" class="doc-comments__item">
        <article class="doc-comment">
          <CfAvatar :name="item.author" size="sm" />
          <div class="doc-comment__body">
            <div class="doc-comment__meta">
              <strong>{{ item.author }}</strong>
              <span v-if="item.role === 'admin'" class="doc-comment__role">{{ T.role }}</span>
              <time :datetime="item.createdAt">{{ formatTime(item.createdAt) }}</time>
            </div>
            <p>{{ item.content }}</p>
          </div>
        </article>

        <ol v-if="item.replies?.length" class="doc-comments__replies">
          <li v-for="reply in item.replies" :key="reply.id" class="doc-comments__reply">
            <article class="doc-comment doc-comment--reply">
              <CfAvatar :name="reply.author" size="sm" />
              <div class="doc-comment__body">
                <div class="doc-comment__meta">
                  <strong>{{ reply.author }}</strong>
                  <span v-if="reply.role === 'admin'" class="doc-comment__role">维护者</span>
                  <time :datetime="reply.createdAt">{{ formatTime(reply.createdAt) }}</time>
                </div>
                <p>{{ reply.content }}</p>
              </div>
            </article>
          </li>
        </ol>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.doc-comments {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--line-1);
}
.doc-comments__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}
.doc-comments__eyebrow {
  margin: 0 0 0.2rem;
  color: var(--fg-3);
  font-size: var(--t-12);
  font-weight: var(--w-semibold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.doc-comments h2 {
  margin: 0;
  font-size: var(--t-20);
  line-height: var(--lh-20);
}
.doc-comments__form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 1rem 0 1.25rem;
}
.doc-comments__emoji {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
}
.doc-comments__emoji span {
  color: var(--fg-3);
  font-size: var(--t-12);
}
.doc-comments__emoji .cf-btn {
  min-width: 2rem;
}
.doc-comments__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.doc-comments__notice,
.doc-comments__loading {
  margin: 0;
  color: var(--fg-2);
  font-size: var(--t-13);
}
.doc-comments__list,
.doc-comments__replies {
  list-style: none;
  margin: 0;
  padding: 0;
}
.doc-comments__item + .doc-comments__item {
  margin-top: 1rem;
}
.doc-comment {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.75rem;
  padding: 0.9rem 0;
  border-bottom: 1px solid var(--line-1);
}
.doc-comment__body {
  min-width: 0;
}
.doc-comment__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem 0.55rem;
  color: var(--fg-2);
  font-size: var(--t-12);
}
.doc-comment__meta strong {
  color: var(--fg-1);
  font-size: var(--t-13);
}
.doc-comment__role {
  display: inline-flex;
  align-items: center;
  min-height: 1.25rem;
  padding: 0 0.4rem;
  border-radius: var(--r-3);
  background: var(--accent-soft);
  color: var(--accent-1);
  font-weight: var(--w-semibold);
}
.doc-comment p {
  margin: 0.35rem 0 0;
  color: var(--fg-1);
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
.doc-comments__replies {
  margin-left: 2.75rem;
}
.doc-comment--reply {
  padding-left: 0.75rem;
  border-left: 2px solid var(--line-1);
}
@media (max-width: 640px) {
  .doc-comments__actions {
    align-items: stretch;
    flex-direction: column;
  }
  .doc-comments__actions .cf-btn {
    width: 100%;
  }
  .doc-comments__replies {
    margin-left: 1rem;
  }
}
</style>
