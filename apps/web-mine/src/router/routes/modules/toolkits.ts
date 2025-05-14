import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: -1,
      title: $t('toolkits.title'),
    },
    name: 'Toolkits',
    path: '/toolkits',
    children: [
      {
        meta: {
          title: '科室',
        },
        name: 'Guahao',
        path: '/dept',
        component: () => import('#/views/toolkits/guhao/index.vue'),
      },
      {
        meta: {
          // affixTab: true,
          title: $t('toolkits.guhao'),
        },
        name: 'Appointments',
        path: '/appointments',
        component: () => import('#/views/toolkits/guhao/appointments.vue'),
      },
    ],
  },
];

export default routes;
