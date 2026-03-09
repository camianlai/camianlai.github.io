/**
 * 游戏状态管理对象
 * 集中管理游戏运行过程中的核心状态信息
 */
const gameState = {
  isPlaying: false, // 游戏是否正在进行中，控制所有游戏逻辑的开关
  currentInstruction: null, // 当前显示的指令对象，包含按键和文本信息
  instructionStartTime: 0, // 当前指令开始显示的时间戳，用于计算反应时间
  isProcessingInput: false, // 是否正在处理用户输入，防止重复处理按键事件
};

/**
 * 定时器管理对象
 * 统一管理游戏中使用的所有定时器，便于清理和避免内存泄漏
 */
const timers = {
  gameTimer: null, // 游戏主定时器，控制30秒游戏时长
  instructionTimer: null, // 指令超时定时器，2秒内未响应则判定为超时
  feedbackTimer: null, // 反馈延迟定时器，控制500ms反馈显示时间
};

/**
 * 统计数据对象
 * 记录游戏过程中的各项数据，用于实时显示和计算
 */
const stats = {
  currentCombo: 0, // 当前连击数，连续正确按键的次数
  totalAttempts: 0, // 总尝试次数，包括正确、错误和超时的总和
  correctAttempts: 0, // 正确次数，用户按对按键的总数
  reactionTimes: [], // 反应时间数组，存储每次正确响应的毫秒数
};

/**
 * 指令配置数组
 * 定义所有可能的拳击动作及其对应的按键组合
 * 每个指令包含：显示文字、支持的按键码数组
 */
const instructions = [
  { key: 'w/↑', text: '上勾拳', codes: ['KeyW', 'ArrowUp'] }, // W键或上方向键
  { key: 'a/←', text: '左直拳', codes: ['KeyA', 'ArrowLeft'] }, // A键或左方向键
  { key: 's/↓', text: '下勾拳', codes: ['KeyS', 'ArrowDown'] }, // S键或下方向键
  { key: 'd/→', text: '右直拳', codes: ['KeyD', 'ArrowRight'] }, // D键或右方向键
];

/**
 * DOM元素引用对象
 * 缓存页面中需要频繁操作的DOM元素，提高性能
 */
const elements = {
  startBtn: document.getElementById('start-btn'), // 开始游戏按钮
  instructionDisplay: document.getElementById('current-instruction'), // 指令显示区域
  currentCombo: document.getElementById('current-combo'), // 当前连击数显示元素
  accuracy: document.getElementById('accuracy'), // 准确率显示元素
  avgReaction: document.getElementById('avg-reaction'), // 平均反应时间显示元素
  // 按键提示元素，用于高亮效果
  keyHints: document.querySelectorAll('.key-hint'), // 所有按键提示元素的NodeList
};

/**
 * 按键映射对象
 * 将键盘码映射到对应的按键提示元素索引
 */
const keyMapping = {
  KeyW: 0,
  ArrowUp: 0, // W键和上方向键对应第1个按键提示
  KeyA: 1,
  ArrowLeft: 1, // A键和左方向键对应第2个按键提示
  KeyS: 2,
  ArrowDown: 2, // S键和下方向键对应第3个按键提示
  KeyD: 3,
  ArrowRight: 3, // D键和右方向键对应第4个按键提示
};

/**
 * 初始化事件监听器
 * 绑定开始按钮点击事件和全局键盘按下/松开事件
 */
function initializeEventListeners() {
  elements.startBtn.addEventListener('click', startGame);
  document.addEventListener('keydown', handleKeyPress);
  document.addEventListener('keyup', handleKeyRelease); // 添加键盘松开事件监听
}

/**
 * 开始游戏
 * 设置游戏状态为进行中，重置统计数据，禁用开始按钮
 * 生成第一个指令，启动30秒游戏定时器
 */
function startGame() {
  gameState.isPlaying = true;
  resetStats();
  elements.startBtn.disabled = true;
  generateNextInstruction();

  timers.gameTimer = setTimeout(() => {
    stopGame();
  }, 30000);
}

/**
 * 停止游戏
 * 重置游戏状态，清理所有定时器，恢复开始按钮
 * 显示训练结束信息，更新界面显示
 */
function stopGame() {
  gameState.isPlaying = false;
  gameState.currentInstruction = null;
  gameState.isProcessingInput = false;
  elements.startBtn.disabled = false;

  clearAllTimers();

  elements.instructionDisplay.textContent = '训练结束';
  elements.instructionDisplay.className = 'instruction-text';
  elements.instructionDisplay.style.color = '#ecf0f1';

  updateDisplay();
}

/**
 * 重置统计数据
 * 将所有统计字段归零，清空反应时间数组
 * 调用updateDisplay()更新界面显示
 */
function resetStats() {
  stats.currentCombo = 0;
  stats.totalAttempts = 0;
  stats.correctAttempts = 0;
  stats.reactionTimes = [];
  updateDisplay();
}

/**
 * 清理指令相关定时器
 * 清除指令超时定时器和反馈延迟定时器
 * 不影响游戏主定时器，确保30秒限制正常工作
 */
function clearInstructionTimers() {
  if (timers.instructionTimer) {
    clearTimeout(timers.instructionTimer);
    timers.instructionTimer = null;
  }
  if (timers.feedbackTimer) {
    clearTimeout(timers.feedbackTimer);
    timers.feedbackTimer = null;
  }
}

/**
 * 清理所有定时器
 * 清除游戏主定时器(30秒限制)和所有指令相关定时器
 * 通常在游戏结束时调用，确保没有定时器泄漏
 */
function clearAllTimers() {
  if (timers.gameTimer) {
    clearTimeout(timers.gameTimer);
    timers.gameTimer = null;
  }
  clearInstructionTimers();
}

/**
 * 从instructions数组中随机选择一个指令
 * 更新显示内容，记录开始时间，设置2秒超时检测
 * 重置输入处理状态，允许接收新的按键输入
 */
function generateNextInstruction() {
  if (!gameState.isPlaying) return;

  gameState.isProcessingInput = false; // 重置输入处理状态，允许接收新的按键输入

  // TODO: 生成下一个随机指令
  const randomIndex = Math.floor(Math.random() * instructions.length);
  gameState.currentInstruction = instructions[randomIndex];
  // TODO: END

  gameState.instructionStartTime = Date.now(); // 记录当前时间戳，用于后续计算反应时间

  if (gameState.currentInstruction) {
    elements.instructionDisplay.textContent = gameState.currentInstruction.text;
    elements.instructionDisplay.className = 'instruction-text active';
    elements.instructionDisplay.style.color = '#ecf0f1';
  }

  if (timers.instructionTimer) clearTimeout(timers.instructionTimer);
  timers.instructionTimer = setTimeout(() => {
    if (
      gameState.isPlaying &&
      gameState.currentInstruction &&
      !gameState.isProcessingInput
    ) {
      handleMissedInstruction();
    }
  }, 2000);
}

/**
 * 处理键盘按键事件 - 核心键盘输入识别逻辑
 * @param {KeyboardEvent} event - 键盘事件对象
 * 【实现要求】:
 * 获取按下的按键码，根据按键调用相应的处理函数
 * - 如果按键正确 → 调用handleCorrectInput()
 * - 如果按键错误 → 调用handleIncorrectInput()
 */
function handleKeyPress(event) {
  // 检查游戏状态和输入状态
  if (
    !gameState.isPlaying ||
    !gameState.currentInstruction ||
    gameState.isProcessingInput
  )
    return;

  // 定义所有有效按键的码列表
  const validCodes = [
    'KeyW',
    'KeyA',
    'KeyS',
    'KeyD',
    'ArrowUp',
    'ArrowLeft',
    'ArrowDown',
    'ArrowRight',
  ];
  let pressedKey = event.code; // 记录当前按下的按键

  // 添加按键高亮效果
  highlightKey(pressedKey, true);

  if (!validCodes.includes(pressedKey)) {
    showInvalidKeyFeedback(); // 显示无效按键提示
    return;
  }

  // 屏蔽方向键的默认行为
  if (
    ['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'].includes(pressedKey)
  ) {
    event.preventDefault();
  }

  // 设置输入处理状态，防止重复处理
  gameState.isProcessingInput = true;

  let expectedCodes = gameState.currentInstruction.codes; // 当前指令期望的按键码数组
  // TODO: 判断按键是否正确并调用相应处理函数
  if (expectedCodes.includes(event.code)) {
    handleCorrectInput(); // 匹配，处理正确输入
  } else {
    handleIncorrectInput(); // 不匹配，处理错误输入
  }
  // TODO: END
}

/**
 * 处理正确输入 - 用户按对了按键的处理逻辑
 *
 * 【实现要求】:
 * 1. 计算反应时间：当前时间 - 指令开始时间
 * 2. 更新统计数据：正确次数、总次数、连击数、反应时间数组
 * 3. 清理当前指令状态和定时器
 * 4. 显示正确反馈信息
 * 5. 延迟500ms后生成下一个指令
 * - TODO部分调用showFeedback() 更新界面显示
 */
function handleCorrectInput() {
  if (!gameState.currentInstruction || gameState.isProcessingInput === false)
    return;
  // TODO: 显示正确反馈
  showFeedback('correct');
  // TODO: END

  // 计算反应时间
  const reactionTime = Date.now() - gameState.instructionStartTime;

  // 更新统计数据
  stats.reactionTimes.push(reactionTime); // 将反应时间添加到数组中，用于后续计算平均值
  stats.correctAttempts++; // 正确次数+1
  stats.totalAttempts++; // 总次数+1
  stats.currentCombo++; // 连击数+1

  // 更新界面显示
  updateDisplay();

  // 清理当前指令状态
  gameState.currentInstruction = null;
  clearInstructionTimers();

  // 延迟500ms后生成下一个指令
  timers.feedbackTimer = setTimeout(() => {
    generateNextInstruction();
  }, 500);
}

/**
 * 处理错误输入 - 用户按错了按键的处理逻辑
 *
 * 【实现要求】:
 * 1. 更新统计数据：总次数+1，连击数重置为0
 * 2. 清理当前指令状态和定时器
 * 3. 显示错误反馈信息
 * 4. 延迟500ms后生成下一个指令
 * - TODO部分调用showFeedback()更新界面显示
 */
function handleIncorrectInput() {
  if (!gameState.currentInstruction || gameState.isProcessingInput === false)
    return;

  // TODO: 显示错误反馈
  showFeedback('incorrect');
  // TODO: END

  // 更新统计数据
  stats.totalAttempts++; // 总次数+1
  stats.currentCombo = 0; // 连击数重置为0
  // 更新界面显示
  updateDisplay();
  // 清理当前指令状态
  gameState.currentInstruction = null;
  clearInstructionTimers();

  // 延迟500ms后生成下一个指令
  timers.feedbackTimer = setTimeout(() => {
    generateNextInstruction();
  }, 500);
}

/**
 * 处理超时未响应
 * 当指令显示2秒后用户仍未按键时自动调用
 * 增加总尝试次数，重置连击数，显示超时反馈
 * 设置输入处理状态，500ms后生成下一个指令
 */
function handleMissedInstruction() {
  if (!gameState.currentInstruction || gameState.isProcessingInput) return;

  gameState.isProcessingInput = true;
  stats.totalAttempts++;
  stats.currentCombo = 0;

  gameState.currentInstruction = null;

  showFeedback('missed');
  updateDisplay();

  timers.feedbackTimer = setTimeout(() => {
    generateNextInstruction();
  }, 500);
}

/**
 * 显示无效按键反馈
 * 对不在有效按键列表中的按键给出提示
 * 帮助用户了解哪些按键是可用的，提升游戏体验
 */
function showInvalidKeyFeedback() {
  const display = elements.instructionDisplay; // 获取指令显示区域DOM元素的引用
  const originalText = display.textContent; // 保存原始文本内容
  const originalColor = display.style.color; // 保存原始颜色

  // 显示无效按键提示
  display.textContent = '请使用 WASD 或方向键';
  display.style.color = '#e67e22'; // 橙色提示颜色，区别于错误的红色

  // 800ms后恢复原始内容和颜色
  setTimeout(() => {
    display.textContent = originalText;
    display.style.color = originalColor;
  }, 800);
}
/**
 * 显示反馈信息
 * @param {string} type - 反馈类型：'correct'(正确)、'incorrect'(错误)、'missed'(超时)
 * 根据类型设置不同的文字内容和颜色
 * 400ms后恢复默认颜色，避免颜色状态混乱
 */
function showFeedback(type) {
  const display = elements.instructionDisplay; // 获取指令显示区域DOM元素的引用

  switch (type) {
    case 'correct':
      display.textContent = '正确！';
      display.style.color = '#27ae60';
      break;
    case 'incorrect':
      display.textContent = '错误！';
      display.style.color = '#e74c3c';
      break;
    case 'missed':
      display.textContent = '超时！';
      display.style.color = '#f39c12';
      break;
  }

  setTimeout(() => {
    display.style.color = '#ecf0f1';
  }, 400);
}

/**
 * 更新界面显示
 * 实时更新连击数、准确率和平均反应时间
 * 准确率 = 正确次数 / 总次数 * 100(四舍五入)
 * 平均反应时间 = 所有反应时间之和 / 反应次数(使用reduce方法)
 */
function updateDisplay() {
  elements.currentCombo.textContent = stats.currentCombo;

  const accuracy =
    stats.totalAttempts > 0 // 计算准确率：正确次数/总次数*100，避免除零错误
      ? Math.round((stats.correctAttempts / stats.totalAttempts) * 100)
      : 0;
  elements.accuracy.textContent = accuracy + '%'; // 更新准确率显示，添加百分号后缀

  const avgReaction =
    stats.reactionTimes.length > 0 // 计算平均反应时间：所有反应时间之和/次数
      ? Math.round(
          stats.reactionTimes.reduce((a, b) => a + b, 0) /
            stats.reactionTimes.length
        )
      : 0;
  elements.avgReaction.textContent = avgReaction + 'ms'; // 更新平均反应时间显示，添加毫秒后缀
}

// 初始化游戏
initializeEventListeners();
updateDisplay();

/**
 * 处理键盘松开事件
 * @param {KeyboardEvent} event - 键盘事件对象
 * 只处理按键高亮效果的移除，不影响游戏逻辑
 */
function handleKeyRelease(event) {
  const releasedKey = event.code; // 获取松开的按键码
  const validCodes = [
    'KeyW',
    'KeyA',
    'KeyS',
    'KeyD',
    'ArrowUp',
    'ArrowLeft',
    'ArrowDown',
    'ArrowRight',
  ];

  if (validCodes.includes(releasedKey)) {
    highlightKey(releasedKey, false); // 移除按键高亮效果
  }
}

/**
 * 控制按键高亮效果
 * @param {string} keyCode - 按键码（如'KeyW', 'ArrowUp'）
 * @param {boolean} isPressed - 是否按下状态，true为高亮，false为取消高亮
 */
function highlightKey(keyCode, isPressed) {
  const keyIndex = keyMapping[keyCode]; // 获取按键对应的元素索引
  if (keyIndex !== undefined && elements.keyHints[keyIndex]) {
    const keyElement = elements.keyHints[keyIndex]; // 获取对应的按键提示元素

    if (isPressed) {
      keyElement.classList.add('pressed'); // 添加高亮样式类
    } else {
      keyElement.classList.remove('pressed'); // 移除高亮样式类
    }
  }
}

// 导出测试需要的函数和变量 (仅在Node.js环境中)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    gameState,
    instructions,
    stats,
    generateNextInstruction,
    handleKeyPress,
    handleCorrectInput,
    handleIncorrectInput,
  };
}