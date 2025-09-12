import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { uploadImage } from '../lib/api';

export const CameraPreview: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isLookingAway, setIsLookingAway] = useState(false);
  const lookAwayTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
        ]);
        setModelsLoaded(true);
        console.log("Models loaded");
      } catch (error) {
        console.error("Error loading models: ", error);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    const getCameraStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    };

    getCameraStream();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!modelsLoaded) return;

    const handlePlay = () => {
      const detectionInterval = setInterval(async () => {
        if (videoRef.current && !videoRef.current.paused) {
          const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

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
                setIsLookingAway(true);
                lookAwayTimer.current = setTimeout(() => {
                  captureAndUploadImage();
                }, 3000); // 3 seconds
              }
            } else {
              setIsLookingAway(false);
              if (lookAwayTimer.current) {
                clearTimeout(lookAwayTimer.current);
                lookAwayTimer.current = null;
              }
            }
          } else {
            setIsLookingAway(true); // No face detected is also looking away
            if (!lookAwayTimer.current) {
                lookAwayTimer.current = setTimeout(() => {
                    captureAndUploadImage();
                }, 5000); // 5 seconds if no face
            }
          }
        }
      }, 1000);

      return () => {
        clearInterval(detectionInterval);
        if (lookAwayTimer.current) {
          clearTimeout(lookAwayTimer.current);
        }
      };
    };

    const video = videoRef.current;
    if (video) {
      video.addEventListener('play', handlePlay);
      return () => {
        video.removeEventListener('play', handlePlay);
      };
    }
  }, [modelsLoaded, isLookingAway]);

  const captureAndUploadImage = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        uploadImage(dataUrl).catch(err => console.error("Image upload failed", err));
      }
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 h-72 bg-gray-900 rounded-lg overflow-hidden shadow-lg z-50">
      <div className="absolute top-2 left-2 flex items-center text-white text-sm">
        <span className="relative flex h-3 w-3 mr-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${!isLookingAway ? 'bg-green-400' : 'bg-red-400'} opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-3 w-3 ${!isLookingAway ? 'bg-green-500' : 'bg-red-500'}`}></span>
        </span>
        {!isLookingAway ? 'User Present' : 'User Looking Away'}
      </div>
      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
    </div>
  );
};