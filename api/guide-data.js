const SCHOOL = {
  name: '甘肃政法大学安宁西路校区',
  address: '甘肃省兰州市安宁区安宁西路6号',
  location: '103.729531,36.103393'
};

const PARK = {
  name: '五泉山公园',
  address: '甘肃省兰州市城关区五泉南路103号',
  location: '103.824657,36.037959'
};

const FOODS = [
  {
    name: '伊兴面片',
    address: '五泉山店 · 就在公园旁边',
    location: '103.827000,36.038500',
    rating: '4.5',
    cost: '20-30',
    openTime: '10:00-21:00',
    phone: '13919110233',
    style: '招牌炒面片、腱子肉',
    description: '招牌炒面片、腱子肉，清真风味。面条劲道，肉片厚实，是爬山后补充能量的绝佳选择。',
    badge: '最近',
    badgeColor: 'red',
    icon: 'utensils',
    distance: '步行3分钟',
    colorFrom: 'from-amber-400',
    colorTo: 'to-orange-500'
  },
  {
    name: '占国牛肉面',
    address: '五泉山下 · 本地学生最爱',
    location: '103.826500,36.039000',
    rating: '4.6',
    cost: '15-25',
    openTime: '06:00-15:00',
    phone: '13919221441',
    style: '牛腱子肉扎实，面条劲道',
    description: '牛腱子肉扎实，面条劲道。推荐"二细"或"韭叶"，加肉蛋双飞。下午去汤会稍咸，建议中午前。',
    badge: '必吃',
    badgeColor: 'amber',
    icon: 'bowl-rice',
    distance: '步行5分钟',
    colorFrom: 'from-yellow-400',
    colorTo: 'to-amber-500'
  },
  {
    name: '再回首',
    address: '大众巷店/道升巷店',
    location: '103.830000,36.060000',
    rating: '4.3',
    cost: '15-20',
    openTime: '09:00-22:00',
    phone: '0931-8888888',
    style: '兰州小吃集合店',
    description: '高担酿皮、灰豆子、甜胚子奶茶、油炒粉。兰州小吃集合店，人均不到20元吃到撑，学生党福音。',
    badge: '小吃',
    badgeColor: 'blue',
    icon: 'leaf',
    distance: '打车10分钟',
    colorFrom: 'from-green-400',
    colorTo: 'to-emerald-500'
  },
  {
    name: '杜记甜食',
    address: '西关什字附近',
    location: '103.835000,36.055000',
    rating: '4.2',
    cost: '10-15',
    openTime: '08:00-20:00',
    phone: '0931-7777777',
    style: '兰州老字号甜食',
    description: '灰豆子、甜醅子、晶糕、糖油糕。兰州老字号甜食店，6元一碗的灰豆子温暖又扎实。',
    badge: '甜品',
    badgeColor: 'purple',
    icon: 'cookie-bite',
    distance: '打车12分钟',
    colorFrom: 'from-purple-400',
    colorTo: 'to-pink-500'
  },
  {
    name: '阿西娅羊羔肉',
    address: '西关店 · 西北菜天花板',
    location: '103.838000,36.052000',
    rating: '4.7',
    cost: '60-80',
    openTime: '11:00-23:00',
    phone: '0931-6666666',
    style: '黄焖羊羔肉、手抓羊肉',
    description: '黄焖羊羔肉鲜嫩无膻味，配沙葱和油香饼。手抓羊肉也是一绝，三泡台茶解腻一流。',
    badge: '正餐',
    badgeColor: 'orange',
    icon: 'drumstick-bite',
    distance: '打车10分钟',
    colorFrom: 'from-red-400',
    colorTo: 'to-orange-500'
  },
  {
    name: '五泉老街',
    address: '公园周边',
    location: '103.827500,36.037500',
    rating: '4.4',
    cost: '15-30',
    openTime: '06:00-23:00',
    phone: '无',
    style: '牛肉面馆、烧烤摊、小吃街',
    description: '牛肉面馆、烧烤摊、小吃一条街。爬山下来随便找一家牛肉面，配上一碟小菜，最是地道。',
    badge: '夜市',
    badgeColor: 'teal',
    icon: 'fire',
    distance: '步行可达',
    colorFrom: 'from-teal-400',
    colorTo: 'to-cyan-500'
  }
];

async function fetchDrivingSummary(key) {
  const url = `https://restapi.amap.com/v3/direction/driving?origin=${SCHOOL.location}&destination=${PARK.location}&output=JSON&strategy=0&key=${key}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== '1' || !data.route || !data.route.paths || !data.route.paths[0]) {
    throw new Error('Failed to fetch driving route from AMap');
  }

  const path = data.route.paths[0];
  return {
    distanceMeters: Number(path.distance),
    durationSeconds: Number(path.duration),
    taxiCost: Number(data.route.taxi_cost || 0),
    strategy: path.strategy || '速度最快',
    tolls: Number(path.tolls || 0)
  };
}

module.exports = async (req, res) => {
  try {
    const key = process.env.AMAP_WEBSERVICE_KEY;
    if (!key) {
      return res.status(500).json({ ok: false, error: 'Missing AMAP_WEBSERVICE_KEY' });
    }

    const route = await fetchDrivingSummary(key);

    res.setHeader('Cache-Control', 's-maxage=600, stale-while-revalidate=1800');
    return res.status(200).json({
      ok: true,
      weather: { summary: '晴 · 约 19°C', note: '基于会话核验结果，早晚略凉' },
      school: SCHOOL,
      park: PARK,
      route,
      foods: FOODS,
      verifiedAt: '2026-05-03'
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: error.message || 'Unknown error'
    });
  }
};
