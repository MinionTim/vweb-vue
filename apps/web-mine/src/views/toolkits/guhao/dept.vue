<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';
import { VxeButton } from 'vxe-pc-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getExampleTableApi } from '#/api';

import ChooseDeptView from './choose-dept-modal.vue';

interface RowType {
  category: string;
  color: string;
  id: string;
  price: string;
  productName: string;
  releaseDate: string;
}
const selectRow = ref<RowType>();

const [ChooseDeptModal, chooseDeptModalApi] = useVbenModal({
  connectedComponent: ChooseDeptView,
});

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    {
      component: 'Input',
      fieldName: 'category',
      label: 'Category',
    },
    {
      component: 'Input',
      fieldName: 'productName',
      label: 'ProductName',
    },
    {
      component: 'Input',
      fieldName: 'price',
      label: 'Price',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          {
            label: 'Color1',
            value: '1',
          },
          {
            label: 'Color2',
            value: '2',
          },
        ],
        placeholder: '请选择',
      },
      fieldName: 'color',
      label: 'Color',
    },
    {
      component: 'DatePicker',
      fieldName: 'datePicker',
      label: 'Date',
    },
  ],
  // 控制表单是否显示折叠按钮
  showCollapseButton: true,
};

const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    { align: 'left', title: 'Name', type: 'checkbox', width: 100 },
    { field: 'category', title: '名称' },
    { field: 'color', title: '院区' },
    { field: 'productName', title: '类型' },
    { field: 'price', title: '级别' },
    { field: 'price', title: '区域', width: 100 },
    { field: 'releaseDate', formatter: 'formatDateTime', title: 'Date' },
    // { title: '操作', fixed: 'right', width: 100, slots: { default: 'action' } },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      width: 120,
    },
  ],
  height: 'auto',
  keepSource: true,
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        message.success(`Query params: ${JSON.stringify(formValues)}`);
        return await getExampleTableApi({
          page: page.currentPage,
          pageSize: page.pageSize,
          ...formValues,
        });
      },
    },
  },
  rowConfig: {
    isHover: true,
  },
};

const editRow = (row: RowType) => {
  selectRow.value = row;
  // message.info(
  //   `How many roads must a man walk down, ${selectRow.value}, ${selectRow.value.productName}`,
  // );
  // formOptions.data = Object.assign(XEUtils.clone(defaultData, true), row)
  // showEditPopup.value = true
  chooseDeptModalApi.setData(row);
  chooseDeptModalApi.open();
};

const [Grid] = useVbenVxeGrid({ formOptions, gridOptions });
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #action="{ row }">
        <VxeButton
          icon="vxe-icon-edit"
          mode="text"
          status="primary"
          @click="editRow(row)"
        >
          选择
        </VxeButton>
      </template>
    </Grid>
  </Page>
  <ChooseDeptModal />
</template>
