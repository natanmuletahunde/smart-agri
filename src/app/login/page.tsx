import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-md flex-1 flex-col justify-center px-4 py-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Log in</CardTitle>
          <CardDescription>
            Access your{" "}
            <Link href="/" className="text-primary underline">
              Smart Agri
            </Link>{" "}
            account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
