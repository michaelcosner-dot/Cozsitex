export function Sparkline({
  data,
  projected,
  color = "#038748",
  projectedColor = "#9CA3AF",
  width = 80,
  height = 28,
}: {
  data: number[];
  projected?: number[];
  color?: string;
  projectedColor?: string;
  width?: number;
  height?: number;
}) {
  const allData = projected ? [...data, ...projected] : data;
  const max = Math.max(...allData);
  const min = Math.min(...allData);
  const range = max - min || 1;

  const toPoints = (arr: number[]) =>
    arr
      .map((v, i) => {
        const x = (i / (arr.length - 1)) * width;
        const y = height - 2 - ((v - min) / range) * (height - 4);
        return `${x},${y}`;
      })
      .join(" ");

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      {projected && (
        <polyline
          points={toPoints(projected)}
          fill="none"
          stroke={projectedColor}
          strokeWidth="1.5"
          strokeDasharray="3,2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <polyline
        points={toPoints(data)}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* terminal dot */}
      {(() => {
        const last = data[data.length - 1];
        const x = width;
        const y = height - 2 - ((last - min) / range) * (height - 4);
        return <circle cx={x} cy={y} r="2.5" fill={color} />;
      })()}
    </svg>
  );
}
