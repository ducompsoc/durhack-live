import * as React from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';

import { IScheduledEvent, useHackathon } from '../../util/socket';

// A lot of this file is brutally copied from the main site.

interface IAugmentedScheduledEvent extends IScheduledEvent {
	startDate?: Date;
	endDate?: Date;
}

const Wrapper = styled.div`
	padding: 0px 24px;
`;

const TimelineContainer = styled.div`
	position: relative;

	@media screen and (min-width: 1080px) {
		&:before, .event .line:before, .event .line:after {
			content: '';
			height: 2px;
			background-color: #92CED4;
		}

		&:before {
			position: absolute;
			top: 97px;
			right: 100%;
			left: -100vh;
		}

		.group {
			&:nth-child(even) .set {
				flex-direction: row-reverse;
			}

			.set {
				.event {
					width: 320px;
				}
			}

			.bracket {
				position: absolute;
				display: flex !important;
				width: 12px;
				height: 244px;
				border-style: solid;
				border-color: #92CED4;
				margin-top: -149px;

				.day {
					width: 164px;
					font-weight: bold;
					text-align: center;
					color: #92CED4;
					transform: rotate(-90deg);
					margin-left: -48px;
				}
			}

			&:nth-child(even) .bracket {
				right: -12px;
				border-width: 2px 2px 2px 0px;
				border-radius: 0px 3px 3px 0px;
			}

			&:nth-child(odd) .bracket {
				left: -12px;
				border-width: 2px 0px 2px 2px;
				border-radius: 3px 0px 0px 3px;
			}

			&:nth-child(odd):last-child .event:last-child .line:after, &:nth-child(even):last-child .event:last-child .line:before {
				background-color: transparent;
			}
		}
	}

	.group {
		.set .event {
			text-align: center;
			padding: 32px 0px;

			.time {
				display: inline-block;
				background-color: #92CED4;
				border: solid 2px #92CED4;
				border-radius: 4px;
				line-height: 18px;
				font-size: 14px;
				font-weight: bold;
				color: #222;
				padding: 4px 9px;
				margin-bottom: 4px;
			}

			&.done {
				.time, .icon, .title {
					opacity: 0.5;
				}

				.time {
					background: none;
					color: #fff;
				}
			}

			.line {
				line-height: 20px;

				&:before, &:after {
					width: 100%;
				}

				.icon {
					font-size: 32px;
					margin: 16px;
					color: #fff;
				}
			}

			.title {
				padding: 0px 6px 12px 6px;
			}
		}

		.bracket {
			display: none;
		}
	}
`;

const EventContent = styled.div`
	height: 84px;
`;

const PlayButton = styled.a`
	display: inline-block;
	border: solid 2px #fff;
	border-radius: 4px;
	font-size: 16px;
	font-weight: bold;
	text-decoration: none;
	color: #fff;
	padding: 4px 12px 5px 12px;

	&:hover {
		background-color: #fff;
		color: #111;
	}

	> span {
		margin-right: 9px;
	}
`;

export const Schedule = React.memo(() => {
	const { state } = useHackathon();

	const groups = React.useMemo(() => {
		if (!state) {
			return [];
		}

		const scheduledItems = [...state.schedule];
		const elementsPerGroup = Math.min(6, Math.ceil(state.schedule.length / 3));
		const result: IAugmentedScheduledEvent[][] = [];
		while (scheduledItems.length) {
			result.push(
				scheduledItems
					.splice(0, elementsPerGroup)
					.map((event: IScheduledEvent) => {
						const startDate = new Date(event.start);
						const endDate = event.end ? new Date(event.end) : undefined;

						/* eslint-disable-next-line no-restricted-globals */
						if (isNaN(startDate.getTime()) || (endDate && isNaN(endDate?.getTime()))) {
							return event;
						}

						return { ...event, startDate, endDate };
					}),
			);
		}

		return result;
	}, [state]);

	return (
		<Wrapper>
			<TimelineContainer>
				{groups.map((events, idx) => (
					<div className="group">
						{idx !== 0 && (
							<div className="bracket center column">
								<div className="day" />
							</div>
						)}

						<div className="row set">
							{events.map(event => (
								<div className={`event ${event.state}`}>
									<div className="time">
										{event.startDate ? format(event.startDate, 'p').toLowerCase() : '--:--'}
										{event.endDate && <> &ndash; {format(new Date(event.endDate), 'p').toLowerCase()}</>}
									</div>
									<div className="line row center">
										<div className="icon">
											<span className={event.icon} />
										</div>
									</div>
									<EventContent>
										<div className="title">{event.name}</div>
										{event.state === 'in-progress' && event.liveLink && !event.liveLink.startsWith('#') && (
											<PlayButton href={event.liveLink} target="_blank">
												<span className="fas fa-play" />
												Join Zoom
											</PlayButton>
										)}
										{event.state === 'done' && event.recordingLink && (
											<PlayButton href={event.recordingLink} target="_blank">
												<span className="fas fa-play" />
												{event.recordingLink.includes('youtube') ? 'Watch back' : 'Get resources'}
											</PlayButton>
										)}
									</EventContent>
								</div>
							))}
						</div>
					</div>
				))}
			</TimelineContainer>
		</Wrapper>
	);
});
