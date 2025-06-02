import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      // icon: 'ic:baseline-view-in-ar',
      icon: 'lucide:layout-dashboard',
      keepAlive: true,
      order: -1,
      title: $t('toolkits.title'),
    },
    name: 'Toolkits',
    path: '/toolkits',
    children: [
      {
        meta: {
          title: '示例',
          icon: 'lucide:layers',
        },
        name: 'Demo',
        path: '/dept',
        component: () => import('#/views/toolkits/guhao/index.vue'),
      },
      {
        meta: {
          title: $t('toolkits.guhao'),
          icon: 'lucide:notepad-text',
        },
        name: 'Appointments',
        path: '/appointments',
        component: () => import('#/views/toolkits/guhao/appointments.vue'),
      },
    ],
  },
];

export default routes;
