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
    name: '德祥楼（中山林店）',
    address: '民主西路299号至诚大厦写字楼1-3层',
    location: '103.826393,36.045697',
    rating: '4.4',
    cost: '107',
    openTime: '10:00-21:30',
    phone: '0931-8113905',
    style: '清真正餐 / 羊肉更强'
  },
  {
    name: '国保牛肉面（总店）',
    address: '中路子79号（近电力大厦）',
    location: '103.826633,36.046925',
    rating: '4.6',
    cost: '18',
    openTime: '06:00-15:00',
    phone: '13919221441 / 13993174294',
    style: '学生预算友好'
  },
  {
    name: '明德富纯汤牛肉面（五泉店）',
    address: '五泉广场公交站附近',
    location: '103.828858,36.040276',
    rating: '4.1',
    cost: '15',
    openTime: '24小时营业',
    phone: '18919019053',
    style: '下山后就近省事'
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
