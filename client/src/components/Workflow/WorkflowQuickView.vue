<script setup lang="ts">
import { type AxiosError } from "axios";
import { BAlert, BCard } from "bootstrap-vue";
import { ref, watch } from "vue";

import { fromSimple } from "@/components/Workflow/Editor/modules/model";
import { getWorkflowFull, getWorkflowInfo } from "@/components/Workflow/workflows.services";
import { useDatatypesMapper } from "@/composables/datatypesMapper";
import { provideScopedWorkflowStores } from "@/composables/workflowStores";
import type { Workflow } from "@/stores/workflowStore";
import { assertDefined } from "@/utils/assertions";

import Heading from "@/components/Common/Heading.vue";
import LoadingSpan from "@/components/LoadingSpan.vue";
import WorkflowGraph from "@/components/Workflow/Editor/WorkflowGraph.vue";
import WorkflowInformation from "@/components/Workflow/Published/WorkflowInformation.vue";
import WorkflowRunButton from "@/components/Workflow/WorkflowRunButton.vue";

const props = defineProps<{
    id: string;
}>();

const { datatypesMapper } = useDatatypesMapper();

const { stateStore } = provideScopedWorkflowStores(props.id);

stateStore.scale = 0.75;

const loading = ref(true);
const errored = ref(false);
const errorMessage = ref("");
const workflow = ref<Workflow | null>(null);
const workflowInfo = ref<
    | {
          name: string;
          [key: string]: unknown;
          license?: string;
          tags?: string[];
          update_time: string;
      }
    | undefined
>();

watch(
    () => props.id,
    async (id) => {
        workflowInfo.value = undefined;
        loading.value = true;
        errored.value = false;
        errorMessage.value = "";

        try {
            const [workflowInfoData, fullWorkflow] = await Promise.all([getWorkflowInfo(id), getWorkflowFull(id)]);

            assertDefined(workflowInfoData.name);

            workflowInfo.value = workflowInfoData;
            workflow.value = fullWorkflow;

            fromSimple(props.id, fullWorkflow);
        } catch (e) {
            const error = e as AxiosError<{ err_msg?: string }>;

            if (error.response?.data.err_msg) {
                errorMessage.value = error.response.data.err_msg;
            }

            errored.value = true;
        } finally {
            loading.value = false;
        }
    },
    {
        immediate: true,
    }
);
</script>

<template>
    <div class="workflow-quick-view h-100">
        <div v-if="loading" class="w-100">
            <BAlert class="w-100" show variant="info">
                <LoadingSpan message="Loading workflow preview" />
            </BAlert>
        </div>

        <div v-else class="workflow-preview-container h-100">
            <div class="w-100">
                <span class="d-flex mb-2 flex-gapx-1">
                    <Heading h1 separator inline size="xl" class="flex-grow-1 mb-0"> Workflow Preview </Heading>

                    <WorkflowRunButton :id="props.id" full />
                </span>
            </div>

            <div class="w-100 h-100 d-flex">
                <template v-if="errored">
                    <BAlert v-if="errorMessage" show variant="danger">
                        Failed to load workflow:
                        {{ errorMessage }}
                    </BAlert>

                    <BAlert v-else show variant="danger"> Unknown Error </BAlert>
                </template>

                <BCard v-else-if="!loading && workflowInfo" class="workflow-preview-card">
                    <WorkflowGraph
                        v-if="workflow && datatypesMapper"
                        :steps="workflow.steps"
                        :datatypes-mapper="datatypesMapper"
                        readonly />
                </BCard>

                <WorkflowInformation
                    v-if="!loading && !errored && workflowInfo"
                    class="pl-2"
                    :workflow-info="workflowInfo" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "breakpoints.scss";

.workflow-quick-view {
    .workflow-preview-container {
        display: flex;
        flex-direction: column;
        width: 100%;

        .workflow-preview-card {
            flex-grow: 2;
        }

        &:deep(.workflow-information) {
            max-width: 500px;
            height: 100%;
        }
    }

    @media only screen and (max-width: $breakpoint-xl) {
        flex-direction: column;
        height: unset;

        .workflow-preview {
            height: 450px;
        }

        &:deep(.workflow-information) {
            max-width: unset;
            height: unset;
        }
    }
}
</style>
