export interface ARCapabilities {
  hasWebcam: boolean;
  hasWebXR: boolean;
  preferredMode: "native-ar" | "webcam-ar" | "none";
}

export interface TableSurface {
  position: [number, number, number];
  normal: [number, number, number];
  confidence: number;
}

export interface ARPlacement {
  position: [number, number, number];
  elevation: number;
  scale: number;
}

export async function detectARCapabilities(): Promise<ARCapabilities> {
  const capabilities: ARCapabilities = {
    hasWebcam: false,
    hasWebXR: false,
    preferredMode: "none",
  };

  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        capabilities.hasWebcam = true;
        stream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.log("Webcam not available:", error);
        capabilities.hasWebcam = false;
      }
    }
  } catch (error) {
    console.log("MediaDevices API not available:", error);
  }

  if ("xr" in navigator) {
    try {
      const xr = (navigator as any).xr;
      if (xr && typeof xr.isSessionSupported === "function") {
        const supported = await xr.isSessionSupported("immersive-ar");
        capabilities.hasWebXR = supported;
      }
    } catch (error) {
      console.log("WebXR check failed:", error);
      capabilities.hasWebXR = false;
    }
  }

  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    );

  if (capabilities.hasWebXR && isMobile) {
    capabilities.preferredMode = "native-ar";
  } else if (capabilities.hasWebcam) {
    capabilities.preferredMode = "webcam-ar";
  } else {
    capabilities.preferredMode = "none";
  }

  return capabilities;
}

export function calculateTablePlacement(
  groundLevel: number = 0,
  modelHeight: number = 0
): ARPlacement {
  return {
    position: [0, groundLevel + modelHeight * 0.5, 0],
    elevation: groundLevel,
    scale: 2,
  };
}

export function detectTableSurface(): TableSurface {
  return {
    position: [0, 0, 0],
    normal: [0, 1, 0],
    confidence: 0.9,
  };
}

export function adjustModelElevation(
  basePosition: [number, number, number],
  modelBounds?: { min: [number, number, number]; max: [number, number, number] }
): [number, number, number] {
  if (modelBounds) {
    const bottomOffset = Math.abs(modelBounds.min[1]);
    return [basePosition[0], basePosition[1] + bottomOffset, basePosition[2]];
  }
  return basePosition;
}
