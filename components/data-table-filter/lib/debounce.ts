type ControlFunctions = {
  cancel: () => void
  flush: () => void
  isPending: () => boolean
}

type DebounceOptions = {
  leading?: boolean
  trailing?: boolean
  maxWait?: number
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  options: DebounceOptions = {},
): ((...args: Parameters<T>) => ReturnType<T> | undefined) & ControlFunctions {
  const { leading = false, trailing = true, maxWait } = options
  let timeout: NodeJS.Timeout | null = null
  let lastArgs: Parameters<T> | null = null
  let result: ReturnType<T> | undefined
  let lastCallTime: number | null = null
  let lastInvokeTime = 0

  const maxWaitTime = maxWait !== undefined ? Math.max(wait, maxWait) : null

  function invokeFunc(time: number, thisArg: any): ReturnType<T> | undefined {
    if (lastArgs === null) return undefined
    const args = lastArgs
    lastArgs = null
    lastInvokeTime = time
    result = func.apply(thisArg, args)
    return result
  }

  function shouldInvoke(time: number): boolean {
    if (lastCallTime === null) return false
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    return (
      lastCallTime === null ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (maxWaitTime !== null && timeSinceLastInvoke >= maxWaitTime)
    )
  }

  function startTimer(
    pendingFunc: () => void,
    waitTime: number,
  ): NodeJS.Timeout {
    return setTimeout(pendingFunc, waitTime)
  }

  function remainingWait(time: number): number {
    if (lastCallTime === null) return wait
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime
    const timeWaiting = wait - timeSinceLastCall
    return maxWaitTime !== null
      ? Math.min(timeWaiting, maxWaitTime - timeSinceLastInvoke)
      : timeWaiting
  }

  function timerExpired(thisArg: any) {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time, thisArg)
    }
    timeout = startTimer(() => timerExpired(thisArg), remainingWait(time))
  }

  function leadingEdge(time: number, thisArg: any): ReturnType<T> | undefined {
    lastInvokeTime = time
    timeout = startTimer(() => timerExpired(thisArg), wait)
    return leading ? invokeFunc(time, thisArg) : undefined
  }

  function trailingEdge(time: number, thisArg: any): ReturnType<T> | undefined {
    timeout = null
    if (trailing && lastArgs) {
      return invokeFunc(time, thisArg)
    }
    lastArgs = null
    return result
  }

  function debounced(
    this: any,
    ...args: Parameters<T>
  ): ReturnType<T> | undefined {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastCallTime = time

    if (isInvoking) {
      if (timeout === null) {
        return leadingEdge(lastCallTime, this)
      }
      if (maxWaitTime !== null) {
        timeout = startTimer(() => timerExpired(this), wait)
        return invokeFunc(lastCallTime, this)
      }
    }
    if (timeout === null) {
      timeout = startTimer(() => timerExpired(this), wait)
    }
    return result
  }

  debounced.cancel = () => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    lastInvokeTime = 0
    lastArgs = null
    lastCallTime = null
    timeout = null
  }

  debounced.flush = function(this: any) {
    return timeout === null ? result : trailingEdge(Date.now(), this)
  }

  debounced.isPending = () => {
    return timeout !== null
  }

  return debounced
}
