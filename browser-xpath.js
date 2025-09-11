// 浏览器环境中的 xpath 替代方案
// 使用原生 DOM API 和 XPath 支持

/**
 * 在浏览器环境中执行 XPath 查询
 * @param {string} xpath - XPath 表达式
 * @param {Element} contextNode - 上下文节点，默认为 document
 * @returns {Array<Element>} 匹配的元素数组
 */
function evaluateXPath(xpath, contextNode = document) {
  const result = document.evaluate(
    xpath,
    contextNode,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  );
  
  const elements = [];
  for (let i = 0; i < result.snapshotLength; i++) {
    elements.push(result.snapshotItem(i));
  }
  
  return elements;
}

/**
 * 从元素中提取文本内容
 * @param {Array<Element>} elements - 元素数组
 * @returns {string} 文本内容
 */
function extractTextContent(elements) {
  return elements.map(el => el.textContent?.trim()).join('\n');
}

/**
 * 从元素中提取属性值
 * @param {Array<Element>} elements - 元素数组
 * @param {string} attribute - 属性名
 * @returns {string|null} 属性值
 */
function extractAttribute(elements, attribute) {
  if (elements.length === 0) return null;
  return elements[0].getAttribute(attribute);
}

/**
 * 浏览器环境中的 xpath 操作
 * @param {Object} params - 参数对象
 * @param {string} params.xpath - XPath 表达式
 * @param {string} params.attribute - 要提取的属性名（可选）
 * @param {Element} params.contextNode - 上下文节点（可选）
 * @returns {string} 提取的内容
 */
function browserXPath(params) {
  const { xpath, attribute, contextNode } = params;
  
  if (!xpath) {
    throw new Error('xpath 参数是必需的');
  }
  
  try {
    const elements = evaluateXPath(xpath, contextNode);
    
    if (elements.length === 0) {
      throw new Error(`未找到匹配的XPath元素: ${xpath}`);
    }
    
    if (attribute) {
      const attrValue = extractAttribute(elements, attribute);
      if (attrValue === null) {
        throw new Error(`元素没有 "${attribute}" 属性`);
      }
      return attrValue;
    } else {
      return extractTextContent(elements);
    }
  } catch (error) {
    throw new Error(`xpath 操作失败: ${error.message}`);
  }
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
  // Node.js 环境
  module.exports = { browserXPath, evaluateXPath, extractTextContent, extractAttribute };
} else if (typeof window !== 'undefined') {
  // 浏览器环境
  window.browserXPath = { browserXPath, evaluateXPath, extractTextContent, extractAttribute };
}
