import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function LoginPage() {
  const { user, signOut, signInWithGoogle } = useAuth();

  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[350px]">
          <CardHeader>
            <h2 className="text-2xl font-bold text-center">User Profile</h2>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center">
              <Image
                src={user.photoURL || "/default-avatar.png"}
                alt="User Avatar"
                width={96}
                height={96}
                className="rounded-full mb-4"
              />
              <h3 className="text-lg font-semibold">{user.displayName}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
              <Button onClick={signOut} className="mt-4 w-full">
                Logout
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[350px]">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">
            Welcome to Notes App
          </h2>
        </CardHeader>
        <CardContent>
          <Button onClick={signInWithGoogle} className="w-full">
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
