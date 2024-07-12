"use client";

import styled, { css } from "styled-components";

export interface ICardProps {
  colour?: string;
  $noPadding?: boolean;
  highlight?: boolean;
}

const Card = styled.div.attrs<ICardProps>({ className: "dh-box" })`
  margin: 9px;
  overflow: hidden;

  ${(p) =>
    p.highlight &&
    css`
      border-left: solid 1px ${p.theme.secondaryA};
    `}

  ${(p) =>
    !p.$noPadding &&
    css`
      padding: 24px;
    `}
`;

export default Card;
