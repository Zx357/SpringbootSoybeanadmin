/**
 * 若依通用方法（从 RuoYi-Vue3 src/utils/ruoyi.js 移植）
 */

// 日期格式化
export function parseTime(time: any, pattern?: string) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}';
  let date: Date;
  if (typeof time === 'object') {
    date = time as Date;
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time);
    } else if (typeof time === 'string') {
      time = time
        .replace(/-/gm, '/')
        .replace('T', ' ')
        .replace(/\.[\d]{3}/gm, '');
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = (formatObj as any)[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    if (result.length > 0 && value < 10) {
      value = `0${value}`;
    }
    return value || 0;
  });
  return timeStr;
}

// 表单重置（通过组件实例调用，this 为组件代理）
export function resetForm(this: any, refName: string) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields();
  }
}

// 添加日期范围
export function addDateRange(params: any, dateRange: any, propName?: string) {
  const search = params;
  search.params = typeof search.params === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {};
  const range = Array.isArray(dateRange) ? dateRange : [];
  if (typeof propName === 'undefined') {
    search.params.beginTime = range[0];
    search.params.endTime = range[1];
  } else {
    search.params[`begin${propName}`] = range[0];
    search.params[`end${propName}`] = range[1];
  }
  return search;
}

// 回显数据字典
export function selectDictLabel(datas: any, value: any) {
  if (value === undefined) {
    return '';
  }
  const actions: string[] = [];
  Object.keys(datas).some(key => {
    if (datas[key].value === `${value}`) {
      actions.push(datas[key].label);
      return true;
    }
    return false;
  });
  if (actions.length === 0) {
    actions.push(value);
  }
  return actions.join('');
}

// 回显数据字典（字符串、数组）
export function selectDictLabels(datas: any, value: any, separator?: string) {
  if (value === undefined || value.length === 0) {
    return '';
  }
  if (Array.isArray(value)) {
    value = value.join(',');
  }
  const actions: string[] = [];
  const currentSeparator = undefined === separator ? ',' : separator;
  const temp = value.split(currentSeparator);
  Object.keys(value.split(currentSeparator)).some((val: any) => {
    let match = false;
    Object.keys(datas).some(key => {
      if (datas[key].value === `${temp[val]}`) {
        actions.push(datas[key].label + currentSeparator);
        match = true;
      }
      return false;
    });
    if (!match) {
      actions.push(temp[val] + currentSeparator);
    }
    return false;
  });
  return actions.join('').substring(0, actions.join('').length - 1);
}

// 转换字符串，undefined、null 等转化为 ""
export function parseStrEmpty(str: any) {
  if (!str || str === 'undefined' || str === 'null') {
    return '';
  }
  return str;
}

/**
 * 构造树型结构数据
 * @param data 数据源
 * @param id id字段 默认 'id'
 * @param parentId 父节点字段 默认 'parentId'
 * @param children 孩子节点字段 默认 'children'
 */
export function handleTree(data: any[], id?: string, parentId?: string, children?: string) {
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  };

  const childrenListMap: Record<string, any> = {};
  const tree: any[] = [];
  for (const d of data) {
    const cid = d[config.id];
    childrenListMap[cid] = d;
    if (!d[config.childrenList]) {
      d[config.childrenList] = [];
    }
  }

  for (const d of data) {
    const cparentId = d[config.parentId];
    const parentObj = childrenListMap[cparentId];
    if (!parentObj) {
      tree.push(d);
    } else {
      parentObj[config.childrenList].push(d);
    }
  }
  return tree;
}

/**
 * 参数处理
 * @param params 参数
 */
export function tansParams(params: Record<string, any>) {
  let result = '';
  for (const propName of Object.keys(params)) {
    const value = params[propName];
    const part = `${encodeURIComponent(propName)}=`;
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== '' && typeof value[key] !== 'undefined') {
            const subParams = `${propName}[${key}]`;
            const subPart = `${encodeURIComponent(subParams)}=`;
            result += `${subPart + encodeURIComponent(value[key])}&`;
          }
        }
      } else {
        result += `${part + encodeURIComponent(value)}&`;
      }
    }
  }
  return result;
}

// 返回项目路径
export function getNormalPath(p?: string) {
  if (!p || p.length === 0 || p === 'undefined') {
    return p as string;
  }
  const res = p.replace('//', '/');
  if (res[res.length - 1] === '/') {
    return res.slice(0, res.length - 1);
  }
  return res;
}

// 验证是否为blob格式
export function blobValidate(data: any) {
  return data.type !== 'application/json';
}
