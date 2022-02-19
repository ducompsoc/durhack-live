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
			<p>Your organisers for DurHack:</p>
			<div className="team-grid row center template">
				<div className="column center">
					<PurpleTippy content={<><div><strong>Mohammed</strong></div><div>Workshop Officer</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/mohammed.jpg" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Tom N</strong></div><div>Logistics Assistant</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/tomnudd.jpg" />
						</span>
					</PurpleTippy>
					<PurpleTippy content={<><div><strong>Tom M</strong></div><div>Catering Officer</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/tommorris.jpg" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Kah</strong></div><div>Head of Logistics</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/kah.png" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Omar</strong></div><div>Co-Head of Sponsorship</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/omar.jpg" />
						</span>
					</PurpleTippy>
					<PurpleTippy content={<><div><strong>Alperen</strong></div><div>Sponsorship Officer</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/alperen.jpg" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Matthew</strong></div><div>Co-Head of Sponsorship</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/matt.jpg" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Karl</strong></div><div>Co-Lead Organiser</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/karl.jpg" />
						</span>
					</PurpleTippy>
					<PurpleTippy content={<><div><strong>Amy</strong></div><div>Co-Lead Organiser</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/amy.jpg" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Heidi</strong></div><div>Head of Media, Publicity, and Design</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/heidi.jpg" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Mingyue</strong></div><div>Media &amp; Publicity Assistant</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/mingyue.jpg" />
						</span>
					</PurpleTippy>
					<PurpleTippy content={<><div><strong>Zeynep</strong></div><div>Media &amp; Publicity Assistant</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/zeynep.jpg" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Matus</strong></div><div>Finance Officer</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/matus.jpg" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>Ethan</strong></div><div>Head of Tech</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/ethan.jpg" />
						</span>
					</PurpleTippy>
					<PurpleTippy content={<><div><strong>Abhinav</strong></div><div>Tech Officer</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/abhinav.png" />
						</span>
					</PurpleTippy>
				</div>
				<div className="column center">
					<PurpleTippy content={<><div><strong>DurHack Dino</strong></div><div>Mascot</div></>}>
						<span>
							<img src="https://durhack.com/assets/team/dino.png" />
						</span>
					</PurpleTippy>
				</div>
			</div>
		</div>
	</TeamContainer>
));

/* eslint-enable */
