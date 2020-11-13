import Tippy from '@tippyjs/react';
import * as React from 'react';
import styled from 'styled-components';

import 'tippy.js/dist/tippy.css'; // eslint-disable-line

const PurpleTippy = styled(Tippy)`
	background: ${p => p.theme.primaryDark};

	&[data-placement^='top'] > .tippy-arrow::before {
		border-top-color: ${p => p.theme.primaryDark};
	}
`;

const TeamContainer = styled.div`
	position: relative;
	font-weight: 300;
	text-align: center;
	padding: 48px 0px 0px 0px;

	> .inner {
		> p {
			font-size: 22px;

			> a {
				color: #fff;
				text-decoration: none;

				&:hover {
					border-bottom: dashed 1px #fff;
				}
			}
		}
	}

	.team-grid {
		margin: 64px 0px;

		span {
			display: inline-block;
			border: solid 2px #fff;
			border-radius: 100%;
			line-height: 0px;
			padding: 2px;
			margin: 6px 0px;
			transition: .5s ease;

			img {
				width: 78px;
				height: 78px;
				border-radius: 100%;
			}

			&:hover {
				transform: scale(1.05);
			}
		}
	}
`;

/* eslint-disable */

export const Team = React.memo(() => (
	<TeamContainer>
		<div className="inner">
			<p>Your organisers for DurHack 2020</p>
			<div className="team-grid row center template">
				<div className="column center">
					<PurpleTippy content={<><div><strong>Zeynep</strong></div><div>Publicity Officer</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/zeynep.jpg" />
						</span>
					</PurpleTippy>
					<PurpleTippy content={<><div><strong>Laszlo</strong></div><div>Design Officer</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/laszlo.png" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Hugo</strong></div><div>Design Assistant</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/placeholder.png" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Ethan</strong></div><div>Web Officer</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/ethan.jpg" />
						</span>
					</PurpleTippy>
					<PurpleTippy content={<><div><strong>Heidi</strong></div><div>Press Officer</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/heidi.jpg" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Amy</strong></div><div>Diversity Officer</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/amy.jpg" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Irenitemi</strong></div><div>Outreach Officer</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/irenitemi.jpg" />
						</span>
					</PurpleTippy>
					<PurpleTippy content={<><div><strong>Betty</strong></div><div>Head of Finance</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/placeholder.png" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Jamie</strong></div><div>Head of Hacker Experience</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/jamie.jpg" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Alex</strong></div><div>Lead Organiser</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/alex.jpg" />
						</span>
					</PurpleTippy>
					<PurpleTippy content={<><div><strong>Christos</strong></div><div>Head of Logistics</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/christos.jpg" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Karl</strong></div><div>Head of Sponsorship</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/karl.jpg" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Peter</strong></div><div>Deputy Head of Logistics</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/peter.jpg" />
						</span>
					</PurpleTippy>
					<PurpleTippy content={<><div><strong>Kah</strong></div><div>Logistics Assistant</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/kah.png" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Sam</strong></div><div>Tech Officer</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/sam.jpg" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Kevin</strong></div><div>Catering Officer</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/kevin.jpg" />
						</span>
					</PurpleTippy>
					<PurpleTippy content={<><div><strong>Devansh</strong></div><div>Finance Assistant</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/devansh.png" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Henry</strong></div><div>Sponsorship Officer</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/henry.jpg" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Matt</strong></div><div>Sponsorship Officer</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/matt.jpg" />
						</span>
					</PurpleTippy>
					<PurpleTippy content={<><div><strong>Omar</strong></div><div>Sponsorship Officer</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/omar.jpg" />
						</span>
					</PurpleTippy>
				</div>
			</div>
		</div>
	</TeamContainer>
));

/* eslint-enable */
