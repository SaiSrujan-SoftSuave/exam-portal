import React, { useState, useCallback } from "react";
import { Camera, Mic, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type PermissionStatus = "not-requested" | "granted" | "denied" | "requesting";

interface DeviceAccessProps {
  onPermissionChange: (camera: PermissionStatus, microphone: PermissionStatus) => void;
}

export const DeviceAccess = ({ onPermissionChange }: DeviceAccessProps) => {
  const [cameraStatus, setCameraStatus] = useState<PermissionStatus>("not-requested");
  const [micStatus, setMicStatus] = useState<PermissionStatus>("not-requested");
  const { toast } = useToast();

  const requestCameraAccess = useCallback(async () => {
    setCameraStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      setCameraStatus("granted");
      toast({
        title: "Camera Access Granted",
        description: "Camera permission has been successfully granted.",
        variant: "default",
      });
    } catch (error) {
      setCameraStatus("denied");
      toast({
        title: "Camera Access Denied",
        description: "Camera permission is required to start the exam.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const requestMicAccess = useCallback(async () => {
    setMicStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
      setMicStatus("granted");
      toast({
        title: "Microphone Access Granted", 
        description: "Microphone permission has been successfully granted.",
        variant: "default",
      });
    } catch (error) {
      setMicStatus("denied");
      toast({
        title: "Microphone Access Denied",
        description: "Microphone permission is required to start the exam.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Notify parent component of permission changes
  React.useEffect(() => {
    onPermissionChange(cameraStatus, micStatus);
  }, [cameraStatus, micStatus, onPermissionChange]);

  const getStatusIcon = (status: PermissionStatus) => {
    switch (status) {
      case "granted":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "denied":
        return <XCircle className="h-4 w-4 text-destructive" />;
      case "requesting":
        return <Clock className="h-4 w-4 text-warning animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: PermissionStatus) => {
    switch (status) {
      case "granted":
        return "Granted";
      case "denied":
        return "Denied";
      case "requesting":
        return "Requesting...";
      default:
        return "Not Requested";
    }
  };

  const getStatusColor = (status: PermissionStatus) => {
    switch (status) {
      case "granted":
        return "text-success";
      case "denied":
        return "text-destructive";
      case "requesting":
        return "text-warning";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className="border-warning/20 bg-warning/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <span className="text-warning">🔒</span>
          Required for Proctoring
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Camera Permission */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
          <div className="flex items-center gap-3">
            <Camera className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-sm">Camera Access</p>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(cameraStatus)}
                <span className={`text-xs ${getStatusColor(cameraStatus)}`}>
                  Status: {getStatusText(cameraStatus)}
                </span>
              </div>
            </div>
          </div>
          
          {cameraStatus === "not-requested" && (
            <Button
              onClick={requestCameraAccess}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              Request Access
            </Button>
          )}
          
          {cameraStatus === "denied" && (
            <Button
              onClick={requestCameraAccess}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              Retry
            </Button>
          )}
        </div>

        {/* Microphone Permission */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
          <div className="flex items-center gap-3">
            <Mic className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-sm">Microphone Access</p>
              <div className="flex items-center gap-2 mt-1">
                {getStatusIcon(micStatus)}
                <span className={`text-xs ${getStatusColor(micStatus)}`}>
                  Status: {getStatusText(micStatus)}
                </span>
              </div>
            </div>
          </div>
          
          {micStatus === "not-requested" && (
            <Button
              onClick={requestMicAccess}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              Request Access
            </Button>
          )}
          
          {micStatus === "denied" && (
            <Button
              onClick={requestMicAccess}
              size="sm"
              variant="outline"
              className="text-xs"
            >
              Retry
            </Button>
          )}
        </div>

        {(cameraStatus === "denied" || micStatus === "denied") && (
          <p className="text-xs text-destructive text-center bg-destructive/10 p-2 rounded border border-destructive/20">
            ⚠️ You must allow camera & microphone access to start the exam
          </p>
        )}
      </CardContent>
    </Card>
  );
};