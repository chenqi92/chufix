import {
  CfDonutChart,
  CfBarChart,
  CfTreemap,
  CfStat,
  CfStackedBar100,
} from '@chufix-design/react';

const sources = [
  { name: 'Search', value: 4280 },
  { name: 'Direct', value: 2240 },
  { name: 'Social', value: 1820 },
  { name: 'Email', value: 940 },
  { name: 'Other', value: 720 },
];

const conversions = [42, 68, 35, 91, 57, 78, 23, 64, 49, 72];
const conversionsLabel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon', 'Tue', 'Wed'];

const bundleNodes = [
  { name: 'react-dom', value: 1200 },
  { name: 'react', value: 720 },
  { name: 'lodash', value: 540 },
  { name: 'moment', value: 480 },
  { name: 'rxjs', value: 380 },
  { name: 'd3', value: 320 },
  { name: 'others', value: 600 },
];

const browsers = [
  { name: 'Chrome', value: 65 },
  { name: 'Safari', value: 18 },
  { name: 'Firefox', value: 9 },
  { name: 'Edge', value: 5 },
  { name: 'Other', value: 3 },
];

export function AnalyticsBoard() {
  return (
    <div className="board">
      <header className="board__head">
        <h2>Analytics</h2>
        <p>过去 7 天的访问与转化分布</p>
      </header>

      <section className="board__stats">
        <CfStat label="总访问" value="9,300" trend="up" delta={12.4} />
        <CfStat label="独立访客" value="6,712" trend="up" delta={3.8} />
        <CfStat label="跳出率" value="42.1" suffix="%" trend="down" delta={-1.4} />
        <CfStat label="平均停留" value="3:42" trend="flat" />
      </section>

      <section className="board__row board__row--3">
        <div className="board__card">
          <h3>来源分布</h3>
          <CfDonutChart segments={sources} size={180} thickness={22} />
        </div>
        <div className="board__card">
          <h3>每日转化</h3>
          <CfBarChart data={conversions} labels={conversionsLabel} height={200} />
        </div>
        <div className="board__card">
          <h3>浏览器份额</h3>
          <CfStackedBar100 segments={browsers} />
        </div>
      </section>

      <section className="board__card">
        <h3>Bundle 分析 · 4.2 MB</h3>
        <CfTreemap nodes={bundleNodes} height={220} />
      </section>
    </div>
  );
}
