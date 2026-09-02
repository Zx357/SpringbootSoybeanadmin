import { defineStore } from 'pinia';
import { SetupStoreId } from '@/enum';

interface DictItem {
  label: string;
  value: string;
  elTagType: string;
  elTagClass: string;
}

/** 若依字典缓存 store */
export const useDictStore = defineStore(SetupStoreId.Dict, () => {
  const dictMap = new Map<string, DictItem[]>();

  function getDict(key: string) {
    return dictMap.get(key);
  }

  function setDict(key: string, value: DictItem[]) {
    dictMap.set(key, value);
  }

  function cleanDict() {
    dictMap.clear();
  }

  return {
    getDict,
    setDict,
    cleanDict
  };
});
