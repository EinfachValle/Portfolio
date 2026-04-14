"use client";

import { useEffect, useRef, useState } from "react";

import {
  type DeviceState,
  createDeviceDetector,
  getSSRDefaults,
} from "device-type-detection";

export interface DeviceDetectionResult {
  deviceType: string;
  touchDevice: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  orientation: "portrait" | "landscape";
  isMobile: boolean;
  isTablet: boolean;
  isMobileVertical: boolean;
  isMobileHorizontal: boolean;
  isTabletVertical: boolean;
  isTabletHorizontal: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
  isTV: boolean;
  isTV4K: boolean;
}

function mapState(state: DeviceState): DeviceDetectionResult {
  return {
    deviceType: state.deviceType,
    touchDevice: state.touchDevice,
    isPortrait: state.isPortrait,
    isLandscape: state.isLandscape,
    orientation: state.orientation,
    isMobile: state.isMobile,
    isTablet: state.isTablet,
    isMobileVertical: state.isMobileVertical,
    isMobileHorizontal: state.isMobileHorizontal,
    isTabletVertical: state.isTabletVertical,
    isTabletHorizontal: state.isTabletHorizontal,
    isLaptop: state.isLaptop,
    isDesktop: state.isDesktop,
    isTV: state.isTV,
    isTV4K: state.isTV4K,
  };
}

/**
 * React hook for device type detection.
 *
 * Uses the `device-type-detection` package which handles:
 * - UA-based mobile/tablet/TV detection (including iPad detection)
 * - Width-based breakpoint classification
 * - Orientation tracking (resize, matchMedia, screen.orientation)
 * - Throttled event listeners (150ms default)
 * - SSR safety (returns desktop defaults on the server)
 */
const useDeviceTypeDetection = (): DeviceDetectionResult => {
  const [state, setState] = useState<DeviceDetectionResult>(() =>
    mapState(getSSRDefaults()),
  );

  const detectorRef = useRef<ReturnType<typeof createDeviceDetector> | null>(
    null,
  );

  useEffect(() => {
    const detector = createDeviceDetector();
    detectorRef.current = detector;

    // Set initial client-side state
    setState(mapState(detector.getState()));

    // Subscribe to future changes
    const unsubscribe = detector.subscribe((newState) => {
      setState(mapState(newState));
    });

    return () => {
      unsubscribe();
      detector.destroy();
      detectorRef.current = null;
    };
  }, []);

  return state;
};

export default useDeviceTypeDetection;
