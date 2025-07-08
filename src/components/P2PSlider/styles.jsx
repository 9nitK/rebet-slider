import { default as Lottie } from "lottie-react";
import { css, default as styled } from "styled-components";

// Only the unique color values actually used in this file
const USED_COLORS = {
  sliderOrangeLight: "rgba(37, 37, 47, 1)",
  sliderOrangeDark: "rgba(20, 20, 27, 1)",
  sliderOrangeBorderLight: "rgba(252, 66, 51, 0.5)",
  sliderOrangeBorderDark: "rgba(255, 238, 146,1)",
  sliderRedLight: "rgba(98, 22, 49, 1)",
  sliderRedDark: "rgba(255, 90, 139, 1)",
  sliderRedBorderLight: "rgba(98, 22, 49, 1)",
  sliderRedBorderDark: "rgba(218, 73, 108, 1)",
  sliderGreenLight: "rgba(27, 125, 67, 1)",
  sliderGreenDark: "rgba(108, 231, 150, 1)",
  sliderGreenBorderLight: "rgba(26, 80, 62, 1)",
  sliderGreenBorderDark: "rgba(64, 198, 134, 1)",
  redText: "rgba(128, 32, 55, 1)",
  greenText: "rgba(7, 110, 73, 1)",

  // I used below if you dont mind
  orangeBorderLight: "rgba(252, 66, 51, 0.5)",
  orangeBorderDark: "#ffee92",
  greenBorderLight: "rgba(0, 128, 0, 0.5)",
  greenBorderDark: "#a8ff92",
  redBorderLight: "rgba(231, 76, 106, 0.5)",
  redBorderDark: "#e74c6a",
  yellow: "rgb(255, 221, 36)",
  orange: "rgb(252, 66, 51)",
  globBg: "rgb(26, 26, 28)",
  globShadow: "rgba(253, 111, 39, 0.4)",
  containerBg: "#181622",
  globButton: "#25252f",
  redAccent: "rgba(115, 71, 80, 0.5)",
  orangeAccent: "rgb(252, 167, 50)",
};

export const DECLINE_THRESHOLD = -0.2;
export const ACCEPT_THRESHOLD = 0.2;

export const P2PSliderWrapper = styled.div`
  position: relative;
  z-index: 1;
  min-width: 600px;
  height: 120px;
  padding: 4px 4px;
  border-radius: 32px;
  box-sizing: border-box;
  background: linear-gradient(
    90deg,
    ${USED_COLORS.orangeBorderLight} 0.29%,
    ${USED_COLORS.orangeBorderDark} 50.03%,
    ${USED_COLORS.orangeBorderLight} 100%
  );

  ${(props) =>
    props.dragPosition > ACCEPT_THRESHOLD &&
    css`
      background: linear-gradient(
        90deg,
        ${USED_COLORS.greenBorderLight} 0.29%,
        ${USED_COLORS.greenBorderDark} 50.03%,
        ${USED_COLORS.greenBorderLight} 100%
      );
    `}

  ${(props) =>
    props.dragPosition < DECLINE_THRESHOLD &&
    css`
      background: linear-gradient(
        90deg,
        ${USED_COLORS.redBorderLight} 0.29%,
        ${USED_COLORS.redBorderDark} 50.03%,
        ${USED_COLORS.redBorderLight} 100%
      );
    `}
  -webkit-mask: linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
`;

export const P2PSliderContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${USED_COLORS.containerBg};
  border-radius: 32px;
  padding: 0 10px;
  background: linear-gradient(
    180deg,
    ${USED_COLORS.sliderOrangeLight} 0%,
    ${USED_COLORS.sliderOrangeDark} 100%
  );

  ${(props) =>
    props.dragPosition > ACCEPT_THRESHOLD &&
    css`
      background: linear-gradient(
        180deg,
        ${USED_COLORS.sliderGreenLight} 0%,
        ${USED_COLORS.sliderGreenDark} 100%
      );
    `}

  ${(props) =>
    props.dragPosition < DECLINE_THRESHOLD &&
    css`
      background: linear-gradient(
        180deg,
        ${USED_COLORS.sliderRedLight} 0%,
        ${USED_COLORS.sliderRedDark} 100%
      );
    `}
  ${(props) =>
    props.isDragging &&
    css`
      cursor: grabbing;
    `}
`;

export const SliderActionText = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 26px;
  font-weight: 600;
  filter: ${(props) => (props.isInverted ? "invert(0.6)" : "unset")};
  img {
    width: 30px;
    height: 30px;
    object-fit: contain;
  }
`;

export const SliderGlob = styled.div`
  background: linear-gradient(${USED_COLORS.globBg}, ${USED_COLORS.globBg})
      padding-box,
    linear-gradient(
        90deg,
        ${USED_COLORS.orange} 0%,
        ${USED_COLORS.yellow} 50.57%,
        ${USED_COLORS.orange} 100%
      )
      border-box;

  ${(props) =>
    props.dragPosition > ACCEPT_THRESHOLD &&
    css`
      background: linear-gradient(${USED_COLORS.globBg}, ${USED_COLORS.globBg})
          padding-box,
        linear-gradient(
            90deg,
            ${USED_COLORS.greenBorderLight} 0%,
            ${USED_COLORS.greenBorderDark} 50.57%,
            ${USED_COLORS.greenBorderLight} 100%
          )
          border-box;
    `}

  ${(props) =>
    props.dragPosition < DECLINE_THRESHOLD &&
    css`
      background: linear-gradient(${USED_COLORS.globBg}, ${USED_COLORS.globBg})
          padding-box,
        linear-gradient(
            90deg,
            ${USED_COLORS.redAccent} 0.29%,
            ${USED_COLORS.redBorderDark} 50.03%,
            ${USED_COLORS.redBorderLight} 100%
          )
          border-box;
    `}
  z-index: 10;
  border-radius: 64px;
  border: 2px solid transparent;
  height: 100px;
  width: 100px;
  filter: drop-shadow(0px 0px 18px ${USED_COLORS.globShadow});
  position: absolute;
  top: 50%;
  left: 50%;
  cursor: grab;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.4, 2, 0.6, 1), box-shadow 0.2s;
  transform: translate(-50%, -50%)
    translateX(${(props) => (props.dragPosition || 0) * 240}px);
`;

export const SliderGlobInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  border-radius: 64px;
  border-width: 2px;
  background: linear-gradient(
    182.32deg,
    ${USED_COLORS.orange} 1.95%,
    ${USED_COLORS.orangeAccent} 98.06%
  );
  ${(props) =>
    props.dragPosition > ACCEPT_THRESHOLD &&
    css`
      background: linear-gradient(
        182.32deg,
        ${USED_COLORS.greenBorderLight} 1.95%,
        ${USED_COLORS.greenBorderDark} 98.06%
      );
    `}

  ${(props) =>
    props.dragPosition < DECLINE_THRESHOLD &&
    css`
      background: linear-gradient(
        182.32deg,
        ${USED_COLORS.redBorderLight} 1.95%,
        ${USED_COLORS.redBorderDark} 98.06%
      );
    `}
`;

export const SliderGlobButton = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${USED_COLORS.globButton};
`;

export const LeftArrow = styled(Lottie)`
  height: 50px;
  transform: translateX(-20px);
  filter: ${(props) => (props.isInverted ? "invert(0.6)" : "unset")};
`;

export const RightArrow = styled(Lottie)`
  height: 50px;
  transform: translateX(20px);
  filter: ${(props) => (props.isInverted ? "invert(0.6)" : "unset")};
`;
