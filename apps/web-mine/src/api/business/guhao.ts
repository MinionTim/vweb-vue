import { requestClient } from '#/api/request';

export namespace DemoTableApi {
  export interface PageFetchParams {
    [key: string]: any;
    page: number;
    pageSize: number;
  }
}

export namespace CronjobApi {
  export interface PageFetchParams {
    [key: string]: any;
    page_num: number;
    page_size: number;
  }
  export interface AddCronParams {
    unit_id: number;
    dep_id: number;
    date: string;
    branch_id: number;
    unit_name: string;
    branch_name: number;
    dep_name: number;
    interval_in_sec: number;
    expire_time: string;
    name: string;
    desc: string;
  }
  export interface ModifyCronParams {
    job_id: string;
    unit_id: number;
    dep_id: number;
    date: string;
    branch_id: number;
    unit_name: string;
    branch_name: number;
    dep_name: number;
    expire_time: string;
    name: string;
    desc: string;
  }
  export interface StopCronParams {
    job_id: string;
  }
  export interface DeleteCronParams {
    job_id: string;
  }
  export interface SearchUnitParams {
    unit_name: string;
  }
  export interface ListUnitDeptsParams {
    unit_id: number;
    branch_id: number;
  }
}

/**
 * 获取示例表格数据
 */
async function listCronJobApi(params: CronjobApi.PageFetchParams) {
  return requestClient.get('/list_cron_jobs', { params });
}
async function stopCronJobApi(job_id: string) {
  return requestClient.post('/stop_cron_job', { job_id });
}
async function addCronJobApi(params: CronjobApi.AddCronParams) {
  return requestClient.post('/add_cron_job', params);
}
async function modifyCronJobApi(params: CronjobApi.ModifyCronParams) {
  return requestClient.post('/modify_cron_job', params);
}
async function deleteCronJobApi(params: CronjobApi.DeleteCronParams) {
  return requestClient.post('/delete_cron_job', params);
}
async function searchUnitApi(params: CronjobApi.SearchUnitParams) {
  return requestClient.get('/query_units', { params });
}

async function listUnitDeptsApi(params: CronjobApi.ListUnitDeptsParams) {
  return requestClient.get('/list_depts', { params });
}
/**
 * 获取示例表格数据
 */
async function getExampleTableApi(params: DemoTableApi.PageFetchParams) {
  return requestClient.get('/table/list', { params });
}

export {
  addCronJobApi,
  deleteCronJobApi,
  getExampleTableApi,
  listCronJobApi,
  listUnitDeptsApi,
  modifyCronJobApi,
  searchUnitApi,
  stopCronJobApi,
};
