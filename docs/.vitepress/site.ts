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
  name: 'Laurence',
  /** 头像（放在 docs/public/ 下的文件） */
  avatar: '/avatar.svg',

  /** 首页「关于我」段落，支持 Markdown 行内语法 */
  bio: [
    '我是一名在读硕士研究生，研究方向是**大模型压缩与量化**，目前关注大型视觉语言模型（LVLM）的细粒度量化方法。',
    '本科阶段长期泡在嵌入式与数字系统设计里：写过 PLC 运动控制，做过 FPGA 图像处理，也完整走过一遍 RISC-V 处理器「一生一芯」的设计流程。',
    '喜欢把工程里踩过的坑整理成文章——既是复盘，也希望能帮到踩同一个坑的人。',
  ],

  /** 个人信息表 */
  info: [
    { label: '研究方向', value: '模型压缩 / LVLM 量化' },
    { label: '身份', value: '硕士研究生在读' },
    { label: '所在地', value: '中国' },
    { label: '状态', value: '🟢 开放实习与合作' },
  ],

  email: 'you@example.com',
  github: 'https://github.com/yourname',

  /** 技能标签分组 */
  skills: [
    { title: '数字设计', icon: '🔧', items: ['Verilog', 'Vivado', 'AHB / AXI', 'RISC-V'] },
    { title: '嵌入式', icon: '⚙️', items: ['C / C++', 'STM32', 'PLC 运动控制'] },
    { title: '机器学习', icon: '🧠', items: ['Python', 'PyTorch', '量化与推理部署'] },
    { title: '工具', icon: '🧰', items: ['Linux', 'Git', 'LaTeX', 'VS Code'] },
  ] as SkillGroup[],

  /** 首页「我做过什么」时间线 */
  timeline: [
    {
      period: '现在',
      title: '硕士 · 模型量化研究',
      desc: '研究大型视觉语言模型的细粒度量化，跟着论文和代码一点点啃。',
    },
    {
      period: '本科',
      title: '一生一芯',
      desc: '从指令集到流片流程，完整设计并验证一颗 RISC-V 处理器。',
    },
    {
      period: '本科',
      title: '电子设计竞赛 & 西门子杯',
      desc: '嵌入式系统、FPGA 加速与运动控制，拿过几个不大不小的奖。',
    },
  ] as TimelineItem[],
}
