<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';

import { ref } from 'vue';

import { Page, useVbenModal, confirm } from '@vben/common-ui';

import { message } from 'ant-design-vue';
import dayjs from 'dayjs';
import { VxeButton } from 'vxe-pc-ui';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteCronJobApi, listCronJobApi, stopCronJobApi } from '#/api';

import AppointmentCreateView from './appointment-create-modal.vue';

interface RowType {
  id: number;
  job_id: string;
  state: string;
  name: string;
  func_path: string;
  func_kwargs: string;
  trigger_type: string;
  trigger_args: number;
  task_type: string;
  task_kwargs: string;
  expire_time: string;
  description: null;
  create_time: string;
  update_time: string;
}

const selectRow = ref<RowType>();
const [AppointmentCreateModal, appointmentCreateApi] = useVbenModal({
  connectedComponent: AppointmentCreateView,
});

const formOptions: VbenFormProps = {
  showCollapseButton: false,
  schema: [
    {
      component: 'RangePicker',
      defaultValue: undefined,
      fieldName: 'rangePicker',
      label: '创建时间',
    },
    {
      component: 'Select',
      componentProps: {
        allowClear: true,
        options: [
          {
            label: '运行中',
            value: 'running',
          },
          {
            label: '已停用',
            value: 'stopped',
          },
        ],
        placeholder: '请选择',
      },
      fieldName: 'state',
      label: '状态',
    },
  ],
};

const formatterTimeFriendly = ({ cellValue }) => {
  const minutes = cellValue / 60;
  return Number.isInteger(minutes)
    ? `${minutes.toString()}分钟`
    : `${minutes.toFixed(1)}分钟`;
};
const gridOptions: VxeGridProps<RowType> = {
  checkboxConfig: {
    highlight: true,
    labelField: 'name',
  },
  columns: [
    { title: '序号', type: 'seq', width: 50 },
    {
      field: 'job_id',
      title: '任务ID',
    },
    {
      field: 'task_kwargs.unit_name',
      title: '机构',
      showOverflow: 'tooltip',
      minWidth: 120,
    },
    {
      field: 'task_kwargs.branch_name',
      title: '院区',
      showOverflow: 'tooltip',
    },
    {
      field: 'task_kwargs.dep_name',
      title: '科室',
      minWidth: 120,
    },
    {
      field: 'func_kwargs.date',
      title: '预约时间',
      width: 100,
    },
    {
      field: 'trigger_args',
      title: '轮询间隔时间',
      formatter: formatterTimeFriendly,
      width: 100,
    },
    {
      field: 'state',
      title: '运行状态',
      width: 70,
    },
    {
      field: 'create_time',
      formatter: 'formatDateTime',
      title: '创建时间',
      // width: 100,
    },
    {
      field: 'action',
      fixed: 'right',
      slots: { default: 'action' },
      title: '操作',
      minWidth: 110,
    },
  ],
  height: 'auto',
  keepSource: true,
  rowConfig: {
    isHover: true,
  },
  cellConfig: {
    height: 50, // 设置行高
  },
  pagerConfig: {},
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues: Record<string, any>) => {
        const apiParams = { ...formValues };
        if (
          apiParams.rangePicker &&
          Array.isArray(apiParams.rangePicker) &&
          apiParams.rangePicker.length === 2
        ) {
          apiParams.create_time_from = dayjs(apiParams.rangePicker[0])
            .tz('Asia/Shanghai')
            .format('YYYY-MM-DD');
          apiParams.create_time_to = dayjs(apiParams.rangePicker[1])
            .tz('Asia/Shanghai')
            .format('YYYY-MM-DD');
          delete apiParams.rangePicker;
        }
        // message.success(`Query params: ${JSON.stringify(apiParams)}`);
        return await listCronJobApi({
          page_num: page.currentPage,
          page_size: page.pageSize,
          ...apiParams,
        });
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({ formOptions, gridOptions });

const editRow = (row: RowType) => {
  selectRow.value = row;
  // console.log('edit row', JSON.stringify(row));
  appointmentCreateApi.setData({
    // 表单值
    values: row,
  });
  appointmentCreateApi.open();
};

const deleteRow = (row: RowType) => {
  confirm({
    centered: false,
    content: `确认删除任务 ${row.job_id} ?`,
    icon: 'warning',
  }).then(async () => {
    await deleteCronJobApi({
      job_id: row.job_id,
    });
    message.success(`任务 ${row.job_id} 删除成功`);
    refreshGrid();
  });
};

const stopRow = (row: RowType) => {
  confirm({
    centered: false,
    content: `确认停用任务 ${row.job_id} 吗，停用后不可再编辑 ?`,
    icon: 'warning',
  }).then(async () => {
    await stopCronJobApi({
      job_id: row.job_id,
    });
    message.success(`任务 ${row.job_id} 停用成功`);
    refreshGrid();
  });
};

const createRow = () => {
  appointmentCreateApi.setData({});
  appointmentCreateApi.open();
};

// 处理子组件成功事件
const refreshGrid = () => {
  // 刷新表格数据
  gridApi.query();
};
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <template #toolbar-actions>
        <VxeButton icon="vxe-icon-add" status="primary" @click="createRow()">
          新增
        </VxeButton>
      </template>
      <template #action="{ row }">
        <div style="display: flex; gap: 8px">
          <VxeButton
            icon="vxe-icon-edit"
            mode="text"
            status="primary"
            :disabled="row.state === 'stopped'"
            @click="editRow(row)"
          >
            编辑
          </VxeButton>
          <VxeButton
            icon="vxe-icon-swap"
            mode="text"
            status="warning"
            :disabled="row.state === 'stopped'"
            @click="stopRow(row)"
          >
            停用
          </VxeButton>
          <VxeButton
            icon="vxe-icon-delete"
            mode="text"
            status="error"
            @click="deleteRow(row)"
          >
            删除
          </VxeButton>
        </div>
      </template>
    </Grid>
    <AppointmentCreateModal @success="refreshGrid" />
  </Page>
</template>
