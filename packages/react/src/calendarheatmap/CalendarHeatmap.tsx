import { useMemo } from 'react';
import {
  buildCells,
  calendarHeatmapClass,
  type CalendarHeatmapProps,
} from './variants';

const dowLabels = ['日', '一', '二', '三', '四', '五', '六'];

export function CalendarHeatmap({
  data,
  startDate,
  endDate,
  thresholds = [1, 3, 6, 10],
  className,
}: CalendarHeatmapProps) {
  const built = useMemo(
    () => buildCells(data, startDate, endDate, thresholds),
    [data, startDate, endDate, thresholds],
  );
  const cls = calendarHeatmapClass({ className });
  return (
    <div className={cls}>
      <div className="cf-heatmap__months">
        {built.months.map((m) => (
          <span
            key={`${m.week}-${m.label}`}
            className="cf-heatmap__month"
            style={{ gridColumn: `${m.week + 2}` }}
          >{m.label}</span>
        ))}
      </div>
      <div className="cf-heatmap__grid">
        <div className="cf-heatmap__dow">
          {dowLabels.map((d, i) => (
            <span key={d} className={`cf-heatmap__dow-cell${i % 2 === 1 ? '' : ' is-hidden'}`}>{d}</span>
          ))}
        </div>
        <div className="cf-heatmap__weeks">
          {built.weeks.map((week, wi) => (
            <div key={wi} className="cf-heatmap__week">
              {week.map((cell, di) => (
                <div
                  key={di}
                  className={`cf-heatmap__cell is-l${cell.level}${cell.inRange ? '' : ' is-empty'}`}
                  title={cell.inRange ? `${cell.date}: ${cell.value}` : ''}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="cf-heatmap__legend">
        <span>少</span>
        <span className="cf-heatmap__cell is-l0" />
        <span className="cf-heatmap__cell is-l1" />
        <span className="cf-heatmap__cell is-l2" />
        <span className="cf-heatmap__cell is-l3" />
        <span className="cf-heatmap__cell is-l4" />
        <span>多</span>
      </div>
    </div>
  );
}
