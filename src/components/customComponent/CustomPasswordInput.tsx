import React, { useEffect, useState } from "react";
import { Input, InputProps } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import './style.css'

type Props = {
  name: string;
  showValidators: boolean; // SHOW PASS VALIDATION OR NOT
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};
const CustomPasswordInput = ({ onChange, name, showValidators }: Props) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  const requirements = [
    { re: /.{8,}/, label: "At least 8 characters" },
    { re: /[A-Z]/, label: "At least one uppercase letter" },
    { re: /[a-z]/, label: "At least one lowercase letter" },
    { re: /[0-9]/, label: "At least one number" },
    { re: /[^A-Za-z0-9]/, label: "At least one special character" },
  ];

  useEffect(() => {
    if (showValidators === true) {
      const meetRequirements = requirements.filter((item) =>
        item.re.test(password)
      );
      setStrength((meetRequirements.length / requirements.length) * 100);
    }
  }, [password]);

  // Get color based on strength
  const getStrengthColor = (val: any) => {
    if (val !== 0 && val <= 20) return "bg-red-500";
    if (strength === 40) return "bg-orange-500";
    if (strength === 60) return "bg-yellow-500";
    if (strength === 80) return "bg-[#c1da11]";
    if (strength === 100) return "bg-green-500";

    return "bg-gray-200";
  };

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={showPassword ? "text" : "password"}
          value={[password]}
          onChange={(e) => {
            setPassword(e.target.value);
            onChange(e);
          }}
          onKeyDown={(event: any) => {
            if (event.which == 32) {
              event.preventDefault();
            }
          }}
          className="custom_pass_Input pr-10"
          placeholder="Enter password"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword === true ? (
            <Eye className="h-4 w-4 text-gray-500" />
          ) : (
            <EyeOff className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </div>
      {showValidators === true && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={`h-full ${getStrengthColor(strength)}`}
                  style={{ width: `${strength}%` }}
                />
              </div>
            </div>
            <ul className="list-disc list-inside text-xs text-gray-400 space-y-1">
              {requirements.map((req, index) => (
                <li
                  key={`pass_condition_${index}`}
                  className={
                    req.re.test(password) ? "text-black" : "text-gray-400"
                  }
                >
                  {req.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomPasswordInput;
