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
