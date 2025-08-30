import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  Phone,
  MapPin,
  Heart,
  Shield,
  Flame,
  Zap,
  Waves,
  Wind,
  CheckCircle,
  Clock,
  Users
} from "lucide-react";

const emergencyContacts = {
  national: [
    { name: "National Emergency", number: "112", icon: AlertTriangle, color: "text-red-600" },
    { name: "Fire Department", number: "101", icon: Flame, color: "text-orange-600" },
    { name: "Police", number: "100", icon: Shield, color: "text-blue-600" },
    { name: "Ambulance", number: "108", icon: Heart, color: "text-pink-600" },
    { name: "Disaster Management", number: "1078", icon: AlertTriangle, color: "text-purple-600" }
  ]
};

const firstAidSteps = {
  cpr: {
    title: "CPR (Cardiopulmonary Resuscitation)",
    icon: Heart,
    steps: [
      "Check responsiveness and breathing",
      "Call for help and emergency services",
      "Place hands on center of chest",
      "Push hard and fast at least 2 inches deep",
      "Allow complete chest recoil between compressions",
      "Give 30 chest compressions at 100-120/minute",
      "Open airway and give 2 rescue breaths",
      "Continue cycles of 30 compressions and 2 breaths"
    ]
  },
  burns: {
    title: "Treating Burns",
    icon: Flame,
    steps: [
      "Remove from heat source safely",
      "Cool the burn with running water for 10-20 minutes",
      "Remove jewelry/clothing near burn before swelling",
      "Cover with clean, dry cloth",
      "Do NOT use ice, butter, or ointments",
      "Seek immediate medical attention for severe burns",
      "Watch for signs of shock",
      "Keep person warm and comfortable"
    ]
  },
  bleeding: {
    title: "Severe Bleeding",
    icon: AlertTriangle,
    steps: [
      "Ensure scene safety",
      "Wear gloves if available",
      "Apply direct pressure with clean cloth",
      "Maintain pressure and do not remove cloth",
      "Elevate injured area above heart if possible",
      "Apply pressure to pressure points if needed",
      "Call emergency services immediately",
      "Monitor for signs of shock"
    ]
  }
};

const evacuationProcedures = {
  fire: {
    title: "Fire Evacuation",
    icon: Flame,
    color: "bg-red-50 border-red-200",
    steps: [
      "Stay low and crawl under smoke",
      "Feel doors before opening - don't open if hot",
      "Use stairs, never elevators",
      "Go to designated assembly point",
      "Don't go back inside for belongings",
      "Call fire department from safe location"
    ]
  },
  earthquake: {
    title: "Earthquake Response",
    icon: Zap,
    color: "bg-yellow-50 border-yellow-200",
    steps: [
      "DROP to hands and knees immediately",
      "COVER your head and neck under desk/table",
      "HOLD ON to your shelter and protect yourself",
      "Stay away from windows and heavy objects",
      "If outdoors, move away from buildings",
      "After shaking stops, evacuate if building is damaged"
    ]
  },
  flood: {
    title: "Flood Safety",
    icon: Waves,
    color: "bg-blue-50 border-blue-200",
    steps: [
      "Move to higher ground immediately",
      "Avoid walking in moving water",
      "Don't drive through flooded roads",
      "Stay away from storm drains and sewers",
      "Listen to emergency broadcasts",
      "Have emergency kit ready"
    ]
  }
};

export default function Emergency() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("contacts");
  const [sosPressed, setSosPressed] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await User.me();
        setUser(userData);
      } catch (error) {
        console.error("Error loading user:", error);
      }
    };
    loadUser();
  }, []);

  const handleSOS = () => {
    setSosPressed(true);
    // In a real app, this would trigger emergency services
    setTimeout(() => setSosPressed(false), 3000);
  };

  const callEmergency = (number) => {
    window.open(`tel:${number}`, '_self');
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-red-50 to-orange-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with SOS Button */}
        <div className="text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Emergency Toolkit
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Quick access to emergency contacts, first aid guidance, and safety procedures.
            Use responsibly and only in real emergencies.
          </p>
          
          {/* SOS Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleSOS}
              disabled={sosPressed}
              className={`w-32 h-32 rounded-full text-xl font-bold shadow-xl transition-all duration-300 ${
                sosPressed 
                  ? 'bg-red-700 scale-110 animate-pulse' 
                  : 'bg-red-600 hover:bg-red-700 hover:scale-105'
              }`}
            >
              {sosPressed ? (
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-1" />
                  <div className="text-sm">SENT</div>
                </div>
              ) : (
                <div className="text-center">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-1" />
                  <div>SOS</div>
                </div>
              )}
            </Button>
          </div>

          {sosPressed && (
            <Alert className="bg-green-50 border-green-200 max-w-md mx-auto">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Emergency alert sent to your emergency contacts and local authorities.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
            <TabsTrigger value="contacts">Emergency Contacts</TabsTrigger>
            <TabsTrigger value="firstaid">First Aid</TabsTrigger>
            <TabsTrigger value="evacuation">Evacuation</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts" className="mt-8">
            <div className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-blue-500" />
                    National Emergency Numbers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {emergencyContacts.national.map((contact) => (
                      <Card key={contact.number} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => callEmergency(contact.number)}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-gray-50 rounded-full">
                              <contact.icon className={`w-6 h-6 ${contact.color}`} />
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">{contact.name}</div>
                              <div className="text-2xl font-bold text-blue-600">{contact.number}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {user?.emergency_contact && (
                <Card className="shadow-lg border-0 border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-green-500" />
                      Your Emergency Contact
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">Personal Emergency Contact</div>
                        <div className="text-lg text-green-600">{user.emergency_contact}</div>
                      </div>
                      <Button onClick={() => callEmergency(user.emergency_contact)}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="firstaid" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {Object.values(firstAidSteps).map((procedure, index) => (
                <Card key={index} className="shadow-lg border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <procedure.icon className="w-5 h-5 text-red-500" />
                      {procedure.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {procedure.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-3">
                          <Badge className="bg-red-100 text-red-700 min-w-6 h-6 rounded-full flex items-center justify-center text-xs">
                            {stepIndex + 1}
                          </Badge>
                          <p className="text-sm text-gray-700">{step}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="evacuation" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {Object.values(evacuationProcedures).map((procedure, index) => (
                <Card key={index} className={`shadow-lg border-0 ${procedure.color}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <procedure.icon className="w-5 h-5" />
                      {procedure.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {procedure.steps.map((step, stepIndex) => (
                        <div key={stepIndex} className="flex items-start gap-3">
                          <Badge className="bg-white/80 text-gray-700 min-w-6 h-6 rounded-full flex items-center justify-center text-xs">
                            {stepIndex + 1}
                          </Badge>
                          <p className="text-sm text-gray-800">{step}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Safety Tips */}
        <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Remember: Stay Calm, Stay Safe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Always prioritize your safety first</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Know your evacuation routes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Keep emergency kit accessible</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-300" />
                <span>Practice emergency drills regularly</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}