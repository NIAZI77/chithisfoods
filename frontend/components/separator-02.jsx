import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaTwitch, FaTwitter } from "react-icons/fa";

export default function HorizontalSeparatorWithLabel() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="text-">Create an account</CardTitle>
        <CardDescription>
          Start your free 30 days trials. Cancel at anytime.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Enter your email" />
            </div>
            <Button>Get Started</Button>
          </div>
          <div
            className="relative my-4 flex items-center justify-center overflow-hidden">
            <Separator />
            <div className="px-2 text-center bg-background text-sm">OR</div>
            <Separator />
          </div>
          <div className="grid w-full gap-2">
            <Button variant="outline">
              <FcGoogle className="h-5 w-5 mr-2" />
              Sign up with Google
            </Button>
            <Button variant="outline">
              <FaTwitch className="h-5 w-5 mr-2 text-purple-600" />
              Sign up with Twitch
            </Button>
            <Button variant="outline">
              <FaTwitter className="h-5 w-5 mr-2 text-blue-400" />
              Sign up with Twitter
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
