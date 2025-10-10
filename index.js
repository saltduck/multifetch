
const { ethers } = require('ethers');
const cheerio = require('cheerio');

// 检测运行环境
const isBrowser = typeof window !== 'undefined';
const isNode = typeof process !== 'undefined' && process.versions && process.versions.node;

/**
 * 后处理函数，用于对原始数据进行转换和格式化
 * @param {any} data - 原始数据
 * @param {string|Array} postprocess - 后处理配置，可以是字符串或数组
 * @returns {any} 处理后的数据
 */
function processData(data, postprocess) {
  if (!postprocess) {
    return data;
  }

  try {
    // 将单个操作转换为数组
    const operations = Array.isArray(postprocess) ? postprocess : [postprocess];
    
    let result = data;
    
    // 按顺序执行每个操作
    for (const operation of operations) {
      if (typeof operation !== 'string') {
        console.warn('Postprocess 操作必须是字符串:', operation);
        continue;
      }
      
      result = executeOperation(result, operation);
    }
    
    return result;
  } catch (error) {
    console.error('Postprocess 处理失败:', error.message);
    return data; // 处理失败时返回原始数据
  }
}

/**
 * 执行单个后处理操作
 * @param {any} data - 当前数据
 * @param {string} operation - 操作字符串
 * @returns {any} 处理后的数据
 */
function executeOperation(data, operation) {
  if (typeof operation !== 'string') {
    throw new Error('操作必须是字符串');
  }

  // JSON 数据提取
  if (operation.startsWith('json:')) {
    return extractJsonData(data, operation.substring(5));
  }
  
  // 对象属性提取
  if (operation.startsWith('object:')) {
    return extractObjectProperty(data, operation.substring(7));
  }
  
  // 数学运算
  if (operation.startsWith('div:')) {
    return performMathOperation(data, 'div', parseFloat(operation.substring(4)));
  }
  
  if (operation.startsWith('mul:')) {
    return performMathOperation(data, 'mul', parseFloat(operation.substring(4)));
  }
  
  if (operation.startsWith('add:')) {
    return performMathOperation(data, 'add', parseFloat(operation.substring(4)));
  }
  
  if (operation.startsWith('sub:')) {
    return performMathOperation(data, 'sub', parseFloat(operation.substring(4)));
  }
  
  // 数据类型转换
  if (operation === 'toNumber') {
    return convertToNumber(data);
  }
  
  throw new Error(`不支持的操作类型: ${operation}`);
}

/**
 * 从 JSON 数据中提取指定路径的值
 * @param {any} data - 原始数据
 * @param {string} path - 路径，如 "data.floor_price" 或 "0.airdrop_stake_counts"
 * @returns {any} 提取的值
 */
function extractJsonData(data, path) {
  try {
    // 如果数据是字符串，尝试解析为 JSON
    let jsonData = data;
    if (typeof data === 'string') {
      jsonData = JSON.parse(data);
    }
    
    // 按路径提取数据
    const pathParts = path.split('.');
    let result = jsonData;
    
    for (const part of pathParts) {
      if (result === null || result === undefined) {
        return null;
      }
      
      // 检查是否是数组索引
      if (!isNaN(part)) {
        result = result[parseInt(part)];
      } else {
        result = result[part];
      }
    }
    
    return result;
  } catch (error) {
    throw new Error(`JSON 数据提取失败: ${error.message}`);
  }
}

/**
 * 从对象中提取指定路径的属性值
 * @param {any} data - 原始数据
 * @param {string} path - 路径，如 "result" 或 "data.value"
 * @returns {any} 提取的值
 */
function extractObjectProperty(data, path) {
  try {
    const pathParts = path.split('.');
    let result = data;
    
    for (const part of pathParts) {
      if (result === null || result === undefined) {
        return null;
      }
      
      result = result[part];
    }
    
    return result;
  } catch (error) {
    throw new Error(`对象属性提取失败: ${error.message}`);
  }
}

/**
 * 执行数学运算
 * @param {any} data - 当前数据
 * @param {string} operation - 运算类型 ('div', 'mul', 'add', 'sub')
 * @param {number} operand - 操作数
 * @returns {number} 运算结果
 */
function performMathOperation(data, operation, operand) {
  if (isNaN(operand)) {
    throw new Error(`无效的操作数: ${operand}`);
  }
  
  const num = convertToNumber(data);
  if (isNaN(num)) {
    throw new Error(`无法将数据转换为数字: ${data}`);
  }
  
  switch (operation) {
    case 'div':
      return num / operand;
    case 'mul':
      return num * operand;
    case 'add':
      return num + operand;
    case 'sub':
      return num - operand;
    default:
      throw new Error(`不支持的数学运算: ${operation}`);
  }
}

/**
 * 将数据转换为数字
 * @param {any} data - 原始数据
 * @returns {number} 转换后的数字
 */
function convertToNumber(data) {
  if (typeof data === 'number') {
    return data;
  }
  
  if (typeof data === 'string') {
    const num = parseFloat(data);
    if (isNaN(num)) {
      throw new Error(`无法将字符串转换为数字: ${data}`);
    }
    return num;
  }
  
  if (typeof data === 'boolean') {
    return data ? 1 : 0;
  }
  
  throw new Error(`不支持的数据类型转换为数字: ${typeof data}`);
}


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

// AMM LP 合约所需的 ABI (Uniswap V2)
const lpAbi = [
  "function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)",
  "function token0() view returns (address)",
  "function token1() view returns (address)",
];

// Uniswap V3 池合约所需的 ABI
const lpV3Abi = [
  "function slot0() view returns (uint160 sqrtPriceX96, int24 tick, uint16 observationIndex, uint16 observationCardinality, uint16 observationCardinalityNext, uint8 feeProtocol, bool unlocked)",
  "function token0() view returns (address)",
  "function token1() view returns (address)",
  "function fee() view returns (uint24)",
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

  // 检查是否包含 xpath 操作（已移除的功能）
  const hasXpathOperations = operations.some(op => op.type === 'xpath');
  if (hasXpathOperations) {
    throw new Error('xpath 操作已从 bcfetch 中移除。请使用其他方法进行网页抓取。');
  }

  // 为每个操作对象创建一个 promise
  const promises = operations.map(async (operation) => {
    if (!operation || typeof operation.type !== 'string') {
      throw new Error(`无效的操作对象: ${JSON.stringify(operation)}`);
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
          // 应用 postprocess
          value = processData(value, operation.params.postprocess);
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
          // 应用 postprocess
          value = processData(value, operation.params.postprocess);
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
            
            // 计算已确认交易的余额
            const confirmedBalance = data.chain_stats.funded_txo_sum - data.chain_stats.spent_txo_sum;
            console.log('已确认交易的余额:', confirmedBalance);

            // 计算未确认交易的余额
            const unconfirmedBalance = data.mempool_stats.funded_txo_sum - data.mempool_stats.spent_txo_sum;
            console.log('未确认交易的余额:', unconfirmedBalance);
            
            // 总余额 = 已确认余额 + 未确认余额
            const totalBalanceInSatoshi = confirmedBalance + unconfirmedBalance;
            const totalBalanceInBTC = totalBalanceInSatoshi / 100000000;
            value = totalBalanceInBTC.toFixed(8); // 转换为BTC并保留8位小数
            // 应用 postprocess
            value = processData(value, operation.params.postprocess);
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
          // 应用 postprocess
          value = processData(value, operation.params.postprocess);
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
          // 应用 postprocess
          value = processData(value, operation.params.postprocess);
          break;
        } catch (error) {
          throw new Error(`获取币安 ${symbol} 价格失败: ${error.message}`);
        }
      }

      case 'lpPrice': {
        const { chainid, contract, reverse, version = 2 } = operation.params || {};
        if (!chainid || !contract) {
          throw new Error('lpPrice 操作需要 "chainid" 和 "contract" 参数。');
        }

        const provider = providers[chainid];
        if (!provider) {
          throw new Error(`不支持的 chainid: "${chainid}"。支持的 chainid 有: ${Object.keys(providers).join(', ')}.`);
        }

        try {
          if (version === 3) {
            // Uniswap V3 价格计算（纯 BigInt 分数计算，避免 BigInt 与 Number 混用）
            const lpContract = new ethers.Contract(contract, lpV3Abi, provider);
            
            // 并发获取 slot0 数据和代币地址
            const [slot0Data, token0Address, token1Address] = await Promise.all([
              lpContract.slot0(),
              lpContract.token0(),
              lpContract.token1()
            ]);

            const { sqrtPriceX96 } = slot0Data;
            
            // 获取代币的小数位数
            const token0Contract = new ethers.Contract(token0Address, erc20Abi, provider);
            const token1Contract = new ethers.Contract(token1Address, erc20Abi, provider);
            
            const [d0Raw, d1Raw] = await Promise.all([
              token0Contract.decimals(),
              token1Contract.decimals()
            ]);
            const d0 = Number(d0Raw);
            const d1 = Number(d1Raw);

            // price1_per_0 = (sqrtPriceX96^2 / 2^192) * 10^(d0 - d1)
            const numeratorBase = (sqrtPriceX96 * sqrtPriceX96);
            const denominatorBase = (1n << 192n);

            // 根据小数位差异进行 10^diff 调整
            const decimalsDiff = d0 - d1; // 可能为负数
            let num = numeratorBase;
            let den = denominatorBase;
            if (decimalsDiff > 0) {
              num = num * (10n ** BigInt(decimalsDiff));
            } else if (decimalsDiff < 0) {
              den = den * (10n ** BigInt(-decimalsDiff));
            }

            // 将分数转换为带精度的小数字符串
            const toDecimalString = (n, d, precision) => {
              const scaled = (n * (10n ** BigInt(precision))) / d;
              const s = scaled.toString();
              if (precision === 0) return s;
              const i = s.length > precision ? s.slice(0, -precision) : '0';
              const f = s.length > precision ? s.slice(-precision) : s.padStart(precision, '0');
              // 去除尾部多余的 0
              const fTrimmed = f.replace(/0+$/, '');
              return fTrimmed.length ? `${i}.${fTrimmed}` : i;
            };

            const PRECISION = 18; // 输出 18 位精度

            let resultStr;
            if (reverse === true) {
              // reverse=true: 需要 token1/token0 价格 = num/den
              resultStr = toDecimalString(num, den, PRECISION);
            } else {
              // reverse=false: 需要 token0/token1 价格 = den/num
              resultStr = toDecimalString(den, num, PRECISION);
            }

            value = resultStr;
          } else {
            // Uniswap V2 价格计算（原有逻辑）
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
          }
          // 应用 postprocess
          value = processData(value, operation.params.postprocess);
          break;
        } catch (error) {
          throw new Error(`在链 ${chainid} 上为 LP 合约 ${contract} 计算价格失败: ${error.message}`);
        }
      }

      case 'call': {
        const { chainid, contract, data } = operation.params || {};
        if (!chainid || !contract || !data) {
          throw new Error('call 操作需要 "chainid"、"contract" 和 "data" 参数。');
        }

        const provider = providers[chainid];
        if (!provider) {
          throw new Error(`不支持的 chainid: "${chainid}"。支持的 chainid 有: ${Object.keys(providers).join(', ')}.`);
        }

        try {
          // 验证 data 是否为有效的16进制字符串
          if (typeof data !== 'string') {
            throw new Error('data 参数必须是16进制字符串');
          }
          
          // 确保 data 以 0x 开头
          const hexData = data.startsWith('0x') ? data : `0x${data}`;
          
          // 验证16进制格式
          if (!/^0x[0-9a-fA-F]+$/.test(hexData)) {
            throw new Error('data 参数必须是有效的16进制字符串');
          }

          // 使用 provider.call 方法直接调用合约
          const result = await provider.call({
            to: contract,
            data: hexData
          });
          
          // 返回结果
          value = {
            contract: contract,
            chainid: chainid,
            data: hexData,
            result: result
          };
          // 应用 postprocess
          value = processData(value, operation.params.postprocess);
          break;
        } catch (error) {
          throw new Error(`在链 ${chainid} 上调用合约 ${contract} 失败: ${error.message}`);
        }
      }


      default:
        // 如果操作类型不被支持，则抛出错误
        throw new Error(`不支持的操作类型: "${operation.type}"`);
    }
    return value;
  });

  // 等待所有 promise 完成并返回结果数组
  return Promise.all(promises);
}

// 导出函数
if (typeof module !== 'undefined' && module.exports) {
  // Node.js 环境
  module.exports = { fetch };
} else if (typeof window !== 'undefined') {
  // 浏览器环境
  window.bcfetch = { fetch };
}
