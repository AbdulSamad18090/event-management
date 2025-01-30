import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

const ImageCropper = ({ image, onCropComplete, isUploading }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((value) => {
    setZoom(value[0]);
  }, []);

  const onRotationChange = useCallback((value) => {
    setRotation(value[0]);
  }, []);

  const onCropCompleteHandler = useCallback(
    (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleSave = useCallback(() => {
    onCropComplete(croppedAreaPixels);
  }, [croppedAreaPixels, onCropComplete]);

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative h-64 mb-8">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteHandler}
          onZoomChange={setZoom}
          cropShape="round"
          showGrid={false}
          className="rounded-lg"
        />
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium">Zoom</p>
          <Slider
            value={[zoom]}
            onValueChange={onZoomChange}
            min={1}
            max={3}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Rotation</p>
          <Slider
            value={[rotation]}
            onValueChange={onRotationChange}
            min={0}
            max={360}
            step={1}
            className="w-full"
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          {isUploading ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
};

export default ImageCropper;
