
const { ethers } = require('ethers');

// 支持的链ID到公共RPC节点的映射
const providers = {
  1: new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/84842078b09946638c03157f83405213'), // 以太坊主网 (公共 Infura)
  56: new ethers.JsonRpcProvider('https://bsc-dataseed.binance.org/'), // 币安智能链
  137: new ethers.JsonRpcProvider('https://rpc.ankr.com/polygon'), // Polygon
};

// 获取余额和代币小数位数所需的最小ERC20 ABI
const erc20Abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

/**
 * 异步处理一系列操作，根据每个操作的类型执行不同的网络请求。
 * 使用 Promise.all 来并发执行所有操作，并保持结果的原始顺序。
 *
 * @param {Array<Object>} operations - 操作对象的数组。
 * @param {string} operations[].type - 操作的类型 (例如 'http-get', 'http-post', 'balanceOf')。
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
            const balance = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
            value = balance.toString(); // 余额单位：聪
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
