/**
 * 站点与个人信息统一配置。
 * 想改名字、简介、联系方式、技能，只改这里就够了。
 */

export interface SkillGroup {
  title: string
  icon: string
  items: string[]
}

export interface TimelineItem {
  period: string
  title: string
  desc: string
}

export const profile = {
  /** 显示名 */
  name: '芦恩祈',
  /** 头像（放在 docs/public/ 下的文件） */
  avatar: '/avatar.jpg',

  /** 首页「关于我」段落，支持 Markdown 行内语法 */
  bio: [
    '我是**芦恩祈**，南京邮电大学（NJUPT）大二学生，同时修读**应用物理学**与**电子科学与技术**。',
    '主要方向是**嵌入式软件、计算机体系结构、数字芯片设计**，以及**大模型的量化研究**。做过 Zynq 频谱分析（2026 电赛 G 题）、GD32 数据终端（西门子杯），目前为一生一芯C阶段三期学员。',
    '现任南京邮电大学校大学生科学技术协会第 35 届电子部部长。喜欢把踩过的坑整理成文章——既是复盘，也希望能帮到踩同一个坑的人。',
  ],

  /** 个人信息表 */
  info: [
    { label: '学校', value: '南京邮电大学' },
    { label: '年级', value: '本科二年级' },
    { label: '专业', value: '应用物理 + 电子科学' },
    { label: '职务', value: '校科协 35 届电子部部长' },
    { label: '方向', value: '嵌入式 / 芯片 / 量化' },
    { label: '所在地', value: '南京' },
  ],

  email: '1207058938@qq.com',
  github: 'https://github.com/xiao-lu-0104',

  /** 技能标签分组 */
  skills: [
    { title: '数字设计', icon: '🔧', items: ['Verilog', 'Vivado', 'AHB / AXI', 'RISC-V', 'Zynq'] },
    { title: '嵌入式', icon: '⚙️', items: ['C / C++', 'GD32 / STM32', '通信协议', 'Bootloader'] },
    { title: '机器学习', icon: '🧠', items: ['Python', 'PyTorch', '模型量化'] },
    { title: '工具', icon: '🧰', items: ['Linux', 'Git', 'LaTeX', 'VS Code'] },
  ] as SkillGroup[],

  /** 首页「我做过什么」时间线 */
  timeline: [
    {
      period: '现在',
      title: '南邮大二 · 校科协电子部部长',
      desc: '同时修应用物理与电子科学，主要折腾嵌入式、体系结构、数字芯片和大模型量化。',
    },
    {
      period: '2026',
      title: '电赛 G 题 · Zynq 频谱分析',
      desc: 'PL 高速采集 + PS 的 FFT/CZT 算法，做信号参数测量。',
    },
    {
      period: '2026',
      title: '西门子杯 · GD32 数据终端',
      desc: '从采集、协议、参数存储做到 OTA 升级，完整走了一遍数据终端固件。',
    },
    {
      period: '2025',
      title: '一生一芯',
      desc: '从指令集到流片流程，完整设计并验证一颗 RISC-V 处理器。',
    },
  ] as TimelineItem[],
}
