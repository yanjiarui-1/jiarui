const link = (label, url) => ({ label, url });
export const map = (name) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`;
const route = (from, to) => `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(from)}&destination=${encodeURIComponent(to)}`;
export const hotels = [
  {name:'阿布扎比皇家玫瑰酒店', en:'Royal Rose Hotel Abu Dhabi, Curio Collection by Hilton', in:'2月1日 14:00起', arrival:'2月2日凌晨', out:'2月6日 12:00前', room:'King Guest Room', nights:5, price:4800.40, nightly:960.08, url:'https://www.hilton.com/', map:map('Royal Rose Hotel Abu Dhabi'), key:'rose'},
  {name:'慕温匹克迪拜河畔酒店', en:'Mövenpick Dubai Creek', in:'2月6日 15:00起', out:'2月12日 12:00前', room:'Deluxe King Room', nights:6, price:3312.97, nightly:552.16, url:'https://all.accor.com/hotel/C683/index.en.shtml', map:map('Movenpick Dubai Creek'), key:'creek'},
];
export const flights = [
  {date:'2月1日 · 经济舱', code:'EY889', from:['19:45','PKX','北京大兴'], to:['01:00','AUH','2月2日抵达'], duration:'9小时15分钟'},
  {date:'2月12日 · 经济舱', code:'EY888', from:['21:20','AUH','阿布扎比'], to:['08:45','PKX','2月13日抵达'], duration:'7小时25分钟'},
];
export const airfare = 10411;
export const bookingRegions = { abuDhabi:'阿布扎比', dubai:'迪拜' };
// Order by suggested start date. Each id also identifies its checklist item.
export const booking = [
  ['future',['未来博物馆','Museum of the Future Ticket','迪拜未来博物馆'],'dubai',9,'30–60天','2026年12月11日–2027年1月10日',750,'¥700–800',[link('查看馆方公告','https://museumofthefuture.ae/en')],'馆方官网目前显示展览暂时关闭，2月场次待确认。'],
  ['burj',['哈利法塔','At the Top, Burj Khalifa Ticket (Levels 124 & 125)','哈利法塔124／125层观景台'],'dubai',11,'21–30天','1月12–21日',950,'¥700–1,200',[link('官方旅游购票入口','https://experiences.visitdubai.com/at-the-top-burj-khalifa-get-your-tickets')]],
  ['sea',['海洋世界','SeaWorld Abu Dhabi Ticket','阿布扎比海洋世界'],'abuDhabi',3,'7–14天','1月20–27日',1400,'¥1,200–1,600',[link('官方网站','https://www.seaworldabudhabi.com/')]],
  ['team',['teamLab现象博物馆','teamLab Phenomena Abu Dhabi Ticket'],'abuDhabi',4,'7–14天','1月21–28日',620,'¥620起',[link('官方网站','https://www.teamlab.art/e/phenomena/')]],
  ['owl',['猫头鹰咖啡馆','Boomah Café Abu Dhabi'],'abuDhabi',5,'7–14天','1月22–29日',280,'¥280',[link('店铺导航',map('Boomah Cafe Abu Dhabi')),link('旅游局店铺介绍','https://visitabudhabi.ae/en/where-to-go/dining-and-restaurants/boomah-cafe/')],'提前向店方确认门店地址、营业状态及预约方式。'],
  ['mosque',['大清真寺免费预约','Sheikh Zayed Grand Mosque Visitor Access Pass','谢赫扎耶德大清真寺免费预约'],'abuDhabi',5,'7–14天','1月22–29日',0,'免费预约',[link('官方预约','https://visit.szgmc.gov.ae/')]],
  ['desert',['沙漠冲沙','Evening Desert Safari in Dubai','迪拜傍晚沙漠冲沙'],'dubai',7,'7–14天','1月24–31日',1600,'¥1,200–2,000',[link('Arabian Adventures','https://www.arabian-adventures.com/'),link('Platinum Heritage','https://www.platinum-heritage.com/')]],
  ['palace',['总统府','Qasr Al Watan Presidential Palace Ticket','阿布扎比总统府'],'abuDhabi',2,'3–7天','1月26–30日',290,'¥260–320',[link('官方网站','https://www.qasralwatan.ae/')]],
  ['gold',['金箔咖啡','Palace Cappuccino at Emirates Palace','酋长皇宫酒店金箔咖啡'],'abuDhabi',2,'3–7天','1月26–30日',350,'¥300–400',[link('酋长皇宫酒店官网','https://www.mandarinoriental.com/en/abu-dhabi/emirates-palace')]],
  ['water',['亚特兰蒂斯水上世界','Aquaventure World Ticket in Atlantis Dubai'],'dubai',10,'7–14天','1月27日–2月3日',1500,'¥1,300–1,700',[link('官方网站','https://www.aquaventureworld.com/')]],
  ['louvre',['海上卢浮宫','Louvre Abu Dhabi Ticket','阿布扎比海上卢浮宫'],'abuDhabi',4,'3–7天','1月28日–2月1日',280,'¥280',[link('官方网站','https://www.louvreabudhabi.ae/')]],
  ['butterfly',['蝴蝶花园','The Butterfly Gardens Abu Dhabi Ticket','阿布扎比蝴蝶花园'],'abuDhabi',5,'3–7天','1月29日–2月2日',220,'¥220',[link('官方网站','https://butterflygardensabudhabi.com/plan-your-visit/')]],
  ['frame',['迪拜相框','Dubai Frame Ticket'],'dubai',9,'3–7天','2月2–6日',200,'¥200',[link('迪拜旅游局购票指南','https://www.visitdubai.com/en/places-to-visit/dubai-frame')]],
].map(([id,[name,ticketName,calendarName = name],region,day,ahead,window,price,range,links,note])=>({
  id,name,ticketName,calendarName,region,day,ahead,window,price,range,links,note,
}));
export const bookings = Object.fromEntries(booking.map(item=>[item.id,item]));
const list = (ids) => ids.map(id=>bookings[id]);
const abra = {id:'abra',name:'传统木船（现场支付）',window:'2月8日',price:4,links:[link('迪拜RTA官网','https://www.rta.ae/')]};
export const groups = [
  ['机票酒店',[{id:'flight',name:'国际往返机票',window:'已预订',price:airfare}, ...hotels.map(hotel=>({id:hotel.key,name:hotel.name,window:'已预订',price:hotel.price})),{id:'late',name:'通知酒店凌晨入住',window:'现在'}]],
  ['阿布扎比',[...list(['palace','gold','sea','louvre','team','butterfly','owl','mosque']),{id:'reunion',name:'除夕年夜饭',window:'1月22–29日'}]],
  ['迪拜',[bookings.desert,abra,...list(['future','frame','water','burj']),{id:'dinner',name:'春节晚餐',window:'1月下旬'}]],
  ['交通及准备',[
    {id:'pickup',name:'阿布扎比凌晨接机',window:'1月下旬'}, {id:'transfer',name:'2月6日跨城专车',window:'1月下旬'}, {id:'airport',name:'2月12日机场送机',window:'1月下旬'},
    {id:'insurance',name:'境外旅游保险',window:'出发前2周'}, {id:'network',name:'境外网络及电话卡',window:'出发前1周'}, {id:'ramadan',name:'确认斋月营业时间',window:'出发前1周'}, {id:'hotel-tax',name:'确认酒店早餐及旅游税',window:'出发前'}, {id:'passport',name:'核对护照、签证政策及行李',window:'现在'},
  ]],
];
export const tasks = groups.flatMap(([,items])=>items);
export const taskById = Object.fromEntries(tasks.map(item=>[item.id,item]));
export const experiences = [...booking, abra];
export const days = [
  ['北京出发 · 开启假期','北京出发','北京','飞机',[
    ['14:30','出发前往机场','携带护照、机票、酒店确认单及随身物品。'],['16:30','抵达北京大兴机场','办理值机、托运、安检及出境手续。'],['19:45','EY889起飞','飞行9小时15分钟，机上用餐、休息。',['late','pickup']],
  ]],
  ['皇宫与城市风光','总统府、金箔咖啡','阿布扎比','皇家玫瑰',[
    ['01:00–03:00','抵达及入住','抵达扎耶德国际机场，入境取行李后前往皇家玫瑰酒店。'],['11:00–12:30','自然醒、午餐','不安排早间景点，充分休息。'],['13:00–15:00','阿布扎比总统府','参观宫殿建筑、中央大厅及皇家展品。',['palace']],['15:30–17:00','酋长皇宫酒店金箔咖啡','体验24K金箔咖啡，欣赏酒店建筑。',['gold']],['17:30–19:00','滨海大道','欣赏海滨日落，随后在市区吃晚餐。'],['20:30','返回皇家玫瑰酒店'],
  ]],
  ['海洋世界 · 亚斯岛','海洋世界','阿布扎比','皇家玫瑰',[
    ['09:00–10:30','早餐、乘车前往亚斯岛'],['10:30–16:30','阿布扎比海洋世界','参观大型海洋馆、企鹅展区和不同主题海洋生态区。午餐在园内解决。',['sea']],['17:00–19:00','亚斯购物中心','逛街、吃晚餐，当天留出时间休息。'],['19:30–20:30','返回酒店休息'],
  ]],
  ['海上艺术与沉浸式科技','卢浮宫、teamLab','萨迪亚特岛','皇家玫瑰',[
    ['09:30','早餐、前往文化区'],['10:30–13:00','阿布扎比海上卢浮宫','参观艺术展品，欣赏海上穹顶和光影建筑。',['louvre']],['13:00–14:30','午餐、休息'],['14:30–17:00','teamLab现象博物馆','体验数字艺术和光影互动，优先关注14:30附近的场次。',['team']],['17:30–19:30','Mamsha海滨步道','海边散步、看日落、吃晚餐。'],
  ]],
  ['蝴蝶、猫头鹰与清真寺','蝴蝶、猫头鹰、清真寺','农历除夕','皇家玫瑰',[
    ['09:30','早餐、出发'],['10:30–12:00','蝴蝶花园','必去。近距离欣赏蝴蝶和热带植物。',['butterfly']],['12:00–13:30','Al Qana海滨午餐'],['14:30–15:30','猫头鹰咖啡馆','必去。观察猫头鹰，遵守店方的动物保护和互动要求。',['owl']],['16:30–18:30','谢赫扎耶德大清真寺','欣赏白色大理石建筑及日落夜景。当天为周五，核对礼拜期间的游客开放时段。',['mosque']],['19:30','除夕年夜饭','选酒店附近的中餐厅或阿拉伯餐厅，餐后回酒店收拾行李。',['reunion']],
  ]],
  ['春节初一 · 前往迪拜','春节初一、前往迪拜','更换酒店','慕温匹克',[
    ['09:00–11:30','早餐、整理行李','时间充裕可顺路逛WTC市集或豪森宫附近。'],['12:00','皇家玫瑰酒店退房'],['12:30–15:00','专车前往迪拜','参考车程1.5–2.5小时，视路况而定。',['transfer']],['15:00–17:00','入住慕温匹克酒店','休息、整理随身物品。'],['18:00–21:00','迪拜Mall及春节晚餐','逛商场，欣赏哈利法塔外观和音乐喷泉。登塔安排在2月11日。',['dinner'],[link('迪拜Mall官网','https://thedubaimall.com/')]],
  ]],
  ['沙漠冲沙与营地晚宴','沙漠冲沙','迪拜','慕温匹克',[
    ['09:30–13:00','自然醒、酒店泳池、午餐','上午在酒店休息。'],['14:00–21:00','沙漠冲沙品质团','参考安排：14:00酒店接车，15:30越野冲沙，16:30骑骆驼、滑沙和拍照，17:30看日落，18:00营地晚餐与表演，21:00返回。预订时确认往返接送、晚餐和保险。',['desert']],
  ]],
  ['迪拜老城 · 黄金香料市场','老城区、黄金市场','迪拜河畔','慕温匹克',[
    ['10:00–12:30','阿法迪历史街区','免费游览传统街巷、风塔及Al Seef沿河街区。'],['12:30–14:00','阿拉伯特色午餐','可以关注Arabian Tea House一类的传统餐厅。'],['14:00–14:30','传统Abra木船','搭乘公共渡船横渡迪拜河，双人暂估¥4，现场支付。',['abra']],['14:30–17:00','黄金市场及香料市场','免费游览，逛黄金首饰、香料和椰枣摊位。'],['17:30','晚餐、返回酒店','当天主要在酒店附近活动。'],
  ]],
  ['未来科技与城市地标','未来博物馆、迪拜相框','迪拜','慕温匹克',[
    ['09:30','早餐、前往未来博物馆'],['10:30–13:00','未来博物馆','预留未来城市与科技互动展览时段，按馆方开放公告决定是否成行。',['future']],['13:00–14:30','午餐、休息'],['15:00–16:30','迪拜相框','从观景平台欣赏迪拜新城与老城。',['frame']],['17:00以后','自由活动、晚餐'],
  ]],
  ['棕榈岛 · 亚特兰蒂斯水上世界','棕榈岛、水上世界','全天水上活动','慕温匹克',[
    ['08:00–10:00','早餐、打车前往棕榈岛','从德拉区出发，建议比其他游玩日稍早。'],['10:00–16:30','亚特兰蒂斯水上世界','体验滑梯、漂流河和沙滩，午餐在园内解决。查清储物柜、毛巾及附加项目是否含在门票里。',['water']],['17:00–19:30','棕榈岛海滨日落','海边散步、海景晚餐。'],['20:00','乘车返回酒店','准备泳衣、防晒、防水手机袋和换洗衣物。遇到大风或降温可调整日期。'],
  ]],
  ['帆船酒店与哈利法塔','帆船酒店、哈利法塔','迪拜经典地标','慕温匹克',[
    ['09:00','早餐、出发'],['10:00–11:30','朱美拉海滩','在公共区域拍摄帆船酒店外观。'],['11:30–14:00','朱美拉古堡市集','免费逛市集、拍运河、吃午餐。'],['14:00–15:30','前往迪拜Mall、咖啡休息','直接前往商场，节省折返德拉的时间。'],['16:00–18:30','哈利法塔124/125层','优先关注日落前场次，争取看到白天、日落及夜景。',['burj']],['18:30–20:30','音乐喷泉、晚餐','在公共观景区看喷泉，再吃迪拜最后一晚的晚餐。'],['21:00','返回酒店、整理行李'],
  ]],
  ['最后的自由时间 · 返程','自由活动、返程','迪拜 / 阿布扎比','飞机',[
    ['09:00–11:30','自然醒、早餐、整理行李'],['12:00','慕温匹克酒店退房','行李寄存在前台。'],['12:00–14:00','午餐、购买伴手礼','只在酒店附近活动。'],['14:30','专车前往阿布扎比机场','留出跨城交通和堵车时间。',['airport']],['17:00–17:30','预计抵达机场','办理值机、托运、退税及出境。'],['21:20','EY888起飞返京','阿提哈德航空，预计飞行7小时25分钟。'],
  ]],
  ['平安抵达北京','抵达北京','北京','家',[
    ['08:45','抵达北京大兴国际机场','办理入境、领取行李。回家休息，整理照片和实际消费记录。'],
  ]],
].map(([title,summary,place,stay,stops],i)=>({day:i+1,date:`2月${i+1}日`,weekday:`周${'一二三四五六日'[i%7]}`,title,summary,place,stay,stops}));
export const transport = [
  ['阿布扎比机场至皇家玫瑰酒店','2月2日凌晨 · 约02:00出发','30–45分钟','¥150–250',route('Zayed International Airport','Royal Rose Hotel Abu Dhabi'),'建议搭乘机场正规出租车或提前预订接机。'],
  ['皇家玫瑰酒店至慕温匹克迪拜河畔酒店','2月6日 · 12:30出发','1.5–2.5小时','¥500–800',route('Royal Rose Hotel Abu Dhabi','Movenpick Dubai Creek')],
  ['慕温匹克迪拜河畔酒店至阿布扎比机场','2月12日 · 14:30出发','1.5–2.5小时','¥500–800',route('Movenpick Dubai Creek','Zayed International Airport')],
];
export const apps = [
  ['Careem','当地打车及Hala出租车','https://www.careem.com/'],['Uber','市内及部分跨城交通','https://www.uber.com/'],['Google Maps','景点导航和餐厅查询','https://maps.google.com/'],['Google Translate','英文及阿拉伯语翻译','https://translate.google.com/'],
];
export const reminders = [
  ['斋月期间的安排','2027年斋月预计在2月8日前后开始，以当地观月公告为准。留意迪拜后半程餐厅、景点和表演时间。2月7日冲沙的活动内容也宜提前向运营商确认。'],
  ['清真寺着装','穿宽松衣物，遮盖肩膀和腿部，女性准备遮盖头发的头巾。以清真寺官方着装规定为准。',link('查看官方访客准则','https://visit.szgmc.gov.ae/')],
  ['天气及衣物','白天通常较温暖，夜间、沙漠及海边可能偏凉。准备薄外套、长裤、泳衣、墨镜和防晒用品。'],
  ['货币及支付','当地使用阿联酋迪拉姆（AED）。可携带Visa或Mastercard及少量当地现金。手册人民币价格为预算估算。'],
  ['电源及网络','准备英标Type G转换插头、充电宝及境外网络。'],
  ['旅行安全及保险','出发前核对入境政策、安全形势和航班动态，检查沙漠越野与水上乐园活动是否在保险承保范围内。',link('中国领事服务网','https://cs.mfa.gov.cn/')],
];
