import styled, { css } from 'styled-components';

const LinkButton = styled.a<{ primary?: boolean }>`
	display: inline-block;
	background-color: rgba(17, 17, 17, 0.5);
	border-radius: 100px;
	font-weight: bold;
	text-decoration: none;
	padding: 12px 32px;
	transition: .3s ease;

	&:hover {
		background-color: rgba(17, 17, 17, 0.9);
	}

	${p => p.primary && css`
		background-color: ${p.theme.secondaryA};
		box-shadow: 0px 4px 0px rgba(0, 0, 0, 0.25);
		color: #111;

		&:hover {
			background-color: ${p.theme.secondaryA};
			opacity: 0.8;
		}
	`}
`;

export default LinkButton;
