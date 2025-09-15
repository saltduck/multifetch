const { fetch } = require('./index');

// 专门测试Transcription TVL的xpath功能
const tvlTests = [
  // 测试1: 原始的Transcription TVL案例
  {
    type: 'xpath',
    params: {
      url: 'https://transcription.bihelix.io/zh',
      xpath: '/html/body/div[1]/div[2]/div/div[1]/div[1]/div[3]/div[1]/div[1]/div[2]',
      waitFor: 5000
    }
  },
  
//   // 测试2: 获取页面body内容
//   {
//     type: 'xpath',
//     params: {
//       url: 'https://transcription.bihelix.io/zh',
//       xpath: '//body',
//       waitFor: 5000
//     }
//   },
  
//   // 测试3: 获取页面标题
//   {
//     type: 'xpath',
//     params: {
//       url: 'https://transcription.bihelix.io/zh',
//       xpath: '//title',
//       waitFor: 5000
//     }
//   }
];

// 提取浮点数的辅助函数
function extractFloatFromText(text) {
  if (!text) return [];
  
  // 查找文本中的浮点数模式
  const floatPatterns = [
    /(\d+\.\d+)/g,  // 标准浮点数
    /(\d+,\d+\.\d+)/g,  // 带千位分隔符的浮点数
    /(\d+\.\d+)\s*BTC/g,  // 带BTC单位的浮点数
    /(\d+\.\d+)\s*btc/g,  // 带btc单位的浮点数
  ];
  
  const numbers = [];
  
  for (const pattern of floatPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      numbers.push(...matches);
    }
  }
  
  // 清理和转换数字
  const cleanedNumbers = numbers.map(num => {
    // 移除逗号分隔符
    let cleaned = num.replace(/,/g, '');
    // 移除单位
    cleaned = cleaned.replace(/\s*(BTC|btc|USD|usd|$|ETH|eth)/g, '').trim();
    // 转换为浮点数
    const floatValue = parseFloat(cleaned);
    return isNaN(floatValue) ? null : floatValue;
  }).filter(num => num !== null);
  
  return cleanedNumbers;
}

// 专门提取TVL数值的函数
function extractTVLValue(text) {
  if (!text) return null;
  
  // 查找可能的TVL相关文本模式
  const tvlPatterns = [
    /总锁仓[^0-9]*(\d+\.\d+)/g,
    /TVL[^0-9]*(\d+\.\d+)/g,
    /锁仓数量[^0-9]*(\d+\.\d+)/g,
    /总质押[^0-9]*(\d+\.\d+)/g,
    /筹集资金[^0-9]*(\d+\.\d+)/g,
    /fundsRaised[^0-9]*(\d+\.\d+)/g,
  ];
  
  for (const pattern of tvlPatterns) {
    const matches = text.match(pattern);
    if (matches) {
      for (const match of matches) {
        const numberMatch = match.match(/(\d+\.\d+)/);
        if (numberMatch) {
          const value = parseFloat(numberMatch[1]);
          if (value > 0.001 && value < 1000000) { // 合理的TVL范围
            return value.toString();
          }
        }
      }
    }
  }
  
  // 如果没有找到特定的TVL模式，尝试查找所有数字并返回最大的合理值
  const allNumbers = extractFloatFromText(text);
  const reasonableNumbers = allNumbers.filter(num => num >= 0.001 && num <= 1000000);
  
  if (reasonableNumbers.length > 0) {
    // 返回最大的数字作为可能的TVL值
    const maxValue = Math.max(...reasonableNumbers);
    return maxValue.toString();
  }
  
  return null;
}

async function testTranscriptionTVL() {
  console.log('🔍 专门测试Transcription TVL xpath功能...\n');
  
  try {
    const results = await fetch(tvlTests);
    
    console.log('📊 TVL测试结果:');
    console.log('='.repeat(80));
    
    results.forEach((value, index) => {
      const operation = tvlTests[index];
      
      console.log(`\n🔍 测试 ${index + 1}:`);
      console.log(`   XPath: ${operation.params.xpath}`);
      console.log(`   原始结果: ${value}`);
      console.log(`   原始结果长度: ${value ? value.length : 0} 字符`);
      
      // 打印原始结果的前500个字符供人工检查
      if (value && value.length > 0) {
        const preview = value.length > 500 ? value.substring(0, 500) + '...' : value;
        console.log(`   📄 原始结果预览:`);
        console.log(`   ${preview.split('\n').map(line => `   ${line}`).join('\n')}`);
      }
      
      // 尝试提取TVL数值
      const tvlValue = extractTVLValue(value);
      if (tvlValue) {
        console.log(`   🎯 提取的TVL数值: "${tvlValue}"`);
        console.log(`   ✅ 成功提取到浮点数字符串: "${tvlValue}"`);
        console.log(`   🔍 数值类型检查: ${typeof tvlValue} (应该是 "string")`);
        console.log(`   🔍 数值内容检查: "${tvlValue}" (应该是纯数字字符串)`);
      } else {
        // 尝试提取所有浮点数
        const numbers = extractFloatFromText(value);
        if (numbers.length > 0) {
          console.log(`   🎯 提取的所有浮点数: [${numbers.join(', ')}]`);
          console.log(`   📈 最大数值: ${Math.max(...numbers)}`);
          console.log(`   📉 最小数值: ${Math.min(...numbers)}`);
          
          // 检查是否有合理的TVL数值（通常在0.001到1000000之间）
          const validTVL = numbers.filter(num => num >= 0.001 && num <= 1000000);
          if (validTVL.length > 0) {
            console.log(`   ✅ 可能的TVL数值: [${validTVL.join(', ')}]`);
            const recommendedTVL = Math.max(...validTVL).toString();
            console.log(`   📊 推荐TVL值: "${recommendedTVL}"`);
            console.log(`   🔍 推荐值类型检查: ${typeof recommendedTVL} (应该是 "string")`);
            console.log(`   🔍 推荐值内容检查: "${recommendedTVL}" (应该是纯数字字符串)`);
          } else {
            console.log(`   ⚠️  未找到合理的TVL数值范围`);
          }
        } else {
          console.log(`   ❌ 未找到浮点数`);
        }
      }
      
      console.log('-'.repeat(60));
    });
    
    // 总结
    console.log('\n📋 测试总结:');
    const allNumbers = [];
    const allTVLValues = [];
    
    results.forEach((result, index) => {
      const value = Object.values(result)[0];
      const numbers = extractFloatFromText(value);
      const tvlValue = extractTVLValue(value);
      
      allNumbers.push(...numbers);
      if (tvlValue) {
        allTVLValues.push(tvlValue);
      }
    });
    
    console.log(`\n📊 数值提取统计:`);
    console.log(`   🔢 总共找到 ${allNumbers.length} 个数字`);
    if (allNumbers.length > 0) {
      console.log(`   📈 数值范围: ${Math.min(...allNumbers)} - ${Math.max(...allNumbers)}`);
      console.log(`   📋 所有数字: [${allNumbers.join(', ')}]`);
    }
    
    console.log(`\n🎯 TVL数值提取结果:`);
    if (allTVLValues.length > 0) {
      console.log(`   ✅ 成功提取到 ${allTVLValues.length} 个TVL值`);
      console.log(`   📋 TVL值列表: [${allTVLValues.join(', ')}]`);
      console.log(`   🔍 最终推荐TVL值: "${allTVLValues[0]}"`);
      console.log(`   🔍 推荐值类型: ${typeof allTVLValues[0]} (应该是 "string")`);
    } else {
      const validTVL = allNumbers.filter(num => num >= 0.001 && num <= 1000000);
      if (validTVL.length > 0) {
        const recommendedTVL = Math.max(...validTVL).toString();
        console.log(`   ⚠️  未找到特定TVL模式，使用最大合理值`);
        console.log(`   📋 可能的TVL值: [${validTVL.join(', ')}]`);
        console.log(`   🔍 推荐TVL值: "${recommendedTVL}"`);
        console.log(`   🔍 推荐值类型: ${typeof recommendedTVL} (应该是 "string")`);
      } else {
        console.log(`   ❌ 未找到任何合理的TVL数值`);
      }
    }
    
  } catch (error) {
    console.error('❌ 测试失败:', error.message);
  }
}

testTranscriptionTVL();
