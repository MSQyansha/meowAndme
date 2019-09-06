const EditMap = {
  intervalArray:[ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 365 ],
  intervalMap: [
    { status: 0, name: '单次提醒' },
    { status: 1, name: '1天1次' },
    { status: 2, name: '2天1次' },
    { status: 3, name: '3天1次' },
    { status: 4, name: '4天1次' },
    { status: 5, name: '5天1次' },
    { status: 6, name: '6天1次' },
    { status: 7, name: '7天1次' },
    { status: 8, name: '8天1次' },
    { status: 9, name: '9天1次' },
    { status: 10, name: '10天1次' },
    { status: 11, name: '11天1次' },
    { status: 12, name: '12天1次' },
    { status: 13, name: '13天1次' },
    { status: 14, name: '14天1次' },
    { status: 15, name: '15天1次' },
    { status: 16, name: '16天1次' },
    { status: 17, name: '17天1次' },
    { status: 18, name: '18天1次' },
    { status: 19, name: '19天1次' },
    { status: 20, name: '20天1次' },
    { status: 21, name: '21天1次' },
    { status: 22, name: '22天1次' },
    { status: 23, name: '23天1次' },
    { status: 24, name: '24天1次' },
    { status: 25, name: '25天1次' },
    { status: 26, name: '26天1次' },
    { status: 27, name: '27天1次' },
    { status: 28, name: '28天1次' },
    { status: 29, name: '29天1次' },
    { status: 30, name: '1月1次' },
    { status: 60, name: '2月1次' },
    { status: 90, name: '3月1次' },
    { status: 120, name: '4月1次' },
    { status: 150, name: '5月1次' },
    { status: 180, name: '6月1次' },
    { status: 210, name: '7月1次' },
    { status: 240, name: '8月1次' },
    { status: 270, name: '9月1次' },
    { status: 300, name: '10月1次' },
    { status: 330, name: '11月1次' },
    { status: 365, name: '1年1次' },
  ],
  breedArray:[ '阿比西尼亚猫', '埃及猫', '奥西猫', '巴厘猫', '波米拉猫', '波斯猫', '伯曼猫', '布偶猫', '德文卷毛猫', '东方猫', '东奇尼猫', '俄罗斯蓝猫', '哈瓦那棕猫', '呵叻猫', '加菲猫', '加拿大无毛猫', '金吉拉', '橘猫', '拉邦猫', '褴褛猫', '狸花猫', '临清狮猫', '马恩岛猫', '曼基康猫', '美国短毛猫', '美国短尾猫', '美国刚毛猫', '美国卷耳猫', '美国卷毛猫', '孟加拉豹猫', '孟买猫', '缅甸猫', '缅因猫', '奶牛猫', '挪威森林猫', '欧洲缅甸猫', '日本短尾猫', '塞尔凯克卷毛猫', '三花猫', '沙特尔猫', '斯芬克斯猫', '苏格兰折耳猫', '索马里猫', '土耳其安哥拉猫', '土耳其梵猫', '西伯利亚森林猫', '喜马拉雅猫', '暹罗猫', '新加坡猫', '异国短毛猫', '英国短毛猫', '英短蓝白', '英短蓝猫', '英短银渐层', '英短金渐层', '英国长毛猫', '中华田园猫', '重点色短毛猫' ],

  sexMap:[
    { status: 1, name: '男孩', select: false },
    { status: 2, name: '女孩', select: false },
  ],

  spayMap: [
    { status: 2, name: '已绝育', select: false },
    { status: 1, name: '未绝育', select: false },
  ],

  recordType:[
    {
      "id": 0,
      "title": "随手记",
      "image_url": "https://s3.cn-north-1.amazonaws.com.cn/nfs.gemii.cc/rekord/268f490f-bfde-481c-9e7b-b409b3427288.png"
    },
    {
      "id": 1,
      "title": "称体重",
      "image_url": "https://s3.cn-north-1.amazonaws.com.cn/nfs.gemii.cc/rekord/0157a586-483d-4685-b860-02a869123d04.png",

    },
    {
      "id": 2,
      "title": "做驱虫",
      "image_url": "https://s3.cn-north-1.amazonaws.com.cn/nfs.gemii.cc/rekord/2694a837-f067-469c-aed4-94f49c6a3fb2.png",
    },
    {
      "id": 3,
      "title": "打疫苗",
      "image_url": "https://s3.cn-north-1.amazonaws.com.cn/nfs.gemii.cc/rekord/c31a5881-5a96-491d-9529-48190568c212.png",
    }
  ],
  rTypes : ['随手记', '称体重', '做驱虫', '打疫苗'],
  remindTypes: ['自定义', '称体重', '剪指甲', '换猫砂', '洗耳朵', '猫三联', '狂犬疫苗', '体外驱虫', '体内驱虫','上药','洗澡','体检']
 
}


module.exports = EditMap;