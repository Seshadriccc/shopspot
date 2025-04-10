
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LeadQualifier = () => {
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [criteria, setCriteria] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate("/login", { replace: true });
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!linkedinUrl || !criteria) {
      toast({
        title: "Missing information",
        description: "Please fill in both fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResponse(null);

    try {
      const webhookUrl = "https://shopspot.app.n8n.cloud/webhook-test/85c00764-31ce-4630-b177-a29af3105519";
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          linkedinUrl,
          qualificationCriteria: criteria,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      setResponse(data);
      
      toast({
        title: "Qualification request sent",
        description: "Successfully received response from the service"
      });
    } catch (error) {
      console.error("Error qualifying lead:", error);
      toast({
        title: "Error qualifying lead",
        description: "There was an error processing your request",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sales Lead Qualifier</CardTitle>
          <CardDescription>
            Enter a LinkedIn URL and qualification criteria to evaluate potential leads
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
              <Input
                id="linkedin"
                placeholder="https://www.linkedin.com/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="criteria">Qualification Criteria</Label>
              <Textarea
                id="criteria"
                placeholder="Describe your qualification criteria (e.g., industry, company size, role, etc.)"
                value={criteria}
                onChange={(e) => setCriteria(e.target.value)}
                disabled={isLoading}
                className="min-h-[120px]"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-brand-teal hover:bg-brand-teal/90"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Qualify Lead"
              )}
            </Button>
          </form>
          
          {response && (
            <div className="mt-8">
              <Alert className="bg-gray-50 border-gray-200">
                <AlertTitle className="text-lg font-medium mb-2">Qualification Result</AlertTitle>
                <AlertDescription>
                  <div className="max-h-[300px] overflow-y-auto bg-white p-4 rounded border text-sm font-mono whitespace-pre-wrap">
                    {JSON.stringify(response, null, 2)}
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          This tool helps determine if a lead meets your qualification criteria
        </CardFooter>
      </Card>
    </div>
  );
};

export default LeadQualifier;
