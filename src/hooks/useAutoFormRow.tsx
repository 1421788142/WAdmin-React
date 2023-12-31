import { debounce } from "@/utils/index";
import { useState } from 'react'

const getColNum = (width: number) => {
    if (!width) return 0
    if (width >= 1600) {
        return 6;
    } else if (width >= 1200) {
        return 4;
    } else if (width >= 1000) {
        return 3;
    } else if (width >= 400) {
        return 2;
    } else {
        return 1;
    }
}

export const useAutoFormRow = (
    el: React.MutableRefObject<any>,
    defaultNum = 4,
    maxLength = 4
) => {
    let [ num, setNum] = useState(defaultNum);

    const resetNum = () => {
        if (!el.current) return
        const width = el.current.clientWidth;
        setNum(()=>Math.min(maxLength, getColNum(width)))
    }

    const intersectionObserver = new IntersectionObserver(entries => {
        for (let i = 0, len = entries.length; i < len; i++) {
            if (entries[i].intersectionRatio <= 0) continue;
            resetNum();
        }
    });

    const resize = debounce(resetNum);
    const remove = () => {
        if (!el.current) return
        window.removeEventListener("resize", resize);
        intersectionObserver.unobserve(el.current);
        intersectionObserver.disconnect();
    };
    const init = () => {
        if (!el?.current) return;
        remove();
        intersectionObserver.observe(el.current);
        window.addEventListener("resize", resize);
    };

    return { num, init, resize, remove, resetNum };
}