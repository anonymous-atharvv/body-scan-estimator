import { CheckCircle, Info } from "lucide-react";

interface MeasurementData {
  estimated_height_cm: number;
  shoulder_width_cm: number;
  arm_length_cm: number;
  leg_length_cm: number;
}

interface MeasurementResultsProps {
  measurements: MeasurementData;
  viewsUsed: number;
  accuracyNote: string;
}

const MeasurementResults = ({ measurements, viewsUsed, accuracyNote }: MeasurementResultsProps) => {
  const resultRows = [
    { label: "Estimated Height", value: measurements.estimated_height_cm, unit: "cm" },
    { label: "Shoulder Width", value: measurements.shoulder_width_cm, unit: "cm" },
    { label: "Arm Length", value: measurements.arm_length_cm, unit: "cm" },
    { label: "Leg / Inseam Length", value: measurements.leg_length_cm, unit: "cm" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle className="w-5 h-5 text-success" />
        <h2 className="text-lg font-semibold text-foreground">Measurement Results</h2>
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="results-table">
          <thead>
            <tr>
              <th>Measurement</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {resultRows.map((row, index) => (
              <tr key={index}>
                <td className="font-medium">{row.label}</td>
                <td>
                  <span className="text-primary font-semibold">{row.value.toFixed(1)}</span>
                  <span className="text-muted-foreground ml-1">{row.unit}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-muted rounded-lg">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="text-muted-foreground">
              <span className="font-medium text-foreground">Views Used:</span> {viewsUsed}
            </p>
            <p className="text-muted-foreground mt-1">
              <span className="font-medium text-foreground">Accuracy:</span> {accuracyNote}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground italic text-center">
        Measurements are approximate and generated using pose estimation, geometric scaling, and anthropometric constraints.
      </p>
    </div>
  );
};

export default MeasurementResults;
