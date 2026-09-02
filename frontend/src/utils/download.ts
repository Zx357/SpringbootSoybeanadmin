import axios from 'axios';
import { ElLoading, ElMessage } from 'element-plus';
import { saveAs } from 'file-saver';
import { localStg } from '@/utils/storage';
import { getServiceBaseURL } from '@/utils/service';
import { blobValidate, tansParams } from '@/utils/ruoyi';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

function getHeaders() {
  const token = localStg.get('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function printErrMsg(data: Blob) {
  const resText = await data.text();
  const rspObj = JSON.parse(resText);
  ElMessage.error(rspObj.msg || '下载文件出现错误，请联系管理员！');
}

/** 通用下载方法（POST，表单参数，blob 响应） */
export function download(url: string, params: any, filename: string, config?: any) {
  const downloadLoadingInstance = ElLoading.service({ text: '正在下载数据，请稍候', background: 'rgba(0, 0, 0, 0.7)' });

  return axios
    .post(baseURL + url, params, {
      transformRequest: [(data: any) => tansParams(data)],
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', ...getHeaders() },
      responseType: 'blob',
      ...config
    })
    .then(async res => {
      const isBlob = blobValidate(res.data);
      if (isBlob) {
        const blob = new Blob([res.data]);
        saveAs(blob, filename);
      } else {
        await printErrMsg(res.data);
      }
      downloadLoadingInstance.close();
    })
    .catch((r: any) => {
      console.error(r);
      ElMessage.error('下载文件出现错误，请联系管理员！');
      downloadLoadingInstance.close();
    });
}

const downloadPlugin = {
  /** 根据文件名下载（通用下载接口） */
  name(name: string, isDelete = true) {
    const url = `${baseURL}/common/download?fileName=${encodeURIComponent(name)}&delete=${isDelete}`;
    return axios
      .get(url, { responseType: 'blob', headers: getHeaders() })
      .then(async res => {
        if (blobValidate(res.data)) {
          const blob = new Blob([res.data]);
          saveAs(blob, decodeURIComponent(res.headers['download-filename']));
        } else {
          await printErrMsg(res.data);
        }
      });
  },
  /** 根据资源路径下载 */
  resource(resource: string) {
    const url = `${baseURL}/common/download/resource?resource=${encodeURIComponent(resource)}`;
    return axios
      .get(url, { responseType: 'blob', headers: getHeaders() })
      .then(async res => {
        if (blobValidate(res.data)) {
          const blob = new Blob([res.data]);
          saveAs(blob, decodeURIComponent(res.headers['download-filename']));
        } else {
          await printErrMsg(res.data);
        }
      });
  },
  /** zip 下载 */
  zip(url: string, name: string) {
    const downloadLoadingInstance = ElLoading.service({ text: '正在下载数据，请稍候', background: 'rgba(0, 0, 0, 0.7)' });
    return axios
      .get(baseURL + url, { responseType: 'blob', headers: getHeaders() })
      .then(async res => {
        if (blobValidate(res.data)) {
          const blob = new Blob([res.data], { type: 'application/zip' });
          saveAs(blob, name);
        } else {
          await printErrMsg(res.data);
        }
        downloadLoadingInstance.close();
      })
      .catch((r: any) => {
        console.error(r);
        ElMessage.error('下载文件出现错误，请联系管理员！');
        downloadLoadingInstance.close();
      });
  },
  saveAs(text: any, name: string, opts?: any) {
    saveAs(text, name, opts);
  }
};

export default downloadPlugin;
