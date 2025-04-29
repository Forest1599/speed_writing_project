import React from "react";
import { Link } from "react-router-dom";

type AcceptPrivacyProps = {
  accepted: boolean;
  setAccepted: (value: boolean) => void;
};

export const AcceptPrivacy: React.FC<AcceptPrivacyProps> = ({ accepted, setAccepted }) => {
  return (
    <label className="flex items-center space-x-2 mb-4">
      <input
        type="checkbox"
        checked={accepted}
        onChange={(e) => setAccepted(e.target.checked)}
        className="form-checkbox rounded"
      />
      <span className="text-white text-sm">
        I agree to the <Link to="/privacy-policy" className="underline text-red-400">Privacy Policy</Link>
      </span>
    </label>
  );
};