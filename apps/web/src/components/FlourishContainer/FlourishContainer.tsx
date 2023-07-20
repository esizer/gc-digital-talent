import React from "react";

import desktopGraphicsLight2 from "~/assets/img/Desktop_Graphics_light_2.png";
import desktopGraphicsLight3 from "~/assets/img/Desktop_Graphics_light_3.png";
import desktopGraphicsDark2 from "~/assets/img/Desktop_Graphics_dark_2.png";
import desktopGraphicsDark3 from "~/assets/img/Desktop_Graphics_dark_3.png";

type Side = "top" | "bottom";
type Size = "sm" | "lg";

interface FlourishContainerProps {
  children: React.ReactNode;
  show?: Array<Side>;
  size?: Size;
  skew?: boolean;
}

const FlourishContainer = ({
  children,
  show = ["top", "bottom"],
  size = "lg",
  skew = true,
}: FlourishContainerProps) => (
  <div data-h2-layer="base(2, relative)">
    <div
      data-h2-height="base(100%)"
      data-h2-width="base(100%)"
      data-h2-background-color="base(white) base:dark(black.light)"
      data-h2-position="base(absolute)"
      {...(skew && {
        "data-h2-transform": "base(skewY(-3deg))",
      })}
      data-h2-overflow="base(hidden)"
    >
      {show.includes("top") && (
        <>
          <img
            data-h2-display="base(block) base:dark(none)"
            data-h2-position="base(absolute)"
            data-h2-location="base(0, 0, auto, auto)"
            data-h2-transform="base(skew(3deg))"
            data-h2-max-width="base(initial)"
            {...(size === "lg"
              ? {
                  "data-h2-height": "base(auto) p-tablet(50%)",
                  "data-h2-width": "base(150%) p-tablet(auto)",
                }
              : {
                  "data-h2-height": "base(auto) p-tablet(20%)",
                  "data-h2-width": "base(60%) p-tablet(auto)",
                })}
            src={desktopGraphicsLight2}
            alt=""
          />
          <img
            data-h2-display="base(none) base:dark(block)"
            data-h2-position="base(absolute)"
            data-h2-location="base(0, 0, auto, auto)"
            data-h2-transform="base(skew(3deg))"
            data-h2-max-width="base(initial)"
            {...(size === "lg"
              ? {
                  "data-h2-height": "base(auto) p-tablet(50%)",
                  "data-h2-width": "base(150%) p-tablet(auto)",
                }
              : {
                  "data-h2-height": "base(auto) p-tablet(20%)",
                  "data-h2-width": "base(60%) p-tablet(auto)",
                })}
            src={desktopGraphicsDark2}
            alt=""
          />
        </>
      )}
      {show.includes("bottom") && (
        <>
          <img
            data-h2-display="base(block) base:dark(none)"
            data-h2-position="base(absolute)"
            data-h2-location="base(auto, auto, 0, 0)"
            data-h2-transform="base(skew(3deg))"
            data-h2-max-width="base(initial)"
            {...(size === "lg"
              ? {
                  "data-h2-height": "base(auto) desktop(90%)",
                  "data-h2-width": "base(150%) p-tablet(100%) desktop(auto)",
                }
              : {
                  "data-h2-height": "base(auto) desktop(30%)",
                  "data-h2-width": "base(45%) p-tablet(32%) desktop(auto)",
                })}
            src={desktopGraphicsLight3}
            alt=""
          />
          <img
            data-h2-display="base(none) base:dark(block)"
            data-h2-position="base(absolute)"
            data-h2-location="base(auto, auto, 0, 0)"
            data-h2-transform="base(skew(3deg))"
            data-h2-height="base(auto) desktop(90%)"
            data-h2-width="base(150%) p-tablet(100%) desktop(auto)"
            data-h2-max-width="base(initial)"
            src={desktopGraphicsDark3}
            alt=""
          />
        </>
      )}
    </div>
    <div
      data-h2-position="base(relative)"
      data-h2-container="base(center, large, x1) p-tablet(center, large, x2)"
    >
      <div data-h2-padding="base(x3, 0) p-tablet(x5, 0, x4, 0) l-tablet(x7, 0, x6, 0)">
        {children}
      </div>
    </div>
  </div>
);

export default FlourishContainer;