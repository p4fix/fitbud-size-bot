
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Ruler, ShoppingBag } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const WelcomeHero = ({ onGetStarted }: { onGetStarted: () => void }) => {
  return (
    <div className="text-center py-8 md:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="inline-flex items-center justify-center mb-4">
          <Avatar className="w-16 h-16">
            <AvatarImage 
              src="/lovable-uploads/c98001f0-b32f-4dd3-ab33-e8034d876077.png" 
              alt="FitBud Logo" 
              className="object-contain"
            />
            <AvatarFallback>FB</AvatarFallback>
          </Avatar>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold text-fitbud-dark mb-4">
          Find Your Perfect Fit
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Say goodbye to sizing confusion when shopping online. Our AI advisor recommends the perfect size across any brand.
        </p>
        
        <Button
          onClick={onGetStarted}
          className="bg-fitbud-primary hover:bg-fitbud-secondary text-white px-8 py-6 rounded-full text-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          Get Started <ArrowRight className="ml-2" />
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="bg-fitbud-light rounded-full p-3 inline-flex items-center justify-center text-fitbud-primary mb-4">
              <Ruler size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Measurements</h3>
            <p className="text-gray-600">
              Tell us your measurements once and we'll remember them for all future recommendations.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="bg-fitbud-light rounded-full p-3 inline-flex items-center justify-center text-fitbud-primary mb-4">
              <ShoppingBag size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Brand Intelligence</h3>
            <p className="text-gray-600">
              Our system understands size differences across thousands of clothing brands.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="bg-fitbud-light rounded-full p-3 inline-flex items-center justify-center text-fitbud-primary mb-4">
              <CheckCircle size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2">Fewer Returns</h3>
            <p className="text-gray-600">
              Find your perfect fit the first time, reducing returns and shopping frustration.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHero;
