import ModelsType from '@/declare/modelType';
import { defaultDebugApi, defaultApi, sessionStorageDebugApi, sessionStorageApi } from '@/config/url';
import { checkSession } from '@/utils/util';
import { isStatus } from '@/api/common';
import { message, Button } from 'antd';
import { Topology } from '@/declare/api';
import DebugApi from '@/api/debugApi';

export interface State {
  status: boolean,
  api: string,
  debugApi: string,
  refresh:boolean,
  version:string | null,
  topology:Topology,
}

export default {
  state: {
    refresh:true,
    status: false,
    api: checkSession(sessionStorageApi) || defaultApi,
    debugApi: checkSession(sessionStorageDebugApi) || defaultDebugApi,
    version: null,
    topology:{},
  },
  reducers: {
    setApi(state, { payload }) {
      const { api, debugApi } = payload;
      return {
        ...state,
        api,
        debugApi,
      };
    },
    setStatus(state, { payload }) {
      const { status } = payload;
      return {
        ...state,
        status,
      };
    },
    setRefresh(state, { payload }) {
      const { refresh } = payload;
      return {
        ...state,
        refresh,
      };
    },
    setVersion(state, { payload }) {
      const { version } = payload;
      return {
        ...state,
        version,
      };
    },
    setTopology(state, { payload }) {
      const { topology } = payload;
      return {
        ...state,
        topology,
      };
    },
  },
  effects: {
    * getStatus({ payload }, { call, put }) {
      const { api, debugApi } = payload;
      try {
        const data = yield call(isStatus, api, debugApi);
        const status = data[0].data && data[1].data.status === 'ok';
        yield put({
          type:"setStatus",
          payload:{
            status
          }
        })
        if (status) {
          message.success("Connection succeeded");
          yield put({
            type:"setVersion",
            payload:{
              version:data[1].data.version
            }
          })
        }
      } catch (err) {
        if (err instanceof Error) message.info(err.message);
        yield put({
          type:"setStatus",
          payload:{
            status:false,
          }
        })
      } finally {
        yield put({
          type:"setRefresh",
          payload:{
            refresh: false,
          }
        })
      }
    },
    * getTopology({ payload }, { call, put }) {
      const { debugApi } = payload;
      try {
        const { data }  = yield call(DebugApi.getTopology,debugApi);
        console.log("topology",data);
        yield put({
          type:"setTopology",
          payload:{
            topology:data,
          }
        })
      }
      catch (err){
        if (err instanceof Error) message.info(err.message);
      }
    },
  },
  subscriptions: {},
} as ModelsType<State>;
