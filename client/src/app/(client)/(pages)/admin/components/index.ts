import styled from "styled-components";

export { default as DefaultButtons } from "./DefaultButtons";
export { default as OverlayForm } from "./OverlayForm";
export { default as SwitchSceneForm } from "./SwitchSceneForm";
export { default as MilestoneForm } from "./MilestoneForm";
export { default as FeatureForm } from "./FeatureForm";
export { default as OverlayMainForm } from "./OverlayMainForm";
export { default as LowerThirdForm } from "./LowerThirdForm";
export { default as UpperThirdForm } from "./UpperThirdForm";
export { default as YoutubeForm } from "./YoutubeForm";
export { default as ScheduleForm } from "./ScheduleForm";
export { default as AnnouncementForm } from "./AnnouncementForm";
export { default as TipsForm } from "./TipsForm";


export const Segment = styled.div`
	margin: 12px 0;

	> div {
		width: 100%;

		input {
			box-sizing: border-box;

			&[type=text], &[type=number], &[type=datetime-local] {
				width: 100%;
			}
		}

		select, textarea {
			width: 100%;
			box-sizing: border-box;
		}
	}
`;

export const Label = styled.div`
	width: 33% !important;
`;

export const Buttons = styled.div`
	text-align: right;
`;

export const Table = styled.table`
	width: 100%;

	th, td {
		text-align: left;
		padding: 2px;
	}

	input {
		box-sizing: border-box;
	}
`;
