import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { uploadImage } from "../lib/api";

export const CameraPreview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isLookingAway, setIsLookingAway] = useState(false);
  const [multiplePeopleDetected, setMultiplePeopleDetected] = useState(false);

  const lookAwayTimer = useRef<NodeJS.Timeout | null>(null);
  const multiplePeopleTimer = useRef<NodeJS.Timeout | null>(null);
  const detectionInterval = useRef<NodeJS.Timeout | null>(null);

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL + '/tiny_face_detector'),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL + '/face_landmark_68'),
        ]);
        setModelsLoaded(true);
        console.log("✅ Models loaded");
      } catch (error) {
        console.error("❌ Error loading models: ", error);
      }
    };
    loadModels();
  }, []);

  // Setup camera
  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          console.log("✅ Camera stream obtained");
        }
      } catch (err) {
        console.error("❌ Error accessing camera: ", err);
      }
    };

    getCameraStream();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        console.log("Camera stream stopped");
      }
    };
  }, []);

  // Run detection loop once models are loaded
  useEffect(() => {
    if (!modelsLoaded || !videoRef.current) {
      console.log("Waiting for models or video to be ready...");
      return;
    }

    const runDetection = async () => {
      const video = videoRef.current;
      if (!video || video.paused) {
        console.log("Video not ready or paused.");
        return;
      }

      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();
      console.log("Detections length:", detections.length);

      // --- Multiple People Detection ---
      if (detections.length > 1) {
        if (!multiplePeopleDetected) {
          console.log("Multiple people detected: TRUE");
          setMultiplePeopleDetected(true);
          multiplePeopleTimer.current = setTimeout(() => {
            console.log("Triggering capture for multiple people.");
            captureAndUploadImage();
          }, 3000); // confirm multiple people after 3s
        }
      } else {
        if (multiplePeopleDetected) {
          console.log("Multiple people detected: FALSE");
          setMultiplePeopleDetected(false);
        }
        if (multiplePeopleTimer.current) {
          clearTimeout(multiplePeopleTimer.current);
          multiplePeopleTimer.current = null;
        }
      }

      // --- Looking Away Detection ---
      if (detections.length > 0) {
        const landmarks = detections[0].landmarks;
        const nose = landmarks.getNose();
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();

        const eyeCenter = {
          x: (leftEye[0].x + rightEye[3].x) / 2,
          y: (leftEye[0].y + rightEye[3].y) / 2,
        };

        const headTurnThreshold = 15; // pixels
        const isTurned = Math.abs(nose[3].x - eyeCenter.x) > headTurnThreshold;

        if (isTurned) {
          if (!isLookingAway) {
            console.log("Looking away: TRUE");
            setIsLookingAway(true);
            lookAwayTimer.current = setTimeout(() => {
              console.log("Triggering capture for looking away.");
              captureAndUploadImage();
            }, 3000); // confirm turned head after 3s
          }
        } else {
          if (isLookingAway) {
            console.log("Looking away: FALSE");
            setIsLookingAway(false);
          }
          if (lookAwayTimer.current) {
            clearTimeout(lookAwayTimer.current);
            lookAwayTimer.current = null;
          }
        }
      } else {
        // No face detected = possible look away
        if (!isLookingAway) {
          console.log("No face detected, setting looking away: TRUE");
          setIsLookingAway(true);
          lookAwayTimer.current = setTimeout(() => {
            console.log("Triggering capture for no face detected.");
            captureAndUploadImage();
          }, 5000); // confirm no face after 5s
        }
      }
    };

    detectionInterval.current = setInterval(runDetection, 1000);

    return () => {
      if (detectionInterval.current) clearInterval(detectionInterval.current);
      if (lookAwayTimer.current) clearTimeout(lookAwayTimer.current);
      if (multiplePeopleTimer.current) clearTimeout(multiplePeopleTimer.current);
      console.log("Detection interval cleared.");
    };
  }, [modelsLoaded, isLookingAway, multiplePeopleDetected]);

  const captureAndUploadImage = () => {
    console.log("Attempting to capture and upload image...");
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            console.log("Image captured as blob.");
            const file = new File([blob], `capture_${Date.now()}.jpeg`, {
              type: "image/jpeg",
            });
            uploadImage(file).catch((err) =>
              console.error("❌ Image upload failed", err)
            );
          } else {
            console.error("❌ Failed to create blob from canvas.");
          }
        }, "image/jpeg");
      } else {
        console.error("❌ Canvas context not available.");
      }
    } else {
      console.error("❌ Video ref not available for capture.");
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-72 bg-gray-900 rounded-lg overflow-hidden shadow-lg z-50">
      <div className="absolute top-2 left-2 flex items-center text-white text-sm">
        <span className="relative flex h-3 w-3 mr-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
              !isLookingAway && !multiplePeopleDetected
                ? "bg-green-400"
                : "bg-red-400"
            } opacity-75`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-3 w-3 ${
              !isLookingAway && !multiplePeopleDetected
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          ></span>
        </span>
        {!isLookingAway && !multiplePeopleDetected ? "User Present" : "Alert!"}
      </div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  );
};