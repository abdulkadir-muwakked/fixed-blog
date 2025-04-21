"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageTransition = PageTransition;
exports.FadeIn = FadeIn;
exports.Stagger = Stagger;
const framer_motion_1 = require("framer-motion");
function PageTransition({ children }) {
    return (<framer_motion_1.AnimatePresence mode="wait">
      <framer_motion_1.motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{
            duration: 0.3,
            ease: 'easeInOut',
        }}>
        {children}
      </framer_motion_1.motion.div>
    </framer_motion_1.AnimatePresence>);
}
function FadeIn({ children, delay = 0.1, direction = 'up', className = '', duration = 0.5 }) {
    const getDirectionValues = () => {
        switch (direction) {
            case 'up': return { y: 20 };
            case 'down': return { y: -20 };
            case 'left': return { x: 20 };
            case 'right': return { x: -20 };
            default: return { y: 20 };
        }
    };
    return (<framer_motion_1.motion.div initial={Object.assign({ opacity: 0 }, getDirectionValues())} animate={{
            opacity: 1,
            y: 0,
            x: 0,
        }} transition={{
            duration,
            delay,
            ease: [0.22, 1, 0.36, 1],
        }} className={className}>
      {children}
    </framer_motion_1.motion.div>);
}
function Stagger({ children, className = '', staggerDelay = 0.1, childClassName = '', direction = 'up', }) {
    const getDirectionValues = () => {
        switch (direction) {
            case 'up': return { y: 20 };
            case 'down': return { y: -20 };
            case 'left': return { x: 20 };
            case 'right': return { x: -20 };
            default: return { y: 20 };
        }
    };
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: staggerDelay,
            },
        },
    };
    const item = {
        hidden: Object.assign({ opacity: 0 }, getDirectionValues()),
        show: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
            }
        }
    };
    return (<framer_motion_1.motion.div variants={container} initial="hidden" animate="show" className={className}>
      {Array.isArray(children)
            ? children.map((child, index) => (<framer_motion_1.motion.div key={index} variants={item} className={childClassName}>
              {child}
            </framer_motion_1.motion.div>))
            : <framer_motion_1.motion.div variants={item} className={childClassName}>{children}</framer_motion_1.motion.div>}
    </framer_motion_1.motion.div>);
}
