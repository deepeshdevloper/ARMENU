import { useState, useEffect, useCallback } from 'react';

export interface ParallaxPosition {
  x: number;
  y: number;
}

export function useGyroParallax(sensitivity: number = 1, smoothing: number = 0.1) {
  const [tilt, setTilt] = useState<ParallaxPosition>({ x: 0, y: 0 });
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported('DeviceOrientationEvent' in window);
  }, []);

  const requestPermission = useCallback(async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        setPermissionGranted(permission === 'granted');
        return permission === 'granted';
      } catch (error) {
        console.error('Permission request failed:', error);
        setPermissionGranted(false);
        return false;
      }
    } else {
      setPermissionGranted(true);
      return true;
    }
  }, []);

  useEffect(() => {
    if (!isSupported || permissionGranted === false) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let animationFrameId: number;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.gamma !== null && event.beta !== null) {
        targetX = (event.gamma / 90) * sensitivity;
        targetY = (event.beta / 90) * sensitivity;
      }
    };

    const smoothUpdate = () => {
      currentX += (targetX - currentX) * smoothing;
      currentY += (targetY - currentY) * smoothing;

      setTilt({
        x: Math.max(-1, Math.min(1, currentX)),
        y: Math.max(-1, Math.min(1, currentY)),
      });

      animationFrameId = requestAnimationFrame(smoothUpdate);
    };

    if (permissionGranted) {
      window.addEventListener('deviceorientation', handleOrientation);
      animationFrameId = requestAnimationFrame(smoothUpdate);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isSupported, permissionGranted, sensitivity, smoothing]);

  return {
    tilt,
    isSupported,
    permissionGranted,
    requestPermission,
  };
}
