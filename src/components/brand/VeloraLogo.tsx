// Official Velora mark, traced from the supplied logo. Same geometry as /public/brand/velora-logo*.svg.
// Rendered inline (not <img>) so the white frame and wordmark follow the theme via currentColor.

const MARK_W = 507;
const FULL_W = 1428;
const H = 414;

const FRAME = "M0 0H144L307 292H163ZM46.6 32L173 262H259L132.6 32Z";
const BODY = "M338 0H507L287 414H224L166 302Z";
const FACETS = [
  ["M338 0H507L354 94Z", "#5A4CC8"],
  ["M354 94L507 0L411 180Z", "#4E42AD"],
  ["M354 94L411 180L332 180Z", "#3F358D"],
  ["M338 0L354 94L332 180H235Z", "#5B4DC6"],
  ["M235 180H332L262 330L166 302Z", "#443D9C"],
  ["M332 180H411L287 414L262 330Z", "#5B4DC3"],
  ["M166 302L262 330L287 414H224Z", "#5047B7"],
] as const;
const WORDMARK = "M87.9 0L56.8 0L-1.7-135.8L32.2-135.8L73.5-38.8L115.4-135.8L146.7-135.8L87.9 0M273.7 0L168.6 0L168.6-135.8L271.2-135.8L271.2-110.6L199.8-110.6L199.8-81.1L262.9-81.1L262.9-56.6L199.8-56.6L199.8-25.2L273.7-25.2L273.7 0M406 0L306.5 0L306.5-135.8L337.9-135.8L337.9-25.6L406-25.6L406 0M497.4 2.3Q481.3 2.3 467.6-2.9Q454-8.1 444-17.7Q434-27.2 428.4-40Q422.9-52.8 422.9-67.9Q422.9-83 428.4-95.8Q434-108.6 444.1-118.1Q454.2-127.7 467.7-132.9Q481.3-138.1 497.2-138.1Q513.3-138.1 526.8-132.9Q540.3-127.7 550.3-118.1Q560.3-108.6 565.9-95.9Q571.5-83.2 571.5-67.9Q571.5-52.8 565.9-39.9Q560.3-27 550.3-17.6Q540.3-8.1 526.8-2.9Q513.3 2.3 497.4 2.3M497.2-24.4Q506.3-24.4 514-27.5Q521.7-30.7 527.5-36.5Q533.3-42.3 536.5-50.2Q539.7-58.2 539.7-67.9Q539.7-77.6 536.5-85.6Q533.3-93.5 527.6-99.3Q521.9-105.1 514.1-108.3Q506.3-111.4 497.2-111.4Q488.1-111.4 480.4-108.3Q472.8-105.1 467-99.3Q461.1-93.5 457.9-85.6Q454.7-77.6 454.7-67.9Q454.7-58.4 457.9-50.3Q461.1-42.3 466.9-36.5Q472.6-30.7 480.3-27.5Q488.1-24.4 497.2-24.4M634.4 0L603 0L603-135.8L661-135.8Q689.3-135.8 705-122.7Q720.7-109.6 720.7-86.5Q720.7-71.4 713.5-60.4Q706.4-49.5 693.2-43.6Q693-43.6 693-43.5L723.2 0L689.3 0L663.3-37.8Q662.5-37.8 661.7-37.8L634.4-37.8L634.4 0M634.4-110.2L634.4-62.9L660-62.9Q674.5-62.9 681.7-69.2Q688.9-75.5 688.9-86.5Q688.9-97.8 681.7-104Q674.5-110.2 660-110.2L634.4-110.2M767.7 0L735.5 0L796-135.8L827-135.8L887.7 0L854.8 0L842.7-29.1L779.7-29.1L767.7 0M789.8-53L832.8-53L811.3-105";

type VeloraLogoProps = {
  /** "full" = mark + VELORA wordmark, "mark" = logogram only. */
  variant?: "full" | "mark";
  /** Rendered height in px; width follows the fixed aspect ratio (zero CLS). */
  height?: number;
  /** "mono" draws everything in currentColor, for placement on the violet field. */
  tone?: "brand" | "mono";
  className?: string;
};

export function VeloraLogo({ variant = "full", height = 24, tone = "brand", className }: VeloraLogoProps) {
  const w = variant === "full" ? FULL_W : MARK_W;
  return (
    <svg
      viewBox={`0 0 ${w} ${H}`}
      width={Math.round((height * w) / H)}
      height={height}
      role="img"
      aria-label="Velora Studio Dev"
      className={className}
    >
      <path d={FRAME} fill="currentColor" fillRule="evenodd" />
      {tone === "mono" ? (
        <path d={BODY} fill="currentColor" />
      ) : (
        <>
          <path d={BODY} fill="#5A4CC8" />
          {FACETS.map(([d, fill]) => (
            <path key={d} d={d} fill={fill} />
          ))}
        </>
      )}
      {variant === "full" && <path transform="translate(540 275)" d={WORDMARK} fill="currentColor" />}
    </svg>
  );
}
