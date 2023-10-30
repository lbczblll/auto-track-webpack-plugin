import { findBtnShow, setAutoTracker } from './babel';
import { isVueTemplate, isScriptTemplate } from './utils';

const cacheMethod = new Map();
interface QueryObj {
  moduleRequest: string;
  buriedPoint: string;
}
export default function addBuriedPointLoader(this: any, source: string) {
  const query = (this as any).query.replace(/\?{/, '{');
  const queryObj: QueryObj = JSON.parse(query);
  if (cacheMethod.has(this.resourcePath)) {
    if (isScriptTemplate(queryObj.moduleRequest)) {
      const code = setAutoTracker(
        cacheMethod.get(this.resourcePath),
        source,
        queryObj.buriedPoint
      );
      return code;
    }
  }
  if (isVueTemplate(queryObj.moduleRequest)) {
    const methodCache = findBtnShow(source);
    if (methodCache && methodCache.size !== 0) {
      cacheMethod.set(this.resourcePath, methodCache);
    }
    return source;
  }
}
