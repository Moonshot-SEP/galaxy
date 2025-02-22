<script setup lang="ts">
import { library } from "@fortawesome/fontawesome-svg-core";
import { faClock, faSitemap } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { onMounted, ref } from "vue";

import { invocationCountsFetcher } from "@/api/workflows";
import localize from "@/utils/localization";

library.add(faClock, faSitemap);

interface Props {
    workflow: any;
}

const props = defineProps<Props>();

const count = ref<number | undefined>(undefined);

async function initCounts() {
    const { data } = await invocationCountsFetcher({ workflow_id: props.workflow.id });
    let allCounts = 0;
    for (const stateCount of Object.values(data)) {
        if (stateCount) {
            allCounts += stateCount;
        }
    }
    count.value = allCounts;
}

onMounted(initCounts);
</script>

<template>
    <div class="workflow-invocations-count d-flex align-items-center flex-gapx-1">
        <BBadge
            v-if="count != undefined"
            v-b-tooltip.hover.noninteractive
            pill
            :title="localize('View workflow invocations')"
            class="outline-badge cursor-pointer list-view"
            :to="`/workflows/${props.workflow.id}/invocations`">
            <FontAwesomeIcon :icon="faSitemap" fixed-width />

            <span v-if="count > 0">
                workflow runs:
                {{ count }}
            </span>
            <span v-else> workflow never run </span>
        </BBadge>

        <BButton
            v-else
            v-b-tooltip.hover.noninteractive
            :title="localize('View workflow invocations')"
            class="inline-icon-button"
            variant="link"
            size="sm"
            :to="`/workflows/${props.workflow.id}/invocations`">
            <FontAwesomeIcon :icon="faSitemap" fixed-width />
        </BButton>
    </div>
</template>
