/* eslint-disable react/jsx-no-useless-fragment */
import React from "react";

import { Link, LinkProps } from "@gc-digital-talent/ui";

import { RenderMap, Node, NodeRenderer } from "./types";

const NoNode: NodeRenderer = ({ children }) => {
  return <>{children}</>;
};

const DocNode: NodeRenderer = ({ children }) => (
  <div
    data-h2-color="base(black)"
    data-h2-margin="base:children[>p:not(:first-child)](x.5, 0, 0, 0)"
  >
    {children}
  </div>
);

const TextNode: NodeRenderer = ({ node }) => {
  const content: string = node.text;

  let linkProps: LinkProps = {};
  const isLink = node?.marks?.find((mark) => {
    if (mark.type === "link") {
      linkProps = {
        href: mark.attrs?.href ?? "",
        newTab: mark.attrs?.target === "_blank",
      };
      return true;
    }

    return false;
  });

  return isLink ? (
    <Link href={linkProps.href} newTab={linkProps.newTab}>
      {content}
    </Link>
  ) : (
    <>{content}</>
  );
};

const ParagraphNode: NodeRenderer = ({ children }) => {
  return <p>{children}</p>;
};

const BulletListNode: NodeRenderer = ({ children }) => {
  return <ul>{children}</ul>;
};

const ListItemNode: NodeRenderer = ({ children }) => {
  return <li>{children}</li>;
};

const nodeRenderMap: RenderMap = {
  doc: DocNode,
  text: TextNode,
  paragraph: ParagraphNode,
  bulletList: BulletListNode,
  listItem: ListItemNode,
};

interface RichTextRendererProps {
  /** The current node object */
  node: Node;
  /** A map of components to render for each node type */
  renderMap?: RenderMap;
}

const RichTextRenderer = ({
  node,
  renderMap = nodeRenderMap,
}: RichTextRendererProps) => {
  const children: JSX.Element[] = [];
  // Node has its own content so recursively append it.
  if (node.content) {
    node.content.forEach((childNode, index) => {
      children.push(
        <RichTextRenderer
          // eslint-disable-next-line react/no-array-index-key
          key={`${childNode.type}-${index}`}
          node={childNode}
          {...{ renderMap }}
        />,
      );
    });
  }

  // We do not have a renderer for this
  if (!(node.type in renderMap)) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <NoNode node={node}>{children}</NoNode>;
  }

  const Component = renderMap[node.type];

  return <Component node={node}>{children}</Component>;
};

export default RichTextRenderer;
