"use client";

import { useState, useEffect, useRef, useCallback } from "react";

/* ── Pupil (just a dot) ──────────────────────────────────────────── */
interface PupilProps {
  size?: number;
  maxDistance?: number;
  pupilColor?: string;
  forceLookX?: number;
  forceLookY?: number;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

const Pupil = ({
  size = 12,
  maxDistance = 5,
  pupilColor = "black",
  forceLookX,
  forceLookY,
  containerRef,
}: PupilProps) => {
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const tick = useCallback(
    (mx: number, my: number) => {
      if (forceLookX !== undefined && forceLookY !== undefined) {
        setDx(forceLookX);
        setDy(forceLookY);
        return;
      }
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx_ = mx - cx;
      const dy_ = my - cy;
      const dist = Math.min(Math.sqrt(dx_ * dx_ + dy_ * dy_), maxDistance);
      const angle = Math.atan2(dy_, dx_);
      setDx(Math.cos(angle) * dist);
      setDy(Math.sin(angle) * dist);
    },
    [forceLookX, forceLookY, maxDistance],
  );

  useEffect(() => {
    if (forceLookX !== undefined && forceLookY !== undefined) return;
    const parent = containerRef?.current ?? document;
    const handler = (e: MouseEvent) => tick(e.clientX, e.clientY);
    parent.addEventListener("mousemove", handler);
    return () => parent.removeEventListener("mousemove", handler);
  }, [containerRef, forceLookX, forceLookY, tick]);

  return (
    <div
      ref={ref}
      className="rounded-full"
      style={{
        width: size,
        height: size,
        backgroundColor: pupilColor,
        transform: `translate(${dx}px, ${dy}px)`,
        transition: "transform 0.1s ease-out",
      }}
    />
  );
};

/* ── EyeBall (white eye + pupil) ─────────────────────────────────── */
interface EyeBallProps {
  size?: number;
  pupilSize?: number;
  maxDistance?: number;
  eyeColor?: string;
  pupilColor?: string;
  isBlinking?: boolean;
  forceLookX?: number;
  forceLookY?: number;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

const EyeBall = ({
  size = 48,
  pupilSize = 16,
  maxDistance = 10,
  eyeColor = "white",
  pupilColor = "black",
  isBlinking = false,
  forceLookX,
  forceLookY,
  containerRef,
}: EyeBallProps) => {
  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const tick = useCallback(
    (mx: number, my: number) => {
      if (forceLookX !== undefined && forceLookY !== undefined) {
        setDx(forceLookX);
        setDy(forceLookY);
        return;
      }
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx_ = mx - cx;
      const dy_ = my - cy;
      const dist = Math.min(Math.sqrt(dx_ * dx_ + dy_ * dy_), maxDistance);
      const angle = Math.atan2(dy_, dx_);
      setDx(Math.cos(angle) * dist);
      setDy(Math.sin(angle) * dist);
    },
    [forceLookX, forceLookY, maxDistance],
  );

  useEffect(() => {
    if (forceLookX !== undefined && forceLookY !== undefined) return;
    const parent = containerRef?.current ?? document;
    const handler = (e: MouseEvent) => tick(e.clientX, e.clientY);
    parent.addEventListener("mousemove", handler);
    return () => parent.removeEventListener("mousemove", handler);
  }, [containerRef, forceLookX, forceLookY, tick]);

  return (
    <div
      ref={ref}
      className="rounded-full flex items-center justify-center transition-all duration-150"
      style={{
        width: size,
        height: isBlinking ? 2 : size,
        backgroundColor: eyeColor,
        overflow: "hidden",
      }}
    >
      {!isBlinking && (
        <div
          className="rounded-full"
          style={{
            width: pupilSize,
            height: pupilSize,
            backgroundColor: pupilColor,
            transform: `translate(${dx}px, ${dy}px)`,
            transition: "transform 0.1s ease-out",
          }}
        />
      )}
    </div>
  );
};

/* ── Scene ────────────────────────────────────────────────────────── */
interface EyeAnimationSceneProps {
  passwordLength?: number;
  isPasswordVisible?: boolean;
  isTyping?: boolean;
}

export function EyeAnimationScene({
  passwordLength = 0,
  isPasswordVisible = false,
  isTyping = false,
}: EyeAnimationSceneProps) {
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [purpleBlink, setPurpleBlink] = useState(false);
  const [blackBlink, setBlackBlink] = useState(false);
  const [lookingAtEachOther, setLookingAtEachOther] = useState(false);
  const [purplePeeking, setPurplePeeking] = useState(false);
  const sceneRef = useRef<HTMLDivElement>(null);

  /* Mouse tracking ------------------------------------------------- */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMouseX(e.clientX);
      setMouseY(e.clientY);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  /* Blinking ------------------------------------------------------- */
  useEffect(() => {
    const blink = (setter: (v: boolean) => void) => {
      const t = setTimeout(() => {
        setter(true);
        setTimeout(() => setter(false), 150);
        blink(setter);
      }, Math.random() * 4000 + 3000);
      return t;
    };
    const t1 = blink(setPurpleBlink);
    const t2 = blink(setBlackBlink);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  /* Look at each other when typing starts ------------------------- */
  useEffect(() => {
    if (isTyping) {
      setLookingAtEachOther(true);
      const t = setTimeout(() => setLookingAtEachOther(false), 800);
      return () => clearTimeout(t);
    }
    setLookingAtEachOther(false);
  }, [isTyping]);

  /* Purple peeking when password visible -------------------------- */
  useEffect(() => {
    if (passwordLength > 0 && isPasswordVisible) {
      const schedule = () => {
        const t = setTimeout(() => {
          setPurplePeeking(true);
          setTimeout(() => setPurplePeeking(false), 800);
          schedule();
        }, Math.random() * 3000 + 2000);
        return t;
      };
      const t = schedule();
      return () => clearTimeout(t);
    }
    setPurplePeeking(false);
  }, [passwordLength, isPasswordVisible]);

  /* Helpers for face / body lean ---------------------------------- */
  const calcPos = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (!ref.current)
      return { faceX: 0, faceY: 0, bodySkew: 0 };
    const r = ref.current.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 3;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    return {
      faceX: Math.max(-15, Math.min(15, dx / 20)),
      faceY: Math.max(-10, Math.min(10, dy / 30)),
      bodySkew: Math.max(-6, Math.min(6, -dx / 120)),
    };
  };

  const purpleRef = useRef<HTMLDivElement>(null);
  const blackRef = useRef<HTMLDivElement>(null);
  const yellowRef = useRef<HTMLDivElement>(null);
  const orangeRef = useRef<HTMLDivElement>(null);

  const purplePos = calcPos(purpleRef);
  const blackPos = calcPos(blackRef);
  const yellowPos = calcPos(yellowRef);
  const orangePos = calcPos(orangeRef);

  const isLocked = passwordLength > 0 && isPasswordVisible;

  return (
    <div ref={sceneRef} className="flex items-center justify-center w-full h-full select-none">
      <div className="relative" style={{ width: 500, height: 380 }}>
        {/* ── Purple (back) ──────────────────────────────────────── */}
        <div
          ref={purpleRef}
          className="absolute bottom-0 transition-all duration-700 ease-in-out"
          style={{
            left: 50,
            width: 170,
            height: isTyping || (passwordLength > 0 && !isPasswordVisible) ? 400 : 360,
            backgroundColor: "#6C3FF5",
            borderRadius: "10px 10px 0 0",
            zIndex: 1,
            transform:
              isLocked
                ? "skewX(0deg)"
                : isTyping || (passwordLength > 0 && !isPasswordVisible)
                  ? `skewX(${(purplePos.bodySkew || 0) - 12}deg) translateX(40px)`
                  : `skewX(${purplePos.bodySkew || 0}deg)`,
            transformOrigin: "bottom center",
          }}
        >
          <div
            className="absolute flex gap-7 transition-all duration-700 ease-in-out"
            style={{
              left: isLocked ? 20 : lookingAtEachOther ? 50 : 40 + purplePos.faceX,
              top: isLocked ? 35 : lookingAtEachOther ? 55 : 35 + purplePos.faceY,
            }}
          >
            <EyeBall
              size={17}
              pupilSize={6}
              maxDistance={5}
              eyeColor="white"
              pupilColor="#2D2D2D"
              isBlinking={purpleBlink}
              forceLookX={isLocked ? (purplePeeking ? 4 : -4) : lookingAtEachOther ? 3 : undefined}
              forceLookY={isLocked ? (purplePeeking ? 5 : -4) : lookingAtEachOther ? 4 : undefined}
            />
            <EyeBall
              size={17}
              pupilSize={6}
              maxDistance={5}
              eyeColor="white"
              pupilColor="#2D2D2D"
              isBlinking={purpleBlink}
              forceLookX={isLocked ? (purplePeeking ? 4 : -4) : lookingAtEachOther ? 3 : undefined}
              forceLookY={isLocked ? (purplePeeking ? 5 : -4) : lookingAtEachOther ? 4 : undefined}
            />
          </div>
        </div>

        {/* ── Black (middle) ─────────────────────────────────────── */}
        <div
          ref={blackRef}
          className="absolute bottom-0 transition-all duration-700 ease-in-out"
          style={{
            left: 210,
            width: 110,
            height: 280,
            backgroundColor: "#2D2D2D",
            borderRadius: "8px 8px 0 0",
            zIndex: 2,
            transform:
              isLocked
                ? "skewX(0deg)"
                : lookingAtEachOther
                  ? `skewX(${(blackPos.bodySkew || 0) * 1.5 + 10}deg) translateX(20px)`
                  : isTyping || (passwordLength > 0 && !isPasswordVisible)
                    ? `skewX(${(blackPos.bodySkew || 0) * 1.5}deg)`
                    : `skewX(${blackPos.bodySkew || 0}deg)`,
            transformOrigin: "bottom center",
          }}
        >
          <div
            className="absolute flex gap-5 transition-all duration-700 ease-in-out"
            style={{
              left: isLocked ? 10 : lookingAtEachOther ? 28 : 22 + blackPos.faceX,
              top: isLocked ? 28 : lookingAtEachOther ? 12 : 28 + blackPos.faceY,
            }}
          >
            <EyeBall
              size={15}
              pupilSize={5}
              maxDistance={4}
              eyeColor="white"
              pupilColor="#2D2D2D"
              isBlinking={blackBlink}
              forceLookX={isLocked ? -4 : lookingAtEachOther ? 0 : undefined}
              forceLookY={isLocked ? -4 : lookingAtEachOther ? -4 : undefined}
            />
            <EyeBall
              size={15}
              pupilSize={5}
              maxDistance={4}
              eyeColor="white"
              pupilColor="#2D2D2D"
              isBlinking={blackBlink}
              forceLookX={isLocked ? -4 : lookingAtEachOther ? 0 : undefined}
              forceLookY={isLocked ? -4 : lookingAtEachOther ? -4 : undefined}
            />
          </div>
        </div>

        {/* ── Orange (front left) ────────────────────────────────── */}
        <div
          ref={orangeRef}
          className="absolute bottom-0 transition-all duration-700 ease-in-out"
          style={{
            left: -10,
            width: 220,
            height: 180,
            zIndex: 3,
            backgroundColor: "#FF9B6B",
            borderRadius: "110px 110px 0 0",
            transform: isLocked ? "skewX(0deg)" : `skewX(${orangePos.bodySkew || 0}deg)`,
            transformOrigin: "bottom center",
          }}
        >
          <div
            className="absolute flex gap-7 transition-all duration-200 ease-out"
            style={{
              left: isLocked ? 50 : 75 + (orangePos.faceX || 0),
              top: isLocked ? 85 : 85 + (orangePos.faceY || 0),
            }}
          >
            <Pupil size={11} maxDistance={5} pupilColor="#2D2D2D" forceLookX={isLocked ? -5 : undefined} forceLookY={isLocked ? -4 : undefined} containerRef={sceneRef} />
            <Pupil size={11} maxDistance={5} pupilColor="#2D2D2D" forceLookX={isLocked ? -5 : undefined} forceLookY={isLocked ? -4 : undefined} containerRef={sceneRef} />
          </div>
        </div>

        {/* ── Yellow (front right) ──────────────────────────────── */}
        <div
          ref={yellowRef}
          className="absolute bottom-0 transition-all duration-700 ease-in-out"
          style={{
            left: 275,
            width: 130,
            height: 210,
            backgroundColor: "#E8D754",
            borderRadius: "65px 65px 0 0",
            zIndex: 4,
            transform: isLocked ? "skewX(0deg)" : `skewX(${yellowPos.bodySkew || 0}deg)`,
            transformOrigin: "bottom center",
          }}
        >
          <div
            className="absolute flex gap-5 transition-all duration-200 ease-out"
            style={{
              left: isLocked ? 18 : 47 + (yellowPos.faceX || 0),
              top: isLocked ? 35 : 38 + (yellowPos.faceY || 0),
            }}
          >
            <Pupil size={11} maxDistance={5} pupilColor="#2D2D2D" forceLookX={isLocked ? -5 : undefined} forceLookY={isLocked ? -4 : undefined} containerRef={sceneRef} />
            <Pupil size={11} maxDistance={5} pupilColor="#2D2D2D" forceLookX={isLocked ? -5 : undefined} forceLookY={isLocked ? -4 : undefined} containerRef={sceneRef} />
          </div>
          <div
            className="absolute w-[72px] h-[4px] bg-[#2D2D2D] rounded-full transition-all duration-200 ease-out"
            style={{
              left: isLocked ? 10 : 35 + (yellowPos.faceX || 0),
              top: isLocked ? 80 : 80 + (yellowPos.faceY || 0),
            }}
          />
        </div>
      </div>
    </div>
  );
}
