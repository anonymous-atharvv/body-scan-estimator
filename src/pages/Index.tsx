import { useState } from "react";
import { Loader2, AlertCircle, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import ImageUploadBox from "@/components/ImageUploadBox";
import MeasurementResults from "@/components/MeasurementResults";

interface MeasurementData {
  estimated_height_cm: number;
  shoulder_width_cm: number;
  arm_length_cm: number;
  leg_length_cm: number;
}

interface ApiResponse {
  measurements: MeasurementData;
  views_used: number;
  accuracy_note: string;
}

const Index = () => {
  const [frontImage, setFrontImage] = useState<File | null>(null);
  const [sideImage, setSideImage] = useState<File | null>(null);
  const [standingImage, setStandingImage] = useState<File | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<ApiResponse | null>(null);

  const handleEstimate = async () => {
    // Validation
    if (!frontImage || !sideImage || !standingImage) {
      setError("Please upload all three images (front, side, and standing).");
      return;
    }

    setError(null);
    setResults(null);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("front", frontImage);
      formData.append("side", sideImage);
      formData.append("standing", standingImage);

      const response = await fetch(
        "https://anonymousananta-ai-body-measurement.hf.space/measure_3pose",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data: ApiResponse = await response.json();
      
      if (!data.measurements) {
        throw new Error("Invalid response from server");
      }

      setResults(data);
    } catch (err) {
      console.error("Estimation error:", err);
      setError(
        "Unable to estimate measurements. Please upload clear full-body images with proper posture."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const allImagesUploaded = frontImage && sideImage && standingImage;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Ruler className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            AI-Based Full Body Measurement Estimation
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Upload three full-body images to automatically estimate body measurements using 
            pose estimation and geometric scaling. No manual input required.
          </p>
        </header>

        {/* Main Card */}
        <div className="academic-card">
          {/* Upload Section */}
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Upload Images
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Please upload clear, full-body photographs from three different angles. 
              Ensure proper lighting and a neutral background for best results.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ImageUploadBox
                label="Front View Image"
                description="Full body, facing camera"
                file={frontImage}
                onFileSelect={setFrontImage}
              />
              <ImageUploadBox
                label="Side View Image"
                description="Profile view, full body"
                file={sideImage}
                onFileSelect={setSideImage}
              />
              <ImageUploadBox
                label="Standing View Image"
                description="Neutral pose, full body"
                file={standingImage}
                onFileSelect={setStandingImage}
              />
            </div>
          </section>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center mb-8">
            <Button
              onClick={handleEstimate}
              disabled={isLoading || !allImagesUploaded}
              size="lg"
              className="min-w-[280px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing images, please wait…
                </>
              ) : (
                "Estimate Body Measurements"
              )}
            </Button>
          </div>

          {/* Results Section */}
          {results && (
            <section className="pt-6 border-t border-border">
              <MeasurementResults
                measurements={results.measurements}
                viewsUsed={results.views_used}
                accuracyNote={results.accuracy_note}
              />
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            Academic Research Project • AI Body Measurement Estimation System
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
