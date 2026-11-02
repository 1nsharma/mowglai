"use client";

import { useEffect, useRef, useState } from "react";
import "@/styles/interactive-pet.css";

type Point = { x: number; y: number };

const DIALOGUES = [
    "Hi! I'm Mowglai's tiny guide. Need a hand exploring?",
    "Try our services, work, and contact pages to see what we can build.",
    "Have a project idea? The Start a Project page is a good place to begin.",
    "I'll be here when you need me. Move your pointer and I'll follow!",
];

export default function InteractivePet() {
    const petRef = useRef<HTMLButtonElement>(null);
    const targetRef = useRef<Point>({ x: 180, y: 180 });
    const positionRef = useRef<Point>({ x: 180, y: 180 });
    const frameRef = useRef<number | null>(null);
    const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const messageTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [mood, setMood] = useState<"curious" | "sleeping" | "happy">("curious");
    const [message, setMessage] = useState("");
    const [messageVisible, setMessageVisible] = useState(false);
    const [enabled, setEnabled] = useState(true);
    const dialogueIndex = useRef(0);

    useEffect(() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
        const coarsePointer = window.matchMedia("(pointer: coarse)");
        let disposed = false;

        const placePet = (point: Point) => {
            positionRef.current = point;
            targetRef.current = point;
            if (petRef.current) {
                petRef.current.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`;
            }
        };

        const renderPosition = () => {
            const node = petRef.current;
            if (!node || disposed) return;
            const current = positionRef.current;
            const target = targetRef.current;
            const dx = target.x - current.x;
            const dy = target.y - current.y;
            current.x += dx * 0.075;
            current.y += dy * 0.075;
            node.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%) scaleX(${dx < -1 ? -1 : 1})`;

            if (Math.abs(dx) > 0.8 || Math.abs(dy) > 0.8) {
                frameRef.current = window.requestAnimationFrame(renderPosition);
            } else {
                frameRef.current = null;
            }
        };

        const startAnimation = () => {
            if (!reduceMotion.matches && frameRef.current === null) {
                frameRef.current = window.requestAnimationFrame(renderPosition);
            }
        };

        const onPointerMove = (event: PointerEvent) => {
            if (!enabled || coarsePointer.matches || reduceMotion.matches) return;
            targetRef.current = {
                x: Math.max(38, Math.min(window.innerWidth - 38, event.clientX)),
                y: Math.max(38, Math.min(window.innerHeight - 38, event.clientY)),
            };
            setMood("curious");
            setMessageVisible(false);
            if (idleRef.current) clearTimeout(idleRef.current);
            idleRef.current = setTimeout(() => {
                setMood("sleeping");
                setMessage("Taking a tiny break… Zzz");
                setMessageVisible(true);
            }, 4500);
            startAnimation();
        };

        const onResize = () => {
            if (coarsePointer.matches || reduceMotion.matches) {
                placePet({ x: window.innerWidth - 46, y: window.innerHeight - 110 });
            }
        };

        placePet(coarsePointer.matches || reduceMotion.matches
            ? { x: window.innerWidth - 46, y: window.innerHeight - 110 }
            : { x: 180, y: 180 });
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("resize", onResize, { passive: true });
        return () => {
            disposed = true;
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("resize", onResize);
            if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
            if (idleRef.current) clearTimeout(idleRef.current);
            if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        };
    }, [enabled]);

    const interact = () => {
        setMood("happy");
        setMessage(DIALOGUES[dialogueIndex.current % DIALOGUES.length]);
        dialogueIndex.current += 1;
        setMessageVisible(true);
        if (messageTimerRef.current) clearTimeout(messageTimerRef.current);
        messageTimerRef.current = setTimeout(() => setMessageVisible(false), 5200);
    };

    if (!enabled) {
        return (
            <button className="mowglai-pet-reopen" onClick={() => setEnabled(true)} aria-label="Show Mowglai guide">
                <span aria-hidden="true">🐾</span>
            </button>
        );
    }

    return (
        <div className="mowglai-pet-layer" data-mood={mood}>
            <div className={`mowglai-pet-message ${messageVisible ? "is-visible" : ""}`} role="status" aria-live="polite">
                {message || "Move your pointer — I'll follow!"}
            </div>
            <button
                ref={petRef}
                type="button"
                className="mowglai-pet"
                onClick={interact}
                aria-label="Talk to the Mowglai interactive guide"
                title="Click to chat with the Mowglai guide"
            >
                <span className="mowglai-pet-face" aria-hidden="true">
                    <span className="mowglai-pet-eye" />
                    <span className="mowglai-pet-eye" />
                    <span className="mowglai-pet-mouth" />
                </span>
                <span className="mowglai-pet-shadow" aria-hidden="true" />
            </button>
            <button className="mowglai-pet-hide" onClick={() => setEnabled(false)} aria-label="Hide Mowglai guide">×</button>
        </div>
    );
}
