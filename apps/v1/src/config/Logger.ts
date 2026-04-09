const isInDebugMode = (): boolean => {
  return process.env.NODE_ENV === "development";
};

const Logger = {
  log: function (...params: Parameters<typeof console.log>): void {
    if (isInDebugMode()) {
      console.log(...params);
    }
  },
  error: function (...params: Parameters<typeof console.error>): void {
    if (isInDebugMode()) {
      console.error(...params);
    }
  },
  debug: function (...params: Parameters<typeof console.debug>): void {
    if (isInDebugMode()) {
      console.debug(...params);
    }
  },
  info: function (...params: Parameters<typeof console.info>): void {
    if (isInDebugMode()) {
      console.info(...params);
    }
  },
  warn: function (...params: Parameters<typeof console.warn>): void {
    if (isInDebugMode()) {
      console.warn(...params);
    }
  },
  assert: function (...params: Parameters<typeof console.assert>): void {
    if (isInDebugMode()) {
      console.assert(...params);
    }
  },
  trace: function (...params: Parameters<typeof console.trace>): void {
    if (isInDebugMode()) {
      console.trace(...params);
    }
  },
  count: function (...params: Parameters<typeof console.count>): void {
    if (isInDebugMode()) {
      console.count(...params);
    }
  },
  countReset: function (
    ...params: Parameters<typeof console.countReset>
  ): void {
    if (isInDebugMode()) {
      console.countReset(...params);
    }
  },
  time: function (label?: string): void {
    if (isInDebugMode()) {
      console.time(label);
    }
  },
  timeLog: function (...params: Parameters<typeof console.timeLog>): void {
    if (isInDebugMode()) {
      console.timeLog(...params);
    }
  },
  timeStamp: function (...params: Parameters<typeof console.timeStamp>): void {
    if (isInDebugMode()) {
      console.timeStamp(...params);
    }
  },
  timeEnd: function (label?: string): void {
    if (isInDebugMode()) {
      console.timeEnd(label);
    }
  },
  group: function (...params: Parameters<typeof console.group>): void {
    if (isInDebugMode()) {
      console.group(...params);
    }
  },
  groupCollapsed: function (
    ...params: Parameters<typeof console.groupCollapsed>
  ): void {
    if (isInDebugMode()) {
      console.groupCollapsed(...params);
    }
  },
  profile: function (...params: Parameters<typeof console.profile>): void {
    if (isInDebugMode()) {
      console.profile(...params);
    }
  },
  profileEnd: function (
    ...params: Parameters<typeof console.profileEnd>
  ): void {
    if (isInDebugMode()) {
      console.profileEnd(...params);
    }
  },
  dir: function (...params: Parameters<typeof console.dir>): void {
    if (isInDebugMode()) {
      console.dir(...params);
    }
  },
  clear: (): void => {
    if (isInDebugMode()) {
      console.clear();
    }
  },
} as const;

export default Logger;
