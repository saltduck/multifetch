
const { ethers } = require('ethers');
const cheerio = require('cheerio');

// 支持的链ID到公共RPC节点的映射
const providers = {
  1: new ethers.JsonRpcProvider('https://ethereum.publicnode.com'), // 以太坊主网 (PublicNode)
  56: new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org/'), // 币安智能链
  137: new ethers.JsonRpcProvider('https://polygon-rpc.com'), // Polygon
};

// 获取余额和代币小数位数所需的最小ERC20 ABI
const erc20Abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

// AMM LP 合约所需的 ABI
const lpAbi = [
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() view returns (address)",
  "function token1() view returns (address)",
];

/**
 * 异步处理一系列操作，根据每个操作的类型执行不同的网络请求。
 * 使用 Promise.all 来并发执行所有操作，并保持结果的原始顺序。
 *
 * @param {Array<Object>} operations - 操作对象的数组。
 * @param {string} operations[].type - 操作的类型 (例如 'http-get', 'http-post', 'balanceOf', 'lpPrice')。
 * @param {Object} operations[].params - 该操作所需的参数。
 * @returns {Promise<Array<string>>} 一个 Promise，它解析为一个字符串结果的数组，顺序与输入的操作数组相同。
 * @throws {Error} 如果输入不是一个数组，或者任何操作对象无效/类型不被支持。
 */
async function fetch(operations) {
  // 验证输入是否为数组
  if (!Array.isArray(operations)) {
    throw new Error('输入必须是一个操作数组。');
  }

  // 为每个操作对象创建一个 promise
  const promises = operations.map(async (operation) => {
    if (!operation || typeof operation.type !== 'string' || !operation.name) {
      throw new Error(`无效的操作对象或缺少 "name" 字段: ${JSON.stringify(operation)}`);
    }

    let value;
    // 根据类型执行不同的操作
    switch (operation.type) {
      case 'http-get': {
        if (!operation.params || !operation.params.url) {
          throw new Error('http-get 操作缺少 "url" 参数。');
        }
        try {
          const response = await global.fetch(operation.params.url);
          if (!response.ok) {
            throw new Error(`HTTP 错误！状态: ${response.status}`);
          }
          value = await response.text();
          break;
        } catch (error) {
          throw new Error(`请求 ${operation.params.url} 失败: ${error.message}`);
        }
      }

      case 'http-post': {
        if (!operation.params || !operation.params.url || !operation.params.body) {
          throw new Error('http-post 操作缺少 "url" 或 "body" 参数。');
        }
        try {
          const response = await global.fetch(operation.params.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(operation.params.body),
          });
          if (!response.ok) {
            throw new Error(`HTTP 错误！状态: ${response.status}`);
          }
          value = await response.text();
          break;
        } catch (error) {
          throw new Error(`向 ${operation.params.url} 发送 POST 请求失败: ${error.message}`);
        }
      }

      case 'balanceOf': {
        const { chainid, contract, address } = operation.params || {};
        if (!chainid || !address) {
          throw new Error('balanceOf 操作需要 "chainid" 和 "address" 参数。');
        }
        
        if (chainid === 'BTC') {
          try {
            const response = await global.fetch(`https://blockstream.info/api/address/${address}`);
            if (!response.ok) {
              throw new Error(`HTTP 错误！状态: ${response.status}`);
            }
            const data = await response.json();
            const balanceInSatoshi = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
            const balanceInBTC = balanceInSatoshi / 100000000;
            value = balanceInBTC.toFixed(8); // 转换为BTC并保留8位小数
            break;
          } catch (error) {
            throw new Error(`获取 BTC 地址 ${address} 余额失败: ${error.message}`);
          }
        }

        if (!contract) {
          throw new Error('balanceOf 操作需要 "contract" 参数。');
        }

        const provider = providers[chainid];
        if (!provider) {
          throw new Error(`不支持的 chainid: "${chainid}"。支持的 chainid 有: ${Object.keys(providers).join(', ')}.`);
        }

        try {
          const tokenContract = new ethers.Contract(contract, erc20Abi, provider);
          
          // 并发获取余额和代币小数位数
          const [balance, decimals] = await Promise.all([
            tokenContract.balanceOf(address),
            tokenContract.decimals()
          ]);
          
          // 根据小数位数格式化余额
          value = ethers.formatUnits(balance, decimals);
          break;
        } catch (error) {
          // 增强错误日志
          console.error(`详细错误信息 (balanceOf):`, error);
          // 包装错误以提供更多上下文
          throw new Error(`在链 ${chainid} 上为合约 ${contract} 获取余额失败: ${error.message}`);
        }
      }
      
      case 'binance': {
        if (!operation.params || !operation.params.symbol) {
          throw new Error('binance 操作缺少 "symbol" 参数。');
        }
        const { symbol } = operation.params;
        try {
          const response = await global.fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
          if (!response.ok) {
            throw new Error(`HTTP 错误！状态: ${response.status}`);
          }
          const data = await response.json();
          value = data.price;
          break;
        } catch (error) {
          throw new Error(`获取币安 ${symbol} 价格失败: ${error.message}`);
        }
      }

      case 'lpPrice': {
        const { chainid, contract, reverse } = operation.params || {};
        if (!chainid || !contract) {
          throw new Error('lpPrice 操作需要 "chainid" 和 "contract" 参数。');
        }

        const provider = providers[chainid];
        if (!provider) {
          throw new Error(`不支持的 chainid: "${chainid}"。支持的 chainid 有: ${Object.keys(providers).join(', ')}.`);
        }

        try {
          const lpContract = new ethers.Contract(contract, lpAbi, provider);
          
          // 并发获取储备量和代币地址
          const [reserves, token0Address, token1Address] = await Promise.all([
            lpContract.getReserves(),
            lpContract.token0(),
            lpContract.token1()
          ]);

          const { reserve0, reserve1 } = reserves;
          
          // 获取代币的小数位数
          const token0Contract = new ethers.Contract(token0Address, erc20Abi, provider);
          const token1Contract = new ethers.Contract(token1Address, erc20Abi, provider);
          
          const [token0Decimals, token1Decimals] = await Promise.all([
            token0Contract.decimals(),
            token1Contract.decimals()
          ]);

          // 计算调整后的储备量（考虑小数位数）
          const adjustedReserve0 = Number(ethers.formatUnits(reserve0, token0Decimals));
          const adjustedReserve1 = Number(ethers.formatUnits(reserve1, token1Decimals));

          // 根据 reverse 参数计算价格
          let price;
          if (reverse === true) {
            // token1/token0 的价格
            price = adjustedReserve1 / adjustedReserve0;
          } else {
            // token0/token1 的价格
            price = adjustedReserve0 / adjustedReserve1;
          }

          value = price.toString();
          break;
        } catch (error) {
          throw new Error(`在链 ${chainid} 上为 LP 合约 ${contract} 计算价格失败: ${error.message}`);
        }
      }

      case 'xpath': {
        const { url, xpath, attribute } = operation.params || {};
        if (!url || !xpath) {
          throw new Error('xpath 操作需要 "url" 和 "xpath" 参数。');
        }
        
        try {
          // 获取页面内容
          const response = await global.fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP 错误！状态: ${response.status}`);
          }
          const html = await response.text();
          
          // 使用cheerio解析HTML
          const $ = cheerio.load(html);
          
          // 将xpath转换为cheerio选择器
          // 简单的xpath到CSS选择器转换
          let selector = xpath;
          
          // 处理常见的xpath模式
          if (xpath.startsWith('//')) {
            // 移除开头的 //
            selector = xpath.substring(2);
          }
          
          // 将xpath属性选择器转换为CSS选择器
          // 例如: //h1[@class="title"] -> h1.title
          selector = selector.replace(/\[@class="([^"]+)"\]/g, '.$1');
          // 例如: //a[@href] -> a[href]
          selector = selector.replace(/\[@([^=]+)\]/g, '[$1]');
          // 例如: //a[@href="value"] -> a[href="value"]
          selector = selector.replace(/\[@([^=]+)="([^"]+)"\]/g, '[$1="$2"]');
          
          // 查找元素
          const elements = $(selector);
          
          if (elements.length === 0) {
            throw new Error(`未找到匹配的选择器: ${selector} (原始xpath: ${xpath})`);
          }
          
          // 如果指定了属性，返回属性值；否则返回文本内容
          if (attribute) {
            const attrValue = elements.attr(attribute);
            if (attrValue === undefined) {
              throw new Error(`元素没有 "${attribute}" 属性`);
            }
            value = attrValue;
          } else {
            // 如果找到多个元素，返回所有元素的文本内容（用换行符分隔）
            value = elements.map((i, el) => $(el).text().trim()).get().join('\n');
          }
          
          break;
        } catch (error) {
          throw new Error(`xpath 操作失败: ${error.message}`);
        }
      }

      default:
        // 如果操作类型不被支持，则抛出错误
        throw new Error(`不支持的操作类型: "${operation.type}"`);
    }
    return { [operation.name]: value };
  });

  // 等待所有 promise 完成并返回结果数组
  return Promise.all(promises);
}

module.exports = { fetch };
