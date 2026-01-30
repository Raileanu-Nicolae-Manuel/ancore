import { useState } from "react";
import { Button } from "@ancore/ui/components/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@ancore/ui/components/ui/card";
import { Input } from "@ancore/ui/components/ui/input";
import { Label } from "@ancore/ui/components/ui/label";
import { NavLink } from "react-router";
import { signUp } from "@/web/lib/auth";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      // TODO: change to a in line error message
      alert("Passwords don't match");
      return;
    }

    setLoading(true);
    try {
      await signUp.email({
        email,
        password,
        name,
      });
    } catch (error) {
      console.error("Sign up failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Enter your email below to register a new account
        </CardDescription>
        <CardAction>
          <Button variant="link" asChild>
            <NavLink to="/login">Login</NavLink>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="confirm-password">Confirm Password</Label>
              </div>
              <Input 
                id="confirm-password" 
                type="password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Creating Account..." : "Create Account"}
        </Button>
      </CardFooter>
    </Card>
  )
}