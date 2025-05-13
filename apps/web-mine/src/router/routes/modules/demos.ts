import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    children: [
      {
        meta: {
          title: $t('demos.antd'),
        },
        name: 'AntDesignDemos',
        path: '/demos/ant-design',
        component: () => import('#/views/demos/antd/index.vue'),
      },
      {
        meta: {
          title: '科室',
        },
        name: 'Guahao',
        path: '/demos/dept',
        component: () => import('#/views/demos/guhao/index.vue'),
      },
      {
        meta: {
          title: '预约列表',
        },
        name: 'Appointments',
        path: '/demos/appointments',
        component: () => import('#/views/demos/guhao/appointments.vue'),
      },
    ],
  },
];

export default routes;
