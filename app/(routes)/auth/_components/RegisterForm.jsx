import { useState, useEffect } from "react"; // Import useEffect
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
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react"; // Import next-auth's signIn
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "attendee", // Default to attendee
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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

  // Handle input change dynamically
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

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", password: "", role: "" };

    // Name validation
    if (!formData.name) {
      newErrors.name = "Name is required.";
      valid = false;
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters long.";
      valid = false;
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = "Please select a role.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true); // Start loading state

    // Validate the form
    if (!validateForm()) {
      setLoading(false); // End loading state
      return; // Stop form submission if validation fails
    }

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
          redirect: false,
          email: formData.email,
          password: formData.password,
        });

        if (signInRes?.error) {
          setErrors({
            ...errors,
            email: "Failed to log in after registration.",
          });
        } else {
          // Redirect to dashboard or desired route
        }
      } else {
        // Handle errors (e.g., user already exists)
        setErrors({
          ...errors,
          email: data.error || "An error occurred during registration.",
        });
        toast({
          variant: "destructive",
          title: data.error || "An error occurred during registration.",
        });
      }
    } catch (error) {
      setLoading(false); // End loading state
      setErrors({
        ...errors,
        email: "An error occurred during registration. Please try again.",
      });
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: error.message || "An error occurred during registration.",
      });
    }
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
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            // type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email}</p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleInputChange}
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}
        </div>
        <div>
          <Label htmlFor="role">Register Yourself As</Label>
          <Select value={formData.role} onValueChange={handleRoleChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="organizer">Organizer</SelectItem>
              <SelectItem value="attendee">Attendee</SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>
    </TabsContent>
  );
};

export default RegisterForm;
