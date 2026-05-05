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
    case "rect-area":
      return <RectAreaSvg w={visual.w} h={visual.h} unit={visual.unit ?? "ס״מ"} />;
    case "perimeter-rect":
      return <RectPerimeterSvg w={visual.w} h={visual.h} unit={visual.unit ?? "ס״מ"} />;
    case "symmetry-axes":
      return <SymmetrySvg shape={visual.shape} axes={visual.axes} />;
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
  shape:
    | "triangle"
    | "square"
    | "rectangle"
    | "circle"
    | "rhombus"
    | "parallelogram"
    | "trapezoid"
    | "kite"
    | "pentagon"
    | "hexagon";
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
          rx={4}
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
          rx={4}
        />
      </svg>
    );
  }
  if (shape === "circle") {
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
  if (shape === "rhombus") {
    const cx = size / 2;
    const cy = size / 2;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="מעוין">
        <polygon
          points={`${cx},${p} ${size - p},${cy} ${cx},${size - p} ${p},${cy}`}
          fill="#ec4899"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (shape === "parallelogram") {
    const offset = 30;
    const h = size * 0.6;
    return (
      <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`} role="img" aria-label="מקבילית">
        <polygon
          points={`${offset + p},${p} ${size - p},${p} ${size - offset - p},${h - p} ${p},${h - p}`}
          fill="#a78bfa"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (shape === "trapezoid") {
    const h = size * 0.65;
    return (
      <svg width={size} height={h} viewBox={`0 0 ${size} ${h}`} role="img" aria-label="טרפז">
        <polygon
          points={`${size * 0.25},${p} ${size * 0.75},${p} ${size - p},${h - p} ${p},${h - p}`}
          fill="#fb923c"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (shape === "kite") {
    const cx = size / 2;
    const topY = p;
    const waistY = size * 0.38;
    const bottomY = size - p;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="דלתון">
        <polygon
          points={`${cx},${topY} ${size - p},${waistY} ${cx},${bottomY} ${p},${waistY}`}
          fill="#22d3ee"
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (shape === "pentagon" || shape === "hexagon") {
    const sides = shape === "pentagon" ? 5 : 6;
    const cx = size / 2;
    const cy = size / 2;
    const r = size / 2 - p;
    const points: string[] = [];
    for (let i = 0; i < sides; i++) {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={shape === "pentagon" ? "מחומש" : "משושה"}>
        <polygon
          points={points.join(" ")}
          fill={shape === "pentagon" ? "#34d399" : "#fbbf24"}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return null;
}

function TriangleTypeSvg({
  type,
  size = 170,
}: {
  type: "equilateral" | "isosceles" | "scalene" | "right";
  size?: number;
}) {
  const stroke = "#0f1535";
  const sw = 3;
  const fill = "#fb7185";

  let pts = "";
  let extra: React.ReactNode = null;

  if (type === "equilateral") {
    const base = 130;
    const h = (base * Math.sqrt(3)) / 2;
    const cx = size / 2;
    const top = 20;
    const p1 = { x: cx, y: top };
    const p2 = { x: cx - base / 2, y: top + h };
    const p3 = { x: cx + base / 2, y: top + h };
    pts = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
    // tick marks on each side
    const tickPositions = [
      { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2, rot: 60 },
      { x: (p1.x + p3.x) / 2, y: (p1.y + p3.y) / 2, rot: -60 },
      { x: (p2.x + p3.x) / 2, y: (p2.y + p3.y) / 2, rot: 0 },
    ];
    extra = tickPositions.map((t, i) => (
      <g key={i} transform={`translate(${t.x},${t.y}) rotate(${t.rot})`}>
        <line x1={0} y1={-6} x2={0} y2={6} stroke="#0f1535" strokeWidth={2.5} strokeLinecap="round" />
      </g>
    ));
  } else if (type === "isosceles") {
    const cx = size / 2;
    const top = 15;
    const baseY = size - 20;
    const halfBase = 42;
    const p1 = { x: cx, y: top };
    const p2 = { x: cx - halfBase, y: baseY };
    const p3 = { x: cx + halfBase, y: baseY };
    pts = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
    extra = (
      <>
        <g transform={`translate(${(p1.x + p2.x) / 2},${(p1.y + p2.y) / 2}) rotate(72)`}>
          <line x1={0} y1={-6} x2={0} y2={6} stroke="#0f1535" strokeWidth={2.5} strokeLinecap="round" />
        </g>
        <g transform={`translate(${(p1.x + p3.x) / 2},${(p1.y + p3.y) / 2}) rotate(-72)`}>
          <line x1={0} y1={-6} x2={0} y2={6} stroke="#0f1535" strokeWidth={2.5} strokeLinecap="round" />
        </g>
      </>
    );
  } else if (type === "right") {
    const p1 = { x: 30, y: size - 25 };
    const p2 = { x: size - 25, y: size - 25 };
    const p3 = { x: 30, y: 25 };
    pts = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
    extra = (
      <rect x={p1.x} y={p1.y - 14} width={14} height={14} fill="none" stroke="#0f1535" strokeWidth={2} />
    );
  } else {
    // scalene
    const p1 = { x: 30, y: 40 };
    const p2 = { x: size - 20, y: 80 };
    const p3 = { x: 50, y: size - 20 };
    pts = `${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`;
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="משולש">
      <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      {extra}
    </svg>
  );
}

function AngleSvg({
  type,
  size = 180,
}: {
  type: "acute" | "right" | "obtuse" | "straight";
  size?: number;
}) {
  const cx = size * 0.3;
  const cy = size * 0.72;
  const len = size * 0.6;
  let angle: number;
  if (type === "acute") angle = Math.PI / 4;
  else if (type === "right") angle = Math.PI / 2;
  else if (type === "obtuse") angle = (3 * Math.PI) / 4;
  else angle = Math.PI;

  const x1 = cx + len;
  const y1 = cy;
  const x2 = cx + len * Math.cos(-angle);
  const y2 = cy + len * Math.sin(-angle);

  const arcR = 28;
  const arcX1 = cx + arcR;
  const arcY1 = cy;
  const arcX2 = cx + arcR * Math.cos(-angle);
  const arcY2 = cy + arcR * Math.sin(-angle);
  const largeArc = angle > Math.PI ? 1 : 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="זווית">
      <line x1={cx} y1={cy} x2={x1} y2={y1} stroke="#0f1535" strokeWidth={4} strokeLinecap="round" />
      <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="#0f1535" strokeWidth={4} strokeLinecap="round" />
      <path
        d={`M${arcX1},${arcY1} A${arcR},${arcR} 0 ${largeArc} 0 ${arcX2},${arcY2}`}
        fill="#fde68a"
        stroke="#f59e0b"
        strokeWidth={3}
      />
      {type === "right" && (
        <rect x={cx} y={cy - 16} width={16} height={16} fill="none" stroke="#f59e0b" strokeWidth={3} />
      )}
    </svg>
  );
}

function RectAreaSvg({
  w,
  h,
  unit,
  size = 220,
}: {
  w: number;
  h: number;
  unit: string;
  size?: number;
}) {
  // Render rectangle showing grid + dimensions
  const maxSide = Math.max(w, h);
  const cell = (size - 40) / maxSide;
  const rectW = w * cell;
  const rectH = h * cell;
  const offsetX = (size - rectW) / 2;
  const offsetY = 20;

  const lines: React.ReactNode[] = [];
  // vertical grid lines
  for (let i = 1; i < w; i++) {
    lines.push(
      <line
        key={`v${i}`}
        x1={offsetX + i * cell}
        y1={offsetY}
        x2={offsetX + i * cell}
        y2={offsetY + rectH}
        stroke="#94a3b8"
        strokeWidth={0.5}
      />,
    );
  }
  for (let i = 1; i < h; i++) {
    lines.push(
      <line
        key={`hl${i}`}
        x1={offsetX}
        y1={offsetY + i * cell}
        x2={offsetX + rectW}
        y2={offsetY + i * cell}
        stroke="#94a3b8"
        strokeWidth={0.5}
      />,
    );
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="מלבן עם שטח">
      <rect
        x={offsetX}
        y={offsetY}
        width={rectW}
        height={rectH}
        fill="#bae6fd"
        stroke="#0f1535"
        strokeWidth={2}
      />
      {lines}
      <text x={offsetX + rectW / 2} y={offsetY + rectH + 18} textAnchor="middle" fontSize={14} fontWeight={700} fill="#0f1535">
        {w} {unit}
      </text>
      <text
        x={offsetX - 10}
        y={offsetY + rectH / 2}
        textAnchor="end"
        fontSize={14}
        fontWeight={700}
        fill="#0f1535"
        dominantBaseline="middle"
      >
        {h} {unit}
      </text>
    </svg>
  );
}

function RectPerimeterSvg({
  w,
  h,
  unit,
  size = 220,
}: {
  w: number;
  h: number;
  unit: string;
  size?: number;
}) {
  const maxSide = Math.max(w, h);
  const cell = (size - 40) / maxSide;
  const rectW = w * cell;
  const rectH = h * cell;
  const offsetX = (size - rectW) / 2;
  const offsetY = 20;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="מלבן עם היקף">
      <rect
        x={offsetX}
        y={offsetY}
        width={rectW}
        height={rectH}
        fill="none"
        stroke="#0f1535"
        strokeWidth={3}
      />
      <text x={offsetX + rectW / 2} y={offsetY - 6} textAnchor="middle" fontSize={14} fontWeight={700} fill="#0f1535">
        {w} {unit}
      </text>
      <text x={offsetX + rectW / 2} y={offsetY + rectH + 18} textAnchor="middle" fontSize={14} fontWeight={700} fill="#0f1535">
        {w} {unit}
      </text>
      <text x={offsetX - 10} y={offsetY + rectH / 2} textAnchor="end" fontSize={14} fontWeight={700} fill="#0f1535" dominantBaseline="middle">
        {h} {unit}
      </text>
      <text x={offsetX + rectW + 10} y={offsetY + rectH / 2} textAnchor="start" fontSize={14} fontWeight={700} fill="#0f1535" dominantBaseline="middle">
        {h} {unit}
      </text>
    </svg>
  );
}

function SymmetrySvg({
  shape,
  axes,
  size = 170,
}: {
  shape: "square" | "rectangle" | "equilateral" | "isosceles" | "circle" | "rhombus";
  axes: number;
  size?: number;
}) {
  void axes; // visual displays the shape; the question asks count
  const stroke = "#0f1535";
  const sw = 3;
  const cx = size / 2;
  const cy = size / 2;

  if (shape === "square") {
    const p = 20;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="ריבוע">
        <rect x={p} y={p} width={size - 2 * p} height={size - 2 * p} fill="#10b981" stroke={stroke} strokeWidth={sw} />
        <line x1={cx} y1={p} x2={cx} y2={size - p} stroke="#ec4899" strokeWidth={2} strokeDasharray="4 4" />
        <line x1={p} y1={cy} x2={size - p} y2={cy} stroke="#ec4899" strokeWidth={2} strokeDasharray="4 4" />
        <line x1={p} y1={p} x2={size - p} y2={size - p} stroke="#ec4899" strokeWidth={2} strokeDasharray="4 4" />
        <line x1={size - p} y1={p} x2={p} y2={size - p} stroke="#ec4899" strokeWidth={2} strokeDasharray="4 4" />
      </svg>
    );
  }
  if (shape === "rectangle") {
    const padW = 20;
    const padH = 40;
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="מלבן">
        <rect x={padW} y={padH} width={size - 2 * padW} height={size - 2 * padH} fill="#0ea5e9" stroke={stroke} strokeWidth={sw} />
        <line x1={cx} y1={padH} x2={cx} y2={size - padH} stroke="#ec4899" strokeWidth={2} strokeDasharray="4 4" />
        <line x1={padW} y1={cy} x2={size - padW} y2={cy} stroke="#ec4899" strokeWidth={2} strokeDasharray="4 4" />
      </svg>
    );
  }
  if (shape === "equilateral") {
    const base = 120;
    const h = (base * Math.sqrt(3)) / 2;
    const top = 20;
    const p1 = { x: cx, y: top };
    const p2 = { x: cx - base / 2, y: top + h };
    const p3 = { x: cx + base / 2, y: top + h };
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="משולש שווה-צלעות">
        <polygon points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`} fill="#fb7185" stroke={stroke} strokeWidth={sw} />
        <line x1={p1.x} y1={p1.y} x2={(p2.x + p3.x) / 2} y2={(p2.y + p3.y) / 2} stroke="#ec4899" strokeWidth={2} strokeDasharray="4 4" />
        <line x1={p2.x} y1={p2.y} x2={(p1.x + p3.x) / 2} y2={(p1.y + p3.y) / 2} stroke="#ec4899" strokeWidth={2} strokeDasharray="4 4" />
        <line x1={p3.x} y1={p3.y} x2={(p1.x + p2.x) / 2} y2={(p1.y + p2.y) / 2} stroke="#ec4899" strokeWidth={2} strokeDasharray="4 4" />
      </svg>
    );
  }
  if (shape === "isosceles") {
    const top = 15;
    const baseY = size - 20;
    const halfBase = 42;
    const p1 = { x: cx, y: top };
    const p2 = { x: cx - halfBase, y: baseY };
    const p3 = { x: cx + halfBase, y: baseY };
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="משולש שווה-שוקיים">
        <polygon points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}`} fill="#fb7185" stroke={stroke} strokeWidth={sw} />
        <line x1={p1.x} y1={p1.y} x2={(p2.x + p3.x) / 2} y2={(p2.y + p3.y) / 2} stroke="#ec4899" strokeWidth={2} strokeDasharray="4 4" />
      </svg>
    );
  }
  if (shape === "rhombus") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="מעוין">
        <polygon points={`${cx},20 ${size - 20},${cy} ${cx},${size - 20} 20,${cy}`} fill="#ec4899" stroke={stroke} strokeWidth={sw} />
        <line x1={cx} y1={20} x2={cx} y2={size - 20} stroke="#fbbf24" strokeWidth={2} strokeDasharray="4 4" />
        <line x1={20} y1={cy} x2={size - 20} y2={cy} stroke="#fbbf24" strokeWidth={2} strokeDasharray="4 4" />
      </svg>
    );
  }
  // circle: infinite axes — show a few
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="עיגול">
      <circle cx={cx} cy={cy} r={size / 2 - 16} fill="#f59e0b" stroke={stroke} strokeWidth={sw} />
      <line x1={cx} y1={16} x2={cx} y2={size - 16} stroke="#ec4899" strokeWidth={2} strokeDasharray="4 4" />
      <line x1={16} y1={cy} x2={size - 16} y2={cy} stroke="#ec4899" strokeWidth={2} strokeDasharray="4 4" />
    </svg>
  );
}
