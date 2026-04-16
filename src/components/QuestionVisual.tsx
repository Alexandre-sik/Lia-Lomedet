import type { Visual } from "@/lib/math-generator";

export function QuestionVisual({ visual }: { visual: Visual }) {
  switch (visual.kind) {
    case "fraction":
      return <FractionPie num={visual.num} den={visual.den} />;
    case "compare-frac":
      return (
        <div className="flex items-center justify-center gap-6 sm:gap-10">
          <FractionPie num={visual.a[0]} den={visual.a[1]} color="#8b5cf6" />
          <span className="text-3xl font-extrabold text-white/90">?</span>
          <FractionPie num={visual.b[0]} den={visual.b[1]} color="#f43f5e" />
        </div>
      );
    case "shape":
      return <ShapeSvg shape={visual.shape} />;
    case "triangle-type":
      return <TriangleTypeSvg type={visual.type} />;
    case "angle-type":
      return <AngleSvg type={visual.type} />;
    default:
      return null;
  }
}

function FractionPie({
  num,
  den,
  size = 150,
  color = "#f59e0b",
}: {
  num: number;
  den: number;
  size?: number;
  color?: string;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 6;
  const slices = [];
  const angle = (2 * Math.PI) / den;
  const label = `${num}/${den}`;

  for (let i = 0; i < den; i++) {
    const start = -Math.PI / 2 + i * angle;
    const end = start + angle;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const largeArc = angle > Math.PI ? 1 : 0;
    const d = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2} Z`;
    const filled = i < num;
    slices.push(
      <path
        key={i}
        d={d}
        fill={filled ? color : "#ffffff"}
        stroke="#0f1535"
        strokeWidth={2}
        strokeLinejoin="round"
      />,
    );
  }

  return (
    <figure className="flex flex-col items-center gap-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={label}>
        {slices}
      </svg>
    </figure>
  );
}

function ShapeSvg({
  shape,
  size = 160,
}: {
  shape: "triangle" | "square" | "rectangle" | "circle";
  size?: number;
}) {
  const p = 14;
  const stroke = "#0f1535";
  const sw = 3;

  if (shape === "triangle") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="משולש">
        <polygon
          points={`${size / 2},${p} ${size - p},${size - p} ${p},${size - p}`}
          fill="#8b5cf6"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (shape === "square") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="ריבוע">
        <rect
          x={p}
          y={p}
          width={size - 2 * p}
          height={size - 2 * p}
          fill="#10b981"
          stroke={stroke}
          strokeWidth={sw}
          rx={6}
        />
      </svg>
    );
  }
  if (shape === "rectangle") {
    const h = size * 0.66;
    return (
      <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`} role="img" aria-label="מלבן">
        <rect
          x={p}
          y={p}
          width={size - 2 * p}
          height={h - 2 * p}
          fill="#0ea5e9"
          stroke={stroke}
          strokeWidth={sw}
          rx={6}
        />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="עיגול">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - p}
        fill="#f59e0b"
        stroke={stroke}
        strokeWidth={sw}
      />
    </svg>
  );
}

function TriangleTypeSvg({
  type,
  size = 170,
}: {
  type: "equilateral" | "isosceles" | "scalene";
  size?: number;
}) {
  const stroke = "#0f1535";
  const sw = 3;
  const fill = "#fb7185";

  let pts = "";
  let ticks: Array<{ x: number; y: number; rot: number; count: 1 | 2 | 3 }> = [];

  if (type === "equilateral") {
    const base = 130;
    const h = (base * Math.sqrt(3)) / 2;
    const cx = size / 2;
    const top = 20;
    const p1 = { x: cx, y: top };
    const p2 = { x: cx - base / 2, y: top + h };
    const p3 = { x: cx + base / 2, y: top + h };
    pts = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
    ticks = [
      { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2, rot: 60, count: 1 },
      { x: (p1.x + p3.x) / 2, y: (p1.y + p3.y) / 2, rot: -60, count: 1 },
      { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2, rot: 0, count: 1 },
    ];
  } else if (type === "isosceles") {
    const cx = size / 2;
    const top = 15;
    const baseY = size - 20;
    const halfBase = 42;
    const p1 = { x: cx, y: top };
    const p2 = { x: cx - halfBase, y: baseY };
    const p3 = { x: cx + halfBase, y: baseY };
    pts = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
    ticks = [
      { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2, rot: 72, count: 1 },
      { x: (p1.x + p3.x) / 2, y: (p1.y + p3.y) / 2, rot: -72, count: 1 },
    ];
  } else {
    const p1 = { x: 30, y: 40 };
    const p2 = { x: size - 20, y: 80 };
    const p3 = { x: 50, y: size - 20 };
    pts = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="משולש">
      <polygon
        points={pts}
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
        strokeLinejoin="round"
      />
      {ticks.map((t, i) => (
        <g key={i} transform={`translate(${t.x},${t.y}) rotate(${t.rot})`}>
          {Array.from({ length: t.count }).map((_, j) => (
            <line
              key={j}
              x1={j * 5 - ((t.count - 1) * 5) / 2}
              y1={-6}
              x2={j * 5 - ((t.count - 1) * 5) / 2}
              y2={6}
              stroke="#0f1535"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
          ))}
        </g>
      ))}
    </svg>
  );
}

function AngleSvg({
  type,
  size = 180,
}: {
  type: "acute" | "right" | "obtuse";
  size?: number;
}) {
  const cx = size * 0.3;
  const cy = size * 0.72;
  const len = size * 0.6;
  let angle: number;
  if (type === "acute") angle = Math.PI / 4;
  else if (type === "right") angle = Math.PI / 2;
  else angle = (3 * Math.PI) / 4;

  const x1 = cx + len;
  const y1 = cy;
  const x2 = cx + len * Math.cos(-angle);
  const y2 = cy + len * Math.sin(-angle);

  const arcR = 28;
  const arcX1 = cx + arcR;
  const arcY1 = cy;
  const arcX2 = cx + arcR * Math.cos(-angle);
  const arcY2 = cy + arcR * Math.sin(-angle);

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="זווית">
      <line
        x1={cx}
        y1={cy}
        x2={x1}
        y2={y1}
        stroke="#0f1535"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <line
        x1={cx}
        y1={cy}
        x2={x2}
        y2={y2}
        stroke="#0f1535"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path
        d={`M${arcX1},${arcY1} A${arcR},${arcR} 0 0 0 ${arcX2},${arcY2}`}
        fill="#fde68a"
        stroke="#f59e0b"
        strokeWidth={3}
      />
      {type === "right" && (
        <rect
          x={cx}
          y={cy - 16}
          width={16}
          height={16}
          fill="none"
          stroke="#f59e0b"
          strokeWidth={3}
        />
      )}
    </svg>
  );
}
