/**
 * Documentation: https://www.radix-ui.com/docs/primitives/components/accordion
 */
import React from "react";
import ChevronRightIcon from "@heroicons/react/24/solid/ChevronRightIcon";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import type { HeadingRank, IconType } from "../../types";
import { AccordionMode } from "./types";

export type RootProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Root
> & {
  mode?: AccordionMode;
  size?: "sm" | "md" | "lg";
};

const Root = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Root>,
  RootProps
>(({ mode = "simple", size = "md", ...rest }, forwardedRef) => {
  let baseStyles: Record<string, string> = {
    "data-h2-height":
      "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon](x.8)",
    "data-h2-width":
      "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon](x.8)",
    "data-h2-stroke-width":
      "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon path](1.5)",
    "data-h2-font-size":
      "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Heading](h6, 1)",
  };

  let paddingStyles: Record<string, string> =
    mode === "card"
      ? {
          "data-h2-padding": `
              base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Trigger](x1)
              base:selectors[>.Accordion__Item > .Accordion__Content](0 x1 x1 x2.3)
          `,
        }
      : {
          "data-h2-padding": `
              base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Trigger](x.5 0)
              base:selectors[>.Accordion__Item > .Accordion__Content](0 x1 x1 x1.3)
          `,
        };

  if (size === "sm") {
    baseStyles = {
      "data-h2-height":
        "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon](x.75)",
      "data-h2-width":
        "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon](x.75)",
      "data-h2-stroke-width":
        "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon path](1)",
      "data-h2-font-size":
        "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Heading](body, 1)",
    };

    paddingStyles =
      mode === "card"
        ? {
            "data-h2-padding": `
        base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Trigger](x1)
        base:selectors[>.Accordion__Item > .Accordion__Content](0 x1 x1 x2.25)
          `,
          }
        : {
            "data-h2-padding": `
              base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Trigger](x.5 0)
              base:selectors[>.Accordion__Item > .Accordion__Content](0 x1 x1 x1.25)
          `,
          };
  }

  if (size === "lg") {
    baseStyles = {
      "data-h2-height":
        "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon](x.95)",
      "data-h2-width":
        "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon](x.95)",
      "data-h2-stroke-width":
        "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Icon path](1)",
      "data-h2-font-size":
        "base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Heading](h5, 1)",
    };

    paddingStyles =
      mode === "card"
        ? {
            "data-h2-padding": `
        base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Trigger](x1)
        base:selectors[>.Accordion__Item > .Accordion__Content](0 x1 x1 x2.45)
      `,
          }
        : {
            "data-h2-padding": `
          base:selectors[>.Accordion__Item > .Accordion__Header .Accordion__Trigger](x.5 0)
          base:selectors[>.Accordion__Item > .Accordion__Content](0 x1 x1 x1.45)
      `,
          };
  }

  if (mode === "card") {
    baseStyles = {
      ...baseStyles,
      "data-h2-background-color":
        "base:selectors[>.Accordion__Item](foreground)",
      "data-h2-border-top":
        "base:selectors[>.Accordion__Item + .Accordion__Item](thin solid gray)",
      "data-h2-overflow": "base(hidden)",
      "data-h2-radius": "base(s)",
      "data-h2-shadow": "base(l)",
    };
  }

  return (
    <AccordionPrimitive.Root
      ref={forwardedRef}
      data-h2-display="base(flex)"
      data-h2-flex-direction="base(column)"
      {...baseStyles}
      {...paddingStyles}
      {...rest}
    />
  );
});

const Item = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>((props, forwardedRef) => (
  <AccordionPrimitive.Item
    className="Accordion__Item"
    data-h2-overflow="base(hidden)"
    ref={forwardedRef}
    {...props}
  />
));

export interface AccordionHeaderProps
  extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  as?: HeadingRank | "p";
  icon?: IconType;
  subtitle?: React.ReactNode;
  context?: React.ReactNode;
  titleProps?: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Header>;
}

const Trigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  AccordionHeaderProps
>(
  (
    { as = "h2", subtitle, icon, context, titleProps, children, ...rest },
    forwardedRef,
  ) => {
    const Heading = as;
    const Icon = icon;

    return (
      <AccordionPrimitive.Header asChild {...titleProps}>
        <div className="Accordion__Header">
          <AccordionPrimitive.Trigger
            ref={forwardedRef}
            className="Accordion__Trigger"
            data-h2-align-items="base(center)"
            data-h2-background-color="base(transparent) base:focus-visible(focus)"
            data-h2-color="base(black) base:focus-visible(black)  base:children[.Accordion__Subtitle](black.light) base:focus-visible:children[.Accordion__Subtitle](black) base:children[.Accordion__Chevron](black.light) base:focus-visible:children[.Accordion__Chevron](black)"
            data-h2-cursor="base(pointer)"
            data-h2-display="base(flex)"
            data-h2-flex-wrap="base(wrap) p-tablet(nowrap)"
            data-h2-gap="base(0, x.5)"
            data-h2-outline="base(none)"
            data-h2-justify-content="base(flex-start)"
            data-h2-text-align="base(left)"
            data-h2-width="base(100%)"
            data-h2-shadow="base:focus-visible:children[.Accordion__Chevron](focus)"
            data-h2-transform="
            base:children[.Accordion__Icon--chevron](rotate(0deg))
            base:selectors[[data-state='open']]:children[.Accordion__Icon--chevron](rotate(90deg))"
            {...rest}
          >
            <span
              data-h2-align-items="base(flex-start)"
              data-h2-display="base(flex)"
              data-h2-gap="base(0, x.5)"
              data-h2-flex-grow="base(1)"
            >
              <span
                className="Accordion__Chevron"
                data-h2-display="base(flex)"
                data-h2-align-items="base(center)"
                data-h2-flex-shrink="base(0)"
              >
                <ChevronRightIcon
                  className="Accordion__Icon Accordion__Icon--chevron"
                  data-h2-transition="base(transform 150ms ease)"
                />
              </span>

              <span
                data-h2-flex-grow="base(1)"
                data-h2-display="base(flex)"
                data-h2-flex-direction="base(column)"
                data-h2-gap="base(x.25 0)"
              >
                <Heading
                  className="Accordion__Heading"
                  data-h2-margin="base(0)"
                  data-h2-font-weight="base(700)"
                >
                  {children}
                </Heading>
                {subtitle && (
                  <span
                    className="Accordion__Subtitle"
                    data-h2-font-size="base(body)"
                  >
                    {subtitle}
                  </span>
                )}
              </span>
            </span>

            {(Icon || context) && (
              <span
                data-h2-align-items="base(center)"
                data-h2-display="base(flex)"
                data-h2-gap="base(0 x.25)"
              >
                {context && (
                  <span data-h2-font-size="base(body)">{context}</span>
                )}
                {Icon && <Icon className="Accordion__Icon" />}
              </span>
            )}
          </AccordionPrimitive.Trigger>
        </div>
      </AccordionPrimitive.Header>
    );
  },
);

const Content = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ children, ...rest }, forwardedRef) => (
  <AccordionPrimitive.Content
    className="Accordion__Content"
    data-h2-color="base(black)"
    ref={forwardedRef}
    {...rest}
  >
    {children}
  </AccordionPrimitive.Content>
));

/**
 * @name Accordion
 * @desc A vertically stacked set of interactive headings that each reveal an associated section of content.
 * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion)
 */
const Accordion = {
  /**
   * @name Root
   * @desc Contains all the parts of an accordion.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion#root)
   */
  Root,
  /**
   * @name Item
   * @desc Contains all the parts of a collapsible section.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion#item)
   */
  Item,
  /**
   * @name Trigger
   * @desc Toggles the collapsed state of its associated item. It should be nested inside of an Accordion.Header.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion#trigger)
   */
  Trigger,
  /**
   * @name Content
   * @desc Contains the collapsible content for an item.
   * @see [Documentation](https://www.radix-ui.com/docs/primitives/components/accordion#content)
   */
  Content,
};

export default Accordion;
