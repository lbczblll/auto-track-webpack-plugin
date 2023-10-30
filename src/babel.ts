import { NodePath } from '@babel/core';
import generate from '@babel/generator';
import { parse } from '@babel/parser';
import template from '@babel/template';
import traverse from '@babel/traverse';
import {
  isObjectExpression,
  isArrayExpression,
  Statement,
  BlockStatement,
  ArrayExpression,
  ObjectExpression,
  Property,
  ConditionalExpression,
  CallExpression,
  MemberExpression,
  Identifier
} from '@babel/types';

const btnFlag = ['btnShow'];

function findNode(arr: any[]): any {
  return arr.find(node => {
    const n =
      node.key.name === 'on' &&
      node.value.properties.find(
        (n: any) => n.key.name === 'click' || n.key.value === 'click'
      );
    return n;
  });
}
function deepFind(obj: ArrayExpression): any {
  let found;
  for (let i = 0; i < obj?.elements.length; i++) {
    const item = obj.elements[i] as CallExpression;
    if (Array.isArray(item?.arguments)) {
      const args = item?.arguments;
      for (let j = 0; j < args.length; j++) {
        if (isObjectExpression(args[j])) {
          found = findNode((args[j] as any).properties);
          if (found) {
            return found;
          }
        }
        if (!found && isArrayExpression(args[j])) {
          found = deepFind(args[j] as ArrayExpression);
          return found;
        }
      }
    }
  }
}

function findBtnShow(template: string) {
  const buriedInfo = new Map<string, string>();
  let eventNode: any = null;
  buriedInfo.clear();
  const vueTemplateAst = parse(template, { sourceType: 'unambiguous' });
  traverse(vueTemplateAst, {
    ConditionalExpression(path: NodePath<ConditionalExpression>) {
      const { test, consequent } = path.node;
      eventNode = null;
      if (
        btnFlag.includes(
          (
            ((test as CallExpression).callee as MemberExpression)
              .property as Identifier
          ).name
        )
      ) {
        const childrenArray = (test as CallExpression).arguments;
        const stringLiteralValArray = childrenArray.map(
          (child: any) => child.value
        );
        const consequentArgs = (consequent as CallExpression).arguments;
        const objectExpressions = consequentArgs.find(
          (node: { type: string }) => node.type === 'ObjectExpression'
        ) as ObjectExpression;
        if (objectExpressions) {
          eventNode = findNode(objectExpressions.properties);
        }
        if (!eventNode) {
          const arrayExpressions = consequentArgs.find(
            (node: { type: string }) => node.type === 'ArrayExpression'
          ) as ArrayExpression;
          if (arrayExpressions) {
            eventNode = deepFind(arrayExpressions);
          }
        }
        if (eventNode) {
          if (
            !buriedInfo.has(eventNode.value.properties[0].value.property.name)
          ) {
            buriedInfo.set(
              eventNode.value.properties[0].value.property.name,
              stringLiteralValArray[0]
            );
          }
        }
      }
    }
  });
  return buriedInfo;
}

function setAutoTracker(
  method: any,
  script: string,
  buriedFun: string
): string {
  const vueScriptAst = parse(script, { sourceType: 'unambiguous' });
  traverse(vueScriptAst, {
    ObjectExpression(path: NodePath<ObjectExpression>) {
      if (path.node.properties) {
        const methodsArr: any = path.node.properties.find(
          node => ((node as Property).key as Identifier).name === 'methods'
        );
        if (methodsArr) {
          methodsArr.value.properties.forEach((item: any) => {
            if (method.has(item.key.name)) {
              const param = method.get(item.key.name);
              const ast = template.ast`${buriedFun}('${param}')` as Statement;
              const body = item.body as BlockStatement;
              body.body.unshift(ast);
            }
          });
        }
      }
    }
  });
  const { code } = generate(vueScriptAst);
  return code;
}

export { findBtnShow, setAutoTracker };
