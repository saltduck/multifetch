# 发布指南

## 当前状态
- ✅ 代码已提交到 Git
- ✅ 版本已更新到 1.1.0
- ✅ 已推送到远程仓库
- ⏳ 等待 npm 发布

## 完成发布步骤

### 1. 获取 OTP 代码
从您的身份验证器应用中获取当前的一次性密码（OTP）。

### 2. 发布到 npm
```bash
npm publish --otp=<您的OTP代码>
```

### 3. 验证发布
```bash
npm view bcfetch version
```

## 新版本特性 (v1.1.0)

### 🆕 新增功能
- **call 操作类型**: 支持使用原始16进制数据调用智能合约
- **自动前缀处理**: 自动为16进制数据添加 0x 前缀
- **多链支持**: 支持 Ethereum、BSC、Polygon 链
- **错误处理**: 完善的参数验证和错误提示

### 📝 使用示例
```javascript
const { fetch } = require('bcfetch');

const operations = [
  {
    type: 'call',
    params: {
      chainid: 1,
      contract: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      data: '0x06fdde03' // name() 函数选择器
    }
  }
];

const results = await fetch(operations);
console.log(results);
```

### 📁 新增文件
- `example-call.js` - 完整的调用示例
- `example-simple-call.js` - 简化版示例

### 🔧 技术细节
- 使用 `provider.call()` 方法直接发送原始数据
- 支持带或不带 0x 前缀的16进制数据
- 返回16进制格式的结果，需要根据合约ABI解析

## 发布后检查清单
- [ ] 验证版本号更新
- [ ] 测试安装新版本
- [ ] 更新文档链接
- [ ] 通知用户新功能

