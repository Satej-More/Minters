import * as React from "react";
import { SVGProps } from "react";

export const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 40 40"
    width="40"
    height="40"
    fill="none"
    {...props}
  >
    <defs>
      <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="hsl(var(--primary))" />
        <stop offset="100%" stopColor="hsl(var(--accent))" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <rect x="2" y="2" width="36" height="36" rx="0" stroke="url(#logo-gradient)" strokeWidth="2" fill="none" className="opacity-50" />
    <path
      d="M10 30V14L20 24L30 14V30"
      stroke="url(#logo-gradient)"
      strokeWidth="3"
      strokeLinecap="square"
      strokeLinejoin="bevel"
      style={{ filter: "url(#glow)" }}
    />
    <circle cx="20" cy="24" r="2" fill="hsl(var(--primary))" className="animate-pulse" />
  </svg>
);
