export type TreeNode<T = any> = T & {
  id: number;
  parentId?: number | null;
  children?: TreeNode<T>[];
};

export type ListNode<T extends object = any> = T & {
  id: number;
  parentId: number | null;
};

/** Từ 1 node root chuyển sang tree */
export function rootToTree<T extends ListNode[]>(items: T): TreeNode<T[number]> {
  const map = new Map();

  items.forEach((item) => {
    map.set(item.id, Object.assign(item, map.get(item.id) || {}));

    const parentNode = map.get(item.parentId) || {};
    parentNode.children = parentNode.children || [];
    parentNode.children.push(map.get(item.id));
    map.set(item.parentId, parentNode);
  });

  return map.get(null).children[0];
}

export function deleteEmptyChildren(arr: any) {
  arr?.forEach((node) => {
    if (node.children?.length === 0) delete node.children;
    else deleteEmptyChildren(node.children);
  });
}
