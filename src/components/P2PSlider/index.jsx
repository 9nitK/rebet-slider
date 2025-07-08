import React, { useCallback, useEffect, useRef, useState } from "react";
import growingLeftArrows from "./AnimatedAssets/glowing_left_arrows.json";
import growingRightArrows from "./AnimatedAssets/glowing_right_arrows.json";
import {
  LeftArrow,
  P2PSliderContainer,
  P2PSliderWrapper,
  RightArrow,
  SliderActionText,
  SliderGlob,
  SliderGlobButton,
  SliderGlobInner,
} from "./styles";
/*
###

Welcome to the Rebet Frontend Coding Challenge!

###


Please follow the step-by-step instructions below and upload your solution to a public github repo within 48 hours of receiving this. Email a link to connor@rebet.app.

In the same zip file in which you found this file, you will find a video titled "RebetP2PSliderDemo.mov". The crux of the challenge will be to recreate the component recorded there.

The recorded P2P slider has the following properties of note (ordered in terms of importance):

    1. An "orb" that can be dragged left or right, and returns to center when released.
    2. A track that defines the visibility and path of the orb.
    3. A color scheme that changes when the orb is dragged left or right of center.
    4. Animated bidirectional arrows and a glowing shadow.
    5. Accept and decline indicators.
    6. An action that is triggered when the orb is dragged completely to one side, and then released.
    7. Various color gradients.

Your goal is to recreate the UI/UX of the slider as closely as possible, using a Javascript framework of your choice.
To complete the challenge, send an executable Javascript file(s) that I can run on my machine using "npm run/start".
When I run the file, a web page with a centered slider should appear. Email any questions to connor@rebet.app.



Useful notes:


Colors:

    sliderOrangeLight: 'rgba(37, 37, 47, 1)',
    sliderOrangeDark: 'rgba(20, 20, 27, 1)',

    sliderOrangeBorderLight: 'rgba(252, 66, 51, 0.5)',
    sliderOrangeBorderDark: 'rgba(255, 238, 146,1)',

    sliderRedLight: 'rgba(98, 22, 49, 1)',
    sliderRedDark: 'rgba(255, 90, 139, 1)',

    sliderRedBorderLight: 'rgba(98, 22, 49, 1)',
    sliderRedBorderDark: 'rgba(218, 73, 108, 1)',

    sliderGreenLight: 'rgba(27, 125, 67, 1)',
    sliderGreenDark: 'rgba(108, 231, 150, 1)',

    sliderGreenBorderLight: 'rgba(26, 80, 62, 1)',
    sliderGreenBorderDark: 'rgba(64, 198, 134, 1)',

    redText: 'rgba(128, 32, 55, 1)',
    greenText: 'rgba(7, 110, 73, 1)',


Static Assets:

    Can be found in the StaticAssets folder.


Animated Assets:

    Can be found in the AnimatedAssets folder.
*/

// =====================
// Subcomponents
// =====================
/**
 * AcceptIndicator - Shows the accept (right) indicator
 */
const AcceptIndicator = React.memo((props) => (
  <SliderActionText isInverted={props.isInverted}>
    <div className="slider-accept-text">Accept</div>
    <img src="/public/static-assets/white_check.png" alt="Accept" />
  </SliderActionText>
));

/**
 * DeclineIndicator - Shows the decline (left) indicator
 */
const DeclineIndicator = React.memo((props) => (
  <SliderActionText isInverted={props.isInverted}>
    <img src="/public/static-assets/white_close.png" alt="Decline" />
    <div className="slider-decline-text">Decline</div>
  </SliderActionText>
));

/**
 * SliderOrb - The draggable orb (glob) in the center of the slider
 * @param {number} dragPosition - Current drag position
 * @param {function} onMouseDown - Mouse down handler
 * @param {function} onTouchStart - Touch start handler
 * @param {React.Ref} ref - Forwarded ref for DOM access
 */
const SliderOrb = React.memo(
  React.forwardRef(
    ({ dragPosition, onMouseDown, onTouchStart, children }, ref) => (
      <SliderGlob
        dragPosition={dragPosition}
        ref={ref}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        <SliderGlobInner dragPosition={dragPosition}>
          <SliderGlobButton />
          {children}
        </SliderGlobInner>
      </SliderGlob>
    )
  )
);

// =====================
// Main Component
// =====================
/**
 * P2PSlider - Main slider component
 * Handles drag logic, color changes, and triggers actions on full drag
 */
const P2PSlider = ({ handleAction = () => {} }) => {
  const [dragPosition, setDragPosition] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const sliderRef = useRef(null);
  const orbRef = useRef(null);
  const startPosRef = useRef(0);
  const startMouseRef = useRef(0);
  const leftArrowRef = useRef(null);
  const rightArrowRef = useRef(null);

  // Memoized action handler
  const triggerAction = useCallback(
    (action) => {
      handleAction(action);
    },
    [handleAction]
  );

  // =====================
  // Event Handlers (memoized)
  // =====================
  const handleStart = useCallback(
    (clientX) => {
      if (isAnimating) return;
      setIsDragging(true);
      leftArrowRef.current?.pause();
      rightArrowRef.current?.pause();
      startMouseRef.current = clientX;
      startPosRef.current = dragPosition;
    },
    [isAnimating, dragPosition]
  );

  const handleMove = useCallback(
    (clientX) => {
      if (!isDragging || !sliderRef.current) return;
      const sliderRect = sliderRef.current.getBoundingClientRect();
      const sliderWidth = sliderRect.width;
      const orbWidth = 60;
      const maxTravel = (sliderWidth - orbWidth) / 2;
      const deltaX = clientX - startMouseRef.current;
      const deltaPos = deltaX / maxTravel;
      let newPosition = startPosRef.current + deltaPos;
      newPosition = Math.max(-1, Math.min(1, newPosition));
      setDragPosition((prev) => (prev !== newPosition ? newPosition : prev));
    },
    [isDragging]
  );

  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    // Only trigger action if fully dragged to one side
    if (dragPosition >= 1) {
      triggerAction("accept");
    } else if (dragPosition <= -1) {
      triggerAction("decline");
    }
    // Animate back to center
    setIsAnimating(true);
    setTimeout(() => {
      setDragPosition(0);
      setIsAnimating(false);
      leftArrowRef.current?.play();
      rightArrowRef.current?.play();
    }, 50);
  }, [isDragging, dragPosition, triggerAction]);

  // Mouse event handlers
  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();
      handleStart(e.clientX);
    },
    [handleStart]
  );
  const handleMouseMove = useCallback(
    (e) => {
      handleMove(e.clientX);
    },
    [handleMove]
  );
  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // Touch event handlers
  const handleTouchStart = useCallback(
    (e) => {
      e.preventDefault();
      handleStart(e.touches[0].clientX);
    },
    [handleStart]
  );
  const handleTouchMove = useCallback(
    (e) => {
      e.preventDefault();
      handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );
  const handleTouchEnd = useCallback(
    (e) => {
      e.preventDefault();
      handleEnd();
    },
    [handleEnd]
  );

  // Attach/detach global listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  const isInverted = dragPosition !== 0;

  // Render
  return (
    <P2PSliderWrapper ref={sliderRef} dragPosition={dragPosition}>
      <P2PSliderContainer isDragging={isDragging} dragPosition={dragPosition}>
        <DeclineIndicator isInverted={isInverted} />
        <LeftArrow
          lottieRef={leftArrowRef}
          isInverted={isInverted}
          animationData={growingLeftArrows}
          loop
          play={!isDragging}
        />
        <SliderOrb
          dragPosition={dragPosition}
          ref={orbRef}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        />
        <RightArrow
          lottieRef={rightArrowRef}
          isInverted={isInverted}
          animationData={growingRightArrows}
          loop
          play={!isDragging}
        />
        <AcceptIndicator isInverted={isInverted} />
      </P2PSliderContainer>
    </P2PSliderWrapper>
  );
};

export default P2PSlider;
