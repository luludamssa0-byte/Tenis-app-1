'use client';

import { animate, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

type Props = {
  value: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
};

export default function AnimatedStat({
  value,
  decimals = 0,
  suffix = '',
  prefix = '',
  duration = 1.4,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
