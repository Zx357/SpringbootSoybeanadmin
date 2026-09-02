import { ref, toRefs } from 'vue';
import { useDictStore } from '@/store/modules/dict';
import { getDicts } from '@/service/api/system/dict/data';

/**
 * 获取字典数据（从 RuoYi-Vue3 src/utils/dict.js 移植）
 */
export function useDict(...args: string[]) {
  const res = ref<Record<string, any[]>>({});
  args.forEach(dictType => {
    res.value[dictType] = [];
    const dicts = useDictStore().getDict(dictType);
    if (dicts) {
      res.value[dictType] = dicts;
    } else {
      getDicts(dictType).then((resp: any) => {
        res.value[dictType] = resp.data.map((p: any) => ({
          label: p.dictLabel,
          value: p.dictValue,
          elTagType: p.listClass,
          elTagClass: p.cssClass
        }));
        useDictStore().setDict(dictType, res.value[dictType]);
      });
    }
  });
  return toRefs(res.value);
}
