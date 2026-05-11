<script setup lang="ts">
import { CfStatusCodeBadge } from '@chufix-design/vue';
</script>

<template>
  <div class="demo-row" style="flex-wrap: wrap;">
    <CfStatusCodeBadge :code="200" reason="OK" />
    <CfStatusCodeBadge :code="201" reason="Created" />
    <CfStatusCodeBadge :code="301" reason="Moved" />
    <CfStatusCodeBadge :code="304" reason="Not Modified" />
    <CfStatusCodeBadge :code="400" reason="Bad Request" />
    <CfStatusCodeBadge :code="401" reason="Unauthorized" />
    <CfStatusCodeBadge :code="404" reason="Not Found" />
    <CfStatusCodeBadge :code="429" reason="Too Many" />
    <CfStatusCodeBadge :code="500" reason="Internal" />
    <CfStatusCodeBadge :code="502" reason="Bad Gateway" />
    <CfStatusCodeBadge :code="504" reason="Timeout" />
  </div>
</template>
