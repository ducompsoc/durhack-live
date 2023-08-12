'use client';

import styled, { css } from 'styled-components';

export interface ICardProps {
	colour?: string;
	noPadding?: boolean;
	highlight?: boolean;
}

const Card = styled.div<ICardProps>`
	background-color: ${p => (p.colour ? p.theme[p.colour] : '#141B2F')};
	margin: 9px;
	overflow: hidden;

	${p => p.highlight && css`
		border-left: solid 1px ${p.theme.secondaryA};
	`}

	${p => !p.noPadding && css`
		padding: 24px;
	`}
`;

export default Card;
