import { Selectable } from "@uimix/model/src/models/Selectable";
import { Variant } from "@uimix/model/src/models/Component";
import {
  buildNodeCSS,
  getLayoutType,
} from "@uimix/model/src/models/buildNodeCSS";
import { kebabCase } from "lodash-es";
import * as CSS from "csstype";
import { Page } from "@uimix/model/src/models/Page";
import * as CodeAsset from "@uimix/code-asset-types";

function isDesignToken(
  value: CodeAsset.DesignToken | CodeAsset.DesignTokens
): value is CodeAsset.DesignToken {
  return value.$type !== undefined;
}

function getColorToken(
  designTokens: CodeAsset.DesignTokens,
  path: string[]
): CodeAsset.ColorToken | undefined {
  if (path.length === 0) {
    return undefined;
  }

  const child = designTokens[path[0]];
  if (!child) {
    return;
  }

  if (path.length > 1 && !isDesignToken(child)) {
    return getColorToken(child, path.slice(1));
  }

  if (isDesignToken(child) && child.$type === "color") {
    return child;
  }
}

const baseCSS = [
  `box-sizing: border-box;`,
  `-webkit-font-smoothing: antialiased;`,
];

export class CSSGenerator {
  page: Page;
  designTokens: CodeAsset.DesignTokens;

  constructor(page: Page, designTokens: CodeAsset.DesignTokens) {
    this.page = page;
    this.designTokens = designTokens;
  }

  generate(): string {
    const results: string[] = [];

    const cssForSelectable = new Map<Selectable, CSS.Properties>();
    const generateCSS = (selectable: Selectable) => {
      let css = cssForSelectable.get(selectable);
      if (css) {
        return css;
      }

      let parent = selectable.parent;
      if (parent?.originalNode.isAbstract) {
        parent = undefined;
      }
      const parentLayoutType =
        parent?.node.type === "frame" ? getLayoutType(parent.style) : undefined;

      css = buildNodeCSS(
        selectable.node.type,
        selectable.style,
        (tokenID) =>
          getColorToken(this.designTokens, tokenID.split("/"))?.$value ??
          selectable.project.colorTokens.resolve(tokenID),
        parentLayoutType
      ) as CSS.Properties;

      if (!parent) {
        css.position = "relative";
        delete css.left;
        delete css.right;
        delete css.top;
        delete css.bottom;
      }

      cssForSelectable.set(selectable, css);
      return css;
    };

    const generateCSSText = (selectable: Selectable) => {
      const superSelectable = selectable.superSelectable;
      const css = generateCSS(selectable);
      const superCSS = superSelectable ? generateCSS(superSelectable) : {};

      let diffCSS: CSS.Properties;
      if (superSelectable) {
        const keys = new Set([
          ...Object.keys(css),
          ...Object.keys(superCSS),
        ]) as Set<keyof CSS.Properties>;

        diffCSS = {};
        for (const key of keys) {
          if (css[key] !== superCSS[key]) {
            // @ts-ignore
            diffCSS[key] = css[key] ?? "unset";
          }
        }
      } else {
        diffCSS = css;
      }
      const body: string[] = [];
      if (!superSelectable) {
        body.push(...baseCSS);
      }

      for (const [key, value] of Object.entries(diffCSS)) {
        if (key.startsWith("--")) {
          // eslint-disable-next-line
          body.push(`  ${key}: ${value};`);
        } else {
          // eslint-disable-next-line
          body.push(`  ${kebabCase(key)}: ${value};`);
        }
      }

      const outermostInstance = selectable.nodePath[0];
      const variant = Variant.from(outermostInstance);

      if (variant) {
        const mainComponent = variant.component;
        if (!mainComponent) {
          console.error(
            "mainComponent not found for variant",
            selectable.idPath.join(":")
          );
          return "";
        }

        const condition = variant.condition;
        if (condition?.type === "maxWidth") {
          const selector =
            selectable.nodePath.length === 1
              ? `.uimix-${mainComponent.rootNode.id}`
              : `.uimix-${selectable.idPath.slice(1).join("-")}`;

          results.push(
            `@media (max-width: ${condition.value}px) {`,
            `${selector} {`,
            ...body,
            "}",
            "}"
          );
          return;
        }

        if (selectable.nodePath.length === 1) {
          const selector = `.uimix-${mainComponent.rootNode.id}:hover`;
          results.push(`${selector} {`, ...body, "}");
          return;
        } else {
          const innerIDPath = selectable.idPath.slice(1);
          const selector = `.uimix-${
            mainComponent.rootNode.id
          }:hover .uimix-${innerIDPath.join("-")}`;
          results.push(`${selector} {`, ...body, "}");
          return;
        }
      }

      const selector = ".uimix-" + selectable.idPath.join("-");
      results.push(`${selector} {`, ...body, "}");
    };

    const generateCSSTextRecursive = (selectable: Selectable) => {
      generateCSSText(selectable);
      for (const child of selectable.children) {
        generateCSSTextRecursive(child);
      }
    };

    const components = this.page.components;

    // component root styles must come before instances
    for (const component of components) {
      generateCSSText(component.rootNode.selectable);
      for (const variant of component.variants) {
        generateCSSText(variant.selectable);
      }
    }

    for (const component of components) {
      component.rootNode.selectable.children.forEach(generateCSSTextRecursive);
      for (const variant of component.variants) {
        variant.selectable.children.forEach(generateCSSTextRecursive);
      }
    }

    return results.join("\n");
  }
}
