<script lang="ts" setup>
import type { CascaderProps } from 'ant-design-vue';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Cascader, message } from 'ant-design-vue';

const data = ref();
const options = ref<CascaderProps['options']>([]);
// 级联组件的结果
const choiceResult = ref<string[]>([]);

const [Modal, modalApi] = useVbenModal({
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    message.info(`onConfirm2, ${choiceResult.value}`);
    modalApi.close();
  },
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      handleUpdate();
      data.value = modalApi.getData<Record<string, any>>();
    }
  },
});

function handleUpdate() {
  modalApi.setState({ loading: true });
  setTimeout(() => {
    options.value = [
      {
        value: 'zhejiang',
        label: '浙江',
        children: [
          {
            value: 'hangzhou',
            label: '杭州1',
          },
          {
            value: 'quzhou',
            label: '衢州2',
          },
        ],
      },
      {
        value: 'jiangsu',
        label: 'Jiangsu',
        children: [
          {
            value: 'nanjing',
            label: 'Nanjing',
            children: [
              {
                value: 'zhonghuamen',
                label: 'Zhong Hua Men',
              },
            ],
          },
        ],
      },
    ];
    modalApi.setState({ loading: false });
  }, 2000);
}
</script>

<template>
  <Modal title="请选择">
    <div class="flex flex-wrap p-5 pt-0">名称： {{ data.productName }}</div>
    <div class="flex flex-wrap p-5 pt-0">类型： {{ data.productName }}</div>
    <div class="flex flex-wrap items-center p-5 pt-0">
      <span>科室：</span>
      <Cascader
        v-model:value="choiceResult"
        :options="options"
        placeholder="请选择"
        style="width: 80%"
      />
    </div>
  </Modal>
</template>
