import { useEffect, useRef } from 'react'

export const useUpdateEffect = (fn: Function, args: any[]) => {
    const didMounRef = useRef(false)
    useEffect(() => {
        if (didMounRef.current) fn()
        didMounRef.current = true
    }, args)
}