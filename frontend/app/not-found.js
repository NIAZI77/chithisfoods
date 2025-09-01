import Link from "next/link";
import { HomeIcon, ChefHatIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center">
            <ChefHatIcon className="w-16 h-16 text-rose-500" />
          </div>
          <CardTitle className="text-3xl font-bold cursive">Oops!</CardTitle>
          <p className="text-muted-foreground">404 - Page Not Found</p>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg mb-4">
            Looks like this recipe is still in the kitchen!
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild variant="default">
            <Link href="/" className="flex items-center gap-2">
              <HomeIcon className="w-4 h-4" />
              Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
