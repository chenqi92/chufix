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

const props = withDefaults(defineProps<{
  pageId: string;
  title?: string;
}>(), {
  title: '讨论',
});

const api = '/api/comments';
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
  return new Intl.DateTimeFormat('zh-CN', {
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
    notice.value = '评论已提交，审核通过后会显示在这里。';
    await loadComments();
  } catch {
    notice.value = '评论暂时没有提交成功，请稍后再试。';
  } finally {
    posting.value = false;
  }
}

function quickSendEmoji(emoji: string) {
  if (posting.value || unavailable.value) return;
  if (!author.value.trim()) {
    content.value = emoji;
    notice.value = '先填写昵称，再点 emoji 就能一键发送。';
    return;
  }
  submit(emoji);
}

onMounted(loadComments);
</script>

<template>
  <section class="doc-comments" aria-labelledby="doc-comments-title">
    <header class="doc-comments__header">
      <div>
        <p class="doc-comments__eyebrow">反馈与讨论</p>
        <h2 id="doc-comments-title">{{ title }}</h2>
      </div>
      <CfBadge tone="info" :content="count" show-zero />
    </header>

    <CfAlert v-if="unavailable" tone="warning" variant="soft" title="评论接口尚未启用">
      当前页面已经预留评论模块。配置 Cloudflare Pages Functions 和 D1 绑定后，用户评论会进入待审核队列。
    </CfAlert>

    <form class="doc-comments__form" @submit.prevent="submit()">
      <CfInput
        v-model="author"
        placeholder="昵称"
        size="md"
        :disabled="posting || unavailable"
      />
      <CfTextarea
        v-model="content"
        placeholder="留下建议、问题或使用反馈"
        :rows="4"
        :maxlength="600"
        show-count
        auto-resize
        :disabled="posting || unavailable"
      />
      <div class="doc-comments__emoji" aria-label="快捷 emoji 评论">
        <span>一键发送</span>
        <CfButton
          v-for="emoji in quickEmojis"
          :key="emoji"
          type="button"
          variant="ghost"
          size="sm"
          shape="square"
          :disabled="posting || unavailable"
          :aria-label="`发送 ${emoji}`"
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
          提交评论
        </CfButton>
      </div>
    </form>

    <div v-if="loading" class="doc-comments__loading">正在加载评论...</div>
    <CfEmpty
      v-else-if="!comments.length"
      title="还没有公开评论"
      description="第一条高质量反馈，往往会帮后面的使用者少走一点弯路。"
      illustration="empty"
    />

    <ol v-else class="doc-comments__list">
      <li v-for="item in comments" :key="item.id" class="doc-comments__item">
        <article class="doc-comment">
          <CfAvatar :name="item.author" size="sm" />
          <div class="doc-comment__body">
            <div class="doc-comment__meta">
              <strong>{{ item.author }}</strong>
              <span v-if="item.role === 'admin'" class="doc-comment__role">维护者</span>
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
