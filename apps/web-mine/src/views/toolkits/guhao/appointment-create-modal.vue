<script lang="ts" setup>
import type { CascaderProps } from 'ant-design-vue';

import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { AutoComplete, Cascader, message } from 'ant-design-vue';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import { useVbenForm } from '#/adapter/form';
import {
  addCronJobApi,
  listUnitDeptsApi,
  modifyCronJobApi,
  searchUnitApi,
} from '#/api';

defineOptions({
  name: 'FormModelDemo',
});
dayjs.extend(utc);
dayjs.extend(timezone);

const inEditMode = ref<boolean>(true);
// const data = ref();

// const deptOptions = ref<CascaderProps['options']>([]);
// const deptValue = ref<number[]>([]);

// 添加到现有的 state 对象中
const state = reactive({
  unitValue: '',
  unitOptions: [],
  unitSeletedOpiton: {} as any,
  deptOptions: [] as CascaderProps['options'],
  deptValue: [] as number[],
  deptSelectedOpiton: [] as any,
  originalValues: null as null | Record<string, any>,
});

// 添加重置函数
const resetState = () => {
  state.unitValue = '';
  state.unitOptions = [];
  state.unitSeletedOpiton = {};
  state.deptOptions = [];
  state.deptValue = [];
  state.deptSelectedOpiton = [];
  state.originalValues = null; // 清空全局值
};

const emit = defineEmits(['success']);

async function onSubmit(values: Record<string, any>) {
  // 将时间对象序列化，得到东八区日期
  values.fieldDataPicker = dayjs(values.fieldDataPicker)
    .tz('Asia/Shanghai')
    .format('YYYY-MM-DD');
  if (inEditMode.value) {
    // modifyCronJobApi
    message.info(
      JSON.stringify(values) +
        state.unitValue +
        JSON.stringify(state.deptValue),
    );
    const params = {
      job_id: values.fieldJobId,
      unit_id:
        state.unitSeletedOpiton.unit_id ||
        state.originalValues?.task_kwargs?.unit_id,
      dep_id: state.deptValue.at(-1),
      date: values.fieldDataPicker,
      branch_id:
        state.unitSeletedOpiton.branch_id ||
        state.originalValues?.task_kwargs?.branch_id,
      unit_name:
        state.unitSeletedOpiton.unit_name ||
        state.originalValues?.task_kwargs?.unit_name,
      branch_name:
        state.unitSeletedOpiton.branch_name ||
        state.originalValues?.task_kwargs?.branch_name,
      dep_name:
        state.deptSelectedOpiton.at(-1)?.label ||
        state.originalValues?.task_kwargs?.dep_name,
      expire_time: values.fieldDataPicker,
      name: 'good thing',
      desc: 'desc things',
    };
    await modifyCronJobApi(params);
    message.success('编辑成功');
    emit('success');
  } else {
    // 新增
    await addCronJobApi({
      unit_id: state.unitSeletedOpiton.unit_id,
      dep_id: state.deptValue.at(-1) ?? 0,
      date: values.fieldDataPicker,
      branch_id: state.unitSeletedOpiton.branch_id,
      unit_name: state.unitSeletedOpiton.unit_name,
      branch_name: state.unitSeletedOpiton.branch_name,
      dep_name: state.deptSelectedOpiton.at(-1).label,
      interval_in_sec: values.fieldTimeInterval * 60,
      expire_time: values.fieldDataPicker,
      name: 'good thing',
      desc: 'desc things',
    });
    message.success('新增成功');
    emit('success');
  }
  // console.log(
  //   JSON.stringify(values) + state.unitValue + JSON.stringify(state.deptValue),
  // );
}

const handleSearch = async (searchText: string) => {
  if (searchText) {
    const data = await searchUnitApi({
      unit_name: searchText,
    });
    // branch_name, unit_level_name
    const fixedList = data?.map((item) => ({
      ...item,
      value: item,
      label: `${item.unit_name}${item.branch_name ? `（${item.branch_name}）` : ''} ${item.unit_level_name ? ` - ${item.unit_level_name}` : ''}`,
    }));
    // message.info(JSON.stringify(fixedList));
    state.unitOptions = fixedList;
  }
};
const onUnitSelect = (seletedOption) => {
  state.unitSeletedOpiton = seletedOption;
  state.unitValue = `${seletedOption.unit_name}${seletedOption.branch_name ? `（${seletedOption.branch_name}）` : ''}`;
  formApi.setFieldValue('fieldUnitName', state.unitValue); // 添加这行，更新表单值
  // message.info(JSON.stringify(seletedOption));
  state.deptValue = [];
  onPrepareDepts(seletedOption.unit_id, seletedOption.branch_id, null);
};

const onDeptChange: CascaderProps['onChange'] = (_value, selectedOptions) => {
  state.deptSelectedOpiton = selectedOptions;
  formApi.setFieldValue('fieldDep', state.deptValue); // 添加这行，更新表单值
  // console.log('onDeptChange', JSON.stringify(selectedOptions));
};

function convertDataToOptions(data: any[]) {
  return data.map((item) => ({
    value: item.class_id,
    label: item.class_name,
    children: item.depts.map((dep) => ({
      value: dep.dep_id,
      label: dep.dep_name,
    })),
  }));
}
const onPrepareDepts = async (
  unit_id: number,
  branch_id: number,
  seleted_dep_id: null | number,
) => {
  // console.log('onPrepareDepts', unit_id, branch_id, seleted_dep_id);
  modalApi.setState({ loading: true });
  const data = await listUnitDeptsApi({
    unit_id,
    branch_id,
  });
  modalApi.setState({ loading: false });
  state.deptOptions = convertDataToOptions(data);
  if (seleted_dep_id) {
    const foundItem = state.deptOptions.find((item) =>
      item?.children?.some((child) => child.value === seleted_dep_id),
    );
    if (foundItem) {
      state.deptValue = [foundItem?.value, seleted_dep_id];
    }
  }
  // message.info(JSON.stringify(fixedList));
};

const [Form, formApi] = useVbenForm({
  handleSubmit: onSubmit,
  schema: [
    {
      component: 'Input',
      fieldName: 'fieldJobId',
      label: '任务id',
      componentProps: {
        disabled: true,
        style: { width: '250px' },
      },
      dependencies: {
        show() {
          return inEditMode.value;
        },
        triggerFields: ['fieldDataPicker'],
      },
    },
    {
      component: 'AutoComplete',
      fieldName: 'fieldUnitName',
      label: '医院名称',
      rules: 'required',
    },
    {
      component: 'Cascader',
      fieldName: 'fieldDep',
      label: '科室',
      rules: 'required',
    },
    {
      component: 'DatePicker',
      fieldName: 'fieldDataPicker',
      label: '预约日期',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'fieldTimeInterval',
      label: '轮选间隔时长',
      defaultValue: 10, // 将默认值移到这里
      suffix: () => '分钟',
      dependencies: {
        disabled() {
          return inEditMode.value;
        },
        triggerFields: ['fieldDataPicker'],
      },
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  fullscreenButton: false,

  onCancel() {
    modalApi.close();
  },
  onConfirm: async () => {
    await formApi.submitForm();
    modalApi.close();
  },
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const { values } = modalApi.getData<Record<string, any>>();
      // 设置到 state 中
      state.originalValues = values;

      inEditMode.value = !!values;
      modalApi.setState({
        title: inEditMode.value ? '编辑' : '新增',
      });
      if (inEditMode.value) {
        // Set unitValue which is used by AutoComplete's :value prop
        state.unitValue = `${values.task_kwargs.unit_name}${values.task_kwargs.branch_name ? `（${values.task_kwargs.branch_name}）` : ''}`;

        // 2. Await onPrepareDepts to ensure state.deptValue is populated
        await onPrepareDepts(
          values.task_kwargs.unit_id,
          values.task_kwargs.branch_id,
          values.task_kwargs.dep_id,
        );

        // 3. Set form values for useVbenForm, including fieldUnitName and fieldDep
        formApi.setValues({
          fieldUnitName: state.unitValue, // Add this to update the form model
          fieldDep: state.deptValue, // Add this to update the form model
          fieldDataPicker: dayjs(values.task_kwargs.date),
          fieldJobId: values.job_id,
          fieldTimeInterval: values.trigger_args / 60,
        });
      } else {
        // removeField('fieldJobId'); // This was commented out, keeping as is
      }
    } else {
      formApi.resetForm();
      resetState();
      modalApi.close();
    }
  },
});
</script>
<template>
  <Modal>
    <Form>
      <template #fieldUnitName="slotProps">
        <AutoComplete
          placeholder="请输入机构名"
          v-bind="slotProps"
          :allow-clear="true"
          :dropdown-match-select-width="400"
          :options="state.unitOptions"
          :value="state.unitValue"
          style="width: 250px"
          @search="handleSearch"
          @select="onUnitSelect"
        />
      </template>
      <template #fieldDep="slotProps">
        <Cascader
          placeholder="请输入"
          v-bind="slotProps"
          v-model:value="state.deptValue"
          :options="state.deptOptions"
          style="width: 250px"
          @change="onDeptChange"
        />
      </template>
    </Form>
  </Modal>
</template>
