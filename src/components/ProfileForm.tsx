import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface ProfileFormProps {
  onComplete: (formData: any) => void;
}

const ProfileForm = ({ onComplete }: ProfileFormProps) => {
  const [formData, setFormData] = useState({
    gender: "",
    height: "",
    weight: "",
    waist: "",
    inseam: "",
    chest: "",
    shoulders: "",
    preferredFit: "regular",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save this data
    console.log("Saving profile data:", formData);
    onComplete(formData);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md border p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-fitbud-dark">Your Size Profile</h2>
      
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="measurements" className="mb-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="measurements">Basic Info</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="measurements" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="e.g., 175"
                  value={formData.height}
                  onChange={(e) => handleChange("height", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 70"
                  value={formData.weight}
                  onChange={(e) => handleChange("weight", e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="waist">Waist (cm)</Label>
                <Input
                  id="waist"
                  type="number"
                  placeholder="e.g., 82"
                  value={formData.waist}
                  onChange={(e) => handleChange("waist", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="inseam">Inseam (cm)</Label>
                <Input
                  id="inseam"
                  type="number"
                  placeholder="e.g., 76"
                  value={formData.inseam}
                  onChange={(e) => handleChange("inseam", e.target.value)}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chest">Chest (cm)</Label>
                <Input
                  id="chest"
                  type="number"
                  placeholder="e.g., 95"
                  value={formData.chest}
                  onChange={(e) => handleChange("chest", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="shoulders">Shoulders (cm)</Label>
                <Input
                  id="shoulders"
                  type="number"
                  placeholder="e.g., 45"
                  value={formData.shoulders}
                  onChange={(e) => handleChange("shoulders", e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preferredFit">Preferred Fit</Label>
              <Select
                value={formData.preferredFit}
                onValueChange={(value) => handleChange("preferredFit", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fit preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slim">Slim Fit</SelectItem>
                  <SelectItem value="regular">Regular Fit</SelectItem>
                  <SelectItem value="loose">Loose Fit</SelectItem>
                  <SelectItem value="oversized">Oversized</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              You can add more preferences and previous purchases later to improve your recommendations.
            </p>
          </TabsContent>
        </Tabs>
        
        <Button type="submit" className="w-full bg-fitbud-primary hover:bg-fitbud-secondary transition-colors">
          Save Profile
        </Button>
      </form>
    </div>
  );
};

export default ProfileForm;
