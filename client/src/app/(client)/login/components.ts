import styled from "styled-components";
import { Field } from "formik";

export const FormSection = styled.div`
	padding: 16px 0;
`;

export const ErrorAlert = styled.p`
	color: #ff6060;
`;

export const Textbox = styled(Field)`
  display: block;
	width: 100%;
	max-width: 480px;
	background: none;
	border: none;
	border-bottom: solid 1px #fff;
	font-size: 32px;
	color: #fff;
	padding: 9px 0;
	outline: none;
`;

export const Button = styled.button`
	display: inline-block;
	background-color: ${p => p.theme.secondaryA};
	box-shadow: 0 4px 0 rgba(0, 0, 0, 0.25);
	border: none;
	border-radius: 100px;
	font-size: 20px;
	padding: 12px 48px;
	transition: .3s ease;
	outline: none;

	&:hover {
		opacity: 0.8;
	}
`;
