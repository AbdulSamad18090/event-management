import { useState, useEffect } from "react";  // Import useEffect
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react"; // Import next-auth's signIn
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "attendee", // Default to attendee
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  // Set role from localStorage when the component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedRole = localStorage.getItem("selectedRole");
      if (savedRole) {
        setFormData((prevData) => ({ ...prevData, role: savedRole }));
      }
    }
  }, []);

  // Update formData state dynamically
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleRoleChange = (value) => {
    setFormData((prevData) => ({
      ...prevData,
      role: value,
    }));
    if (typeof window !== "undefined") {
      localStorage.setItem("selectedRole", value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset previous error message
    setSuccess(false); // Reset success message
    setLoading(true); // Start loading state

    try {
      // Send registration request to your API
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          }),
        }
      );

      const data = await res.json();
      setLoading(false); // End loading state

      if (res.ok) {
        // Registration successful, now log the user in
        setSuccess(true);
        console.log("User registered successfully");
        toast({
          title: "Registration successful.",
        });

        // Automatically log the user in using next-auth's signIn method
        const signInRes = await signIn("credentials", {
          redirectTo: "/dashboard",
          email: formData.email,
          password: formData.password,
        });

        if (signInRes?.error) {
          setError("Failed to log in after registration.");
        } else {
          // Redirect to dashboard or desired route
        }
      } else {
        // Handle errors (e.g., user already exists)
        setError(data.error || "An error occurred during registration.");
        toast({
          variant: "destructive",
          title: data.error || "An error occurred during registration.",
        });
      }
    } catch (error) {
      setLoading(false); // End loading state
      setError("An error occurred during registration. Please try again.");
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: error.message || "An error occurred during registration.",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);

    // Pass the selected role when signing in with Google
    const signInRes = await signIn("google", {
      redirect: false,
      role: formData.role,
    });

    setLoading(false);
  };

  return (
    <TabsContent value="register">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="Enter your full name"
            required
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            required
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="role">Select Your Role</Label>
          <Select value={formData.role} onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="organizer">Organizer</SelectItem>
              <SelectItem value="attendee">Attendee</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
      {/* <Separator className="my-4" /> */}
      {/* <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" className="w-full">
            <FcGoogle />
            Continue with Google
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Select Your Role</DialogTitle>
          <DialogDescription>
            Select your role before continuing with Google login.
          </DialogDescription>
          <Select value={formData.role} onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="organizer">Organizer</SelectItem>
              <SelectItem value="attendee">Attendee</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => handleGoogleSignIn(formData.role)}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Register with Google"
            )}
          </Button>
        </DialogContent>
      </Dialog> */}
    </TabsContent>
  );
};

export default RegisterForm;
